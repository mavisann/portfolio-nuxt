import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  css: ['~/assets/styles/main.css'],
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  experimental: {
    appManifest: false,
  },

  vite: {
    plugins: [
      tailwindcss(),
    ],
  },

  modules: [
    'shadcn-nuxt',
  ],

  shadcn: {
    componentDir: '@/components/ui',
  },

  app: {
    head: {
      htmlAttrs: {
        'data-theme': 'portfolio',
        class: 'dark',
      },
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Inter:wght@300;400;500;600;700;800&display=swap',
        },
      ],
    },
  },

  runtimeConfig: {
    // Server-only keys — set via GITHUB_TOKEN / NUXT_<KEY> in .env
    githubToken: process.env.GITHUB_TOKEN || process.env.NUXT_GITHUB_TOKEN || '',
    discordUserId: '1277974645580103765',
    igAccessToken: process.env.NUXT_IG_ACCESS_TOKEN || '',
    linkedinAccessToken: process.env.NUXT_LINKEDIN_ACCESS_TOKEN || '',
    public: {
      siteUrl: '',
    },
  },
})
