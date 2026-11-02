export default defineNuxtConfig({
  css: ['~/assets/styles/main.css'],
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    'shadcn-nuxt'
  ],
  shadcn: {
    componentDir: '@/components/ui'
  }
})  