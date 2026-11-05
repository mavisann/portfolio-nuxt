<script setup lang="ts">
import { computed } from 'vue'
import type { GitHubData, GitHubContributionDay } from '~~/shared/types'
import githubImg from '~/assets/images/techstack/socials/github.png'

// Smart component: fetches live GitHub data via Nitro endpoint
const { data: github, pending } = await useFetch<GitHubData>('/api/github')

// Dynamic GitHub-style month labels aligned with each week column
const weekMonthLabels = computed<(string | null)[]>(() => {
  const contributions = github.value?.contributions
  if (!contributions || contributions.length === 0) return []

  const labels: (string | null)[] = []
  let lastLabeledMonth = -1
  let lastLabeledWeekIndex = -10

  contributions.forEach((week, wIdx) => {
    // Only check days that are not in the future
    const nonFutureDays = week.contributionDays.filter((d: GitHubContributionDay) => !d.isFuture)
    let monthToLabel: string | null = null

    for (const d of nonFutureDays) {
      const parts = d.date.split('-')
      const year = parseInt(parts[0] ?? '', 10)
      const month = parseInt(parts[1] ?? '', 10)
      const dayNum = parseInt(parts[2] ?? '', 10)

      if (isNaN(year) || isNaN(month) || isNaN(dayNum)) continue

      const dDate = new Date(year, month - 1, dayNum)

      // In GitHub, month label appears when a week contains the 1st through 7th day of a new month
      if (dayNum >= 1 && dayNum <= 7 && month !== lastLabeledMonth && wIdx - lastLabeledWeekIndex >= 2) {
        monthToLabel = dDate.toLocaleString('en-US', { month: 'short' })
        lastLabeledMonth = month
        lastLabeledWeekIndex = wIdx
        break
      }
    }

    // Starting month for week 0 if not already labeled
    if (wIdx === 0 && !monthToLabel && nonFutureDays.length > 0) {
      const firstValid = nonFutureDays[0]
      if (firstValid) {
        const parts = firstValid.date.split('-')
        const year = parseInt(parts[0] ?? '', 10)
        const month = parseInt(parts[1] ?? '', 10)
        const dayNum = parseInt(parts[2] ?? '', 10)

        if (!isNaN(year) && !isNaN(month) && !isNaN(dayNum)) {
          const dDate = new Date(year, month - 1, dayNum)
          monthToLabel = dDate.toLocaleString('en-US', { month: 'short' })
          lastLabeledMonth = month
          lastLabeledWeekIndex = 0
        }
      }
    }

    labels.push(monthToLabel)
  })

  return labels
})

const getSquareColor = (count: number, isFuture?: boolean): string => {
  if (isFuture) return 'bg-transparent'
  if (count >= 6) return 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.35)]'
  if (count >= 4) return 'bg-emerald-500'
  if (count >= 2) return 'bg-emerald-600/90'
  if (count >= 1) return 'bg-emerald-800/80'
  return 'bg-[#0D1B2A]/90 border border-[#415A77]/25'
}
</script>

