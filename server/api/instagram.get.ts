import * as cheerio from 'cheerio'
import type { PlatformData, SocialPost } from '~/../shared/types'

export default defineEventHandler(async (event): Promise<PlatformData> => {
  const username = 'prins_s_tuvwx'
  const profileUrl = `https://www.instagram.com/${username}/`

  // Static confirmed counts as requested
  const profile = {
    username,
    name: 'Prince Semillano',
    avatarUrl: '/profile.png',
    profileUrl,
    bio: 'Follow @prins_s_tuvwx on Instagram for photos, reels, and stories.',
    stats: {
      posts: 20,
      followers: 101,
      following: 85,
    },
  }

  const posts: SocialPost[] = []

  // Live Sync Instagram Posts via RSS feed (mjeLCSvpRxRQk9nX)
  try {
    const rssFeedUrl = 'https://rss.app/feeds/mjeLCSvpRxRQk9nX.xml'
    const xml = await $fetch<string>(rssFeedUrl, { timeout: 6000 })

    if (xml) {
      const $ = cheerio.load(xml, { xmlMode: true })

      $('item').each((i, item) => {
        if (posts.length >= 6) return // Take up to 6 recent posts

        const $item = $(item)
        const text = $item.find('title').text().trim()
        const link = $item.find('link').text().trim() || profileUrl
        const rawDate = $item.find('pubDate').text().trim()

        // Find high-res image URL from media:content or embedded HTML
        let imageUrl = $item.find('media\\:content').attr('url') || $item.find('enclosure').attr('url')
        if (!imageUrl) {
          const descHtml = $item.find('description').text()
          const $desc = cheerio.load(descHtml)
          imageUrl = $desc('img').attr('src')
        }

        const timestamp = rawDate ? new Date(rawDate).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        }) : 'Recent'

        if (imageUrl) {
          posts.push({
            id: String(i),
            text: text || 'Instagram Post',
            imageUrl,
            link,
            timestamp,
          })
        }
      })
    }
  } catch (err) {
    console.warn('[Instagram RSS Sync] Fetch failed:', err)
  }

  return {
    profile,
    posts,
  }
})
