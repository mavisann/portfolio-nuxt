import type { PlatformData } from '~/../shared/types'

export default defineEventHandler(async (event): Promise<PlatformData> => {
  const username = 'princestuv'
  const profileUrl = `https://www.facebook.com/${username}/`

  const profile = {
    username,
    name: 'Prince Semillano',
    avatarUrl: '/profile.png',
    profileUrl,
    bio: 'Personal Facebook profile & digital footprint of Prince Semillano.',
    stats: {},
  }

  return {
    profile,
    posts: [],
  }
})

