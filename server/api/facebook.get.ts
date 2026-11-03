import * as cheerio from 'cheerio'
import type { PlatformData } from '~/../shared/types'

export default defineEventHandler(async (event): Promise<PlatformData> => {
  const config = useRuntimeConfig(event)
  const username = 'princestuv'
  const profileUrl = `https://www.facebook.com/${username}/`
  const token = (config.fbAccessToken as string) || process.env.FB_ACCESS_TOKEN || ''

  // Tier 1: Official Facebook Graph API (if token provided)
  if (token) {
    try {
      const res = await $fetch<{ id: string; name: string }>(
        `https://graph.facebook.com/v19.0/me?fields=id,name&access_token=${token}`,
      )
      if (res && res.name) {
        return {
          profile: {
            username,
            name: res.name,
            profileUrl,
            bio: 'Personal Facebook profile & digital footprint of Prince Semillano.',
            stats: {
              account: 'Verified Personal Profile',
            },
          },
          posts: [],
        }
      }
    } catch (err) {
      console.warn('[Facebook Graph API] Token fetch failed:', err)
    }
  }

  // Tier 2: Real Scraper attempt (ZERO static numbers)
  const profile = {
    username,
    name: 'Prince Semillano',
    avatarUrl: '',
    profileUrl,
    bio: 'Personal Facebook profile & digital footprint of Prince Semillano.',
    stats: {} as Record<string, string | number>,
  }

  try {
    const html = await $fetch<string>(profileUrl, {
      headers: {
        'User-Agent': 'facebookexternalhit/1.1 (+https://www.facebook.com/externalhit_uatext.php)',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      timeout: 5000,
    })

    if (html) {
      const $ = cheerio.load(html)
      const ogTitle = $('meta[property="og:title"]').attr('content') || ''
      const ogDescription = $('meta[property="og:description"]').attr('content') || ''
      const ogImage = $('meta[property="og:image"]').attr('content') || ''

      if (ogTitle) {
        const namePart = ogTitle.split('|')[0].split('-')[0].trim()
        if (namePart) profile.name = namePart
      }

      if (ogDescription) {
        profile.bio = ogDescription
      }

      if (ogImage) {
        profile.avatarUrl = ogImage
      }
    }
  } catch (err) {
    console.warn('[Facebook Scraper] Live scrape attempt failed:', err)
  }

  return {
    profile,
    posts: [],
  }
})
