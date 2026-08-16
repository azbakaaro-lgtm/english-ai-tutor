// ---------------------------------------------------------------------------
// Demo AI Engine
// ---------------------------------------------------------------------------
// Everything in this file runs locally in the browser. There is no call to
// OpenAI, Anthropic, or any paid API. Lessons, chat replies and quizzes are
// produced by combining curated content banks with light randomization and
// pattern matching — a genuine "Demo Mode" that always works, offline,
// for free. See README.md for how this could later be swapped for a real
// (optionally free/local) language model if desired.
// ---------------------------------------------------------------------------

import { lessonTemplates } from "../data/lessonBank";
import { vocabularyBank, vocabularyByLevel } from "../data/vocabulary";
import { checkGrammar } from "../data/grammarRules";
import { conversationTopics, fallbackReplies, greetingReplies, encouragements } from "../data/chatbotBank";
import { grammarQuizBank } from "../data/quizBank";

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ---------------------------------------------------------------------------
// Lesson generation
// ---------------------------------------------------------------------------
export function generateLesson(level = "beginner", topicId = null) {
  const pool = lessonTemplates[level] || lessonTemplates.beginner;
  const template = topicId ? pool.find((t) => t.id === topicId) || pick(pool) : pick(pool);

  const relatedVocab = shuffle(vocabularyByLevel(level)).slice(0, 6);

  const exercises = shuffle(template.exercises).map((ex, i) => ({
    ...ex,
    id: `${template.id}-ex-${i}`,
    options: ex.options ? shuffle(ex.options) : undefined,
  }));

  // Build a short closing quiz mixing vocabulary recall + one grammar check
  const quizVocab = shuffle(relatedVocab).slice(0, 3);
  const quiz = quizVocab.map((v, i) => {
    const distractors = shuffle(vocabularyBank.filter((x) => x.id !== v.id)).slice(0, 2).map((x) => x.somali);
    return {
      id: `${template.id}-quiz-${i}`,
      prompt: `What does "${v.word}" mean in Somali?`,
      options: shuffle([v.somali, ...distractors]),
      answer: v.somali,
    };
  });
  if (template.exercises.length) {
    const g = pick(template.exercises.filter((e) => e.type === "mcq") || template.exercises);
    if (g) {
      quiz.push({
        id: `${template.id}-quiz-grammar`,
        prompt: g.prompt,
        options: shuffle(g.options || []),
        answer: g.answer,
      });
    }
  }

  const reading = buildReading(template, relatedVocab);
  const listening = buildListening(template, relatedVocab);

  return {
    id: `${template.id}-${Date.now()}`,
    templateId: template.id,
    level,
    topic: template.topic,
    grammarTitle: template.grammarTitle,
    explanationEn: template.explanationEn,
    explanationSo: template.explanationSo,
    examples: template.examples,
    vocabulary: relatedVocab,
    exercises,
    quiz: shuffle(quiz),
    reading,
    listening,
    generatedAt: new Date().toISOString(),
  };
}

// Builds a short reading passage + comprehension questions from the lesson's
// own example sentences and vocabulary, so every generated lesson includes
// a Reading section with zero extra content authoring required.
function buildReading(template, vocab) {
  const passage = template.examples.map((e) => e.en).join(" ") +
    ` This short passage uses today's topic, "${template.topic}", and words like ${vocab.slice(0, 3).map((v) => `"${v.word}"`).join(", ")}.`;

  const vocabQ = pick(vocab);
  const distractor = pick(vocab.filter((v) => v.id !== vocabQ.id));
  const questions = [
    {
      id: "read-q1",
      prompt: `What is this passage mainly about?`,
      options: shuffle([template.topic, "A weather report", "A shopping list"]),
      answer: template.topic,
    },
    {
      id: "read-q2",
      prompt: `In the passage, what does "${vocabQ.word}" mean?`,
      options: shuffle([vocabQ.somali, distractor.somali]),
      answer: vocabQ.somali,
    },
  ];
  return { title: `Reading: ${template.topic}`, passage, questions };
}

