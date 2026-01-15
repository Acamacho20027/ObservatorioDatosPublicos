// Configuración de Tailwind utilizada por el CDN.
// IMPORTANTE: el CDN de Tailwind espera una variable global `tailwind.config`,
// no `window.tailwind.config`. Por eso se define exactamente así.

window.tailwind = window.tailwind || {};
window.tailwind.config = window.tailwind.config || {};

// Esta asignación es la que realmente usa el CDN:
tailwind.config = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#1f72ad",
        "accent-green": "#4B9B4B",
        "background-light": "#ffffff",
        "background-dark": "#1c1e22",
        "border-gray": "#e5e7eb",
        "surface-gray": "#f9fafb",
      },
      fontFamily: {
        sans: ["'Public Sans'", "sans-serif"],
        display: ["'Public Sans'", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        card: "8px",
        lg: "0.5rem",
        xl: "0.75rem",
        full: "9999px",
      },
      boxShadow: {
        soft:
          "0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      },
    },
  },
};

