// Conversation topics and response banks for the rule-based Demo AI tutor chat.
// No external API calls — everything here runs locally in the browser.

export const conversationTopics = {
  beginner: [
    { id: "intro", label: "Introduce yourself", opener: "Hello! I'm your English tutor. Let's start simple — what is your name?" },
    { id: "family", label: "Talk about family", opener: "Let's talk about family. Do you have brothers or sisters?" },
    { id: "food", label: "Order food", opener: "Imagine we're at a restaurant. What food do you like to eat?" },
    { id: "daily", label: "Daily routine", opener: "Tell me — what time do you wake up every day?" },
  ],
  intermediate: [
    { id: "job", label: "Talk about your job", opener: "What do you do for work, or what job do you want in the future?" },
    { id: "weekend", label: "Describe your weekend", opener: "How was your last weekend? What did you do?" },
    { id: "travel", label: "Plan a trip", opener: "If you could travel anywhere next year, where would you go and why?" },
    { id: "hobby", label: "Discuss a hobby", opener: "What do you like doing in your free time?" },
  ],
  advanced: [
    { id: "news", label: "Discuss current events", opener: "What's a piece of news you've read about recently? What do you think about it?" },
    { id: "interview", label: "Job interview practice", opener: "Let's practice a job interview. Tell me — why should we hire you?" },
    { id: "debate", label: "Debate a topic", opener: "Do you think technology makes life better or worse? Tell me your opinion." },
    { id: "opinion", label: "Give an opinion", opener: "What's a change you'd like to see in your community, and why?" },
  ],
};

// Simple intent-based fallback replies, used when no specific follow-up applies.
export const fallbackReplies = {
  beginner: [
    "That's good! Can you tell me more?",
    "Nice! What else do you do?",
    "I understand. Do you like it?",
    "Good job! Let's continue — tell me one more thing.",
  ],
  intermediate: [
    "Interesting — can you explain a bit more about that?",
    "That makes sense. What made you feel that way?",
    "Good point. What happened next?",
    "I see. How do you usually deal with that?",
  ],
  advanced: [
    "That's a thoughtful point — what evidence or experience shaped that view?",
    "Interesting perspective. What would someone who disagrees with you say?",
    "Could you elaborate on the reasoning behind that?",
    "That's nuanced. How might this apply in a different context?",
  ],
};

export const greetingReplies = [
  "Hello! Great to practice with you today.",
  "Hi there! Ready to practice some English?",
  "Hey! Let's get started.",
];

export const encouragements = [
  "Well done!",
  "Great sentence!",
  "Nice work!",
  "Good effort!",
  "You're improving!",
];
