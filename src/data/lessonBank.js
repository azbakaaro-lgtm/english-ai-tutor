// Lesson templates used by the Demo AI lesson generator.
// Each template is a complete lesson skeleton: grammar point, examples,
// exercises and a short quiz. The generator (utils/aiEngine.js) fills in
// vocabulary from data/vocabulary.js and randomizes exercise order.

export const lessonTemplates = {
  beginner: [
    {
      id: "b-tobe",
      topic: "Introducing yourself: Verb 'to be'",
      grammarTitle: "The verb 'to be' (am / is / are)",
      explanationEn:
        "We use 'am' with I, 'is' with he/she/it, and 'are' with you/we/they. This verb connects a subject to a description, name, or feeling. Example: 'I am a student.' 'She is happy.' 'They are friends.'",
      explanationSo:
        "Waxaan isticmaalnaa 'am' marka la isticmaalayo 'I', 'is' marka la isticmaalayo he/she/it, iyo 'are' marka la isticmaalayo you/we/they. Ereygan wuxuu ku xirayaa qofka iyo sharraxaad, magac, ama dareen. Tusaale: 'I am a student' (Waxaan ahay arday). 'She is happy' (Way faraxsan tahay).",
      examples: [
        { en: "I am from Somalia.", so: "Waxaan ka imid Soomaaliya." },
        { en: "You are my friend.", so: "Waxaad tahay saaxiibkay." },
        { en: "He is a teacher.", so: "Isagu waa macallin." },
        { en: "We are students.", so: "Waxaan nahay ardayda." },
      ],
      exercises: [
        { type: "fill", prompt: "I ___ happy today.", answer: "am", options: ["am", "is", "are"] },
        { type: "fill", prompt: "She ___ a doctor.", answer: "is", options: ["am", "is", "are"] },
        { type: "fill", prompt: "They ___ from Hargeisa.", answer: "are", options: ["am", "is", "are"] },
        { type: "mcq", prompt: "Choose the correct sentence.", answer: "We are friends.", options: ["We is friends.", "We are friends.", "We am friends."] },
      ],
    },
    {
      id: "b-present-simple",
      topic: "Daily routines: Present Simple",
      grammarTitle: "Present Simple tense",
      explanationEn:
        "We use the Present Simple for habits and daily routines. Add -s or -es for he/she/it. Example: 'I eat breakfast at 7.' 'She eats breakfast at 8.' Use 'do/does' for questions and negatives: 'Do you drink tea?' 'He doesn't drink coffee.'",
      explanationSo:
        "Waxaan isticmaalnaa Present Simple marka aan ka hadlayno caadooyin iyo jadwalka maalinlaha ah. Ku dar -s ama -es marka la isticmaalayo he/she/it. Tusaale: 'I eat breakfast at 7' (Waxaan quraacdaa 7). Isticmaal 'do/does' marka aad samaynayso su'aalo ama nafiga: 'Do you drink tea?' (Ma cabtaa shaah?).",
      examples: [
        { en: "I wake up at six.", so: "Waxaan tooska joogaa lixda." },
        { en: "She goes to school every day.", so: "Maalin walba dugsiga ayay tagtaa." },
        { en: "We study English on Mondays.", so: "Isniinaha waxaan barannaa Ingiriisi." },
        { en: "He doesn't like coffee.", so: "Ma jecla bunka (qaxwaha)." },
      ],
      exercises: [
        { type: "fill", prompt: "She ___ (go) to work at 8am.", answer: "goes", options: ["go", "goes", "going"] },
        { type: "fill", prompt: "I ___ (drink) tea every morning.", answer: "drink", options: ["drink", "drinks", "drank"] },
        { type: "mcq", prompt: "Choose the correct question.", answer: "Does he like tea?", options: ["Does he likes tea?", "Does he like tea?", "Do he like tea?"] },
        { type: "fill", prompt: "They ___ (not/like) loud music.", answer: "don't like", options: ["don't like", "doesn't like", "not like"] },
      ],
    },
    {
      id: "b-articles",
      topic: "Talking about objects: a / an / the",
      grammarTitle: "Articles: a, an, the",
      explanationEn:
        "Use 'a' before consonant sounds and 'an' before vowel sounds (a book, an apple). Use 'the' when both speakers know exactly which thing is meant. Example: 'I saw a dog. The dog was black.'",
      explanationSo:
        "Isticmaal 'a' ka hor xarfaha aan shaqal ahayn iyo 'an' ka hor xarfaha shaqalka ah (a book, an apple). Isticmaal 'the' marka labada qof ee wada hadlaya ay si cad u og yihiin waxa la sheegayo. Tusaale: 'I saw a dog. The dog was black' (Waxaan arkay eey. Eeygu wuxuu ahaa mid madow).",
      examples: [
        { en: "She bought a book.", so: "Waxay iibsatay buug." },
        { en: "He ate an orange.", so: "Wuxuu cunay liin macaan." },
        { en: "The sun is bright today.", so: "Qorraxdu maanta way dhalaalaysaa." },
        { en: "I need an umbrella.", so: "Waxaan u baahanahay dallad." },
      ],
      exercises: [
        { type: "fill", prompt: "I saw ___ elephant at the zoo.", answer: "an", options: ["a", "an", "the"] },
        { type: "fill", prompt: "___ moon is beautiful tonight.", answer: "The", options: ["A", "An", "The"] },
        { type: "fill", prompt: "She has ___ cat and a dog.", answer: "a", options: ["a", "an", "the"] },
      ],
    },
  ],
  intermediate: [
    {
      id: "i-past-simple",
      topic: "Talking about the past: Past Simple",
      grammarTitle: "Past Simple tense",
      explanationEn:
        "Use the Past Simple for finished actions at a specific time in the past. Regular verbs add -ed ('worked'). Many common verbs are irregular ('go' → 'went', 'eat' → 'ate'). Example: 'I visited my family last week.'",
      explanationSo:
        "Isticmaal Past Simple marka aad ka hadlayso wax dhammaystiran oo dhacay wakhti gaar ah oo la soo dhaafay. Fal-celisyada caadiga ah waxay ku dartaan -ed ('worked'). Falal badan oo caan ah way sheekaayin gaar leeyihiin ('go' → 'went'). Tusaale: 'I visited my family last week' (Waxaan booqday qoyskeyga toddobaadkii hore).",
      examples: [
        { en: "I traveled to Nairobi last year.", so: "Sannadkii hore waxaan u safray Nairobi." },
        { en: "She finished her homework yesterday.", so: "Shaqadeedii guriga ayay shalay dhammaysay." },
        { en: "They went to the market this morning.", so: "Suuqa ayay tageen saaka." },
        { en: "We didn't watch the news last night.", so: "Habeenkii xalay wararka ma daawan." },
      ],
      exercises: [
        { type: "fill", prompt: "She ___ (go) to Mogadishu last month.", answer: "went", options: ["go", "went", "gone"] },
        { type: "fill", prompt: "We ___ (finish) the project on time.", answer: "finished", options: ["finish", "finished", "finishing"] },
        { type: "mcq", prompt: "Choose the correct negative sentence.", answer: "He didn't call me.", options: ["He not called me.", "He didn't called me.", "He didn't call me."] },
        { type: "fill", prompt: "I ___ (eat) breakfast before I left.", answer: "ate", options: ["eat", "ate", "eaten"] },
      ],
    },
    {
      id: "i-comparatives",
      topic: "Comparing things: Comparatives and Superlatives",
      grammarTitle: "Comparatives and superlatives",
      explanationEn:
        "Use comparatives to compare two things ('bigger than') and superlatives for the most extreme in a group ('the biggest'). Short adjectives add -er/-est; longer adjectives use more/most. Example: 'This city is bigger than that one. It's the biggest city in the region.'",
      explanationSo:
        "Isticmaal comparative marka aad isbarbardhigayso laba shay ('bigger than' — ka weyn) iyo superlative marka aad ka hadlayso ka ugu weyn koox ('the biggest' — ugu weyn). Sifooyinka gaagaaban waxay ku daraan -er/-est; kuwa dhaadheer waxay isticmaalaan more/most. Tusaale: 'This city is bigger than that one' (Magaaladan ayaa ka weyn tan).",
      examples: [
        { en: "Nairobi is bigger than Hargeisa.", so: "Nairobi way ka weyn tahay Hargeisa." },
        { en: "This is the most interesting book I've read.", so: "Kani waa buugga ugu xiisaha badan ee aan akhriyay." },
        { en: "She is more patient than her brother.", so: "Way ka samir badan tahay walaalkeed." },
        { en: "That was the easiest exam this year.", so: "Taasi waxay ahayd imtixaanka ugu fudud sanadkan." },
      ],
      exercises: [
        { type: "fill", prompt: "This road is ___ (long) than that one.", answer: "longer", options: ["long", "longer", "longest"] },
        { type: "fill", prompt: "She is the ___ (smart) student in class.", answer: "smartest", options: ["smart", "smarter", "smartest"] },
        { type: "mcq", prompt: "Choose the correct sentence.", answer: "This phone is more expensive than that one.", options: ["This phone is expensiver than that one.", "This phone is more expensive than that one.", "This phone is most expensive than that one."] },
      ],
    },
    {
      id: "i-modals",
      topic: "Giving advice: Modal verbs (should, must, can)",
      grammarTitle: "Modal verbs: should, must, can",
      explanationEn:
        "'Should' gives advice, 'must' expresses strong obligation or rules, and 'can' expresses ability or permission. Example: 'You should study every day.' 'You must submit the form by Friday.' 'I can speak three languages.'",
      explanationSo:
        "'Should' waxay bixisaa talo, 'must' waxay muujisaa waajib adag ama xeer, 'can' wuxuu muujiyaa awood ama ogolaansho. Tusaale: 'You should study every day' (Waa inaad maalin walba wax barato). 'You must submit the form by Friday' (Waa inaad foomka soo gudbisaa Jimcaha)." ,
      examples: [
        { en: "You should drink more water.", so: "Waa inaad biyo badan cabtaa." },
        { en: "Students must arrive on time.", so: "Ardaydu waa inay wakhtiga yimaadaan." },
        { en: "Can you help me with this?", so: "Ma i caawin kartaa tan?" },
        { en: "We must respect our elders.", so: "Waa inaan ixtiraamno waayeelka." },
      ],
      exercises: [
        { type: "fill", prompt: "You ___ wear a seatbelt — it's the law.", answer: "must", options: ["should", "must", "can"] },
        { type: "fill", prompt: "I think you ___ apologize to her.", answer: "should", options: ["should", "must", "can"] },
        { type: "mcq", prompt: "Which sentence asks about ability?", answer: "Can you swim?", options: ["Must you swim?", "Should you swim?", "Can you swim?"] },
      ],
    },
  ],
  advanced: [
    {
      id: "a-conditionals",
      topic: "Hypothetical situations: Conditionals",
      grammarTitle: "Second and third conditionals",
      explanationEn:
        "The second conditional talks about unreal present situations: 'If I had more time, I would travel.' The third conditional talks about unreal past situations: 'If I had studied, I would have passed.' Both describe imagined outcomes, not facts.",
      explanationSo:
        "Second conditional waxay ka hadashaa xaalado hadda ah oo aan run ahayn: 'If I had more time, I would travel' (Haddii aan haysto wakhti badan, waan safri lahaa). Third conditional waxay ka hadashaa xaalado la soo dhaafay oo aan dhicin: 'If I had studied, I would have passed' (Haddii aan wax barto lahaa, waan gudbi lahaa). Labaduba waxay sharxayaan natiijooyin la maleeyay, ma aha xaqiiqooyin.",
      examples: [
        { en: "If I had a car, I would visit you more often.", so: "Haddii aan baabuur haysto, waan ku booqan lahaa marar badan." },
        { en: "If she had known, she would have come earlier.", so: "Haddii ay ogaan lahayd, waxay imaan lahayd horaanti." },
        { en: "If we had more funding, we could expand the school.", so: "Haddii aan hayno maalgelin badan, waan balaadhin karnaa dugsiga." },
        { en: "I would have called you if I had your number.", so: "Waan ku soo wici lahaa haddii aan haysto lambarkaaga." },
      ],
      exercises: [
        { type: "fill", prompt: "If I ___ (have) more time, I would learn Spanish too.", answer: "had", options: ["have", "had", "would have"] },
        { type: "fill", prompt: "If she had studied harder, she ___ (pass) the exam.", answer: "would have passed", options: ["will pass", "would pass", "would have passed"] },
        { type: "mcq", prompt: "Choose the correct third conditional.", answer: "If he had left earlier, he would have caught the bus.", options: ["If he left earlier, he would catch the bus.", "If he had left earlier, he would have caught the bus.", "If he leaves earlier, he catches the bus."] },
      ],
    },
    {
      id: "a-passive",
      topic: "Formal and academic writing: The Passive Voice",
      grammarTitle: "Passive voice",
      explanationEn:
        "The passive voice shifts focus from who did an action to what happened. Form: object + be + past participle. Example: 'The report was written by the committee.' It is common in academic, news, and professional English.",
      explanationSo:
        "Passive voice waxay diiradda ka beddeshaa qofka sameeyay falka una wareejisaa waxa dhacay. Qaabka: shay + be + past participle. Tusaale: 'The report was written by the committee' (Warbixinta waxaa qoray guddigii). Aad ayey ugu badan tahay Ingiriisiga akadeemiga, wararka iyo xirfadeed.",
      examples: [
        { en: "The bridge was built in 1990.", so: "Buundadu waxaa la dhisay 1990." },
        { en: "New policies are being introduced this year.", so: "Siyaasado cusub ayaa la soo bandhigayaa sanadkan." },
        { en: "The results will be announced tomorrow.", so: "Natiijooyinka waa la sheegi doonaa berri." },
        { en: "Mistakes were made during the process.", so: "Khaladaad ayaa dhacay habka lagu socday." },
      ],
      exercises: [
        { type: "fill", prompt: "The letter ___ (send) yesterday.", answer: "was sent", options: ["sent", "was sent", "is sending"] },
        { type: "fill", prompt: "This building ___ (design) by a famous architect.", answer: "was designed", options: ["designed", "was designed", "designs"] },
        { type: "mcq", prompt: "Choose the passive sentence.", answer: "The exam is being graded now.", options: ["We are grading the exam now.", "The exam is being graded now.", "We grade the exam now."] },
      ],
    },
    {
      id: "a-idioms",
      topic: "Sounding natural: Common idioms",
      grammarTitle: "Idiomatic expressions",
      explanationEn:
        "Idioms are fixed expressions whose meaning isn't literal. Native speakers use them constantly in conversation. Example: 'break the ice' means to start a conversation comfortably, not to physically break ice.",
      explanationSo:
        "Idioms waa weedho go'an oo macnahoodu aanu ahayn mid toos ah. Ku hadlayaasha asaliga ah waxay si joogto ah u isticmaalaan wada-hadalka. Tusaale: 'break the ice' macnaheedu ma aha in barafka la jabiyo — waxay la micno tahay in wada-hadal si raaxo leh loo bilaabo.",
      examples: [
        { en: "He told a joke to break the ice.", so: "Wuxuu sheegay kaftan si uu wada-hadalka u fududeeyo." },
        { en: "That exam was a piece of cake.", so: "Imtixaankaasi wuxuu ahaa mid aad u fudud." },
        { en: "I've been feeling under the weather.", so: "Waan xanuunsanahay dhawaan." },
        { en: "It took time, but I finally got the hang of it.", so: "Waqti bay qaadatay, laakiin ugu dambeyntii waan bartay." },
      ],
      exercises: [
        { type: "mcq", prompt: "'Break the ice' means…", answer: "start a conversation comfortably", options: ["freeze something", "start a conversation comfortably", "cancel a meeting"] },
        { type: "mcq", prompt: "'A piece of cake' means…", answer: "something very easy", options: ["something delicious", "something very easy", "something expensive"] },
        { type: "mcq", prompt: "'Under the weather' means…", answer: "feeling slightly ill", options: ["enjoying the rain", "feeling slightly ill", "feeling very happy"] },
      ],
    },
  ],
};

export const topicChoices = {
  beginner: lessonTemplates.beginner.map((t) => ({ id: t.id, label: t.topic })),
  intermediate: lessonTemplates.intermediate.map((t) => ({ id: t.id, label: t.topic })),
  advanced: lessonTemplates.advanced.map((t) => ({ id: t.id, label: t.topic })),
};
