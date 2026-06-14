import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { post } from "../lib/api";
import { MATERIALS } from "../data/materials";
import { parseRequirements, recommend, buildAgentTrace, type Recommendation, type AgentStep } from "../lib/advisor";

export interface ChatMessage {
  id: number;
  role: "user" | "agent";
  text: string;
  trace?: AgentStep[];
  recs?: Recommendation[];
}

const EXAMPLES = [
  {
    text: "I need packaging for frozen food that must biodegrade within 6 months in compost",
    icon: "🧊",
  },
  {
    text: "Cheap flexible mailer bag for e-commerce that breaks down in the ocean",
    icon: "📦",
  },
  {
    text: "Heat-resistant pharmaceutical blister pack, home compostable",
    icon: "",
  },
  {
    text: "Strong industrial wrap, biodegrades within 1 year in landfill",
    icon: "🏭",
  },
];

export default function ChatAdvisor({
  onResult,
}: {
  onResult: (recs: Recommendation[]) => void;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 0,
      role: "agent",
      text: "Hi! I'm the BioDapt advisor. Describe your product and disposal goals in plain English — e.g. \"I need packaging for frozen food that must biodegrade within 6 months in compost\" — and I'll recommend the best biodegradable materials with trade-off explanations.",
    },
  ]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, thinking]);

  function submit(text: string) {
    const q = text.trim();
    if (!q || thinking) return;
    const userMsg: ChatMessage = { id: Date.now(), role: "user", text: q };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setThinking(true);

    post<{ query: string; recommendations: Recommendation[] }>("/api/recommend", { query: q })
      .then(({ recommendations }) => {
        const req = parseRequirements(q);
        const localRecs = recommend(req);

        const top3 = recommendations.slice(0, 3).map(rec => {
          const localRec = localRecs.find(lr => lr.material.id === rec.material.id);
          return {
            ...rec,
            material: localRec ? localRec.material : (MATERIALS.find(m => m.id === rec.material.id) || rec.material),
            reasons: rec.reasons || (localRec ? localRec.reasons : []),
            warnings: rec.warnings || (localRec ? localRec.warnings : []),
            score: localRec ? localRec.score : rec.score,
          } as Recommendation;
        });

        onResult(top3);
        const summary = `Based on your needs I recommend **${top3[0].material.name}** as the top choice (match ${top3[0].score}/100). I've shortlisted the top 3 — compare them on the radar chart →`;
        setMessages((m) => [
          ...m,
          {
            id: Date.now() + 1,
            role: "agent",
            text: summary,
            trace: buildAgentTrace(req, top3),
            recs: top3,
          },
        ]);
      })
      .catch((err) => {
        console.error("Recommendation error:", err);
        setMessages((m) => [
          ...m,
          {
            id: Date.now() + 1,
            role: "agent",
            text: "Sorry, I couldn't fetch recommendations. Please try again later.",
          },
        ]);
      })
      .finally(() => setThinking(false));
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-4">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-lg">
          🤖
        </span>
        <div>
          <h2 className="text-sm font-semibold text-slate-900">Agentic AI Advisor</h2>
          <p className="text-xs text-slate-400">LangChain + Ollama · classifier & regression tools</p>
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
        <AnimatePresence mode="popLayout">
          {messages.map((m) => (
            <motion.div
              key={m.id}
              layout
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <div
                className={
                  m.role === "user"
                    ? "ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-emerald-600 px-4 py-2.5 text-sm text-white shadow-lg shadow-emerald-200"
                    : "mr-auto max-w-[90%] rounded-2xl rounded-bl-sm bg-slate-100 px-4 py-2.5 text-sm text-slate-700"
                }
              >
                <Formatted text={m.text} />
              </div>

              {m.trace && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ delay: 0.3 }}
                  className="mr-auto mt-2 max-w-[90%] space-y-1.5 overflow-hidden rounded-xl border border-slate-200 bg-white p-3"
                >
                  <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                    Agent reasoning trace
                  </p>
                  {m.trace.map((s, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + i * 0.15 }}
                      className="flex gap-2 text-xs"
                    >
                      <span className="font-semibold text-emerald-600">{i + 1}.</span>
                      <span className="text-slate-600">
                        <span className="font-medium text-slate-800">{s.label}:</span> {s.detail}
                      </span>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        <AnimatePresence>
          {thinking && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mr-auto flex max-w-[90%] items-center gap-2 rounded-2xl rounded-bl-sm bg-slate-100 px-4 py-3 text-sm text-slate-500"
            >
              <Dots /> querying models…
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={endRef} />
      </div>

      {messages.length <= 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap gap-2 px-5 pb-2"
        >
          <p className="w-full text-[11px] font-semibold uppercase tracking-wide text-slate-400 mb-1">
            Try an example:
          </p>
          {EXAMPLES.map((ex, i) => (
            <motion.button
              key={ex.text}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => submit(ex.text)}
              className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-left text-xs text-slate-600 transition hover:border-emerald-300 hover:bg-emerald-50"
            >
              <span>{ex.icon}</span>
              <span className="max-w-[240px] truncate">{ex.text}</span>
            </motion.button>
          ))}
        </motion.div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit(input);
        }}
        className="flex items-center gap-2 border-t border-slate-100 p-4"
      >
        <motion.input
          whileFocus={{ scale: 1.01 }}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Describe your packaging needs…"
          className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-emerald-400 focus:bg-white"
        />
        <motion.button
          type="submit"
          disabled={!input.trim() || thinking}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Send
        </motion.button>
      </form>
    </div>
  );
}

function Formatted({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <span>
      {parts.map((p, i) =>
        p.startsWith("**") && p.endsWith("**") ? (
          <strong key={i} className="font-semibold">
            {p.slice(2, -2)}
          </strong>
        ) : (
          <span key={i}>{p}</span>
        )
      )}
    </span>
  );
}

function Dots() {
  return (
    <span className="flex gap-1">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
          className="h-1.5 w-1.5 rounded-full bg-slate-400"
        />
      ))}
    </span>
  );
}
