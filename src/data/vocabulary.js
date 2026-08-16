// Core vocabulary bank: English word, Somali meaning, example sentence, level, topic.
let id = 1;
const w = (word, somali, example, level, topic) => ({
  id: `v${id++}`,
  word,
  somali,
  example,
  level,
  topic,
});

export const vocabularyBank = [
  // Beginner — everyday
  w("hello", "salaan / salaam", "Hello, my name is Amina.", "beginner", "greetings"),
  w("family", "qoys", "My family lives in Mogadishu.", "beginner", "family"),
  w("mother", "hooyo", "My mother cooks every evening.", "beginner", "family"),
  w("father", "aabbe", "My father works at a shop.", "beginner", "family"),
  w("friend", "saaxiib / saaxiibad", "She is my best friend.", "beginner", "greetings"),
  w("water", "biyo", "Can I have a glass of water?", "beginner", "food"),
  w("food", "cunto", "The food smells delicious.", "beginner", "food"),
  w("house", "guri", "Our house is near the market.", "beginner", "home"),
  w("school", "dugsi / iskuul", "I walk to school every morning.", "beginner", "school"),
  w("book", "buug", "This book belongs to my teacher.", "beginner", "school"),
  w("teacher", "macallin / macallimad", "Our teacher explains things clearly.", "beginner", "school"),
  w("today", "maanta", "Today is a beautiful day.", "beginner", "time"),
  w("tomorrow", "berri", "We will meet again tomorrow.", "beginner", "time"),
  w("morning", "subax", "I drink tea in the morning.", "beginner", "time"),
  w("night", "habeen", "The city is quiet at night.", "beginner", "time"),
  w("happy", "faraxsan", "I am happy to see you.", "beginner", "feelings"),
  w("tired", "daallan", "He feels tired after work.", "beginner", "feelings"),
  w("hungry", "gaajaysan", "The children are hungry.", "beginner", "feelings"),
  w("market", "suuq", "We buy vegetables at the market.", "beginner", "places"),
  w("street", "waddo / jid", "There are many cars on the street.", "beginner", "places"),
  w("work", "shaqo", "My father goes to work early.", "beginner", "work"),
  w("money", "lacag", "She saves her money every month.", "beginner", "work"),
  w("car", "gaari / baabuur", "The car is parked outside.", "beginner", "travel"),
  w("bus", "bas", "We took the bus to the city.", "beginner", "travel"),
  w("time", "waqti", "What time is it now?", "beginner", "time"),
  w("day", "maalin", "Every day I study English.", "beginner", "time"),
  w("week", "toddobaad", "I have five lessons this week.", "beginner", "time"),
  w("big", "weyn", "That is a big building.", "beginner", "adjectives"),
  w("small", "yar", "She has a small dog.", "beginner", "adjectives"),
  w("good", "fiican / wanaagsan", "This is a good idea.", "beginner", "adjectives"),

  // Intermediate — everyday + abstract
  w("opportunity", "fursad", "This job is a great opportunity for me.", "intermediate", "work"),
  w("responsibility", "mas'uuliyad", "Taking care of the family is his responsibility.", "intermediate", "work"),
  w("achieve", "gaadhsiisan / gaarsiisan", "She worked hard to achieve her goals.", "intermediate", "success"),
  w("improve", "hagaajin / horumarin", "I want to improve my English writing.", "intermediate", "learning"),
  w("decision", "go'aan", "He made an important decision yesterday.", "intermediate", "life"),
  w("environment", "deegaan / bay'ad", "We must protect our environment.", "intermediate", "world"),
  w("community", "bulsho / beel", "The community helped rebuild the school.", "intermediate", "world"),
  w("experience", "khibrad / waayo-aragnimo", "Living abroad was a valuable experience.", "intermediate", "life"),
  w("challenge", "caqabad", "Learning a new language is a challenge.", "intermediate", "learning"),
  w("confident", "kalsooni leh", "She felt confident during the interview.", "intermediate", "feelings"),
  w("negotiate", "gorgortan", "They negotiated a fair price.", "intermediate", "work"),
  w("independent", "madax banaan / iskiis u taagan", "My sister is very independent.", "intermediate", "life"),
  w("relationship", "xiriir", "They have a strong relationship.", "intermediate", "family"),
  w("suggest", "soo jeedin", "I suggest we leave early.", "intermediate", "communication"),
  w("compare", "isbarbardhig", "Let's compare the two options.", "intermediate", "learning"),
  w("recommend", "ku talin / dalbin", "The doctor recommended more rest.", "intermediate", "health"),
  w("increase", "kordhin", "Prices increased last month.", "intermediate", "economy"),
  w("reduce", "yareyn", "We should reduce our expenses.", "intermediate", "economy"),
  w("available", "diyaar ah / la heli karo", "The tickets are still available.", "intermediate", "travel"),
  w("necessary", "lagama maarmaan ah", "Water is necessary for life.", "intermediate", "life"),

  // Advanced — nuanced / academic / idioms
  w("resilience", "adkaysi / iimaan-adayg", "Her resilience helped her overcome hardship.", "advanced", "character"),
  w("ambiguous", "aan cad la'aan / madmadow", "The instructions were ambiguous.", "advanced", "communication"),
  w("meticulous", "taxadar badan / feejignaan", "He is meticulous about details.", "advanced", "character"),
  w("procrastinate", "dib u dhigid shaqo", "Stop procrastinating and finish the report.", "advanced", "work"),
  w("versatile", "isbeddel u diyaar ah / kala noolaan", "She is a versatile employee.", "advanced", "work"),
  w("consensus", "is-waafaqid guud", "The team reached a consensus.", "advanced", "communication"),
  w("skeptical", "shaki leh", "He was skeptical about the plan.", "advanced", "feelings"),
  w("paradox", "iskahorimaad fikradeed", "It's a paradox that seems impossible.", "advanced", "academic"),
  w("implication", "saameyn / natiijo dhaqan ah", "Consider the implications of your choice.", "advanced", "academic"),
  w("albeit", "in kastoo", "The plan worked, albeit slowly.", "advanced", "grammar"),
  w("hindsight", "faham dib-dhac ah", "In hindsight, we should have prepared more.", "advanced", "idioms"),
  w("break the ice", "u fudayd wada-hadal (idiom)", "He told a joke to break the ice.", "advanced", "idioms"),
  w("a piece of cake", "aad u fudud (idiom)", "The exam was a piece of cake.", "advanced", "idioms"),
  w("under the weather", "xanuunsan (idiom)", "I'm feeling under the weather today.", "advanced", "idioms"),
  w("get the hang of", "baran hab (idiom)", "You'll get the hang of it soon.", "advanced", "idioms"),
];

export function vocabularyByLevel(level) {
  if (!level || level === "all") return vocabularyBank;
  return vocabularyBank.filter((v) => v.level === level);
}
