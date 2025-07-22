/** @type {import('tailwindcss').Config} */
import daisyui from 'daisyui';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    daisyui,
  ],
  daisyui: {
    themes: [
      {
        karakeep: {
          "primary": "#2563eb",
          "secondary": "#7c3aed",
          "accent": "#06b6d4",
          "neutral": "#1f2937",
          "base-100": "#ffffff",
          "base-200": "#f3f4f6",
          "base-300": "#e5e7eb",
          "info": "#0891b2",
          "success": "#059669",
          "warning": "#d97706",
          "error": "#dc2626",
        },
      },
      {
        "karakeep-dark": {
          "primary": "#3b82f6",
          "secondary": "#8b5cf6",
          "accent": "#22d3ee",
          "neutral": "#374151",
          "base-100": "#1f2937",
          "base-200": "#111827",
          "base-300": "#0f172a",
          "info": "#0ea5e9",
          "success": "#10b981",
          "warning": "#f59e0b",
          "error": "#ef4444",
        },
      },
      "light",
      "dark",
    ],
  },
}