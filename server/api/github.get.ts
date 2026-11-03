import type { GitHubData, GitHubContributionWeek, GitHubRepo } from '~/../shared/types'

const languageColors: Record<string, string> = {
  Vue: '#41b883',
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572A5',
  HTML: '#e34c26',
  CSS: '#563d7c',
  'C++': '#f34b7d',
  C: '#555555',
  'C#': '#178600',
  Java: '#b07219',
  Dart: '#00B4AB',
  PHP: '#4F5D95',
  Rust: '#dea584',
  Go: '#00ADD8',
  Shell: '#89e051',
  Kotlin: '#A97BFF',
  Swift: '#F05138',
  Ruby: '#701516',
  SCSS: '#c6538c',
}

export default defineEventHandler(async (event): Promise<GitHubData> => {
  const config = useRuntimeConfig(event)
  const token = (config.githubToken as string) || ''
  const username = 'mavisann'

  const headers: Record<string, string> = {
    'User-Agent': 'portfolio-nuxt',
    'Accept': 'application/vnd.github.v3+json',
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  // 1. Fetch live GitHub User Profile
  let profile: GitHubProfile = {
    avatarUrl: `https://github.com/${username}.png`,
    name: 'Prince Semillano',
    login: username,
    bio: 'Full-Stack Developer & Student building modern software solutions.',
    followers: 0,
    following: 0,
  }

  try {
    const userRes = await $fetch<{
      avatar_url?: string
      name?: string
      login?: string
      bio?: string
      followers?: number
      following?: number
    }>(`https://api.github.com/users/${username}`, {
      headers,
    })

    if (userRes && userRes.login) {
      profile = {
        avatarUrl: userRes.avatar_url || `https://github.com/${username}.png`,
        name: userRes.name || 'Prince Semillano',
        login: userRes.login,
        bio: userRes.bio || profile.bio,
        followers: userRes.followers ?? 0,
        following: userRes.following ?? 0,
      }
    }
  } catch (err) {
    console.warn('[GitHub API] Profile fetch failed or rate-limited, using fallback profile:', err)
  }

  // 2. Fetch live Public Repositories (auto-syncs whenever you create a new repo)
  let repos: GitHubRepo[] = []

  try {
    const rawRepos = await $fetch<Array<{
      name: string
      description: string | null
      html_url: string
      language: string | null
      fork: boolean
      stargazers_count: number
      private: boolean
    }>>(`https://api.github.com/users/${username}/repos?sort=pushed&direction=desc&per_page=30`, {
      headers,
    })

    if (Array.isArray(rawRepos) && rawRepos.length > 0) {
      // Pick top non-fork public repositories (or public repos if all are forks), sorted by recent push
      const filtered = rawRepos.filter(r => !r.fork)
      const list = filtered.length > 0 ? filtered : rawRepos

      repos = list.slice(0, 6).map((r) => ({
        name: r.name,
        description: r.description || null,
        url: r.html_url,
        language: r.language || 'Code',
        languageColor: r.language ? (languageColors[r.language] || '#778DA9') : '#778DA9',
        isPrivate: r.private || false,
        stargazerCount: r.stargazers_count || 0,
      }))
    }
  } catch (err) {
    console.warn('[GitHub API] Repos fetch failed:', err)
  }

  // 3. Fetch live Contributions Heatmap
  let rawContributions: Array<{ date: string; count: number; color?: string }> = []

  // Try Method A: GitHub Contributions Service API (live, no token required!)
  try {
    const contribRes = await $fetch<{
      total?: Record<string, number>
      contributions?: Array<{
        date: string
        count: number
        level: number
      }>
    }>(`https://github-contributions-api.jogruber.de/v4/${username}?y=last`)

    if (contribRes?.contributions && Array.isArray(contribRes.contributions) && contribRes.contributions.length > 0) {
      rawContributions = contribRes.contributions.map((c) => ({
        date: c.date,
        count: c.count,
      }))
    }
  } catch (err) {
    console.warn('[GitHub API] Contributions service unavailable, trying GraphQL / fallback:', err)
  }

  // Try Method B: GitHub GraphQL API if token is provided and Method A wasn't used
  if (rawContributions.length === 0 && token) {
    try {
      const gqlRes = await $fetch<{
        data?: {
          user?: {
            contributionsCollection?: {
              contributionCalendar?: {
                weeks: Array<{
                  contributionDays: Array<{
                    date: string
                    contributionCount: number
                    color: string
                  }>
                }>
              }
            }
          }
        }
      }>('https://api.github.com/graphql', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'User-Agent': 'portfolio-nuxt',
        },
        body: JSON.stringify({
          query: `
            query($login: String!) {
              user(login: $login) {
                contributionsCollection {
                  contributionCalendar {
                    weeks {
                      contributionDays {
                        date
                        contributionCount
                        color
                      }
                    }
                  }
                }
              }
            }
          `,
          variables: { login: username },
        }),
      })

      const weeks = gqlRes?.data?.user?.contributionsCollection?.contributionCalendar?.weeks
      if (Array.isArray(weeks) && weeks.length > 0) {
        rawContributions = weeks.flatMap((w) =>
          w.contributionDays.map((d) => ({
            date: d.date,
            count: d.contributionCount,
            color: d.color,
          })),
        )
      }
    } catch (err) {
      console.warn('[GitHub API] GraphQL contributions failed:', err)
    }
  }

  // Build GitHub-identical 53-week calendar ending on the current week
  const contributions = buildAlignedContributionWeeks(rawContributions)

  return {
    profile,
    contributions,
    pinnedRepos: repos,
  }
})

