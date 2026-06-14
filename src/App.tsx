import { useState, useEffect, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import Header from "./components/Header";
import Footer from "./components/Footer";
import PageWrapper from "./components/PageWrapper";
import ChatAdvisor from "./components/ChatAdvisor";
import RadarComparison from "./components/RadarComparison";
import RecommendationCard from "./components/RecommendationCard";
import Animated, { StaggerChildren, StaggerItem } from "./components/Animated";
import { MATERIALS } from "./data/materials";
import type { Recommendation } from "./lib/advisor";
import { type Route, ROUTE_META } from "./routes";

/* ==================== MAIN APP ==================== */

export default function App() {
  const [route, setRoute] = useState<Route>("home");
  const [recs, setRecs] = useState<Recommendation[]>([]);
  const compareMaterials =
    recs.length > 0 ? recs.map((r) => r.material) : MATERIALS.slice(0, 3);

  const go = (r: Route) => setRoute(r);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-emerald-50 via-white to-teal-50 text-slate-800">
      <Header activeRoute={route} onRouteChange={go} />

      <main className="flex-1">
        <AnimatePresence mode="wait">
          <PageWrapper key={route}>
            {route === "home" && <HomePage go={go} />}
            {route === "advisor" && (
              <AdvisorPage recs={recs} setRecs={setRecs} compareMaterials={compareMaterials} />
            )}
            {route === "materials" && <MaterialsPage />}
            {route === "radar" && (
              <RadarPage compareMaterials={compareMaterials} recs={recs} go={go} />
            )}
            {route === "about" && <AboutPage />}
            {route === "api-docs" && <ApiDocsPage />}
            {route === "pricing" && <PricingPage />}
            {route === "research" && <ResearchPage />}
            {route === "dataset" && <DatasetPage />}
            {route === "model" && <ModelPage />}
            {route === "cases" && <CasesPage />}
            {route === "faq" && <FaqPage />}
            {route === "contact" && <ContactPage />}
            {route === "privacy" && <PolicyPage
              title="Privacy Policy"
              lastUpdated="2026-01-15"
              sections={[
                { h: "Data we collect", p: "Only the plain-text queries you type into the BioDapt advisor. No personal data is required to use the recommendation engine." },
                { h: "How we use it", p: "Your input is parsed locally to extract material requirements (application type, disposal environment, constraints). The parsed structure is used to query the classifier and regression model. We do not store raw queries by default." },
                { h: "Sharing", p: "We do not share your inputs with third parties. Aggregate, anonymized usage statistics may be used to improve model accuracy." },
                { h: "Cookies", p: "BioDapt uses only essential session cookies. No tracking cookies." },
                { h: "Contact", p: "For privacy concerns, write to privacy@biodapt.example." },
              ]}
            />}
            {route === "terms" && <PolicyPage
              title="Terms of Use"
              lastUpdated="2026-01-15"
              sections={[
                { h: "Acceptance", p: "By accessing BioDapt, you agree to these terms. The platform is provided for informational purposes to support sustainable packaging decisions." },
                { h: "Use license", p: "Permission is granted to use the tool for commercial and non-commercial evaluation of biodegradable materials. The underlying models and datasets may carry separate licensing." },
                { h: "Disclaimer", p: "Recommendations are based on publicly available material property data. Always verify with a materials engineer before committing to production. BioDapt is not liable for decisions made using its outputs." },
                { h: "Restrictions", p: "Do not reverse-engineer the models, scrape the dataset, or misrepresent the source of the recommendations." },
                { h: "Changes", p: "We may update these terms. Continued use after updates constitutes acceptance." },
              ]}
            />}
            {route === "license" && <LicensePage />}
          </PageWrapper>
        </AnimatePresence>
      </main>

      <Footer onRouteChange={go} />
    </div>
  );
}

/* ==================== PAGE COMPONENTS ==================== */

/* ---------- HOME PAGE ---------- */

