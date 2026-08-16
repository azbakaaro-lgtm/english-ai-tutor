// ---------------------------------------------------------------------------
// AI generation service for the Admin Dashboard.
//
// Two modes, chosen automatically:
//
//   1. "groq"     — used when GROQ_API_KEY is set in backend/.env. Groq's
//                   API is free (generous free tier, no credit card), and
//                   uses an OpenAI-compatible /chat/completions endpoint,
//                   so this is plain fetch() with no extra SDK. Get a free
//                   key at https://console.groq.com/keys.
//
//   2. "template" — used automatically whenever no key is configured, or
//                   whenever the API call fails for any reason (rate limit,
//                   network, bad response). Builds a complete, real lesson
//                   from a deterministic template so the Admin Dashboard
//                   ALWAYS works, for free, with zero setup.
//
// Neither mode uses a paid API (OpenAI/Anthropic/etc are never called here).
// ---------------------------------------------------------------------------

const GROQ_API_KEY = process.env.GROQ_API_KEY || "";
const GROQ_MODEL = process.env.GROQ_MODEL || "llama-3.1-8b-instant";
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

function isAIConfigured() {
  return Boolean(GROQ_API_KEY);
}

async function callGroq(systemPrompt, userPrompt) {
  const res = await fetch(GROQ_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      temperature: 0.7,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Groq API error ${res.status}: ${text.slice(0, 300)}`);
  }

  const data = await res.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error("Groq API returned no content");

  // Strip markdown code fences if the model added them despite instructions.
  const cleaned = content.replace(/^```json\s*|```\s*$/g, "").trim();
  return JSON.parse(cleaned);
}

// ---------------------------------------------------------------------------
// Lesson generation
// ---------------------------------------------------------------------------

const LESSON_SCHEMA_HINT = `Return ONLY a single JSON object (no markdown, no commentary) with this exact shape:
{
  "topic": "string - short lesson title",
  "grammarTitle": "string - grammar point name",
  "explanationEn": "string - 2-4 sentence grammar explanation in English",
  "explanationSo": "string - the SAME explanation translated naturally into Somali",
  "examples": [ { "en": "string", "so": "string (Somali translation)" }, ... 4 items ],
  "vocabulary": [ { "word": "string", "somali": "string (Somali meaning)", "example": "string (English example sentence)" }, ... 6 items ],
  "exercises": [ { "type": "mcq", "prompt": "string", "options": ["a","b","c"], "answer": "string (must exactly equal one option)" }, ... 4 items ],
  "quiz": [ { "prompt": "string", "options": ["a","b","c"], "answer": "string (must exactly equal one option)" }, ... 3 items ],
  "reading": {
    "title": "string",
    "passage": "string - 4-6 sentence short reading passage in English matching the level and topic",
    "questions": [ { "prompt": "string", "options": ["a","b","c"], "answer": "string (must exactly equal one option)" }, ... 3 items ]
  },
  "listening": {
    "script": "string - 3-5 sentence short script meant to be read aloud (text-to-speech) in English",
    "questions": [ { "prompt": "string", "options": ["a","b","c"], "answer": "string (must exactly equal one option)" }, ... 2 items ]
  }
}`;

export async function generateLessonContent(level, topic) {
  if (isAIConfigured()) {
    try {
      const system = `You are an expert English-as-a-second-language curriculum writer creating lessons for Somali-speaking learners. Write clear, level-appropriate content and accurate Somali translations. ${LESSON_SCHEMA_HINT}`;
      const user = `Create one complete ${level} level English lesson on the topic: "${topic}". Keep vocabulary and sentence complexity appropriate for a ${level} learner.`;
      const json = await callGroq(system, user);
      return { ...normalizeLesson(json, level, topic), source: "ai" };
    } catch (err) {
      console.warn("Groq generation failed, falling back to template:", err.message);
    }
  }
  return { ...templateLesson(level, topic), source: "template" };
}

function normalizeLesson(json, level, topic) {
  return {
    topic: json.topic || topic,
    level,
    grammarTitle: json.grammarTitle || "Grammar focus",
    explanationEn: json.explanationEn || "",
    explanationSo: json.explanationSo || "",
    examples: Array.isArray(json.examples) ? json.examples : [],
    vocabulary: Array.isArray(json.vocabulary)
      ? json.vocabulary.map((v, i) => ({ id: `v_ai_${Date.now()}_${i}`, word: v.word, somali: v.somali, example: v.example, level }))
      : [],
    exercises: Array.isArray(json.exercises) ? json.exercises.map((e, i) => ({ ...e, id: `ex_ai_${i}` })) : [],
    quiz: Array.isArray(json.quiz) ? json.quiz.map((q, i) => ({ ...q, id: `q_ai_${i}` })) : [],
    reading: json.reading || null,
    listening: json.listening || null,
  };
}

// Deterministic, always-works fallback. Builds a genuine lesson (not a stub)
// by weaving the topic into a fixed set of ESL sentence patterns per level.
function templateLesson(level, topic) {
  const bank = {
    beginner: {
      grammarTitle: "Simple Present & everyday vocabulary",
      explanationEn: `We use the Simple Present to talk about facts, habits and things that are generally true. This lesson practices that using the topic "${topic}".`,
      explanationSo: `Waxaan isticmaalnaa Simple Present marka aan ka hadlayno xaqiiqooyin, caadooyin, iyo waxyaabo run ah guud ahaan. Casharkani wuxuu ku dhaqmayaa mowduuca "${topic}".`,
      pattern: (t) => [
        { en: `I like to talk about ${t}.`, so: `Waan jeclahay inaan ka hadlo ${t}.` },
        { en: `She often thinks about ${t}.`, so: `Way inta badan ka fikirtaa ${t}.` },
        { en: `We learn something new about ${t} every day.`, so: `Maalin walba wax cusub ayaan ka baranaa ${t}.` },
        { en: `Do you know a lot about ${t}?`, so: `Ma wax badan ka taqaanaa ${t}?` },
      ],
    },
    intermediate: {
      grammarTitle: "Past Simple & descriptive language",
      explanationEn: `The Past Simple describes finished actions at a specific past time. Here we practice it while discussing "${topic}".`,
      explanationSo: `Past Simple wuxuu sharaxayaa ficillo dhammaystiran oo dhacay wakhti gaar ah oo la soo dhaafay. Halkan waxaan ku dhaqmaynaa isagoo lala hadlayo "${topic}".`,
      pattern: (t) => [
        { en: `Yesterday we discussed ${t} in class.`, so: `Shalay fasalka waxaan kaga hadalnay ${t}.` },
        { en: `She explained ${t} very clearly.`, so: `Way si cad u sharaxday ${t}.` },
        { en: `I hadn't heard about ${t} before this lesson.`, so: `Kama aanan maqlin ${t} casharkan ka hor.` },
        { en: `They asked several questions about ${t}.`, so: `Waxay weydiiyeen su'aalo dhowr ah oo ku saabsan ${t}.` },
      ],
    },
    advanced: {
      grammarTitle: "Complex sentences & nuanced vocabulary",
      explanationEn: `Advanced English often combines clauses to express nuance. This lesson uses "${topic}" to practice more sophisticated sentence structures.`,
      explanationSo: `Ingiriisiga heerka sare wuxuu inta badan isku daraa jumlado si loo muujiyo farqiyada yaryar. Casharkani wuxuu isticmaalayaa "${topic}" si loogu tababbaro qaab-dhismeedka jumlada ee sare.`,
      pattern: (t) => [
        { en: `Although opinions vary, most experts agree that ${t} matters.`, so: `In kastoo aragtiyuhu kala duwan yihiin, khubarada badankood waxay ku raacsan yihiin in ${t} muhiim tahay.` },
        { en: `Had we understood ${t} sooner, we would have acted differently.`, so: `Haddii aan si dhaqso ah u fahmi lahayn ${t}, si kale ayaan u dhaqmi lahayn.` },
        { en: `The implications of ${t} extend well beyond the obvious.`, so: `Saameynta ${t} way ka baxsan tahay waxa cad.` },
        { en: `It's worth reflecting on how ${t} has evolved over time.`, so: `Waxaa mudan in la fikiro sida ${t} ay isu beddeshay wakhtiga.` },
      ],
    },
  };

  const cfg = bank[level] || bank.beginner;
  const examples = cfg.pattern(topic);
  const vocabPool = [
    { word: "topic", somali: "mowduuc" },
    { word: "understand", somali: "fahmid" },
    { word: "practice", somali: "tababbar" },
    { word: "improve", somali: "hagaajin" },
    { word: "explain", somali: "sharaxid" },
    { word: "discuss", somali: "ka hadlid" },
  ];
  const vocabulary = vocabPool.map((v, i) => ({
    id: `v_tpl_${Date.now()}_${i}`,
    word: v.word,
    somali: v.somali,
    example: `Let's ${v.word} ${topic} together.`,
    level,
  }));

  const exercises = examples.slice(0, 3).map((ex, i) => ({
    id: `ex_tpl_${i}`,
    type: "mcq",
    prompt: `Which sentence is correct?`,
    options: shuffleArr([ex.en, ex.en.replace(/\.$/, "").toLowerCase() + " (incorrect capitalization).", ex.en.replace(/\b(is|are|was|were)\b/, "be")]),
    answer: ex.en,
  }));

  const quiz = [
    {
      id: "q_tpl_0",
      prompt: `What is this lesson mainly about?`,
      options: shuffleArr([topic, "Unrelated small talk", "A different grammar topic"]),
      answer: topic,
    },
    {
      id: "q_tpl_1",
      prompt: `Choose the sentence that matches today's grammar focus (${cfg.grammarTitle}).`,
      options: shuffleArr([examples[0].en, "This sentence uses no verb at all.", "This sentence is in a random tense."]),
      answer: examples[0].en,
    },
  ];

  const passage = `${examples[0].en} ${examples[1].en} ${examples[2].en} ${examples[3].en} This is a short passage about ${topic}, written for ${level} learners.`;
  const reading = {
    title: `Reading: ${topic}`,
    passage,
    questions: [
      {
        prompt: "What is the passage mainly about?",
        options: shuffleArr([topic, "Cooking recipes", "Sports scores"]),
        answer: topic,
      },
      {
        prompt: "Is this passage written for beginner, intermediate, or advanced learners?",
        options: shuffleArr(["beginner", "intermediate", "advanced"]),
        answer: level,
      },
    ],
  };

  const listening = {
    script: `${examples[1].en} ${examples[2].en} ${examples[3].en}`,
    questions: [
      {
        prompt: "Listen and choose the topic discussed.",
        options: shuffleArr([topic, "The weather forecast", "A football match"]),
        answer: topic,
      },
    ],
  };

  return {
    topic: `${topic} (${cfg.grammarTitle})`,
    level,
    grammarTitle: cfg.grammarTitle,
    explanationEn: cfg.explanationEn,
    explanationSo: cfg.explanationSo,
    examples,
    vocabulary,
    exercises,
    quiz,
    reading,
    listening,
  };
}

