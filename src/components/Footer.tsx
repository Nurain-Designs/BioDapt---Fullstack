import { useState } from "react";
import { motion } from "framer-motion";
import { ROUTE_META, type Route } from "../routes";

interface FooterProps {
  onRouteChange: (route: Route) => void;
}

export default function Footer({ onRouteChange }: FooterProps) {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    }
  }

  const go = (r: Route) => {
    onRouteChange(r);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="border-t border-slate-200 bg-slate-900 text-slate-300">
      {/* Main footer */}
      <div className="mx-auto max-w-7xl px-6 py-12 sm:px-6 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          {/* Brand column */}
          <div className="space-y-4">
            <button
              onClick={() => go("home")}
              className="flex items-center gap-2.5 group"
            >
              <motion.span
                whileHover={{ rotate: 10, scale: 1.1 }}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 text-base shadow-lg"
              >
                🌱
              </motion.span>
              <span className="text-lg font-bold text-white group-hover:text-emerald-400 transition">
                BioDapt
              </span>
            </button>
            <p className="text-sm leading-relaxed text-slate-400">
              An ML-based material recommendation system and agentic AI advisor that
              helps small manufacturers select the right biodegradable packaging material,
              replacing plastic packaging decisions made with no data support.
            </p>
            <div className="flex gap-2 pt-1">
              {[
                { icon: "GH", label: "GitHub", url: "https://github.com" },
                { icon: "LI", label: "LinkedIn", url: "https://linkedin.com" },
                { icon: "TW", label: "Twitter/X", url: "https://twitter.com" },
                { icon: "DS", label: "Discord", url: "https://discord.com" },
              ].map((s) => (
                <motion.a
                  key={s.label}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  whileHover={{ y: -3, scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="group flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800 text-xs font-bold text-slate-400 transition hover:bg-emerald-600 hover:text-white"
                >
                  {s.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Platform links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Platform</h3>
            <ul className="mt-4 space-y-3">
              {(["advisor", "materials", "radar", "api-docs", "pricing"] as Route[]).map((r) => {
                const m = ROUTE_META[r];
                return (
                  <li key={r}>
                    <motion.button
                      whileHover={{ x: 4 }}
                      onClick={() => go(r)}
                      className="text-sm text-left transition hover:text-emerald-400 focus:text-emerald-400 outline-none"
                    >
                      {m.icon} {m.label}
                    </motion.button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Resources / docs */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Resources</h3>
            <ul className="mt-4 space-y-3">
              {(["research", "dataset", "model", "cases", "faq", "contact"] as Route[]).map((r) => {
                const m = ROUTE_META[r];
                return (
                  <li key={r}>
                    <motion.button
                      whileHover={{ x: 4 }}
                      onClick={() => go(r)}
                      className="text-sm text-left transition hover:text-emerald-400 focus:text-emerald-400 outline-none"
                    >
                      {m.icon} {m.label}
                    </motion.button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Stay Updated</h3>
            <p className="mt-4 text-sm text-slate-400">
              Get updates on new materials, model improvements and sustainability insights.
            </p>

            {!subscribed ? (
              <form onSubmit={handleSubscribe} className="mt-4 space-y-2.5">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 px-4 py-2.5 text-sm font-semibold text-white shadow transition hover:shadow-lg hover:shadow-emerald-900/30"
                >
                  Subscribe to Updates
                </motion.button>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-900/50 px-4 py-3 ring-1 ring-inset ring-emerald-700/50"
              >
                <span className="text-green-400">✓</span>
                <span className="text-sm font-medium text-emerald-300">
                  Thanks! You're subscribed.
                </span>
              </motion.div>
            )}

            {/* Quick stats */}
            <div className="mt-5 grid grid-cols-2 gap-2">
              <Stat value="5+" label="Biopolymers" />
              <Stat value="6D" label="Properties" />
              <Stat value="~300r" label="Dataset rows" />
              <Stat value="7–8w" label="Est. build time" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-800 bg-slate-900/60">
        <div className="mx-auto flex max-w-7xl flex-col flex-wrap items-center justify-between gap-3 px-6 py-4 text-xs text-slate-500 sm:flex-row">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span>© {new Date().getFullYear()} BioDapt — Project IDEAKR036309</span>
            <span className="hidden text-slate-700">·</span>
            {(["privacy", "terms", "license"] as Route[]).map((r) => {
              const m = ROUTE_META[r];
              return (
                <motion.button
                  key={r}
                  whileHover={{ y: -1 }}
                  onClick={() => go(r)}
                  className="hover:text-slate-300 transition"
                >
                  {m.label}
                </motion.button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden text-slate-700 sm:inline">Built with</span>
            {["Python", "Scikit-learn", "LangChain", "Ollama", "Streamlit"].map((t) => (
              <span
                key={t}
                className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-medium text-slate-400"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="rounded-lg bg-slate-800/50 p-2 text-center cursor-default"
    >
      <div className="text-base font-bold text-emerald-400">{value}</div>
      <div className="text-[10px] leading-tight text-slate-500">{label}</div>
    </motion.div>
  );
}
