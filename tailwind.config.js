/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Forest Light Theme
        forest: {
          50: "#f0f9f0",
          100: "#dcf2dc",
          200: "#b9e6b9",
          300: "#8cd48c",
          400: "#5cb85c",
          500: "#4a9a4a",
          600: "#3a7c3a",
          700: "#2f622f",
          800: "#285028",
          900: "#234223",
          950: "#0f240f",
        },
        // Earth tones
        earth: {
          50: "#faf8f3",
          100: "#f4f0e6",
          200: "#e8dcc7",
          300: "#d9c4a3",
          400: "#c8a77d",
          500: "#bb9363",
          600: "#ad8157",
          700: "#906a4a",
          800: "#755640",
          900: "#5e4635",
          950: "#32241b",
        },
        // Success green
        success: {
          50: "#f0fdf4",
          500: "#22c55e",
          600: "#16a34a",
        },
        // Warning amber
        warning: {
          50: "#fffbeb",
          500: "#f59e0b",
          600: "#d97706",
        },
        // Error red
        error: {
          50: "#fef2f2",
          500: "#ef4444",
          600: "#dc2626",
        },
      },
      fontFamily: {
        nature: ["Poppins", "Inter", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
        "bounce-gentle": "bounceGentle 2s infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        bounceGentle: {
          "0%, 100%": { transform: "translateY(-5%)" },
          "50%": { transform: "translateY(0)" },
        },
      },
      backgroundImage: {
        "forest-gradient": "linear-gradient(135deg, #4a9a4a 0%, #2f622f 100%)",
        "earth-gradient": "linear-gradient(135deg, #bb9363 0%, #906a4a 100%)",
        "nature-pattern":
          "url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f0f9f0' fill-opacity='0.1'%3E%3Cpath d='m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
      },
    },
  },
  plugins: [],
};
