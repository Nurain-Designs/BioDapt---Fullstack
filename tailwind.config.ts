import { defineConfig } from 'vite';
import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';

// Tailwind configuration for BioDapt UI polish
export default defineConfig({
  darkMode: 'class', // enable class-based dark mode
  content: [
    './index.html',
    './src/**/*.{tsx,ts,jsx,js}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'hsl(162, 70%, 44%)', // emerald teal primary
          dark: 'hsl(162, 70%, 30%)',
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    // Backdrop filter plugin for glassmorphism
    plugin(function({ addUtilities }) {
      const newUtilities = {
        '.backdrop-blur': { backdropFilter: 'blur(12px)' },
        '.glass-card': {
          backgroundColor: 'rgba(255,255,255,0.15)',
          backdropFilter: 'blur(12px)',
          borderRadius: '0.75rem',
          border: '1px solid rgba(255,255,255,0.2)',
        },
      };
      addUtilities(newUtilities, ['responsive', 'hover']);
    }),
  ],
});
