interface SeoOptions {
  title?: string
  description?: string
  image?: string
  type?: 'website' | 'article'
}

export const usePortfolioSeo = (options: SeoOptions = {}) => {
  const route = useRoute()
  const config = useRuntimeConfig()
  const siteUrl = config.public.siteUrl || 'https://princesemillano.dev'

  const defaultTitle = 'Prince Semillano | Full-Stack Developer & Student'
  const defaultDescription =
    'Portfolio of Prince Semillano — Full-Stack Developer specializing in Vue 3, Nuxt 3, TypeScript, and modern web applications.'
  const defaultImage = `${siteUrl}/images/og-preview.png`

  const fullTitle = options.title
    ? `${options.title} | Prince Semillano`
    : defaultTitle
  const description = options.description || defaultDescription
  const image = options.image || defaultImage
  const canonicalUrl = `${siteUrl}${route.path}`

  useHead({
    title: fullTitle,
    htmlAttrs: {
      lang: 'en',
    },
    link: [
      { rel: 'canonical', href: canonicalUrl },
    ],
  })

  useSeoMeta({
    title: fullTitle,
    ogTitle: fullTitle,
    description,
    ogDescription: description,
    ogImage: image,
    ogUrl: canonicalUrl,
    ogType: options.type || 'website',
    twitterCard: 'summary_large_image',
    twitterTitle: fullTitle,
    twitterDescription: description,
    twitterImage: image,
    themeColor: '#0f172a',
  })
}