// Transforms raw dates into a GitHub-identical 53-week calendar grid:
// - Always 53 week columns starting on Sunday 52 weeks ago and ending on the current week.
// - Each column represents Sunday (row 0) to Saturday (row 6), ensuring perfect alignment with Mon/Wed/Fri.
// - Days strictly in the future are marked isFuture: true with transparent color, so they only appear when that day arrives.
function buildAlignedContributionWeeks(
  rawDays: Array<{ date: string; count: number; color?: string }>,
): GitHubContributionWeek[] {
  const dayMap = new Map<string, { count: number; color: string }>()
  for (const item of rawDays) {
    let color = '#0D1B2A'
    if (item.count === 1) color = '#0e4429'
    else if (item.count >= 2 && item.count <= 3) color = '#006d32'
    else if (item.count >= 4 && item.count <= 5) color = '#26a641'
    else if (item.count >= 6) color = '#39d353'
    if (item.color) color = item.color

    dayMap.set(item.date, { count: item.count, color })
  }

  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  // Current week's Sunday (row 0)
  const currentSunday = new Date(today)
  currentSunday.setDate(today.getDate() - today.getDay())

  // 52 weeks before currentSunday -> 53 columns total (weeks 0 to 52)
  const startSunday = new Date(currentSunday)
  startSunday.setDate(currentSunday.getDate() - 52 * 7)

  const weeks: GitHubContributionWeek[] = []

  for (let w = 0; w < 53; w++) {
    const days: GitHubContributionDay[] = []
    for (let d = 0; d < 7; d++) {
      const cellDate = new Date(startSunday)
      cellDate.setDate(startSunday.getDate() + (w * 7 + d))

      const y = cellDate.getFullYear()
      const m = String(cellDate.getMonth() + 1).padStart(2, '0')
      const dayNum = String(cellDate.getDate()).padStart(2, '0')
      const dateStr = `${y}-${m}-${dayNum}`

      const isFuture = cellDate.getTime() > today.getTime()
      const record = dayMap.get(dateStr)

      days.push({
        date: dateStr,
        contributionCount: isFuture ? 0 : (record?.count || 0),
        color: isFuture ? 'transparent' : (record?.color || '#0D1B2A'),
        isFuture,
      })
    }
    weeks.push({ contributionDays: days })
  }

  return weeks
}