<template>
  <section class="w-full space-y-6 text-[#E0E1DD]">
    <!-- Loading Skeleton -->
    <div v-if="pending" class="space-y-4 animate-pulse">
      <div class="h-28 rounded-2xl bg-[#1B263B]/60 border border-[#415A77]/30" />
      <div class="h-44 rounded-2xl bg-[#1B263B]/60 border border-[#415A77]/30" />
      <div class="h-56 rounded-2xl bg-[#1B263B]/60 border border-[#415A77]/30" />
    </div>

    <template v-else-if="github">
      <!-- 1. Profile Card (Middle vertically, left-aligned) -->
      <div class="bg-[#1B263B]/60 backdrop-blur-md border border-[#415A77]/40 rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 transition-all duration-300 hover:border-[#778DA9]/60">
        <div class="flex flex-row items-center gap-5 text-left w-full sm:w-auto">
          <!-- Avatar Placeholder / Image -->
          <div class="relative w-20 h-20 rounded-2xl overflow-hidden border border-[#778DA9]/40 bg-[#0D1B2A] shadow-lg flex-shrink-0">
            <img
              v-if="github.profile.avatarUrl"
              :src="github.profile.avatarUrl"
              :alt="github.profile.name"
              class="w-full h-full object-cover"
            />
            <div v-else class="w-full h-full flex items-center justify-center font-serif text-2xl font-bold text-[#E0E1DD]">
              PS
            </div>
          </div>

          <!-- Profile Text Block (High Contrast, Vertically Middle) -->
          <div class="space-y-1">
            <div class="flex items-center gap-1.5">
              <img :src="githubImg" alt="GitHub" class="w-3.5 h-3.5 object-contain" />
              <span class="text-[11px] font-bold tracking-widest uppercase text-[#778DA9]">
                GitHub Account
              </span>
            </div>
            <h2 class="text-2xl font-serif font-bold text-[#E0E1DD] tracking-tight">
              {{ github.profile.name }}
            </h2>
            <p class="text-xs text-[#CED4DA] font-mono">
              @{{ github.profile.login }}
            </p>

            <!-- Stats Row -->
            <div class="pt-1 flex items-center gap-4 text-xs text-[#CED4DA] font-medium">
              <span class="flex items-center gap-1.5">
                <strong class="text-[#E0E1DD] font-semibold">{{ github.profile.followers }}</strong> followers
              </span>
              <span class="w-1 h-1 rounded-full bg-[#415A77]" />
              <span class="flex items-center gap-1.5">
                <strong class="text-[#E0E1DD] font-semibold">{{ github.profile.following }}</strong> following
              </span>
            </div>
          </div>
        </div>

        <!-- View on GitHub CTA (Vertically Middle) -->
        <a
          :href="`https://github.com/${github.profile.login}`"
          target="_blank"
          rel="noopener noreferrer"
          class="btn btn-sm rounded-xl bg-[#415A77] hover:bg-[#778DA9] text-white border-0 flex items-center gap-2 self-center shadow-sm transition-transform duration-200 hover:scale-[1.03] flex-shrink-0"
        >
          <!-- GitHub Official Local Asset -->
          <img :src="githubImg" alt="GitHub" class="w-4 h-4 object-contain brightness-0 invert" />
          <span>View Profile</span>
        </a>
      </div>

      <!-- 2. Contributions Card -->
      <div class="bg-[#1B263B]/60 backdrop-blur-md border border-[#415A77]/40 rounded-2xl p-6 shadow-xl space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="text-xs font-bold uppercase tracking-widest text-[#E0E1DD]">
            Contributions
          </h3>
          <span class="text-xs text-[#778DA9] font-medium">Last 12 Months</span>
        </div>

        <!-- Heatmap Container -->
        <div class="overflow-x-auto pb-2 scrollbar-thin">
          <div class="min-w-[700px]">
            <!-- Months Header Row: Exact column structure aligned with weeks -->
            <div class="relative flex text-[10px] text-[#CED4DA] font-medium h-4 mb-2 pl-7 pr-1">
              <div
                v-for="(label, wIdx) in weekMonthLabels"
                :key="wIdx"
                class="relative flex-1"
              >
                <span
                  v-if="label"
                  class="absolute left-0 top-0 whitespace-nowrap text-[10px] text-[#CED4DA] font-medium select-none pointer-events-none"
                >
                  {{ label }}
                </span>
              </div>
            </div>

            <!-- Heatmap Grid -->
            <div class="flex gap-1.5 items-start">
              <!-- Days of Week Indicator Column (Mon, Wed, Fri aligned with rows 1, 3, 5) -->
              <div class="flex flex-col gap-1 select-none pr-1.5 text-[9px] text-[#ADB5BD] font-medium w-6 flex-shrink-0">
                <div class="w-full aspect-square flex items-center justify-end opacity-0">Sun</div>
                <div class="w-full aspect-square flex items-center justify-end">Mon</div>
                <div class="w-full aspect-square flex items-center justify-end opacity-0">Tue</div>
                <div class="w-full aspect-square flex items-center justify-end">Wed</div>
                <div class="w-full aspect-square flex items-center justify-end opacity-0">Thu</div>
                <div class="w-full aspect-square flex items-center justify-end">Fri</div>
                <div class="w-full aspect-square flex items-center justify-end opacity-0">Sat</div>
              </div>

              <!-- Matrix: 53 Weeks Columns -->
              <div class="flex gap-1 flex-1 pr-1">
                <div
                  v-for="(week, wIdx) in github.contributions"
                  :key="wIdx"
                  class="flex flex-col gap-1 flex-1"
                >
                  <div
                    v-for="(day, dIdx) in week.contributionDays"
                    :key="dIdx"
                    :title="day.isFuture ? '' : `${day.date}: ${day.contributionCount} contributions`"
                    class="w-full aspect-square rounded-full transition-transform duration-150"
                    :class="[
                      day.isFuture ? 'opacity-0 pointer-events-none' : 'hover:scale-125 cursor-pointer',
                      getSquareColor(day.contributionCount, day.isFuture),
                    ]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Heatmap Legend -->
        <div class="flex items-center justify-end gap-2 text-[10px] text-[#CED4DA] pt-1 font-medium">
          <span>Less</span>
          <div class="flex items-center gap-1">
            <span class="w-2.5 h-2.5 rounded-full bg-[#0D1B2A] border border-[#415A77]/30" />
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-800/80" />
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-600/90" />
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          </div>
          <span>More</span>
        </div>
      </div>

      <!-- 3. Public Repositories Card -->
      <div class="bg-[#1B263B]/60 backdrop-blur-md border border-[#415A77]/40 rounded-2xl p-6 shadow-xl space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="text-xs font-bold uppercase tracking-widest text-[#E0E1DD]">
            Repositories
          </h3>
          <span class="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live Sync
          </span>
        </div>

        <!-- Repositories Responsive Grid -->
        <div v-if="github.pinnedRepos && github.pinnedRepos.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            v-for="repo in github.pinnedRepos"
            :key="repo.name"
            :href="repo.url"
            target="_blank"
            rel="noopener noreferrer"
            class="group p-4 rounded-xl bg-[#0D1B2A]/70 hover:bg-[#1B263B] border border-[#415A77]/30 hover:border-[#778DA9]/60 transition-all duration-300 flex flex-col justify-between gap-3 shadow-sm"
          >
            <!-- Repo Header & Well-Proportioned Pill Badge -->
            <div class="space-y-1.5">
              <div class="flex items-center justify-between gap-2">
                <span class="text-sm font-bold text-[#778DA9] group-hover:text-[#E0E1DD] transition-colors truncate">
                  {{ repo.name }}
                </span>
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#1B263B] text-[#E0E1DD] border border-[#415A77]/60 shadow-sm uppercase tracking-wide">
                  Public
                </span>
              </div>
              <p class="text-xs text-[#CED4DA] line-clamp-2 leading-relaxed font-normal">
                {{ repo.description || 'No description provided.' }}
              </p>
            </div>

            <!-- Repo Footer: Language & Stars -->
            <div class="flex items-center justify-between text-xs text-[#CED4DA] pt-1 border-t border-[#415A77]/20">
              <div class="flex items-center gap-1.5">
                <span
                  class="w-2.5 h-2.5 rounded-full"
                  :style="{ backgroundColor: repo.languageColor || '#778DA9' }"
                />
                <span class="text-xs font-medium">{{ repo.language || 'Code' }}</span>
              </div>

              <!-- Stargazers -->
              <div v-if="repo.stargazerCount > 0" class="flex items-center gap-1 text-[#CED4DA]">
                <svg class="w-3.5 h-3.5 fill-current text-amber-400" viewBox="0 0 24 24">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
                <span class="font-medium">{{ repo.stargazerCount }}</span>
              </div>
            </div>
          </a>
        </div>

        <!-- Empty State if no public repos are published yet -->
        <div
          v-else
          class="p-8 rounded-xl bg-[#0D1B2A]/50 border border-dashed border-[#415A77]/40 text-center space-y-3"
        >
          <div class="w-10 h-10 mx-auto rounded-full bg-[#1B263B] border border-[#415A77]/50 flex items-center justify-center text-[#778DA9]">
            <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
          </div>
          <p class="text-sm font-semibold text-[#E0E1DD]">
            No public repositories found on @{{ github.profile.login }}
          </p>
          <p class="text-xs text-[#CED4DA] max-w-md mx-auto">
            Repositories created on GitHub will automatically sync and display here in real time with live stars, descriptions, and language badges.
          </p>
          <a
            :href="`https://github.com/${github.profile.login}`"
            target="_blank"
            rel="noopener noreferrer"
            class="btn btn-xs rounded-lg bg-[#415A77] hover:bg-[#778DA9] text-white border-0 mt-2"
          >
            Open GitHub Profile
          </a>
        </div>
      </div>
    </template>
  </section>
</template>
