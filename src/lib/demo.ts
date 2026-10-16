/// <reference types="vite/client" />
/**
 * Demo mode (VITE_DEMO_MODE=true) is used for the public static demo, where no
 * BioDapt API is running. Recommendations then come from the in-browser advisor
 * over the bundled sample materials dataset, and the UI says so.
 */
export const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === "true";
