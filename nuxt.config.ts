import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import tailwindcss from '@tailwindcss/vite'

function ensureClientManifestStub() {
  const dir = resolve('.nuxt/dist/server')
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true })
  }
  const manifestPath = resolve(dir, 'client.manifest.mjs')
  if (!existsSync(manifestPath)) {
    writeFileSync(manifestPath, 'export default () => ({});\n', 'utf8')
  }
}

export default defineNuxtConfig({
  hooks: {
    'build:before': ensureClientManifestStub,
    'nitro:build:before': ensureClientManifestStub,
    'prepare:types': ensureClientManifestStub,
  },
  css: ['~/assets/styles/main.css'],
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  experimental: {
    appManifest: false,
  },

  alias: {
    '@animate-ui/vue/primitives/effects/effect': resolve('./app/components/ui/effects/index.ts'),
    '@animate-ui/vue/primitives/cursor': resolve('./app/components/ui/cursor/index.ts'),
    '@animate-ui/vue/primitives/texts/rolling': resolve('./app/components/ui/texts/rolling/index.ts'),
    '@animate-ui/vue': resolve('./app/components/ui/effects/index.ts'),
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
