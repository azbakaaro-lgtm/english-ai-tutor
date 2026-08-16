import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Send, Bot, User, RefreshCcw, Sparkles } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { getConversationTopics, openerFor, generateTutorReply } from "../utils/aiEngine";
import AudioButton from "../components/AudioButton";

const levels = ["beginner", "intermediate", "advanced"];

export default function Chatbot() {
  const { t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();

  const initialLevel = levels.includes(searchParams.get("level")) ? searchParams.get("level") : "beginner";
  const initialTopics = getConversationTopics(initialLevel);
  const initialTopic = initialTopics.find((tp) => tp.id === searchParams.get("topic")) || initialTopics[0];

  const [level, setLevel] = useState(initialLevel);
  const [topicId, setTopicId] = useState(initialTopic.id);
  const [messages, setMessages] = useState(() => [
    { role: "tutor", text: openerFor(initialLevel, initialTopic.id) },
  ]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thinking]);

  // If Conversations.jsx (or a bookmark/link) navigates here with a new
  // ?level=&topic=, pick that conversation up instead of ignoring it.
  useEffect(() => {
    const urlLevel = searchParams.get("level");
    const urlTopic = searchParams.get("topic");
    if (!urlLevel || !urlTopic) return;
    if (!levels.includes(urlLevel)) return;
    const topics = getConversationTopics(urlLevel);
    const found = topics.find((tp) => tp.id === urlTopic);
    if (!found) return;
    if (urlLevel === level && urlTopic === topicId) return;
    setLevel(urlLevel);
    setTopicId(found.id);
    setMessages([{ role: "tutor", text: openerFor(urlLevel, found.id) }]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  function startNewTopic(newLevel = level, topics = getConversationTopics(newLevel)) {
    const topic = topics[Math.floor(Math.random() * topics.length)];
    setTopicId(topic.id);
    setMessages([{ role: "tutor", text: openerFor(newLevel, topic.id) }]);
    setSearchParams({ level: newLevel, topic: topic.id }, { replace: true });
  }

  function handleLevelChange(lvl) {
    setLevel(lvl);
    startNewTopic(lvl, getConversationTopics(lvl));
  }

  function handleSend(e) {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    setMessages((m) => [...m, { role: "user", text }]);
    setInput("");
    setThinking(true);
    setTimeout(() => {
      const { reply, correction } = generateTutorReply(text, level, messages);
      setMessages((m) => [...m, { role: "tutor", text: reply, correction }]);
      setThinking(false);
    }, 500 + Math.random() * 400);
  }

  return (
    <div className="flex flex-col h-[calc(100vh-6.5rem)] lg:h-[calc(100vh-6rem)]">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-ink-900 dark:text-white">{t("chatbot.title")}</h1>
          <p className="mt-1 text-ink-500 dark:text-ink-300">{t("chatbot.subtitle")}</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={level}
            onChange={(e) => handleLevelChange(e.target.value)}
            className="input !w-auto !py-2 text-sm"
          >
            {levels.map((lvl) => (
              <option key={lvl} value={lvl}>{t(`common.${lvl}`)}</option>
            ))}
          </select>
          <button onClick={() => startNewTopic()} className="btn-ghost !px-3 !py-2 text-sm">
            <RefreshCcw className="w-4 h-4" />
            <span className="hidden sm:inline">{t("chatbot.newTopic")}</span>
          </button>
        </div>
      </div>

      <div className="mt-4 flex-1 card p-4 sm:p-5 flex flex-col min-h-0">
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {messages.map((m, i) => (
            <MessageBubble key={i} message={m} t={t} />
          ))}
          {thinking && (
            <div className="flex items-center gap-2 text-sm text-ink-400">
              <Bot className="w-4 h-4" />
              {t("chatbot.thinking")}
            </div>
          )}
          <div ref={endRef} />
        </div>

        <form onSubmit={handleSend} className="mt-4 flex items-center gap-2 border-t border-ink-100 dark:border-ink-700 pt-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t("chatbot.placeholder")}
            className="input flex-1"
          />
          <button type="submit" className="btn-primary !px-4">
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">{t("chatbot.send")}</span>
          </button>
        </form>
      </div>
      <p className="mt-2 text-xs text-ink-400 flex items-center gap-1">
        <Sparkles className="w-3 h-3" /> {t("chatbot.privacyNote")}
      </p>
    </div>
  );
}

function MessageBubble({ message, t }) {
  const isTutor = message.role === "tutor";
  return (
    <div className={`flex ${isTutor ? "justify-start" : "justify-end"} gap-2`}>
      {isTutor && (
        <div className="w-7 h-7 rounded-full bg-azure-500 text-white flex items-center justify-center shrink-0">
          <Bot className="w-4 h-4" />
        </div>
      )}
      <div className="max-w-[80%] space-y-2">
        <div
          className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed flex items-start gap-2 ${
            isTutor
              ? "bg-ink-100 dark:bg-ink-700 text-ink-700 dark:text-ink-100 rounded-tl-sm"
              : "bg-azure-500 text-white rounded-tr-sm"
          }`}
        >
          <span className="flex-1">{message.text}</span>
          <AudioButton text={message.text} size="small" className={!isTutor ? "!bg-white/20 !text-white hover:!bg-white/30" : ""} />
        </div>
        {message.correction && (
          <div className="rounded-xl border border-gold-200 dark:border-gold-500/30 bg-gold-50 dark:bg-gold-500/10 px-3.5 py-2.5 text-xs space-y-1">
            <p className="font-semibold text-gold-700 dark:text-gold-300">{t("chatbot.correctionLabel")}</p>
            <p className="text-ink-500 dark:text-ink-300 line-through decoration-coral-400">{message.correction.original}</p>
            <div className="flex items-center gap-2">
              <p className="text-ink-800 dark:text-white font-medium flex-1">{message.correction.corrected}</p>
              <AudioButton text={message.correction.corrected} size="small" />
            </div>
            <p className="text-ink-500 dark:text-ink-400 pt-1 border-t border-gold-200/60 dark:border-gold-500/20 mt-1">
              <span className="font-semibold">{t("chatbot.somaliLabel")}: </span>
              {message.correction.explanationSo}
            </p>
          </div>
        )}
      </div>
      {!isTutor && (
        <div className="w-7 h-7 rounded-full bg-ink-700 dark:bg-ink-600 text-white flex items-center justify-center shrink-0">
          <User className="w-4 h-4" />
        </div>
      )}
    </div>
  );
}
