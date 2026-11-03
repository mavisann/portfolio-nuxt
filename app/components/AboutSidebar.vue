<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import profileImg from '~/assets/images/profile.jpg'
import type { DiscordPresence, DiscordActivity } from '~/../shared/types'

// SSR initial data fetch
const { data: initialDiscord } = await useFetch<DiscordPresence>('/api/discord')
const discord = ref<DiscordPresence | null>(initialDiscord.value || null)

// Reactive ticker for live elapsed & Spotify progress bar
const now = ref(Date.now())
let timer: ReturnType<typeof setInterval> | null = null
let socket: WebSocket | null = null
let heartbeatTimer: ReturnType<typeof setInterval> | null = null

// Status color mapping — concise labels without "on Discord"
const statusConfig = computed(() => {
  const status = discord.value?.discordStatus || 'offline'
  switch (status) {
    case 'online':
      return {
        label: 'Online',
        badgeBg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300',
        dotBg: 'bg-emerald-400',
      }
    case 'idle':
      return {
        label: 'Idle',
        badgeBg: 'bg-amber-500/10 border-amber-500/30 text-amber-300',
        dotBg: 'bg-amber-400',
      }
    case 'dnd':
      return {
        label: 'Do Not Disturb',
        badgeBg: 'bg-rose-500/10 border-rose-500/30 text-rose-300',
        dotBg: 'bg-rose-400',
      }
    default:
      return {
        label: 'Offline',
        badgeBg: 'bg-[#415A77]/10 border-[#415A77]/30 text-[#CED4DA]',
        dotBg: 'bg-[#778DA9]',
      }
  }
})

// Time formatting utilities
function formatTime(ms: number): string {
  if (ms < 0) ms = 0
  const totalSeconds = Math.floor(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

function formatElapsed(startTimeMs?: number): string {
  if (!startTimeMs) return ''
  const elapsedMs = Math.max(0, now.value - startTimeMs)
  const totalSeconds = Math.floor(elapsedMs / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} elapsed`
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')} elapsed`
}

// Live computed Spotify progress & track position
const spotifyProgress = computed(() => {
  const sp = discord.value?.spotify
  if (!sp || !sp.timestamps) return null

  const { start, end } = sp.timestamps
  const totalDuration = end - start
  if (totalDuration <= 0) return null

  const currentPosition = Math.max(0, Math.min(now.value - start, totalDuration))
  const percent = Math.min(100, Math.max(0, (currentPosition / totalDuration) * 100))

  return {
    current: formatTime(currentPosition),
    total: formatTime(totalDuration),
    percent,
  }
})

// Lanyard WebSocket Real-Time Sync
function connectLanyardWs() {
  if (import.meta.server) return
  try {
    socket = new WebSocket('wss://api.lanyard.rest/socket')

    socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data)
        const { op, d } = message

        // Opcode 1: Hello from server with heartbeat_interval
        if (op === 1) {
          const interval = d.heartbeat_interval
          if (heartbeatTimer) clearInterval(heartbeatTimer)
          heartbeatTimer = setInterval(() => {
            if (socket && socket.readyState === WebSocket.OPEN) {
              socket.send(JSON.stringify({ op: 3 }))
            }
          }, interval)

          // Subscribe to User ID
          socket.send(
            JSON.stringify({
              op: 2,
              d: {
                subscribe_to_id: '1277974645580103765',
              },
            }),
          )
        }

        // Opcode 0: Event (INIT_STATE or PRESENCE_UPDATE)
        if (op === 0 && d) {
          updatePresenceFromLanyard(d)
        }
      } catch (err) {
        console.warn('[Lanyard WS] Parse error:', err)
      }
    }

    socket.onclose = () => {
      if (heartbeatTimer) clearInterval(heartbeatTimer)
    }
  } catch (err) {
    console.warn('[Lanyard WS] Connection error:', err)
  }
}