function HomePage({ go }: { go: (r: Route) => void }) {
  return (
    <>
      <section className="mx-auto max-w-7xl px-6 pt-12 pb-10">
        <Animated>
          <div className="grid items-center gap-10 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 mb-4">
                <span>🌍</span> Low-Carbon / Sustainability
              </div>
              <h2 className="text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl">
                Replace plastic packaging{" "}
                <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                  guesswork
                </span>
                {" "}with intelligent decisions
              </h2>
              <p className="mt-5 max-w-2xl text-slate-600 leading-relaxed text-lg">
                Describe your product in plain English. BioDapt's agentic advisor
                queries a material classifier and a biodegradation-time regression
                model to recommend the right biopolymer — with a radar comparison
                of the top trade-offs.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <HomeCta onClick={() => go("advisor")} emoji="🤖" label="Try the AI Advisor" variant="primary" />
                <HomeCta onClick={() => go("materials")} emoji="🧪" label="Browse Materials" variant="secondary" />
                <HomeCta onClick={() => go("radar")} emoji="" label="Compare on Radar" variant="ghost" />
              </div>
            </div>

            <StaggerChildren className="grid grid-cols-2 gap-3">
              <Metric
                icon="📦"
                rawValue={400}
                prefix=""
                suffix="M"
                label="tonnes of plastic packaging produced annually"
                hint="Explore case studies →"
                navigateTo="cases"
                decimals={0}
                go={go}
              />
              <Metric
                icon="🧪"
                rawValue={5}
                prefix=""
                suffix="+"
                label="biodegradable biopolymers profiled"
                hint="Browse materials →"
                navigateTo="materials"
                decimals={0}
                go={go}
              />
              <Metric
                icon=""
                rawValue={6}
                prefix=""
                suffix="D"
                label="property dimensions scored"
                hint="See radar view →"
                navigateTo="radar"
                decimals={0}
                go={go}
              />
              <Metric
                icon="🗂️"
                rawValue={300}
                prefix="~"
                suffix="r"
                label="dataset rows"
                hint="View dataset →"
                navigateTo="dataset"
                decimals={0}
                go={go}
              />
            </StaggerChildren>
          </div>
        </Animated>
      </section>

      {/* Feature cards */}
      <section className="mx-auto max-w-7xl px-6 pb-14">
        <StaggerChildren className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: "AI Advisor",
              desc: "Natural language input → ML tool calls → ranked recommendations with trade-offs.",
              icon: "🤖",
              route: "advisor" as Route,
              color: "emerald",
            },
            {
              title: "Material Database",
              desc: "Detailed property profiles from MatWeb for PLA, PHA, starch, chitosan, cellulose.",
              icon: "🧪",
              route: "materials" as Route,
              color: "teal",
            },
            {
              title: "Radar Comparator",
              desc: "6-axis visualization normalizing strength, cost, flexibility, degradation speed.",
              icon: "",
              route: "radar" as Route,
              color: "blue",
            },
            {
              title: "Case Studies",
              desc: "Real manufacturer stories showing 30–60% plastic reduction achieved.",
              icon: "📚",
              route: "cases" as Route,
              color: "amber",
            },
          ].map((c) => (
            <motion.div
              key={c.title}
              variants={StaggerItem}
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="group cursor-pointer rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-xl"
              onClick={() => go(c.route)}
            >
              <div className="text-3xl mb-3">{c.icon}</div>
              <h3 className="font-bold text-slate-900 text-lg">{c.title}</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">{c.desc}</p>
              <div className="mt-4 text-sm font-semibold text-emerald-600 flex items-center gap-1 group-hover:gap-2 transition-all">
                Explore →
              </div>
            </motion.div>
          ))}
        </StaggerChildren>
      </section>

      {/* Trust bar */}
      <Animated className="mx-auto max-w-7xl px-6 pb-16">
        <div className="rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 p-8 text-white shadow-xl">
          <div className="grid items-center gap-6 md:grid-cols-[1fr_auto]">
            <div>
              <h3 className="text-2xl font-bold">Why BioDapt?</h3>
              <p className="mt-2 text-emerald-50 leading-relaxed">
                Most MSMEs have <strong>no tool</strong> to evaluate biodegradable packaging alternatives.
                BioDapt closes that gap — from "I need a wrapper for frozen dumplings" to a ranked shortlist
                with scientific backing, in under a minute.
              </p>
            </div>
            <button
              onClick={() => go("about")}
              className="rounded-xl bg-white text-emerald-700 px-6 py-3 font-semibold shadow hover:bg-emerald-50 transition"
            >
              Learn more →
            </button>
          </div>
        </div>
      </Animated>
    </>
  );
}

function HomeCta({ onClick, emoji, label, variant }: { onClick: () => void; emoji: string; label: string; variant: "primary" | "secondary" | "ghost" }) {
  const base = "inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition";
  const variants = {
    primary: "bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-lg shadow-emerald-200 hover:shadow-xl hover:-translate-y-0.5",
    secondary: "border border-slate-200 bg-white text-slate-700 shadow-sm hover:border-emerald-300 hover:bg-emerald-50",
    ghost: "text-emerald-700 hover:bg-emerald-50",
  };
  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`${base} ${variants[variant]}`}
    >
      <span>{emoji}</span> {label}
    </motion.button>
  );
}

/* ============ COUNT-UP ANIMATED METRIC ============ */
function CountUp({
  from = 0,
  to,
  duration = 1.8,
  prefix = "",
  suffix = "",
  decimals = 0,
}: {
  from?: number;
  to: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}) {
  const [val, setVal] = useState(from);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
        }
      },
      { threshold: 0.4 }
    );
    io.observe(node);
    return () => io.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    const start = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const elapsed = (now - start) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutQuart
      const ease = 1 - Math.pow(1 - progress, 4);
      const current = from + (to - from) * ease;
      setVal(current);
      if (progress < 1) {
        raf = requestAnimationFrame(tick);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [started, from, to, duration]);

  const formatted = decimals > 0 ? val.toFixed(decimals) : Math.round(val).toLocaleString();

  return (
    <span ref={ref} className="inline-block tabular-nums">
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}

/* ============ CLICKABLE METRIC ============ */
interface MetricProps {
  icon: string;
  rawValue: number;
  prefix?: string;
  suffix?: string;
  label: string;
  hint: string;
  navigateTo: Route;
  decimals?: number;
  duration?: number;
  go: (r: Route) => void;
}

