/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('daisyui'),
  ],
  // Optional: Add daisyUI config here to set themes
  daisyui: {
    themes: ["light", "dark", "cupcake"], 
  },
}