// Builds a short listening script (meant to be played with the browser's
// free text-to-speech) + comprehension questions.
function buildListening(template, vocab) {
  const script = shuffle(template.examples).slice(0, 3).map((e) => e.en).join(" ");
  const vocabQ = pick(vocab);
  const questions = [
    {
      id: "listen-q1",
      prompt: "Listen to the audio. What topic is being discussed?",
      options: shuffle([template.topic, "Booking a flight", "A doctor's appointment"]),
      answer: template.topic,
    },
    {
      id: "listen-q2",
      prompt: `Which word from today's lesson did you hear used in examples: "${vocabQ.word}" or a made-up word?`,
      options: shuffle([vocabQ.word, "flibbertonic"]),
      answer: vocabQ.word,
    },
  ];
  return { script, questions };
}

export function getTopicsForLevel(level) {
  return (lessonTemplates[level] || []).map((t) => ({ id: t.id, label: t.topic }));
}

// ---------------------------------------------------------------------------
// Chatbot tutor
// ---------------------------------------------------------------------------
export function getConversationTopics(level) {
  return conversationTopics[level] || conversationTopics.beginner;
}

export function openerFor(level, topicId) {
  const topics = conversationTopics[level] || conversationTopics.beginner;
  const topic = topics.find((t) => t.id === topicId) || topics[0];
  return topic.opener;
}

let fallbackCursor = 0;
const keywordCursors = {};

// Keyword-triggered follow-up questions, checked before the generic
// fallback pool. This makes the tutor visibly react to *what the student
// actually said* instead of always giving the same rotating small talk —
// still 100% rule-based and free, just with more surface area.
const KEYWORD_REPLIES = {
  family: [
    "Nice! How many people are in your family?",
    "Do you live close to your family?",
    "What does your family usually do together on weekends?",
  ],
  food: [
    "That sounds delicious! What's your favorite dish to cook?",
    "Do you prefer eating at home or at a restaurant?",
    "What's a traditional Somali dish you'd recommend?",
  ],
  work: [
    "What do you like most about your job?",
    "How long have you been doing that work?",
    "Is it difficult to use English at work?",
  ],
  school: [
    "What's your favorite subject at school?",
    "Do you study English every day?",
    "Who is your English teacher?",
  ],
  travel: [
    "Where would you like to travel next?",
    "Have you traveled outside Somalia before?",
    "What do you enjoy most about traveling?",
  ],
  weather: [
    "Is it hot or cold where you are right now?",
    "What's your favorite season, and why?",
  ],
  hobby: [
    "That's a great hobby! How often do you do it?",
    "How did you get interested in that?",
  ],
  sport: [
    "Do you play that sport, or just watch it?",
    "Who is your favorite team or player?",
  ],
  movie: [
    "What kind of movies do you like best?",
    "Was it in English? Did the subtitles help you learn?",
  ],
  music: [
    "What kind of music do you listen to?",
    "Do you understand the English lyrics when you listen to songs?",
  ],
  friend: [
    "How long have you known each other?",
    "What do you and your friends usually do together?",
  ],
};

function findKeywordTopic(text) {
  const lower = text.toLowerCase();
  for (const [topic, replies] of Object.entries(KEYWORD_REPLIES)) {
    if (lower.includes(topic)) return { topic, replies };
  }
  return null;
}