function updatePresenceFromLanyard(d: any) {
  if (!d) return
  const customActivity = d.activities?.find((a: any) => a.type === 4)
  const customStatus = customActivity?.state || null

  const activities: DiscordActivity[] = (d.activities || [])
    .filter((a: any) => a.name !== 'Spotify' && a.type !== 4)
    .map((a: any) => ({
      name: a.name,
      type: a.type,
      state: a.state,
      details: a.details,
      timestamps: a.timestamps,
      largeImageUrl: a.assets?.large_image?.startsWith('mp:external')
        ? a.assets.large_image.replace(/mp:external\/[^\/]+\/https\//, 'https://')
        : undefined,
    }))

  discord.value = {
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
    spotify:
      d.listening_to_spotify && d.spotify
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

onMounted(() => {
  // Start 1-second real-time timer for progress bars
  timer = setInterval(() => {
    now.value = Date.now()
  }, 1000)

  // Open real-time WebSocket connection to Lanyard
  connectLanyardWs()
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
  if (heartbeatTimer) clearInterval(heartbeatTimer)
  if (socket) socket.close()
})
</script>

<template>
  <aside class="space-y-6 text-[#E0E1DD]">
    <!-- 1. Profile Header Card -->
    <div class="bg-[#1B263B]/60 backdrop-blur-xl border border-[#415A77]/40 rounded-3xl p-6 shadow-2xl space-y-5">
      <div class="flex items-center gap-4">
        <!-- Avatar Photo -->
        <div class="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border border-[#778DA9]/40 bg-[#0D1B2A] shadow-xl flex-shrink-0">
          <img
            :src="profileImg"
            alt="Prince Semillano"
            class="w-full h-full object-cover"
          />
        </div>

        <!-- Name & Status -->
        <div class="space-y-1.5 flex-1 min-w-0">
          <h2 class="text-xl sm:text-2xl font-serif font-bold text-[#E0E1DD] tracking-tight truncate">
            Prince Semillano
          </h2>
          <p class="text-xs text-[#778DA9] font-mono truncate">
            Naic, Cavite &bull; Philippines
          </p>
          <!-- Discord Live Badge & Username (without @) -->
          <div class="pt-0.5 flex flex-wrap items-center gap-2">
            <span
              class="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border shadow-sm"
              :class="statusConfig.badgeBg"
            >
              <span class="w-2 h-2 rounded-full animate-pulse" :class="statusConfig.dotBg" />
              {{ statusConfig.label }}
            </span>
            <span v-if="discord?.discordUser?.username" class="text-[11px] font-mono text-[#778DA9]">
              {{ discord.discordUser.username }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- 2. Discord Live Activity Card -->
    <div class="bg-[#1B263B]/60 backdrop-blur-xl border border-[#415A77]/40 rounded-3xl p-6 shadow-2xl space-y-4">
      <div class="flex items-center justify-between">
        <h3 class="text-xs font-bold uppercase tracking-widest text-[#E0E1DD] flex items-center gap-2">
          <!-- Discord SVG -->
          <svg class="w-4 h-4 fill-[#5865F2]" viewBox="0 0 24 24">
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07f 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
          </svg>
          Discord Activity
        </h3>
      </div>

      <!-- Custom Status (e.g. "was it ever casual?") -->
      <div
        v-if="discord?.customStatus"
        class="px-3.5 py-2.5 rounded-2xl bg-[#0D1B2A]/80 border border-[#415A77]/40 flex items-center gap-2.5 shadow-sm"
      >
        <span class="text-xs text-[#778DA9]">💭</span>
        <span class="text-xs italic text-[#E0E1DD] font-serif tracking-wide">
          "{{ discord.customStatus }}"
        </span>
      </div>

      <!-- Spotify Activity with Real-Time Progress Bar -->
      <div
        v-if="discord?.spotify"
        class="p-4 rounded-2xl bg-[#0D1B2A]/80 border border-[#415A77]/30 space-y-3 shadow-md"
      >
        <div class="flex items-center gap-3.5">
          <img
            :src="discord.spotify.albumArtUrl"
            :alt="discord.spotify.song"
            class="w-14 h-14 rounded-xl object-cover border border-[#415A77]/40 flex-shrink-0 shadow-md"
          />
          <div class="min-w-0 flex-1 space-y-0.5">
            <div class="flex items-center justify-between gap-2">
              <div class="flex items-center gap-1.5">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span class="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Listening to Spotify</span>
              </div>
              <!-- Live Equalizer Animation -->
              <div class="flex items-end gap-0.5 h-3">
                <span class="w-0.5 h-full bg-emerald-400 animate-pulse rounded-full" />
                <span class="w-0.5 h-2/3 bg-emerald-400 animate-pulse rounded-full" />
                <span class="w-0.5 h-5/6 bg-emerald-400 animate-pulse rounded-full" />
              </div>
            </div>
            <p class="text-xs font-bold text-[#E0E1DD] truncate">{{ discord.spotify.song }}</p>
            <p class="text-[11px] text-[#CED4DA] truncate">{{ discord.spotify.artist }}</p>
          </div>
        </div>

        <!-- Live Track Progress Bar & Timestamps -->
        <div v-if="spotifyProgress" class="space-y-1.5 pt-0.5">
          <div class="relative w-full h-1.5 bg-[#1B263B] rounded-full overflow-hidden">
            <div
              class="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-300 ease-linear"
              :style="{ width: `${spotifyProgress.percent}%` }"
            />
          </div>
          <div class="flex items-center justify-between text-[10px] font-mono text-[#778DA9]">
            <span>{{ spotifyProgress.current }}</span>
            <span>{{ spotifyProgress.total }}</span>
          </div>
        </div>
      </div>

      <!-- General Activity (VS Code, Game, etc.) with Live Elapsed Time -->
      <div
        v-if="discord?.activities && discord.activities.length > 0"
        class="p-4 rounded-2xl bg-[#0D1B2A]/80 border border-[#415A77]/30 space-y-2"
      >
        <div class="flex items-center justify-between gap-2">
          <div class="flex items-center gap-1.5">
            <span class="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span class="text-[10px] font-bold uppercase tracking-wider text-cyan-400">Current Focus</span>
          </div>
          <!-- Live Elapsed Time -->
          <span
            v-if="discord.activities[0].timestamps?.start"
            class="text-[10px] font-mono text-[#778DA9] bg-[#1B263B]/80 px-2 py-0.5 rounded-full border border-[#415A77]/40"
          >
            {{ formatElapsed(discord.activities[0].timestamps.start) }}
          </span>
        </div>

        <div class="flex items-start gap-3">
          <img
            v-if="discord.activities[0].largeImageUrl"
            :src="discord.activities[0].largeImageUrl"
            :alt="discord.activities[0].name"
            class="w-10 h-10 rounded-xl object-cover border border-[#415A77]/40 flex-shrink-0"
          />
          <div class="min-w-0 flex-1 space-y-0.5">
            <p class="text-xs font-bold text-[#E0E1DD]">{{ discord.activities[0].name }}</p>
            <p v-if="discord.activities[0].details" class="text-[11px] text-[#CED4DA] truncate">
              {{ discord.activities[0].details }}
            </p>
            <p v-if="discord.activities[0].state" class="text-[10px] text-[#778DA9] font-mono truncate">
              {{ discord.activities[0].state }}
            </p>
          </div>
        </div>
      </div>

      <!-- Offline / Away Fallback -->
      <div
        v-if="!discord?.spotify && (!discord?.activities || discord.activities.length === 0)"
        class="p-4 rounded-2xl bg-[#0D1B2A]/50 border border-dashed border-[#415A77]/30 text-center py-5 space-y-1"
      >
        <p class="text-xs font-semibold text-[#E0E1DD]">Currently Away from Keyboard</p>
        <p class="text-[11px] text-[#CED4DA]">Not streaming active games or media right now.</p>
      </div>
    </div>

    <!-- 3. Bio Block: About Me -->
    <div class="bg-[#1B263B]/60 backdrop-blur-xl border border-[#415A77]/40 rounded-3xl p-6 shadow-2xl space-y-3">
      <h3 class="text-xl font-serif font-bold text-[#E0E1DD]">
        About Me
      </h3>
      <p class="text-sm text-[#CED4DA] leading-relaxed font-normal">
        I'm Prince Semillano, a third year Information Technology student at St. Dominic College of Asia. While my coursework is rooted in software development, my approach to problem-solving is driven by strong interpersonal skills. I am a fast learner and highly adaptable, capable of quickly pivoting to new tools, workflows, and project requirements. Taking on leadership roles in academic and collaborative environments has sharpened my ability to manage project scopes, coordinate tasks, and keep teams aligned through Agile sprint planning. I believe effective communication is just as essential as clean code, allowing me to gather precise client requirements and translate complex technical challenges into clear, actionable strategies.
      </p>
    </div>

    <!-- 4. Bio Block: Professional Aspirations -->
    <div class="bg-[#1B263B]/60 backdrop-blur-xl border border-[#415A77]/40 rounded-3xl p-6 shadow-2xl space-y-3">
      <h3 class="text-xl font-serif font-bold text-[#E0E1DD]">
        Professional Aspirations
      </h3>
      <p class="text-sm text-[#CED4DA] leading-relaxed font-normal">
        As a student pursuing Full-Stack Development, I am acquiring the skills to develop comprehensive software solutions encompassing full-stack products, AI integrations, APIs, bots, and the automation systems that ensure a business operates efficiently. I specialize in building clean, functional web applications from the ground up, utilizing JavaScript, Node.js, Vue, and Nuxt. Serving as a lead system architect and full-stack developer on projects like Mavis Personal Tracker, LCS PrintHub and Real-time synchronized event tabulation systems, I enjoy tackling complex architectural challenges—from designing normalized relational databases in PostgreSQL and SQL Server to implementing live WebSocket data synchronization.
      </p>
    </div>
  </aside>
</template>