function shuffleArr(arr) {
  const a = [...new Set(arr)];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ---------------------------------------------------------------------------
// Vocabulary batch generation
// ---------------------------------------------------------------------------

export async function generateVocabularyBatch(level, count = 10, topic = "general") {
  if (isAIConfigured()) {
    try {
      const system = `You are an ESL curriculum writer. Return ONLY a JSON object: { "words": [ { "word": "string", "somali": "string (accurate Somali meaning)", "example": "string (English example sentence)" }, ... ] }. No markdown, no commentary.`;
      const user = `Generate ${count} useful English vocabulary words for a ${level} learner, themed around "${topic}", each with an accurate Somali translation and a natural example sentence.`;
      const json = await callGroq(system, user);
      const words = Array.isArray(json.words) ? json.words : [];
      return words.slice(0, count).map((w, i) => ({
        id: `v_ai_${Date.now()}_${i}`,
        word: w.word,
        somali: w.somali,
        example: w.example,
        level,
        topic,
      }));
    } catch (err) {
      console.warn("Groq vocabulary generation failed, falling back to template:", err.message);
    }
  }
  return templateVocabulary(level, count, topic);
}

const FALLBACK_WORD_ROOTS = [
  ["journey", "safar"], ["kindness", "naxariis"], ["decision", "go'aan"], ["freedom", "xorriyad"],
  ["patience", "samir"], ["courage", "geesinnimo"], ["knowledge", "aqoon"], ["progress", "horumar"],
  ["community", "bulsho"], ["harvest", "beeraha soo saarka"], ["shelter", "hoy"], ["honesty", "daacadnimo"],
  ["strength", "xoog"], ["wisdom", "xigmad"], ["opportunity", "fursad"], ["challenge", "caqabad"],
  ["gratitude", "mahad naq"], ["celebration", "dabaaldeg"], ["neighbor", "deris"], ["tradition", "dhaqan"],
];

function templateVocabulary(level, count, topic) {
  const out = [];
  for (let i = 0; i < count; i++) {
    const [word, somali] = FALLBACK_WORD_ROOTS[i % FALLBACK_WORD_ROOTS.length];
    const suffix = i >= FALLBACK_WORD_ROOTS.length ? ` ${Math.floor(i / FALLBACK_WORD_ROOTS.length) + 1}` : "";
    out.push({
      id: `v_tpl_${Date.now()}_${i}`,
      word: suffix ? `${word}${suffix}` : word,
      somali,
      example: `This word relates to ${topic}: "${word}" — try using it in your own sentence about ${topic}.`,
      level,
      topic,
    });
  }
  return out;
}

export { isAIConfigured };
