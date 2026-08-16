// Grammar quiz question pool (vocabulary & translation questions are generated
// dynamically from data/vocabulary.js inside utils/aiEngine.js so the quiz
// never runs out of fresh combinations).

export const grammarQuizBank = {
  beginner: [
    { q: "I ___ a student.", options: ["am", "is", "are"], answer: "am" },
    { q: "She ___ from Kismayo.", options: ["am", "is", "are"], answer: "is" },
    { q: "They ___ my cousins.", options: ["am", "is", "are"], answer: "are" },
    { q: "He ___ (like) tea.", options: ["like", "likes", "liking"], answer: "likes" },
    { q: "We ___ (not/have) a car.", options: ["don't have", "doesn't have", "not have"], answer: "don't have" },
    { q: "Choose the correct plural: one book, two ___", options: ["book", "books", "bookes"], answer: "books" },
    { q: "I saw ___ apple on the table.", options: ["a", "an", "the"], answer: "an" },
    { q: "___ you speak English?", options: ["Do", "Does", "Is"], answer: "Do" },
    { q: "My sister ___ (study) at university.", options: ["study", "studies", "studying"], answer: "studies" },
    { q: "This is ___ house.", options: ["I", "my", "me"], answer: "my" },
  ],
  intermediate: [
    { q: "Yesterday, I ___ (go) to the market.", options: ["go", "went", "gone"], answer: "went" },
    { q: "She has ___ (live) here for five years.", options: ["live", "lived", "living"], answer: "lived" },
    { q: "This book is ___ (interesting) than that one.", options: ["interesting", "more interesting", "most interesting"], answer: "more interesting" },
    { q: "You ___ finish this by Friday — it's required.", options: ["can", "must", "might"], answer: "must" },
    { q: "If it rains, we ___ (stay) home.", options: ["stay", "will stay", "stayed"], answer: "will stay" },
    { q: "He is the ___ (tall) boy in the class.", options: ["tall", "taller", "tallest"], answer: "tallest" },
    { q: "While I ___ (cook), she cleaned the house.", options: ["cook", "cooked", "was cooking"], answer: "was cooking" },
    { q: "I look forward to ___ (see) you again.", options: ["see", "seeing", "saw"], answer: "seeing" },
    { q: "There ___ many people at the event.", options: ["was", "were", "is"], answer: "were" },
    { q: "She asked me where I ___ (be) born.", options: ["am", "was", "were"], answer: "was" },
  ],
  advanced: [
    { q: "If I had known, I ___ (help) you.", options: ["would help", "would have helped", "will help"], answer: "would have helped" },
    { q: "The report ___ (submit) by the deadline.", options: ["was submitted", "submitted", "is submit"], answer: "was submitted" },
    { q: "Not only ___ she talented, but she is also hardworking.", options: ["is", "she is", "did"], answer: "is" },
    { q: "He speaks as though he ___ (know) everything.", options: ["knows", "knew", "known"], answer: "knew" },
    { q: "'Break the ice' means to…", options: ["start a conversation comfortably", "cool something down", "end an argument"], answer: "start a conversation comfortably" },
    { q: "Had she studied harder, she ___ (pass).", options: ["would pass", "would have passed", "passes"], answer: "would have passed" },
    { q: "The committee, along with the director, ___ (be) in agreement.", options: ["is", "are", "were"], answer: "is" },
    { q: "It's high time we ___ (make) a decision.", options: ["make", "made", "making"], answer: "made" },
    { q: "Scarcely had he arrived ___ the meeting started.", options: ["when", "than", "then"], answer: "when" },
    { q: "'Get the hang of' means to…", options: ["give up on something", "learn how to do something", "forget something"], answer: "learn how to do something" },
  ],
};
