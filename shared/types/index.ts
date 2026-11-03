// ─── GitHub ──────────────────────────────────────

export interface GitHubProfile {
  avatarUrl: string
  name: string
  login: string
  bio: string
  followers: number
  following: number
}

export interface GitHubRepo {
  name: string
  description: string | null
  url: string
  language: string | null
  languageColor: string | null
  isPrivate: boolean
  stargazerCount: number
}

export interface GitHubContributionDay {
  date: string
  contributionCount: number
  color: string
  isFuture?: boolean
}

export interface GitHubContributionWeek {
  contributionDays: GitHubContributionDay[]
}

export interface GitHubData {
  profile: GitHubProfile
  contributions: GitHubContributionWeek[]
  pinnedRepos: GitHubRepo[]
}

// ─── Discord / Lanyard ──────────────────────────

export interface DiscordActivity {
  name: string
  type: number
  state?: string
  details?: string
  largeImageUrl?: string
  smallImageUrl?: string
  timestamps?: {
    start?: number
    end?: number
  }
}

export interface DiscordPresence {
  discordStatus: 'online' | 'idle' | 'dnd' | 'offline'
  activities: DiscordActivity[]
  customStatus?: string | null
  discordUser?: {
    username: string
    displayName?: string
    avatarUrl?: string
  } | null
  spotify?: {
    song: string
    artist: string
    albumArtUrl: string
    album?: string
    timestamps?: {
      start: number
      end: number
    }
  } | null
}

// ─── Social / Professional Platforms ────────────

export interface SocialProfile {
  username: string
  name: string
  avatarUrl?: string
  profileUrl: string
  bio: string
  stats: Record<string, string | number>
}

export interface SocialPost {
  id: string
  text?: string
  imageUrl?: string
  timestamp: string
  link: string
}

export interface PlatformData {
  profile: SocialProfile
  posts: SocialPost[]
}

// ─── Certifications ─────────────────────────────

export interface Certification {
  id: number
  category: 'Professional Certification' | 'Course Certificates'
  title: string
  subtitle: string
  issuer: string
  date: string
  imageUrl: string
  verifyLink: string
}

// ─── Tech Stack ─────────────────────────────────

export interface TechItem {
  title: string
  fullName: string
  imageSrc: string
}

export interface TechCategory {
  categoryName: string
  items: TechItem[]
}

// ─── Projects ───────────────────────────────────

export interface Project {
  id: number
  title: string
  description: string
  liveUrl: string
  codeUrl: string
  languages: string[]
}

// ─── Contact ────────────────────────────────────

export interface ContactMethod {
  type: string
  value: string
  link: string
  icon: string
}

