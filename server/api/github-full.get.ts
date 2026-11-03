import type { GitHubRepo } from '~/../shared/types'

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
  async (event): Promise<GitHubRepo[]> => {
    const config = useRuntimeConfig(event)
    const token = (config.githubToken as string) || process.env.GITHUB_TOKEN || process.env.NUXT_GITHUB_TOKEN || ''
    const username = 'mavisann'

    const headers: Record<string, string> = {
      'User-Agent': 'portfolio-nuxt-app/1.0',
      'Accept': 'application/vnd.github.v3+json',
    }
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

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
        repos = rawRepos.map((r) => ({
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
      console.warn('[GitHub Full API] Repos API rate-limited on server IP, trying web scrape fallback...')
    }

    // Tier 2: Web scrape fallback if API was rate-limited
    if (repos.length === 0) {
      try {
        const reposHtml = await $fetch<string>(`https://github.com/${username}?tab=repositories`, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          },
          timeout: 4000,
        })

        if (reposHtml) {
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
          }

          if (scrapedList.length > 0) {
            repos = scrapedList
          }
        }
      } catch (err) {
        console.warn('[GitHub Full Web] Scrape failed, using verified fallback list:', err)
      }
    }

    // Tier 3: Verified fallback list
    if (repos.length === 0) {
      repos = defaultFallbackRepos
    }

    return repos
  },
  {
    maxAge: 60 * 15, // 15-minute SWR cache
    name: 'github-full-repos',
    swr: true,
  },
)
