import type { PlatformData } from '~/../shared/types'

export default defineEventHandler(async (event): Promise<PlatformData> => {
  const config = useRuntimeConfig(event)
  const token = (config.linkedinAccessToken as string) || ''
  const slug = 'mavisan07'
  const profileUrl = `https://www.linkedin.com/in/${slug}/`

  let profile = {
    username: slug,
    name: 'Prince Semillano',
    avatarUrl: '/profile.png',
    profileUrl,
    bio: 'Information Technology Student at St. Dominic College of Asia · Aspiring Full-Stack Developer.',
    stats: {
      connections: '19+ connections',
      education: 'St. Dominic College of Asia',
      location: 'Naic, Calabarzon, Philippines',
    },
  }

  // 1. Try public OpenGraph scrape (works live without token)
  try {
    const html = await $fetch<string>(profileUrl, {
      headers: {
        'User-Agent': 'LinkedInBot/1.0 (compatible; Mozilla/5.0; Apache-HttpClient +http://www.linkedin.com)',
      },
      timeout: 4000,
    })

    if (html) {
      const descMatch = html.match(/<meta\s+property="og:description"\s+content="([^"]+)"/i)
      if (descMatch && descMatch[1]) {
        // Example: "Edukasyon: St. Dominic College of Asia · Lokasyon: Naic · 19 koneksyon sa LinkedIn..."
        const descText = descMatch[1]
        const connMatch = descText.match(/([0-9]+)\s*(?:connections|koneksyon)/i)
        if (connMatch && connMatch[1]) {
          profile.stats.connections = `${connMatch[1]}+ connections`
        }
      }

      const titleMatch = html.match(/<meta\s+property="og:title"\s+content="([^"]+)"/i)
      if (titleMatch && titleMatch[1]) {
        const namePart = titleMatch[1].split('-')[0]?.trim()
        if (namePart) profile.name = namePart
      }
    }
  } catch (err) {
    console.warn('[LinkedIn Scraper] Live OG fetch failed:', err)
  }

  // 2. If access token is set, query LinkedIn API
  if (token) {
    try {
      const res = await $fetch<{ localizedFirstName?: string; localizedLastName?: string }>(
        'https://api.linkedin.com/v2/me',
        {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 4000,
        },
      )
      if (res && (res.localizedFirstName || res.localizedLastName)) {
        profile.name = `${res.localizedFirstName || ''} ${res.localizedLastName || ''}`.trim()
      }
    } catch (err) {
      console.warn('[LinkedIn API] Token-based fetch failed:', err)
    }
  }

  return {
    profile,
    posts: [],
  }
})
