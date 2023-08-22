/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      borderColor: {
        DEFAULT: "hsl(var(--slate7))"
      },
      colors: {
        "lo-contrast": "hsl(var(--slate11))",
        "hi-contrast": "hsl(var(--slate12))",
      },
      divideColor: {
        DEFAULT: "hsl(var(--slate7))"
      },
      placeholderColor: {
        DEFAULT: "hsl(var(--slate8))"
      },
      ringColor: {
        DEFAULT: "hsl(var(--slate7))"
      },
    },
  },
  plugins: [require("windy-radix-palette"), require("@tailwindcss/forms")],
}

