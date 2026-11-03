/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './app/components/**/*.{js,vue,ts}',
    './app/layouts/**/*.vue',
    './app/pages/**/*.vue',
    './app/plugins/**/*.{js,ts}',
    './app/composables/**/*.{js,ts}',
    './app/app.vue',
    './app/error.vue',
  ],
  theme: {
    extend: {
      colors: {
        // Deep Sea & Light Steel Palettes
        deep: {
          900: '#0D1B2A', // Deepest Navy
          800: '#1B263B', // Dark Navy Slate
          700: '#415A77', // Muted Steel Blue
          600: '#778DA9', // Slate Blue
          100: '#E0E1DD', // Soft Crisp White
        },
        steel: {
          50: '#F8F9FA',
          100: '#E9ECEF',
          200: '#DEE2E6',
          300: '#CED4DA',
          400: '#ADB5BD',
          500: '#6C757D',
          600: '#495057',
          700: '#343A40',
          800: '#212529',
        },
      },
      fontFamily: {
        serif: ['"DM Serif Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('daisyui'),
  ],
  daisyui: {
    themes: [
      {
        portfolio: {
          'primary': '#778DA9',          // Slate Blue
          'primary-content': '#0D1B2A',
          'secondary': '#415A77',        // Muted Steel Blue
          'secondary-content': '#E0E1DD',
          'accent': '#778DA9',           // Steel accent
          'accent-content': '#0D1B2A',
          'neutral': '#1B263B',          // Dark Navy Slate
          'neutral-content': '#E0E1DD',  // Crisp text
          'base-100': '#0D1B2A',         // Deepest Navy (#0D1B2A)
          'base-200': '#1B263B',         // Dark Navy Slate (#1B263B)
          'base-300': '#415A77',         // Steel Blue (#415A77)
          'base-content': '#E0E1DD',     // Off-white readable text (#E0E1DD)
          'info': '#778DA9',
          'success': '#4ade80',
          'warning': '#fbbf24',
          'error': '#f87171',
        },
      },
      'dark',
    ],
  },
}