// Produces a full tutor turn: { reply, correction } where correction is
// null if no mistake was detected in the user's message. `history` is the
// list of prior { role, text } turns in this conversation — passing it in
// lets the tutor occasionally reference something the student said earlier,
// so the conversation feels continuous rather than stateless.
export function generateTutorReply(userMessage, level = "beginner", history = []) {
  const trimmed = userMessage.trim();
  const correction = checkGrammar(trimmed);

  const isGreeting = /^(hi|hello|hey|salaam|salam)\b/i.test(trimmed);
  const isQuestion = /\?\s*$/.test(trimmed);
  const isShortYesNo = /^(yes|no|yeah|nope|maybe|sure)\b/i.test(trimmed);

  let reply;
  const keywordMatch = findKeywordTopic(trimmed);

  if (keywordMatch) {
    const cursor = keywordCursors[keywordMatch.topic] || 0;
    reply = keywordMatch.replies[cursor % keywordMatch.replies.length];
    keywordCursors[keywordMatch.topic] = cursor + 1;
  } else if (isGreeting) {
    reply = pick(greetingReplies);
  } else if (isShortYesNo) {
    reply = "Can you tell me more about that? " + pick(fallbackReplies[level] || fallbackReplies.beginner);
  } else if (isQuestion) {
    reply = "Good question! " + pick(fallbackReplies[level] || fallbackReplies.beginner);
  } else {
    // Occasionally reference something from earlier in the conversation,
    // if we can find a keyword the student already used, to make the
    // tutor feel like it remembers the conversation rather than resetting
    // every turn.
    const priorUserTurns = history.filter((h) => h.role === "user").map((h) => h.text);
    const priorTopic = priorUserTurns.length > 1 ? findKeywordTopic(priorUserTurns[priorUserTurns.length - 2] || "") : null;

    const bank = fallbackReplies[level] || fallbackReplies.beginner;
    const base = bank[fallbackCursor % bank.length];
    fallbackCursor += 1;

    reply = priorTopic && Math.random() < 0.35
      ? `Going back to what you said about ${priorTopic.topic} — ${base.charAt(0).toLowerCase()}${base.slice(1)}`
      : base;
  }

  if (correction) {
    reply = `${pick(encouragements)} ${reply}`;
  }

  return { reply, correction };
}

// ---------------------------------------------------------------------------
// Quiz generation
// ---------------------------------------------------------------------------
export function generateQuiz(level = "beginner", category = "mixed", count = 8) {
  const pools = {
    grammar: () => buildGrammarQuestions(level),
    vocabularyCat: () => buildVocabQuestions(level),
    translation: () => buildTranslationQuestions(level),
  };

  let questions = [];
  if (category === "mixed") {
    questions = [...buildGrammarQuestions(level), ...buildVocabQuestions(level), ...buildTranslationQuestions(level)];
  } else if (pools[category]) {
    questions = pools[category]();
  } else {
    questions = buildGrammarQuestions(level);
  }

  return shuffle(questions).slice(0, count).map((q, i) => ({ ...q, id: `q${i}-${Date.now()}` }));
}

function buildGrammarQuestions(level) {
  const bank = grammarQuizBank[level] || grammarQuizBank.beginner;
  return bank.map((q) => ({
    category: "grammar",
    prompt: q.q,
    options: shuffle(q.options),
    answer: q.answer,
  }));
}

function buildVocabQuestions(level) {
  const words = shuffle(vocabularyByLevel(level)).slice(0, 10);
  return words.map((v) => {
    const distractors = shuffle(vocabularyBank.filter((x) => x.id !== v.id)).slice(0, 2).map((x) => x.somali);
    return {
      category: "vocabularyCat",
      prompt: `What does "${v.word}" mean in Somali?`,
      options: shuffle([v.somali, ...distractors]),
      answer: v.somali,
    };
  });
}

function buildTranslationQuestions(level) {
  const words = shuffle(vocabularyByLevel(level)).slice(0, 10);
  return words.map((v) => {
    const distractors = shuffle(vocabularyBank.filter((x) => x.id !== v.id)).slice(0, 2).map((x) => x.word);
    const flip = Math.random() > 0.5;
    if (flip) {
      return {
        category: "translation",
        prompt: `Translate to English: "${v.somali}"`,
        options: shuffle([v.word, ...distractors]),
        answer: v.word,
      };
    }
    const distractorsSo = shuffle(vocabularyBank.filter((x) => x.id !== v.id)).slice(0, 2).map((x) => x.somali);
    return {
      category: "translation",
      prompt: `Translate to Somali: "${v.word}"`,
      options: shuffle([v.somali, ...distractorsSo]),
      answer: v.somali,
    };
  });
}
