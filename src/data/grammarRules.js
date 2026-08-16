// Rule-based grammar checker. Each rule looks for a common mistake pattern
// (frequent among Somali-speaking English learners), proposes a corrected
// sentence, and explains the fix in both English and Somali.
// This runs 100% locally — no external AI API involved (Demo Mode).

export const grammarRules = [
  {
    id: "have-age",
    test: /\bi\s+have\s+(\d{1,2})\s+years?\b/i,
    fix: (s, m) => s.replace(m[0], `I am ${m[1]} years old`),
    explanationEn: "In English we say 'I am ... years old', not 'I have ... years'. Age uses the verb 'to be'.",
    explanationSo: "Ingiriisiga waxaan nidhaahnaa 'I am ... years old', ma nidhaahno 'I have ... years'. Da'da waxaa loo isticmaalaa 'to be'.",
  },
  {
    id: "he-go",
    test: /\b(he|she|it)\s+(go|want|like|have|do|make|need|love|study|work|live|play|watch|eat|drink|come|say|think)\b(?!s)/i,
    fix: (s, m) => {
      const verbMap = { go: "goes", want: "wants", like: "likes", have: "has", do: "does", make: "makes", need: "needs", love: "loves", study: "studies", work: "works", live: "lives", play: "plays", watch: "watches", eat: "eats", drink: "drinks", come: "comes", say: "says", think: "thinks" };
      const verb = m[2].toLowerCase();
      return s.replace(m[0], `${m[1]} ${verbMap[verb] || verb + "s"}`);
    },
    explanationEn: "With he/she/it in the present simple, the verb needs an -s or -es ending.",
    explanationSo: "Marka la isticmaalayo he/she/it ee Present Simple, fal-celiska waa in lagu daraa -s ama -es.",
  },
  {
    id: "dont-doesnt",
    test: /\b(he|she|it)\s+don't\b/i,
    fix: (s, m) => s.replace(m[0], `${m[1]} doesn't`),
    explanationEn: "Use 'doesn't' (not 'don't') with he/she/it.",
    explanationSo: "Isticmaal 'doesn't' (ee ma aha 'don't') marka la isticmaalayo he/she/it.",
  },
  {
    id: "am-agree",
    test: /\bi\s+am\s+agree\b/i,
    fix: (s, m) => s.replace(m[0], "I agree"),
    explanationEn: "'Agree' is already a verb — don't use 'am' before it. Just say 'I agree'.",
    explanationSo: "'Agree' horeba waa fal — 'am' ha ka hor gelin. Kaliya dheh 'I agree'.",
  },
  {
    id: "no-article-job",
    test: /\bi\s+am\s+(student|teacher|doctor|engineer|nurse|driver|farmer|lawyer)\b/i,
    fix: (s, m) => s.replace(m[0], `I am a ${m[1]}`),
    explanationEn: "Singular jobs need 'a' or 'an' before them: 'I am a student.'",
    explanationSo: "Shaqooyinka keliya waxay u baahan yihiin 'a' ama 'an' ka hor: 'I am a student.'",
  },
  {
    id: "double-negative",
    test: /\bdon'?t\s+have\s+no\b/i,
    fix: (s, m) => s.replace(m[0], "don't have any"),
    explanationEn: "English avoids double negatives. Use 'don't have any' instead of 'don't have no'.",
    explanationSo: "Ingiriisiga wuu ka fogaadaa laba nafi oo isku mid ah. Isticmaal 'don't have any' halkii 'don't have no'.",
  },
  {
    id: "much-countable",
    test: /\bmuch\s+(people|friends|books|cars|students|questions|problems)\b/i,
    fix: (s, m) => s.replace(m[0], `many ${m[1]}`),
    explanationEn: "Use 'many' with countable plural nouns, and 'much' with uncountable nouns like water or time.",
    explanationSo: "Isticmaal 'many' marka magaca la tirin karo (jamac), 'much' isticmaal marka aan la tirin karin sida biyaha ama waqtiga.",
  },
  {
    id: "informations",
    test: /\binformations\b/i,
    fix: (s, m) => s.replace(m[0], "information"),
    explanationEn: "'Information' is uncountable in English — it has no plural 's'.",
    explanationSo: "'Information' Ingiriisiga lama tirin karo — 's' jamac ma leh.",
  },
  {
    id: "advices",
    test: /\badvices\b/i,
    fix: (s, m) => s.replace(m[0], "advice"),
    explanationEn: "'Advice' is uncountable — say 'some advice' or 'a piece of advice', not 'advices'.",
    explanationSo: "'Advice' lama tirin karo — dheh 'some advice' ama 'a piece of advice', ee ha odhan 'advices'.",
  },
  {
    id: "am-boring",
    test: /\bi\s+am\s+boring\b/i,
    fix: (s, m) => s.replace(m[0], "I am bored"),
    explanationEn: "'Boring' describes something that causes boredom; use 'bored' to describe how you feel.",
    explanationSo: "'Boring' waxay sharraxaysaa shay caajis keena; 'bored' isticmaal marka aad sharraxeynayso sida aad dareemayso.",
  },
  {
    id: "yesterday-present",
    test: /\byesterday\s+i\s+(go|eat|see|come|do|make|have|buy|meet)\b/i,
    fix: (s, m) => {
      const past = { go: "went", eat: "ate", see: "saw", come: "came", do: "did", make: "made", have: "had", buy: "bought", meet: "met" };
      return s.replace(m[0], `Yesterday I ${past[m[1].toLowerCase()]}`);
    },
    explanationEn: "'Yesterday' refers to the past, so the verb should be in the past simple form.",
    explanationSo: "'Yesterday' waxay tilmaamaysaa wakhti la soo dhaafay, marka fal-celisku waa inuu ku jiraa qaabka Past Simple.",
  },
  {
    id: "where-question-order",
    test: /\bwhere\s+you\s+are\s+going\b/i,
    fix: (s, m) => {
      const isCapitalized = /^[A-Z]/.test(m[0]);
      const replacement = isCapitalized ? "Where are you going" : "where are you going";
      return s.replace(m[0], replacement);
    },
    explanationEn: "In questions, the auxiliary verb comes before the subject: 'where are you going', not 'where you are going'.",
    explanationSo: "Su'aalaha, fal-caawiyaha wuxuu ka horreeyaa magaca falka: 'where are you going', ma aha 'where you are going'.",
  },
  {
    id: "very-much-adj",
    test: /\bvery\s+much\s+(happy|sad|tired|excited|good|beautiful|big|small)\b/i,
    fix: (s, m) => s.replace(m[0], `very ${m[1]}`),
    explanationEn: "Use 'very' (not 'very much') directly before an adjective: 'very happy', not 'very much happy'.",
    explanationSo: "Isticmaal 'very' (ee ma aha 'very much') si toos ah ugu hor sifaynta: 'very happy', ma aha 'very much happy'.",
  },
];

// Runs all rules and returns the first match, or null if the sentence looks fine.
export function checkGrammar(sentence) {
  for (const rule of grammarRules) {
    const m = sentence.match(rule.test);
    if (m) {
      return {
        original: sentence,
        corrected: rule.fix(sentence, m),
        explanationEn: rule.explanationEn,
        explanationSo: rule.explanationSo,
        ruleId: rule.id,
      };
    }
  }
  return null;
}
