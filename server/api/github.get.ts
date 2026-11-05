import type { GitHubData, GitHubContributionWeek, GitHubContributionDay, GitHubProfile, GitHubRepo } from '~/../shared/types'

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

// Fallback real repositories (used if GitHub completely blocks datacenter IPs and web scraping times out)
const defaultFallbackRepos: GitHubRepo[] = [
  {
    name: 'portfolio-nuxt',
    description: 'Personal website containing my web dev portfolio (developed with Nuxt).',
    url: 'https://github.com/mavisann/portfolio-nuxt',
    language: 'Vue',
    languageColor: '#41b883',
    isPrivate: false,
    stargazerCount: 0,
  },
  {
    name: 'sdca-tabulation',
    description: 'Tabulation System for Mr. and Ms. SDCA',
    url: 'https://github.com/mavisann/sdca-tabulation',
    language: 'JavaScript',
    languageColor: '#f1e05a',
    isPrivate: false,
    stargazerCount: 0,
  },
  {
    name: 'LCS-PrintHub',
    description: 'A Web-Based Ordering and Print Customization System with a Native AI-Powered Chatbot for LCS Printing Shop',
    url: 'https://github.com/mavisann/LCS-PrintHub',
    language: 'Code',
    languageColor: '#778DA9',
    isPrivate: false,
    stargazerCount: 0,
  },
  {
    name: 'Mavis-Personal-Tracker',
    description: 'Personal Website Tracker with real-time cloud database saving.',
    url: 'https://github.com/mavisann/Mavis-Personal-Tracker',
    language: 'JavaScript',
    languageColor: '#f1e05a',
    isPrivate: false,
    stargazerCount: 0,
  },
  {
    name: 'portfolio',
    description: 'Personal static website containing my skills as an IT professional.',
    url: 'https://github.com/mavisann/portfolio',
    language: 'HTML',
    languageColor: '#e34c26',
    isPrivate: false,
    stargazerCount: 0,
  },
  {
    name: 'SDCA-BSIT2A-ITELEC2-Web',
    description: 'Discussion Codebase for WebSys Course.',
    url: 'https://github.com/mavisann/SDCA-BSIT2A-ITELEC2-Web',
    language: 'HTML',
    languageColor: '#e34c26',
    isPrivate: false,
    stargazerCount: 0,
  },
]

