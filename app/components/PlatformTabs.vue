<script setup lang="ts">
import { ref } from 'vue'
import type { PlatformData, GitHubRepo } from '~~/shared/types'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import instagramImg from '~/assets/images/techstack/socials/instagram.png'
import facebookImg from '~/assets/images/techstack/socials/facebook.png'
import linkedinImg from '~/assets/images/techstack/socials/linkedin.png'
import githubImg from '~/assets/images/techstack/socials/github.png'

// Active Platform Tab: 'social' | 'professional'
const activeTab = ref<'social' | 'professional'>('social')

// Fetch platform data in parallel via Nitro endpoints
const { data: instagram } = await useFetch<PlatformData>('/api/instagram')
const { data: facebook } = await useFetch<PlatformData>('/api/facebook')
const { data: linkedin } = await useFetch<PlatformData>('/api/linkedin')
const { data: repos } = await useFetch<GitHubRepo[]>('/api/github-full')
</script>

<template>
  <Tabs v-model="activeTab" default-value="social" class="w-full space-y-6 text-[#E0E1DD]">
    <!-- 1. Centered Segmented Pill Control (TabsList / TabsTrigger) -->
    <div class="flex justify-center sm:justify-start">
      <TabsList>
        <TabsTrigger value="social">
          Social Media
        </TabsTrigger>
        <TabsTrigger value="professional">
          Professional Platforms
        </TabsTrigger>
      </TabsList>
    </div>

    <!-- 2. View A: Social Media Platforms with smooth TabsContent transition -->
    <TabsContent value="social" class="mt-0 space-y-6">
      <!-- Instagram Card -->
      <div class="bg-[#1B263B]/60 backdrop-blur-xl border border-[#415A77]/40 hover:border-[#778DA9]/60 rounded-3xl p-6 shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl space-y-5">
        <!-- Platform Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div class="flex items-center gap-3.5">
            <!-- Instagram Official Local Asset -->
            <img
              :src="instagramImg"
              alt="Instagram"
              class="w-11 h-11 object-contain flex-shrink-0"
            />
            <div>
              <h4 class="text-base font-serif font-bold text-[#E0E1DD]">Instagram</h4>
              <p class="text-xs text-[#778DA9] font-mono">@{{ instagram?.profile.username || 'prins_s_tuvwx' }}</p>
            </div>
          </div>

          <a
            :href="instagram?.profile.profileUrl || 'https://www.instagram.com/prins_s_tuvwx/'"
            target="_blank"
            rel="noopener noreferrer"
            class="btn btn-sm rounded-xl bg-[#415A77] hover:bg-[#778DA9] text-white border-0 flex items-center gap-1.5 self-start sm:self-auto shadow-md"
          >
            <span>View Profile</span>
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M7 17L17 7M17 7H7M17 7V17" />
            </svg>
          </a>
        </div>

        <!-- Bio, Divider & Stats Group with Balanced Symmetrical Spacing -->
        <div class="space-y-3.5">
          <p class="text-xs text-[#CED4DA] leading-relaxed">
            {{ instagram?.profile.bio || 'Follow @prins_s_tuvwx on Instagram for photos, reels, and stories.' }}
          </p>

          <!-- Symmetrical Horizontal Divider -->
          <div class="border-t border-[#415A77]/30" />

          <!-- Stats Row -->
          <div
            v-if="instagram?.profile.stats && Object.keys(instagram.profile.stats).length > 0"
            class="flex items-center gap-6 text-xs text-[#CED4DA]"
          >
            <div v-if="instagram.profile.stats.posts !== undefined">
              <strong class="text-[#E0E1DD]">{{ instagram.profile.stats.posts }}</strong> posts
            </div>
            <div v-if="instagram.profile.stats.followers !== undefined">
              <strong class="text-[#E0E1DD]">{{ instagram.profile.stats.followers }}</strong> followers
            </div>
            <div v-if="instagram.profile.stats.following !== undefined">
              <strong class="text-[#E0E1DD]">{{ instagram.profile.stats.following }}</strong> following
            </div>
          </div>
        </div>

        <!-- Recent Posts Grid (Rendered when posts exist from Meta API) -->
        <div v-if="instagram?.posts && instagram.posts.length > 0" class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <a
            v-for="post in instagram.posts"
            :key="post.id"
            :href="post.link"
            target="_blank"
            rel="noopener noreferrer"
            class="group relative aspect-square rounded-2xl overflow-hidden bg-[#0D1B2A] border border-[#415A77]/30 shadow-md"
          >
            <img
              v-if="post.imageUrl"
              :src="post.imageUrl"
              :alt="post.text"
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-[#0D1B2A]/90 via-[#0D1B2A]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-3 flex flex-col justify-end">
              <p class="text-[11px] text-[#E0E1DD] line-clamp-2 leading-tight">{{ post.text }}</p>
              <span class="text-[9px] text-[#778DA9] pt-1">{{ post.timestamp }}</span>
            </div>
          </a>
        </div>

        <!-- Clean Live Account Card (when token is not set) -->
        <div v-else class="p-4 rounded-2xl bg-[#0D1B2A]/70 border border-[#415A77]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div class="space-y-1">
            <span class="text-xs font-bold text-[#E0E1DD]">Live Public Instagram Profile</span>
            <p class="text-[11px] text-[#CED4DA]">Synced with active feed and highlights of @prins_s_tuvwx.</p>
          </div>
          <a
            :href="instagram?.profile.profileUrl || 'https://www.instagram.com/prins_s_tuvwx/'"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-1.5 text-xs text-[#778DA9] hover:text-[#E0E1DD] font-medium transition-colors"
          >
            <span>Open Instagram</span>
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M7 17L17 7M17 7H7M17 7V17" />
            </svg>
          </a>
        </div>
      </div>

      <!-- Facebook Card -->
      <div class="bg-[#1B263B]/60 backdrop-blur-xl border border-[#415A77]/40 hover:border-[#778DA9]/60 rounded-3xl p-6 shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl space-y-5">
        <!-- Platform Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div class="flex items-center gap-3.5">
            <!-- Facebook Official Local Asset -->
            <img
              :src="facebookImg"
              alt="Facebook"
              class="w-11 h-11 object-contain flex-shrink-0"
            />
            <div>
              <h4 class="text-base font-serif font-bold text-[#E0E1DD]">{{ facebook?.profile.name || 'Prince Semillano' }}</h4>
              <p class="text-xs text-[#778DA9] font-mono">@{{ facebook?.profile.username || 'princestuv' }}</p>
            </div>
          </div>

          <a
            :href="facebook?.profile.profileUrl || 'https://www.facebook.com/princestuv/'"
            target="_blank"
            rel="noopener noreferrer"
            class="btn btn-sm rounded-xl bg-[#415A77] hover:bg-[#778DA9] text-white border-0 flex items-center gap-1.5 self-start sm:self-auto shadow-md"
          >
            <span>View Profile</span>
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M7 17L17 7M17 7H7M17 7V17" />
            </svg>
          </a>
        </div>

        <!-- Bio, Divider & Content with Balanced Symmetrical Spacing -->
        <div class="space-y-3.5">
          <p class="text-xs text-[#CED4DA] leading-relaxed">
            {{ facebook?.profile.bio || 'Personal Facebook profile & digital footprint of Prince Semillano.' }}
          </p>

          <!-- Symmetrical Horizontal Divider -->
          <div class="border-t border-[#415A77]/30" />
        </div>

        <!-- Dynamic Facebook Content / Action Card -->
        <div class="p-4 rounded-2xl bg-[#0D1B2A]/70 border border-[#415A77]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div class="space-y-1">
            <span class="text-xs font-bold text-[#E0E1DD]">Live Facebook Profile</span>
            <p class="text-[11px] text-[#CED4DA]">Connect on Facebook for personal updates, messaging, and networking.</p>
          </div>
          <a
            :href="facebook?.profile.profileUrl || 'https://www.facebook.com/princestuv/'"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-1.5 text-xs text-[#778DA9] hover:text-[#E0E1DD] font-medium transition-colors"
          >
            <span>Open Facebook</span>
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M7 17L17 7M17 7H7M17 7V17" />
            </svg>
          </a>
        </div>
      </div>
    </TabsContent>

    <!-- 3. View B: Professional Platforms with smooth TabsContent transition -->
    <TabsContent value="professional" class="mt-0 space-y-6">
      <!-- LinkedIn Card -->
      <div class="bg-[#1B263B]/60 backdrop-blur-xl border border-[#415A77]/40 hover:border-[#778DA9]/60 rounded-3xl p-6 shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl space-y-5">
        <!-- Platform Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div class="flex items-center gap-3.5">
            <!-- LinkedIn Official Local Asset -->
            <img
              :src="linkedinImg"
              alt="LinkedIn"
              class="w-11 h-11 object-contain flex-shrink-0"
            />
            <div>
              <h4 class="text-base font-serif font-bold text-[#E0E1DD]">{{ linkedin?.profile.name || 'Prince Semillano' }}</h4>
              <p class="text-xs text-[#778DA9] font-mono">@{{ linkedin?.profile.username || 'mavisan07' }}</p>
            </div>
          </div>

          <a
            :href="linkedin?.profile.profileUrl || 'https://www.linkedin.com/in/mavisan07/'"
            target="_blank"
            rel="noopener noreferrer"
            class="btn btn-sm rounded-xl bg-[#415A77] hover:bg-[#778DA9] text-white border-0 flex items-center gap-1.5 self-start sm:self-auto shadow-md"
          >
            <span>Connect</span>
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M7 17L17 7M17 7H7M17 7V17" />
            </svg>
          </a>
        </div>

        <!-- Bio, Divider & Dynamic Credentials with Balanced Symmetrical Spacing -->
        <div class="space-y-3.5">
          <!-- Bio & Professional Summary -->
          <p class="text-xs text-[#CED4DA] leading-relaxed">
            {{ linkedin?.profile.bio || 'Information Technology Student at St. Dominic College of Asia · Aspiring Full-Stack Developer.' }}
          </p>

          <!-- Symmetrical Horizontal Divider -->
          <div class="border-t border-[#415A77]/30" />

          <!-- Dynamic LinkedIn Credentials & Metadata -->
          <div class="flex flex-wrap items-center gap-2.5 text-xs">
            <div class="px-3 py-1.5 rounded-xl bg-[#0D1B2A]/80 border border-[#415A77]/40 text-[#E0E1DD] font-medium">
              <strong class="text-white">{{ linkedin?.profile.stats.connections || '19+ connections' }}</strong>
            </div>
            <div class="px-3 py-1.5 rounded-xl bg-[#0D1B2A]/80 border border-[#415A77]/40 text-[#CED4DA]">
              🎓 {{ linkedin?.profile.stats.education || 'St. Dominic College of Asia' }}
            </div>
            <div class="px-3 py-1.5 rounded-xl bg-[#0D1B2A]/80 border border-[#415A77]/40 text-[#778DA9]">
              📍 {{ linkedin?.profile.stats.location || 'Naic, Calabarzon, Philippines' }}
            </div>
          </div>
        </div>

        <!-- Professional Network Action Card -->
        <div class="p-4 rounded-2xl bg-[#0D1B2A]/70 border border-[#415A77]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div class="space-y-1">
            <span class="text-xs font-bold text-[#E0E1DD]">Professional Inquiries & Opportunities</span>
            <p class="text-[11px] text-[#CED4DA]">Open to internships, freelance software development, and technical collaboration.</p>
          </div>
          <a
            :href="linkedin?.profile.profileUrl || 'https://www.linkedin.com/in/mavisan07/'"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-1.5 text-xs text-[#778DA9] hover:text-[#E0E1DD] font-medium transition-colors"
          >
            <span>Open LinkedIn</span>
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M7 17L17 7M17 7H7M17 7V17" />
            </svg>
          </a>
        </div>
      </div>

      <!-- GitHub Repositories Showcase Card -->
      <div class="bg-[#1B263B]/60 backdrop-blur-xl border border-[#415A77]/40 hover:border-[#778DA9]/60 rounded-3xl p-6 shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl space-y-5">
        <!-- Platform Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div class="flex items-center gap-3.5">
            <!-- GitHub Official Local Asset -->
            <img
              :src="githubImg"
              alt="GitHub"
              class="w-11 h-11 object-contain flex-shrink-0"
            />
            <div>
              <h4 class="text-base font-serif font-bold text-[#E0E1DD]">GitHub</h4>
              <p class="text-xs text-[#778DA9] font-mono">@mavisann</p>
            </div>
          </div>

          <a
            href="https://github.com/mavisann"
            target="_blank"
            rel="noopener noreferrer"
            class="btn btn-sm rounded-xl bg-[#415A77] hover:bg-[#778DA9] text-white border-0 flex items-center gap-1.5 self-start sm:self-auto"
          >
            <span>View Profile</span>
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M7 17L17 7M17 7H7M17 7V17" />
            </svg>
          </a>
        </div>

        <!-- Description & Symmetrical Horizontal Divider -->
        <div class="space-y-3.5">
          <p class="text-xs text-[#CED4DA] leading-relaxed">
            All public repositories auto-synced live from GitHub without static templates.
          </p>

          <!-- Symmetrical Horizontal Divider -->
          <div class="border-t border-[#415A77]/30" />
        </div>

        <!-- Live Repositories Grid -->
        <div v-if="repos && repos.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          <a
            v-for="repo in repos"
            :key="repo.name"
            :href="repo.url"
            target="_blank"
            rel="noopener noreferrer"
            class="group p-4 rounded-2xl bg-[#0D1B2A]/70 hover:bg-[#1B263B] border border-[#415A77]/30 hover:border-[#778DA9]/60 transition-all duration-300 flex flex-col justify-between gap-3 shadow-sm"
          >
            <div class="space-y-1.5">
              <div class="flex items-center justify-between gap-2">
                <span class="text-sm font-bold text-[#778DA9] group-hover:text-[#E0E1DD] transition-colors truncate">
                  {{ repo.name }}
                </span>
                <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#1B263B] text-[#E0E1DD] border border-[#415A77]/60">
                  Public
                </span>
              </div>
              <p class="text-xs text-[#CED4DA] line-clamp-2 leading-relaxed">
                {{ repo.description || 'Public repository by Prince Semillano.' }}
              </p>
            </div>

            <div class="flex items-center justify-between text-xs text-[#CED4DA] pt-2 border-t border-[#415A77]/20">
              <div class="flex items-center gap-1.5">
                <span
                  class="w-2.5 h-2.5 rounded-full"
                  :style="{ backgroundColor: repo.languageColor || '#778DA9' }"
                />
                <span class="text-xs font-medium">{{ repo.language || 'Code' }}</span>
              </div>

              <div v-if="repo.stargazerCount > 0" class="flex items-center gap-1">
                <svg class="w-3.5 h-3.5 fill-current text-amber-400" viewBox="0 0 24 24">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
                <span>{{ repo.stargazerCount }}</span>
              </div>
            </div>
          </a>
        </div>

        <div
          v-else
          class="p-6 rounded-2xl bg-[#0D1B2A]/50 border border-dashed border-[#415A77]/40 text-center text-xs text-[#CED4DA]"
        >
          No public repositories found on @mavisann yet.
        </div>
      </div>
    </TabsContent>
  </Tabs>
</template>

