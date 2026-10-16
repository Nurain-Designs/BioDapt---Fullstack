import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../utils/cn";

import { ROUTE_META, type Route } from "../routes";
import { DEMO_MODE } from "../lib/demo";

interface HeaderProps {
  activeRoute: Route;
  onRouteChange: (route: Route) => void;
}

export default function Header({ activeRoute, onRouteChange }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 12);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const NAV: Route[] = ["home", "advisor", "materials", "radar", "about"];

  const go = (r: Route) => {
    onRouteChange(r);
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-all duration-300",
        scrolled
          ? "border-emerald-200 bg-white/90 shadow-lg backdrop-blur-lg"
          : "border-emerald-100/60 bg-white/70 backdrop-blur"
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Logo */}
        <button
          onClick={() => go("home")}
          className="flex items-center gap-2.5 rounded-xl p-1 transition hover:bg-emerald-50"
        >
          <motion.span
            whileHover={{ rotate: 10, scale: 1.1 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-lg shadow-lg shadow-emerald-200"
          >
            🌱
          </motion.span>
          <div className="hidden sm:block">
            <h1 className="text-base font-bold tracking-tight text-slate-900 leading-none">
              BioDapt
            </h1>
            <p className="mt-0.5 text-[10px] text-slate-500 leading-none">
              Biodegradable Packaging AI
            </p>
          </div>
        </button>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((r) => {
            const m = ROUTE_META[r];
            const active = activeRoute === r;
            return (
              <motion.button
                key={r}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => go(r)}
                className={cn(
                  "relative flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition",
                  active
                    ? "bg-emerald-100 text-emerald-800"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                )}
              >
                <span className="text-xs">{m.icon}</span>
                {m.label}
                {active && (
                  <motion.span
                    layoutId="activeTabBar"
                    className="absolute bottom-[-8px] left-1/2 h-[2px] w-5 -translate-x-1/2 rounded-full bg-emerald-500"
                  />
                )}
              </motion.button>
            );
          })}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Status indicator */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="hidden items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-200 lg:flex"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            {DEMO_MODE ? "Demo mode" : "Engine Online"}
          </motion.div>


          {/* CTA button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => go("advisor")}
            className="hidden rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 px-4 py-2 text-sm font-semibold text-white shadow hover:shadow-lg sm:block"
          >
            Try Advisor
          </motion.button>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileOpen((o) => !o)}
            className="relative flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 transition hover:bg-slate-100 md:hidden"
            aria-label="Toggle menu"
          >
            <AnimatePresence mode="wait">
              {mobileOpen ? (
                <motion.svg
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </motion.svg>
              ) : (
                <motion.svg
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </motion.svg>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Mobile nav dropdown */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden border-t border-slate-100 bg-white md:hidden"
          >
            <nav className="mx-auto flex max-w-7xl flex-col px-4 gap-1 py-4">
              {NAV.map((r) => {
                const m = ROUTE_META[r];
                return (
                  <motion.button
                    key={r}
                    onClick={() => go(r)}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.05 }}
                    className={cn(
                      "flex items-center gap-2.5 rounded-xl px-4 py-3 text-left text-sm font-medium transition",
                      activeRoute === r
                        ? "bg-emerald-50 text-emerald-800"
                        : "text-slate-600 hover:bg-slate-50"
                    )}
                  >
                    <span>{m.icon}</span>
                    {m.label}
                    {activeRoute === r && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="ml-auto rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-bold text-white"
                      >
                        Active
                      </motion.span>
                    )}
                  </motion.button>
                );
              })}

              <motion.button
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                onClick={() => go("advisor")}
                className="mt-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 px-4 py-3 text-sm font-semibold text-white shadow"
              >
                🚀 Try the AI Advisor
              </motion.button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
