import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MessageCircle, ArrowRight } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { getConversationTopics } from "../utils/aiEngine";

const levels = ["beginner", "intermediate", "advanced"];

export default function Conversations() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [level, setLevel] = useState("beginner");

  const topics = getConversationTopics(level);

  function startConversation(topicId) {
    navigate(`/app/chat?level=${level}&topic=${topicId}`);
  }

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-semibold text-ink-900 dark:text-white">{t("conversations.title")}</h1>
      <p className="mt-1 text-ink-500 dark:text-ink-300 max-w-xl">{t("conversations.subtitle")}</p>

      <div className="mt-5 grid grid-cols-3 gap-2 max-w-md">
        {levels.map((lvl) => (
          <button
            key={lvl}
            onClick={() => setLevel(lvl)}
            className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors ${
              level === lvl
                ? "border-azure-500 bg-azure-50 text-azure-600 dark:bg-azure-900/40 dark:text-azure-300"
                : "border-ink-200 dark:border-ink-600 text-ink-500 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-ink-800"
            }`}
          >
            {t(`common.${lvl}`)}
          </button>
        ))}
      </div>

      <div className="mt-6 grid sm:grid-cols-2 gap-4">
        {topics.map((topic) => (
          <button
            key={topic.id}
            onClick={() => startConversation(topic.id)}
            className="card p-5 text-left hover:-translate-y-0.5 hover:shadow-lg transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-azure-50 dark:bg-azure-900/40 flex items-center justify-center text-azure-500 dark:text-azure-300">
              <MessageCircle className="w-5 h-5" />
            </div>
            <p className="mt-3 font-semibold text-ink-800 dark:text-white">{topic.label}</p>
            <p className="mt-1 text-xs text-ink-400 line-clamp-2">{topic.opener}</p>
            <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-azure-500 group-hover:gap-2 transition-all">
              {t("conversations.start")} <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