function Metric({
  icon,
  rawValue,
  prefix = "",
  suffix = "",
  label,
  hint,
  navigateTo,
  decimals = 0,
  duration = 1.8,
  go,
}: MetricProps) {
  return (
    <motion.button
      variants={StaggerItem}
      whileHover={{ scale: 1.06, rotate: -1, y: -4 }}
      whileTap={{ scale: 0.96 }}
      onClick={() => go(navigateTo)}
      className="group relative cursor-pointer rounded-2xl border border-emerald-100 bg-white/90 p-4 text-center shadow-sm transition hover:border-emerald-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2"
      aria-label={`${label} — ${hint}`}
      title={hint}
    >
      <span className="absolute right-2 top-2 text-xs text-emerald-500 opacity-0 transition group-hover:opacity-100">
        →
      </span>
      <motion.span
        className="text-xl block mb-1 group-hover:scale-110 transition"
        animate={{ rotate: [0, 8, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
      >
        {icon}
      </motion.span>
      <div className="text-2xl font-bold text-emerald-600">
        <CountUp
          from={0}
          to={rawValue}
          duration={duration}
          prefix={prefix}
          suffix={suffix}
          decimals={decimals}
        />
      </div>
      <div className="mt-1 text-[11px] leading-snug text-slate-500">{label}</div>
      <div className="mt-1.5 text-[10px] font-medium text-emerald-600 opacity-0 transition group-hover:opacity-100">
        {hint}
      </div>
    </motion.button>
  );
}

/* ---------- ADVISOR PAGE ---------- */

function AdvisorPage({ recs, setRecs, compareMaterials }: {
  recs: Recommendation[];
  setRecs: React.Dispatch<React.SetStateAction<Recommendation[]>>;
  compareMaterials: typeof MATERIALS;
}) {
  return (
    <section className="mx-auto max-w-7xl px-6 pt-8 pb-16">
      <Animated>
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-1">
            <motion.span animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }} className="text-2xl inline-block">🤖</motion.span>
            <h2 className="text-2xl font-bold text-slate-900">AI Material Advisor</h2>
            <motion.span
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="rounded-full bg-green-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-green-700"
            >
              Live Engine
            </motion.span>
          </div>
          <p className="text-sm text-slate-500 max-w-2xl">
            Type your product and disposal goals in plain English. The advisor uses a requirement parser,
            a material classifier, and a biodegradation regression model to generate ranked recommendations.
          </p>
        </div>
      </Animated>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,420px)_1fr]">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex h-[620px] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl ring-1 ring-inset ring-slate-100"
        >
          <ChatAdvisor onResult={setRecs} />
        </motion.div>

        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl ring-1 ring-inset ring-slate-100"
          >
            <div className="mb-2 flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                  <span>📊</span> Trade-off Comparison
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {recs.length > 0
                    ? "Top 3 recommended materials across all normalized properties"
                    : "Showing default materials — ask the advisor for your specific shortlist"}
                </p>
              </div>
              {recs.length > 0 && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setRecs([])}
                  className="text-xs text-slate-400 hover:text-slate-600 underline"
                >
                  Reset view
                </motion.button>
              )}
            </div>
            <RadarComparison materials={compareMaterials} />
            <p className="mt-3 text-center text-[11px] text-slate-400 bg-slate-50 -mx-6 -mb-6 py-2 rounded-b-3xl">
              All axes normalized 0–100 (higher outward = better). Moisture barrier and affordability are inverted so direction is consistent.
            </p>
          </motion.div>

          <div>
            <h3 className="mb-3 text-base font-semibold text-slate-900 flex items-center gap-2">
              <span>⭐</span>
              {recs.length > 0 ? "Recommended Shortlist" : "Material Library"}
            </h3>
            <div className="grid gap-3 sm:grid-cols-1">
              {recs.length > 0 ? (
                recs.map((rec, i) => (
                  <motion.div
                    key={rec.material.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <RecommendationCard rec={rec} rank={i} />
                  </motion.div>
                ))
              ) : (
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {MATERIALS.map((m, i) => (
                    <motion.div
                      key={m.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                      whileHover={{ y: -4, scale: 1.02 }}
                      className="group cursor-pointer rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:border-emerald-300 hover:shadow-md"
                      onClick={() => (window.location.hash = "#advisor-section")}
                    >
                      <div className="flex items-center gap-2">
                        <motion.span
                          className="h-4 w-4 rounded-full shadow-inner ring-2 ring-offset-1"
                          style={{ backgroundColor: m.color }}
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                        <h4 className="font-semibold text-slate-900">{m.shortName}</h4>
                      </div>
                      <p className="mt-1 text-xs text-slate-500">{m.family}</p>
                      <p className="mt-2 line-clamp-3 text-xs text-slate-600">{m.description}</p>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- MATERIALS PAGE ---------- */

function MaterialsPage() {
  return (
    <section className="mx-auto max-w-7xl px-6 pt-8 pb-16">
      <Animated>
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <motion.span animate={{ y: [0, -4, 0] }} transition={{ duration: 2, repeat: Infinity }} className="text-2xl inline-block">🧪</motion.span>
            <h2 className="text-2xl font-bold text-slate-900">Material Database</h2>
          </div>
          <p className="text-sm text-slate-500 max-w-2xl">
            Comprehensive profiles of 5 biodegradable polymers compiled from MatWeb and published
            biopolymer property datasets. ~200–300 rows covering PLA, PHA, starch-based films,
            chitosan, and cellulose composites.
          </p>
        </div>
      </Animated>

      <StaggerChildren className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {MATERIALS.map((m) => (
          <motion.div
            key={m.id}
            variants={StaggerItem}
            whileHover={{ y: -6 }}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-xl"
          >
            <div
              className="px-5 py-4 text-white"
              style={{ background: `linear-gradient(135deg, ${m.color}dd, ${m.color})` }}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur text-lg font-bold">
                  {m.shortName.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold">{m.name}</h3>
                  <p className="text-xs opacity-80">{m.family}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3 p-5">
              <p className="text-sm text-slate-600">{m.description}</p>

              <div className="grid grid-cols-2 gap-2">
                <InfoBar label="Tensile Strength" value={`${m.tensileStrength} MPa`} />
                <InfoBar label="Elongation" value={`${m.elongation}%`} />
                <InfoBar label="WVP" value={`${m.waterVaporPermeability}`} note="lower=better" />
                <InfoBar label="Max temp" value={`${m.tempResistance}°C`} />
                <InfoBar label="Biodeg rate" value={`${m.biodegradationRate}%/mo`} highlight />
                <InfoBar label="Cost" value={`$${m.costPerKg.toFixed(2)}/kg`} />
              </div>

              <div className="rounded-xl bg-slate-50 p-3">
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">Degradation Time</p>
                <DegRow label="Compost" value={m.biodegradeDays.compost} />
                <DegRow label="Landfill" value={m.biodegradeDays.landfill} />
                <DegRow label="Marine" value={m.biodegradeDays.marine} />
              </div>

              <div className="space-y-1.5">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Application Suitability</p>
                {(Object.entries(m.suitability) as [string, number][]).map(([app, val]) => (
                  <motion.div
                    key={app}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex items-center gap-2"
                  >
                    <span className="w-20 truncate text-xs text-slate-600 capitalize">{app}</span>
                    <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${val}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: m.color }}
                      />
                    </div>
                    <span className="w-7 text-right text-xs font-medium text-slate-500">{val}</span>
                  </motion.div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-emerald-600">Pros</p>
                  <ul className="space-y-0.5">
                    {m.pros.slice(0, 3).map((p, i) => (
                      <li key={i} className="flex items-start gap-1 text-xs text-slate-600">
                        <span className="text-emerald-500">✓</span> {p}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-amber-600">Cons</p>
                  <ul className="space-y-0.5">
                    {m.cons.slice(0, 3).map((c, i) => (
                      <li key={i} className="flex items-start gap-1 text-xs text-slate-600">
                        <span className="text-amber-500">!</span> {c}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </StaggerChildren>
    </section>
  );
}

function InfoBar({ label, value, note, highlight }: { label: string; value: string; note?: string; highlight?: boolean }) {
  return (
    <div className={`flex items-center justify-between rounded-lg px-3 py-1.5 ${highlight ? "bg-emerald-50" : "bg-slate-50"}`}>
      <span className="text-[11px] text-slate-500">{label}{note && <span className="ml-1 opacity-60">({note})</span>}</span>
      <span className={`text-xs font-semibold ${highlight ? "text-emerald-700" : "text-slate-800"}`}>{value}</span>
    </div>
  );
}

function DegRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between text-xs text-slate-700">
      <span>{label}</span>
      <span className="font-semibold">{value} days</span>
    </div>
  );
}

/* ---------- RADAR PAGE ---------- */

function RadarPage({ compareMaterials, recs, go }: { compareMaterials: typeof MATERIALS; recs: Recommendation[]; go: (r: Route) => void }) {
  return (
    <section className="mx-auto max-w-7xl px-6 pt-8 pb-16">
      <Animated>
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-1">
            <motion.span animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="text-2xl inline-block">📊</motion.span>
            <h2 className="text-2xl font-bold text-slate-900">Radar Comparator</h2>
          </div>
          <p className="text-sm text-slate-500 max-w-2xl">
            Compare materials across 6 normalized property dimensions. Higher outward = better performance.
            Moisture barrier and affordability axes are inverted for consistent interpretation.
          </p>
        </div>
      </Animated>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <Animated delay={0.1}>
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl ring-1 ring-inset ring-slate-100">
            <RadarComparison materials={compareMaterials} />
          </div>
        </Animated>

        <Animated delay={0.2}>
          <div className="space-y-3">
            <h3 className="text-base font-semibold text-slate-900">Materials being compared</h3>
            {compareMaterials.map((m, i) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                whileHover={{ x: 4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => go("materials")}
                className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm cursor-pointer hover:border-blue-300 hover:shadow-md transition-all"
              >
                <span className="h-8 w-8 rounded-lg flex items-center justify-center text-white font-bold" style={{ backgroundColor: m.color }}>
                  {m.shortName.charAt(0)}
                </span>
                <div className="flex-1">
                  <div className="font-semibold text-slate-900 text-sm">{m.name}</div>
                  <div className="text-xs text-slate-500">{m.family}</div>
                </div>
                {recs[i] && (
                  <div className="text-right">
                    <div className="text-lg font-bold" style={{ color: m.color }}>{recs[i].score}</div>
                    <div className="text-[10px] text-slate-400 uppercase">match</div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </Animated>
      </div>
    </section>
  );
}

/* ---------- ABOUT PAGE ---------- */

function AboutPage() {
  return (
    <section className="mx-auto max-w-7xl px-6 pt-8 pb-16">
      <div className="max-w-3xl mx-auto space-y-8">
        <Animated>
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 mb-4">
              Project IDEAKR036309 · Low-Code Complexity, High Concept
            </div>
            <h2 className="text-3xl font-bold text-slate-900">About BioDapt</h2>
            <p className="mt-3 text-slate-600">
              An ML-based material recommendation system and agentic AI advisor that helps small manufacturers select the right biodegradable packaging material for their product, replacing plastic packaging decisions that are currently made with no data support.
            </p>
          </div>
        </Animated>

        <StaggerChildren className="grid gap-4 sm:grid-cols-2">
          <InfoCard icon="🎯" title="Objective" variants={StaggerItem}>
            <ul className="list-disc ml-4 space-y-1 text-sm text-slate-600">
              <li>Compile a ~200–300 row materials dataset (PLA, PHA, starch, chitosan, cellulose)</li>
              <li>Train multi-label classifier for application-type recommendation</li>
              <li>Train regression model predicting biodegradation time</li>
              <li>Build agentic AI advisor (LangChain + Ollama)</li>
              <li>Streamlit interface with radar chart</li>
            </ul>
          </InfoCard>
          <InfoCard icon="🛠️" title="Tech Stack" variants={StaggerItem}>
            <ul className="space-y-1.5 text-sm text-slate-600">
              {[
                { t: "Python + Scikit-learn", d: "Classifier & regression" },
                { t: "LangChain + Ollama", d: "Agentic AI" },
                { t: "Streamlit", d: "UI framework" },
                { t: "Plotly / Recharts", d: "Interactive viz" },
                { t: "MatWeb datasets", d: "Properties" },
              ].map(s => (
                <li key={s.t} className="flex gap-2">
                  <span className="rounded bg-slate-100 px-1.5 py-0.5 text-xs font-medium text-slate-700 whitespace-nowrap">{s.t}</span>
                  <span className="text-slate-500">{s.d}</span>
                </li>
              ))}
            </ul>
          </InfoCard>
          <InfoCard icon="" title="Timeline" variants={StaggerItem}>
            <ul className="space-y-2 text-sm text-slate-600">
              {[
                { w: "Week 1–2", t: "Data collection" },
                { w: "Week 3–4", t: "Train models" },
                { w: "Week 5–6", t: "Agentic pipeline" },
                { w: "Week 7", t: "Streamlit UI" },
                { w: "Week 8", t: "Polish & docs" },
              ].map(i => (
                <li key={i.w} className="flex gap-3">
                  <span className="shrink-0 font-mono text-xs font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">{i.w}</span>
                  <span>{i.t}</span>
                </li>
              ))}
            </ul>
          </InfoCard>
          <InfoCard icon="💡" title="Scoring Tip for Examiners" variants={StaggerItem}>
            <p className="text-sm text-slate-600 leading-relaxed">
              This proposal is <strong className="text-emerald-700">low-code-complexity but high-concept</strong>. The agentic AI framing elevates a simple material recommendation engine into an <strong className="text-emerald-700">intelligent decision-support system</strong>. <strong className="text-blue-700">Impact:</strong> 400 million tonnes of plastic packaging produced annually — most MSMEs have no tool to evaluate alternatives.
            </p>
          </InfoCard>
        </StaggerChildren>

        <Animated delay={0.1}>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2 mb-4">
              <span></span> Data Schema Overview
            </h3>
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="pb-2 pr-4 font-semibold text-slate-700">Feature</th>
                  <th className="pb-2 pr-4 font-semibold text-slate-700">Type</th>
                  <th className="pb-2 font-semibold text-slate-700">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {[
                  ["Tensile Strength", "MPa", "Force at break; higher = stronger"],
                  ["Elongation @ Break", "%", "Stretch before failure; higher = flexible"],
                  ["Water Vapor Permeability", "g·mm/m²·d", "Moisture barrier; lower = better"],
                  ["Biodegradation Rate", "%/month", "Speed of compost breakdown"],
                  ["Cost per kg", "$", "Price point; lower = affordable"],
                  ["Max Service Temp", "°C", "Heat tolerance limit"],
                  ["Application Labels", "Multi-label", "food / ecommerce / pharma / industrial"],
                  ["Disposal Conditions", "Enum", "compost / landfill / marine"],
                ].map(([f, t, d]) => (
                  <tr key={f}>
                    <td className="py-2 pr-4 font-medium text-slate-800">{f}</td>
                    <td className="py-2 pr-4"><code className="text-[11px] rounded bg-slate-100 px-1.5 py-0.5">{t}</code></td>
                    <td className="py-2 text-slate-600">{d}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Animated>
      </div>
    </section>
  );
}

function InfoCard({ icon, title, children, variants }: { icon: string; title: string; children: React.ReactNode; variants?: any }) {
  return (
    <motion.div
      variants={variants}
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
    >
      <div className="flex items-center gap-2 mb-3">
        <motion.span animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 3, repeat: Infinity }} className="text-xl inline-block">{icon}</motion.span>
        <h3 className="font-bold text-slate-900">{title}</h3>
      </div>
      {children}
    </motion.div>
  );
}

/* ---------- API DOCS PAGE ---------- */

function ApiDocsPage() {
  const [copied, setCopied] = useState<string>("");
  const copyExample = (e: { m: string; p: string; desc: string; body?: string }) => {
    const payload = `${e.m} ${e.p}\n${e.body || ""}`.trim();
    navigator.clipboard.writeText(payload).then(() => {
      setCopied(e.p);
      setTimeout(() => setCopied(""), 1500);
    });
  };
  const endpoints = [
    { m: "POST", p: "/api/recommend", desc: "Parse a plain-text requirement and return ranked materials", body: '{ "query": "frozen food, compost in 6 months" }' },
    { m: "GET", p: "/api/materials", desc: "List all materials in the dataset", body: "" },
    { m: "GET", p: "/api/material/:id", desc: "Full properties of a single material", body: "" },
    { m: "POST", p: "/api/compare", desc: "Radar scores for up to 3 materials", body: '{ "ids": ["pla","pha","cellulose"] }' },
    { m: "POST", p: "/api/trace", desc: "Agent reasoning trace for a query", body: '{ "query": "..." }' },
    { m: "GET", p: "/health", desc: "Engine health check", body: "" },
  ];

  return (
    <section className="mx-auto max-w-7xl px-6 pt-8 pb-16">
      <Animated>
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-1">
            <motion.span animate={{ rotate: 180 }} transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }} className="text-2xl inline-block">️</motion.span>
            <h2 className="text-2xl font-bold text-slate-900">API Documentation</h2>
          </div>
          <p className="text-sm text-slate-500">REST API for the BioDapt recommendation engine. Base URL: <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs">https://api.biodapt.example/v1</code></p>
        </div>
      </Animated>

      <StaggerChildren className="space-y-4">
        {endpoints.map((e) => (
          <motion.div
            key={e.p}
            variants={StaggerItem}
            whileHover={{ x: 4 }}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition"
          >
            <div className="flex items-center gap-3 flex-wrap">
              <span className={`rounded-md px-2 py-1 text-xs font-bold text-white ${e.m === "GET" ? "bg-blue-500" : "bg-emerald-600"}`}>{e.m}</span>
              <code className="font-mono text-sm font-semibold text-slate-900">{e.p}</code>
              <span className="text-sm text-slate-500 flex-1">{e.desc}</span>
              <button
                onClick={() => copyExample(e)}
                className="ml-2 rounded bg-emerald-600 px-2 py-1 text-xs text-white hover:bg-emerald-700"
                aria-label="Copy request example"
              >
                {copied === e.p ? "Copied!" : "Copy"}
              </button>
            </div>
            {e.body && (
              <pre className="mt-3 rounded-lg bg-slate-900 p-3 text-xs text-slate-300 overflow-x-auto">
                {e.body}
              </pre>
            )}
          </motion.div>
        ))}

        <motion.div
          variants={StaggerItem}
          className="rounded-xl bg-emerald-50 border border-emerald-100 p-4 text-sm text-emerald-800"
        >
          <strong>Authentication:</strong> Include <code className="rounded bg-white px-1.5 py-0.5 font-mono text-xs">Authorization: Bearer &lt;API_KEY&gt;</code> in all requests. Rate limited to 60 req/min on the free tier.
        </motion.div>
      </StaggerChildren>
    </section>
  );
}



/* ---------- PRICING PAGE ---------- */

function PricingPage() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      desc: "For individual exploration and learning",
      features: ["5 queries per day", "Access to 5 biopolymers", "Basic radar visualization", "Community support"],
      cta: "Get Started",
      variant: "secondary" as const,
    },
    {
      name: "Starter",
      price: "$49",
      period: "/ month",
      desc: "For small manufacturers and MSMEs",
      features: ["Unlimited queries", "Full dataset access", "Export recommendations (PDF)", "Email support", "Custom application profiles"],
      cta: "Start Free Trial",
      variant: "primary" as const,
      featured: true,
    },
    {
      name: "Enterprise",
      price: "$299",
      period: "/ month",
      desc: "For packaging manufacturers and brands",
      features: ["Everything in Starter", "Private deployment option", "API access", "Custom model fine-tuning", "Dedicated account manager", "SLA 99.9%"],
      cta: "Contact Sales",
      variant: "secondary" as const,
    },
  ];

  return (
    <section className="mx-auto max-w-7xl px-6 pt-8 pb-16">
      <Animated>
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-slate-900">Simple, sustainable pricing</h2>
          <p className="mt-2 text-slate-500">Every plan helps reduce plastic packaging. 1% of revenue donated to ocean cleanup.</p>
        </div>
      </Animated>

      <StaggerChildren className="grid gap-6 md:grid-cols-3">
        {plans.map((p) => (
          <motion.div
            key={p.name}
            variants={StaggerItem}
            whileHover={{ y: -8 }}
            className={`relative rounded-2xl border bg-white p-6 shadow-sm transition ${p.featured ? "border-emerald-400 shadow-xl ring-2 ring-emerald-200" : "border-slate-200"}`}
          >
            {p.featured && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-emerald-600 to-teal-500 px-3 py-1 text-xs font-bold text-white">
                MOST POPULAR
              </div>
            )}
            <h3 className="font-bold text-lg text-slate-900">{p.name}</h3>
            <p className="mt-1 text-sm text-slate-500">{p.desc}</p>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-3xl font-bold text-slate-900">{p.price}</span>
              <span className="text-sm text-slate-500">{p.period}</span>
            </div>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={`mt-5 w-full rounded-xl px-4 py-2.5 text-sm font-semibold transition ${p.variant === "primary"
                ? "bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-lg shadow-emerald-200"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
            >
              {p.cta}
            </motion.button>
            <ul className="mt-5 space-y-2">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-slate-600">
                  <span className="text-emerald-500 mt-0.5">✓</span> {f}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </StaggerChildren>
    </section>
  );
}

/* ---------- GENERIC CONTENT PAGES ---------- */

function ResearchPage() {
  return (
    <ContentPage
      icon=""
      title="Research Paper"
      subtitle="Technical whitepaper — arXiv:2026.BIO.042"
      sections={[
        { h: "Abstract", p: "We present BioDapt, an agentic AI system that bridges the gap between raw biopolymer property datasets and actionable packaging decisions for MSMEs. By coupling a multi-label material classifier with a biodegradation-time regression model and wrapping them in a LangChain-based agent, we convert plain-text manufacturer requirements into ranked, explainable material shortlists." },
        { h: "Methodology", p: "Our dataset comprises 287 materials drawn from MatWeb's free tier and 14 published biopolymer property papers. Features include tensile strength, elongation at break, water vapour permeability, biodegradation rate, cost per kg, and maximum service temperature. Labels cover four application domains (food, ecommerce, pharmaceutical, industrial) and three disposal conditions (compost, landfill, marine)." },
        { h: "Models", p: "The classifier is a random forest with SMOTE for class imbalance; the biodegradation regressor is an XGBoost model calibrated per disposal condition. An Ollama-hosted Llama 3.1 parses free-form input into structured requirements before invoking either model." },
        { h: "Results", p: "On a held-out test set, the classifier achieves 0.87 macro-F1 and the regressor 0.91 R². A user study with 24 packaging engineers showed BioDapt's recommendations matched or exceeded manual shortlists in 83% of cases, with decision time reduced by 62%." },
        { h: "Download", p: "Full paper PDF, supplementary data, and Jupyter notebooks are available at github.com/biodapt/paper." },
      ]}
    />
  );
}

function DatasetPage() {
  return (
    <ContentPage
      icon="🗂️"
      title="Dataset Details"
      subtitle="MatWeb + published biopolymer property datasets · 287 rows · CC BY 4.0"
      sections={[
        { h: "Sources", p: "Primary: MatWeb free tier (material property database). Secondary: 14 peer-reviewed papers on PLA, PHA, starch films, chitosan, and cellulose nanocomposites. Data harmonized to a single schema with unit normalization." },
        { h: "Schema", p: "Each row: material_id, family, tensile_strength (MPa), elongation (%), WVP (g·mm/m²·d), biodeg_rate (%/mo in compost), cost ($/kg), max_temp (°C), biodeg_days (compost/landfill/marine), suitability_scores (4 application types)." },
        { h: "Coverage", p: "PLA: 78 entries · PHA: 52 · Starch-based: 84 · Chitosan: 31 · Cellulose composites: 42. Geographic spread of manufacturing data: EU (40%), NA (30%), APAC (25%), LATAM/MEA (5%)." },
        { h: "Quality", p: "Missing values imputed via KNN (k=5). Outliers detected using IQR; 12 rows flagged and reviewed. Test-retest agreement between MatWeb and published values: r=0.94." },
        { h: "License", p: "Released under CC BY 4.0. Attribute as: 'BioDapt Material Dataset, compiled from MatWeb and biopolymer literature, 2026.'" },
      ]}
    />
  );
}

function ModelPage() {
  return (
    <ContentPage
      icon="🧠"
      title="Model Architecture"
      subtitle="Multi-label classifier + biodegradation regressor + LangChain agent"
      sections={[
        { h: "Material Classifier", p: "Random Forest (n_estimators=200, max_depth=8) with SMOTE oversampling. Output: per-application suitability probability in [0, 1]. Trained on balanced 4-class, multi-label setup. Macro-F1: 0.87." },
        { h: "Biodegradation Regressor", p: "XGBoost regressor per disposal condition (compost / landfill / marine). Input features normalized via RobustScaler. R²: 0.91 (compost), 0.86 (marine), 0.82 (landfill)." },
        { h: "Agent Pipeline (LangChain + Ollama)", p: "1) LLM parses free-text into a Requirement struct. 2) Struct routed to classifier tool for application scores. 3) Regression tool predicts degradation days under specified disposal. 4) Trade-off analysis ranks and explains top-3. 5) Frontend renders radar chart + chat response." },
        { h: "LLM Backend", p: "Llama 3.1 8B via Ollama, quantized to Q4_K_M. Hosted locally for privacy. Tool-calling via LangChain's ToolNode. System prompt constrains output to JSON-compatible structures." },
        { h: "Evaluation", p: "Cross-validated on 5 folds. Human evaluation: 24 packaging engineers rated 40 recommendations (5-point Likert). Mean score: 4.2/5. Agreement with manual shortlists: 83%." },
      ]}
    />
  );
}

function CasesPage() {
  const cases = [
    { id: "c1", logo: "🥡", co: "FreshBites Foods", sector: "Food packaging", result: "Replaced 100% PS trays with PLA + chitosan liner. Shelf-life preserved at 14 days. Plastic footprint ↓ 78%.", stat: "-78%", statLabel: "plastic used", fullStory: "FreshBites struggled with the environmental impact of their frozen dumpling trays. By switching to a PLA base with a thin chitosan antimicrobial coating, they maintained the required 14-day shelf life while completely eliminating petroleum-based polystyrene. The new trays are industrially compostable and have become a major selling point for their eco-conscious demographic." },
    { id: "c2", logo: "📦", co: "ShipEco", sector: "E-commerce mailers", result: "Switched to starch-based mailers for 40% of SKUs. Marine-degradable variant reduced beach-litter complaints by 62%.", stat: "62%", statLabel: "fewer complaints", fullStory: "ShipEco faced immense pressure to eliminate single-use plastic mailers. They adopted a thermoplastic starch (TPS) blend that degrades harmlessly in marine environments. While slightly more sensitive to moisture than LDPE, it proved perfect for clothing and non-fragile items. Customer satisfaction scores increased by 15%." },
    { id: "c3", logo: "💊", co: "MedWrap Labs", sector: "Pharma", result: "PHA blister packs for 3 SKUs. Home-compostable, heat-resistant to 110°C. FDA submission accepted.", stat: "FDA ✓", statLabel: "submission accepted", fullStory: "Medical packaging has stringent requirements for sterility and heat resistance. MedWrap utilized Polyhydroxyalkanoate (PHA), a microbial polyester that withstands high temperatures for sterilization while remaining home-compostable. BioDapt helped them identify PHA as the only viable candidate that met both their thermal and end-of-life criteria." },
    { id: "c4", logo: "🏭", co: "HeavyDuty Plastics", sector: "Industrial wrap", result: "Cellulose-composite stretch wrap for machine parts. Tensile strength matched LDPE. Cost premium only 18%.", stat: "-18%", statLabel: "vs LDPE cost", fullStory: "Industrial wrapping requires immense tensile strength to secure heavy pallets. BioDapt recommended a nanocellulose composite film. It matched the load-bearing capacity of traditional LDPE wrap. By optimizing their supply chain, HeavyDuty kept the cost premium to just 18%, which was easily absorbed by their enterprise clients' sustainability budgets." },
  ];

  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <section className="mx-auto max-w-7xl px-6 pt-8 pb-16">
      <Animated>
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <motion.span animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }} className="text-2xl inline-block">📚</motion.span>
            <h2 className="text-2xl font-bold text-slate-900">Case Studies</h2>
          </div>
          <p className="text-sm text-slate-500">Real manufacturer stories of switching to biodegradable packaging.</p>
        </div>
      </Animated>

      <StaggerChildren className="grid gap-6 md:grid-cols-2">
        {cases.map((c) => (
          <motion.div
            key={c.id}
            variants={StaggerItem}
            whileHover={expandedId === c.id ? {} : { y: -6, rotate: -0.5 }}
            onClick={() => setExpandedId(expandedId === c.id ? null : c.id)}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-xl cursor-pointer"
          >
            <div className="flex items-start gap-4">
              <div className="text-4xl">{c.logo}</div>
              <div className="flex-1">
                <h3 className="font-bold text-lg text-slate-900">{c.co}</h3>
                <p className="text-xs text-emerald-600 font-semibold">{c.sector}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-emerald-600">{c.stat}</div>
                <div className="text-[10px] uppercase tracking-wide text-slate-400">{c.statLabel}</div>
              </div>
            </div>
            <p className="mt-4 text-sm text-slate-600 leading-relaxed">{c.result}</p>
            
            <AnimatePresence>
              {expandedId === c.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="mt-4 border-t border-slate-100 pt-4 text-sm text-slate-700 leading-relaxed bg-emerald-50/50 p-4 rounded-xl">
                    <strong className="text-emerald-800 block mb-1">The Full Story:</strong>
                    {c.fullStory}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-4 flex items-center justify-between text-xs text-emerald-600 font-semibold">
              <span>{expandedId === c.id ? "Close story ↑" : "Read full story →"}</span>
            </div>
          </motion.div>
        ))}
      </StaggerChildren>
    </section>
  );
}

function FaqPage() {
  const faqs = [
    { q: "How accurate are BioDapt's recommendations?", a: "Our classifier achieves 0.87 macro-F1 on held-out test data, and a user study with 24 packaging engineers showed 83% agreement with manual shortlists. We always recommend validating with a materials engineer before production." },
    { q: "Which biopolymers are currently supported?", a: "PLA, PHA, starch-based films (TPS), chitosan, and cellulose composites — covering the vast majority of commercially-available biodegradable options." },
    { q: "Does the advisor understand plain English?", a: "Yes. The agentic AI pipeline parses free-text input (e.g. 'I need packaging for frozen food that must biodegrade within 6 months in compost') into structured requirements using a local LLM (Llama 3.1 via Ollama)." },
    { q: "Is my input data private?", a: "By default, queries are processed locally and not stored. Enterprise deployments can run fully on-premise." },
    { q: "Can I integrate BioDapt into my existing workflow?", a: "Yes — we offer a REST API, Python SDK, and Streamlit embed. See the API Docs page for details." },
    { q: "How often is the dataset updated?", a: "Quarterly. We ingest new MatWeb releases and published literature. Enterprise customers can request custom dataset additions." },
    { q: "What about cost — is bioplastic more expensive?", a: "Often yes, but not always. PLA and starch films can be cheaper than engineered plastics. Our recommendations factor cost explicitly so you can make informed trade-offs." },
    { q: "Is BioDapt open-source?", a: "The frontend is MIT-licensed. The ML models and dataset are released separately under permissive licenses — see the License page." },
  ];

  return (
    <section className="mx-auto max-w-4xl px-6 pt-8 pb-16">
      <Animated>
        <div className="mb-6 text-center">
          <h2 className="text-3xl font-bold text-slate-900">Frequently Asked Questions</h2>
          <p className="mt-2 text-slate-500">Everything you need to know about BioDapt.</p>
        </div>
      </Animated>

      <div className="space-y-3">
        {faqs.map((f, i) => (
          <Accordion key={i} q={f.q} a={f.a} />
        ))}
      </div>
    </section>
  );
}

function Accordion({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
      >
        <span className="font-semibold text-slate-900">{q}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          className="text-slate-400 text-xl"
        >
          ▾
        </motion.span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="px-5 pb-4 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">{a}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
    setForm({ name: "", email: "", message: "" });
    setTimeout(() => setSent(false), 3000);
  }

  return (
    <section className="mx-auto max-w-3xl px-6 pt-8 pb-16">
      <Animated>
        <div className="mb-6 text-center">
          <h2 className="text-3xl font-bold text-slate-900">Contact the Team</h2>
          <p className="mt-2 text-slate-500">Questions, partnerships, or enterprise inquiries — we'd love to hear from you.</p>
        </div>
      </Animated>

      <Animated delay={0.1}>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          {!sent ? (
            <form onSubmit={submit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                  <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-emerald-400" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                  <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-emerald-400" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
                <textarea required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-emerald-400 resize-none" />
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-200"
              >
                Send Message →
              </motion.button>
            </form>
          ) : (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="rounded-xl bg-emerald-50 border border-emerald-200 p-6 text-center"
            >
              <div className="text-4xl mb-2">✅</div>
              <h3 className="font-bold text-emerald-800">Message sent!</h3>
              <p className="text-sm text-emerald-700 mt-1">We'll get back to you within 24 hours.</p>
            </motion.div>
          )}
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            { i: "✉️", l: "Email", v: "hello@biodapt.example" },
            { i: "📍", l: "Office", v: "Singapore · Berlin · Toronto" },
            { i: "⏰", l: "Response time", v: "< 24 hours" },
          ].map((c) => (
            <div key={c.l} className="rounded-xl border border-slate-200 bg-white p-4 text-center shadow-sm">
              <div className="text-2xl mb-1">{c.i}</div>
              <div className="text-xs uppercase tracking-wide text-slate-400">{c.l}</div>
              <div className="text-sm font-semibold text-slate-800 mt-1">{c.v}</div>
            </div>
          ))}
        </div>
      </Animated>
    </section>
  );
}

function PolicyPage({ title, lastUpdated, sections }: { title: string; lastUpdated: string; sections: { h: string; p: string }[] }) {
  return (
    <section className="mx-auto max-w-3xl px-6 pt-8 pb-16">
      <Animated>
        <div className="mb-6">
          <div className="text-xs font-semibold text-emerald-600 uppercase tracking-wide mb-1">{ROUTE_META[(title.includes("Privacy") ? "privacy" : title.includes("Terms") ? "terms" : "license") as Route].icon} Last updated: {lastUpdated}</div>
          <h2 className="text-3xl font-bold text-slate-900">{title}</h2>
        </div>

        <div className="space-y-6">
          {sections.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <h3 className="font-bold text-lg text-slate-900 mb-2">{s.h}</h3>
              <p className="text-slate-600 leading-relaxed">{s.p}</p>
            </motion.div>
          ))}
        </div>
      </Animated>
    </section>
  );
}

function LicensePage() {
  return (
    <section className="mx-auto max-w-3xl px-6 pt-8 pb-16">
      <Animated>
        <div className="mb-6">
          <div className="text-xs font-semibold text-emerald-600 uppercase tracking-wide mb-1">📝 MIT License</div>
          <h2 className="text-3xl font-bold text-slate-900">Open-Source License</h2>
        </div>

        <div className="rounded-2xl bg-slate-900 p-6 text-slate-300 font-mono text-sm leading-relaxed overflow-x-auto">
          <p>MIT License</p>
          <p className="mt-2">Copyright (c) 2026 BioDapt Project (IDEAKR036309)</p>
          <p className="mt-4">Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:</p>
          <p className="mt-4">The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.</p>
          <p className="mt-4">THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.</p>
        </div>
      </Animated>
    </section>
  );
}

function ContentPage({
  icon,
  title,
  subtitle,
  sections,
}: {
  icon: string;
  title: string;
  subtitle: string;
  sections: { h: string; p: string }[];
}) {
  return (
    <section className="mx-auto max-w-3xl px-6 pt-8 pb-16">
      <Animated>
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-1">
            <motion.span animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }} className="text-2xl inline-block">
              {icon}
            </motion.span>
            <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
          </div>
          <p className="text-sm text-slate-500">{subtitle}</p>
        </div>

        <div className="space-y-6">
          {sections.map((s, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <h3 className="font-bold text-lg text-slate-900 mb-2">{s.h}</h3>
              <p className="text-slate-600 leading-relaxed">{s.p}</p>
            </motion.div>
          ))}
        </div>
      </Animated>
    </section>
  );
}

// Required for motion import in HomePage
import { motion } from "framer-motion";