export default defineCachedEventHandler(
  async (event): Promise<GitHubData> => {
    const config = useRuntimeConfig(event)
    const token = (config.githubToken as string) || process.env.GITHUB_TOKEN || ''
    const username = 'mavisann'

    const headers: Record<string, string> = {
      'User-Agent': 'portfolio-nuxt-app/1.0 (https://github.com/mavisann/portfolio-nuxt)',
      'Accept': 'application/vnd.github.v3+json',
    }
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    // 1. Fetch live GitHub User Profile
    let profile: GitHubProfile = {
      avatarUrl: '/profile.png',
      name: 'Prince Semillano',
      login: username,
      bio: 'Full-Stack Developer & Student building modern software solutions.',
      followers: 12,
      following: 10,
    }

    // Tier 1: Try GitHub REST API
    let apiProfileSuccess = false
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
        timeout: 4000,
      })

      if (userRes && userRes.login) {
        profile = {
          avatarUrl: userRes.avatar_url || `https://github.com/${username}.png`,
          name: userRes.name || profile.name,
          login: userRes.login,
          bio: userRes.bio || profile.bio,
          followers: userRes.followers ?? profile.followers,
          following: userRes.following ?? profile.following,
        }
        apiProfileSuccess = true
      }
    } catch (err) {
      console.warn('[GitHub API] Profile API rate-limited on server IP, trying web scrape fallback...')
    }

    // Tier 2: If API was rate-limited (e.g. Render shared IP without token), scrape live HTML
    if (!apiProfileSuccess) {
      try {
        const profileHtml = await $fetch<string>(`https://github.com/${username}`, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          },
          timeout: 4000,
        })

        if (profileHtml) {
          const followersMatch = profileHtml.match(/href="[^"]*tab=followers"[^>]*>[\s\S]*?<span[^>]*class="[^"]*text-bold[^"]*"[^>]*>([0-9,]+)<\/span>/i)
          const followingMatch = profileHtml.match(/href="[^"]*tab=following"[^>]*>[\s\S]*?<span[^>]*class="[^"]*text-bold[^"]*"[^>]*>([0-9,]+)<\/span>/i)
          const bioMatch = profileHtml.match(/class="p-note user-profile-bio[^"]*"[^>]*>([\s\S]*?)<\/div>/i)
          const nameMatch = profileHtml.match(/class="p-name vcard-fullname[^"]*"[^>]*>([\s\S]*?)<\/span>/i)

          if (followersMatch && followersMatch[1]) {
            profile.followers = parseInt(followersMatch[1].replace(/,/g, ''), 10) || profile.followers
          }
          if (followingMatch && followingMatch[1]) {
            profile.following = parseInt(followingMatch[1].replace(/,/g, ''), 10) || profile.following
          }
          if (bioMatch && bioMatch[1]) {
            profile.bio = bioMatch[1].trim()
          }
          if (nameMatch && nameMatch[1]) {
            profile.name = nameMatch[1].trim()
          }
        }
      } catch (err) {
        console.warn('[GitHub Web] Profile HTML fallback also failed, using fallback data:', err)
      }
    }

    // 2. Fetch live Public Repositories (Auto-syncs)
    let repos: GitHubRepo[] = []

    // Tier 1: Try GitHub REST API
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
        timeout: 4000,
      })

      if (Array.isArray(rawRepos) && rawRepos.length > 0) {
        const filtered = rawRepos.filter((r) => !r.fork)
        const list = filtered.length > 0 ? filtered : rawRepos

        repos = list.slice(0, 6).map((r) => ({
          name: r.name,
          description: r.description || null,
          url: r.html_url,
          language: r.language || 'Code',
          languageColor: r.language ? languageColors[r.language] || '#778DA9' : '#778DA9',
          isPrivate: r.private || false,
          stargazerCount: r.stargazers_count || 0,
        }))
      }
    } catch (err) {
      console.warn('[GitHub API] Repos API rate-limited on server IP, trying web scrape fallback...')
    }

    // Tier 2: If API was rate-limited, scrape live repositories tab directly
    if (repos.length === 0) {
      try {
        const reposHtml = await $fetch<string>(`https://github.com/${username}?tab=repositories`, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          },
          timeout: 4000,
        })

        if (reposHtml) {
          // Extract repository blocks: <li ... itemprop="owns" ...>
          const items = reposHtml.split(/<li[^>]*itemprop="owns"[^>]*>/i).slice(1)
          const scrapedList: GitHubRepo[] = []

          for (const item of items) {
            const nameMatch = item.match(/<a\s+href="\/mavisann\/([^"/]+)"\s+itemprop="name codeRepository">([\s\S]*?)<\/a>/i)
            if (!nameMatch) continue

            const repoName = nameMatch[1].trim()
            const descMatch = item.match(/<p[^>]*itemprop="description"[^>]*>([\s\S]*?)<\/p>/i)
            const langMatch = item.match(/<span[^>]*itemprop="programmingLanguage"[^>]*>([\s\S]*?)<\/span>/i)
            const starMatch = item.match(/href="\/mavisann\/[^/]+\/stargazers"[^>]*>[\s\S]*?([0-9]+)[\s\S]*?<\/a>/i)

            const language = langMatch ? langMatch[1].trim() : 'Code'

            scrapedList.push({
              name: repoName,
              description: descMatch ? descMatch[1].trim() : null,
              url: `https://github.com/${username}/${repoName}`,
              language,
              languageColor: languageColors[language] || '#778DA9',
              isPrivate: false,
              stargazerCount: starMatch ? parseInt(starMatch[1], 10) : 0,
            })

            if (scrapedList.length >= 6) break
          }

          if (scrapedList.length > 0) {
            repos = scrapedList
          }
        }
      } catch (err) {
        console.warn('[GitHub Web] Repos HTML scrape failed, using verified fallback list:', err)
      }
    }

    // Tier 3: If both failed, use verified fallback repositories
    if (repos.length === 0) {
      repos = defaultFallbackRepos
    }

    // 3. Fetch live Contributions Heatmap
    let rawContributions: Array<{ date: string; count: number; color?: string }> = []

    // Method A: GitHub Contributions Service API (live, public service, no token needed)
    try {
      const contribRes = await $fetch<{
        total?: Record<string, number>
        contributions?: Array<{
          date: string
          count: number
          level: number
        }>
      }>(`https://github-contributions-api.jogruber.de/v4/${username}?y=last`, {
        timeout: 4000,
      })

      if (contribRes?.contributions && Array.isArray(contribRes.contributions) && contribRes.contributions.length > 0) {
        rawContributions = contribRes.contributions.map((c) => ({
          date: c.date,
          count: c.count,
        }))
      }
    } catch (err) {
      console.warn('[GitHub API] Contributions service unavailable, trying GraphQL / fallback:', err)
    }

    // Method B: GitHub GraphQL API if token is provided and Method A wasn't used
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
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            'User-Agent': 'portfolio-nuxt-app/1.0',
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
          timeout: 4000,
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
  },
  {
    maxAge: 60 * 15, // 15-minute server-side SWR cache: prevents hitting GitHub's rate limits
    name: 'github-live-data',
    swr: true,
  },
)

// Transforms raw dates into a GitHub-identical 53-week calendar grid
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
        contributionCount: isFuture ? 0 : record?.count || 0,
        color: isFuture ? 'transparent' : record?.color || '#0D1B2A',
        isFuture,
      })
    }
    weeks.push({ contributionDays: days })
  }

  return weeks
}
