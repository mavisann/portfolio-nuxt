import type { DiscordPresence, DiscordActivity } from '~/../shared/types'

export default defineEventHandler(async (event): Promise<DiscordPresence> => {
  const config = useRuntimeConfig(event)
  const discordUserId = (config.discordUserId as string) || '1277974645580103765'

  try {
    const res = await $fetch<{
      success: boolean
      data?: {
        discord_status?: 'online' | 'idle' | 'dnd' | 'offline'
        discord_user?: {
          id: string
          username: string
          global_name?: string
          avatar?: string
        }
        activities?: Array<{
          name: string
          type: number
          state?: string
          details?: string
          timestamps?: {
            start?: number
            end?: number
          }
          assets?: {
            large_image?: string
            small_image?: string
          }
        }>
        listening_to_spotify?: boolean
        spotify?: {
          song: string
          artist: string
          album: string
          album_art_url: string
          timestamps?: {
            start: number
            end: number
          }
        }
      }
    }>(`https://api.lanyard.rest/v1/users/${discordUserId}`, {
      headers: { 'User-Agent': 'portfolio-nuxt' },
    })

    if (res?.success && res.data) {
      const d = res.data

      // Extract custom status text if user set one
      const customActivity = d.activities?.find((a) => a.type === 4)
      const customStatus = customActivity?.state || null

      // Filter out Spotify and Custom status to get active apps/games
      const activities: DiscordActivity[] = (d.activities || [])
        .filter((a) => a.name !== 'Spotify' && a.type !== 4)
        .map((a) => ({
          name: a.name,
          type: a.type,
          state: a.state,
          details: a.details,
          timestamps: a.timestamps,
          largeImageUrl: a.assets?.large_image?.startsWith('mp:external')
            ? a.assets.large_image.replace(/mp:external\/[^\/]+\/https\//, 'https://')
            : undefined,
        }))

      return {
        discordStatus: d.discord_status || 'offline',
        customStatus,
        discordUser: d.discord_user
          ? {
              username: d.discord_user.username,
              displayName: d.discord_user.global_name || d.discord_user.username,
              avatarUrl: d.discord_user.avatar
                ? `https://cdn.discordapp.com/avatars/${d.discord_user.id}/${d.discord_user.avatar}.png`
                : undefined,
            }
          : null,
        activities,
        spotify: d.listening_to_spotify && d.spotify
          ? {
              song: d.spotify.song,
              artist: d.spotify.artist,
              album: d.spotify.album,
              albumArtUrl: d.spotify.album_art_url,
              timestamps: d.spotify.timestamps,
            }
          : null,
      }
    }
  } catch (err) {
    console.warn('[Lanyard API] Live Discord presence fetch failed:', err)
  }

  // Pure live state fallback: clean offline with zero hardcoded fake data
  return {
    discordStatus: 'offline',
    customStatus: null,
    discordUser: {
      username: 'prince.friess',
      displayName: 'Prince Semillano',
    },
    activities: [],
    spotify: null,
  }
})
