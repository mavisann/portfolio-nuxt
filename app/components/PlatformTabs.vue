<script setup lang="ts">
import { ref } from 'vue'
import type { PlatformData, GitHubRepo } from '~/../shared/types'

// Active Platform Tab: 'social' | 'professional'
const activeTab = ref<'social' | 'professional'>('social')

// Fetch platform data in parallel via Nitro endpoints
const { data: instagram } = await useFetch<PlatformData>('/api/instagram')
const { data: linkedin } = await useFetch<PlatformData>('/api/linkedin')
const { data: repos } = await useFetch<GitHubRepo[]>('/api/github-full')
</script>

<template>
  <div class="space-y-6 text-[#E0E1DD]">
    <!-- 1. Centered Segmented Pill Control (ForgeUI Animated Style) -->
    <div class="flex justify-center sm:justify-start">
      <div class="relative flex items-center p-1.5 rounded-full bg-[#1B263B]/70 border border-[#415A77]/50 backdrop-blur-xl shadow-xl">
        <button
          type="button"
          class="relative px-5 py-2 rounded-full text-xs font-bold transition-colors duration-200 z-10"
          :class="activeTab === 'social' ? 'text-white' : 'text-[#CED4DA] hover:text-[#E0E1DD]'"
          @click="activeTab = 'social'"
        >
          <span
            v-if="activeTab === 'social'"
            class="absolute inset-0 rounded-full bg-[#415A77] shadow-md -z-10 transition-all duration-300"
          />
          Social Media
        </button>

        <button
          type="button"
          class="relative px-5 py-2 rounded-full text-xs font-bold transition-colors duration-200 z-10"
          :class="activeTab === 'professional' ? 'text-white' : 'text-[#CED4DA] hover:text-[#E0E1DD]'"
          @click="activeTab = 'professional'"
        >
          <span
            v-if="activeTab === 'professional'"
            class="absolute inset-0 rounded-full bg-[#415A77] shadow-md -z-10 transition-all duration-300"
          />
          Professional Platforms
        </button>
      </div>
    </div>

    <!-- 2. View A: Social Media Platforms -->
    <div v-if="activeTab === 'social'" class="space-y-6 animate-fadeIn">
      <!-- Instagram Card -->
      <div class="bg-[#1B263B]/60 backdrop-blur-xl border border-[#415A77]/40 rounded-3xl p-6 shadow-2xl space-y-5">
        <!-- Platform Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div class="flex items-center gap-3.5">
            <!-- Instagram Gradient Icon -->
            <div class="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center text-white shadow-lg flex-shrink-0">
              <svg class="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </div>
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

        <!-- Bio & Stats -->
        <p v-if="instagram?.profile.bio" class="text-xs text-[#CED4DA] leading-relaxed">
          {{ instagram.profile.bio }}
        </p>

        <!-- Divider -->
        <div
          v-if="instagram?.profile.stats && Object.keys(instagram.profile.stats).length > 0"
          class="border-t border-[#415A77]/20"
        />

        <!-- Stats Row (Rendered ONLY when real stats exist from live sync, ZERO hardcoded values) -->
        <div
          v-if="instagram?.profile.stats && Object.keys(instagram.profile.stats).length > 0"
          class="flex items-center gap-6 text-xs text-[#CED4DA]"
        >
          <div v-if="instagram.profile.stats.posts">
            <strong class="text-[#E0E1DD]">{{ instagram.profile.stats.posts }}</strong> posts
          </div>
          <div v-if="instagram.profile.stats.followers">
            <strong class="text-[#E0E1DD]">{{ instagram.profile.stats.followers }}</strong> followers
          </div>
          <div v-if="instagram.profile.stats.following">
            <strong class="text-[#E0E1DD]">{{ instagram.profile.stats.following }}</strong> following
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
      <div class="bg-[#1B263B]/60 backdrop-blur-xl border border-[#415A77]/40 rounded-3xl p-6 shadow-2xl space-y-5">
        <!-- Platform Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div class="flex items-center gap-3.5">
            <!-- Facebook Blue Icon -->
            <div class="w-11 h-11 rounded-2xl bg-[#1877F2] flex items-center justify-center text-white shadow-lg flex-shrink-0">
              <svg class="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </div>
            <div>
              <h4 class="text-base font-serif font-bold text-[#E0E1DD]">Facebook</h4>
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

        <!-- Bio & Profile Context -->
        <p class="text-xs text-[#CED4DA] leading-relaxed">
          {{ facebook?.profile.bio || 'Personal Facebook profile & digital footprint of Prince Semillano.' }}
        </p>

        <!-- Divider & Stats Row (Rendered ONLY if live stats exist, ZERO fake placeholders) -->
        <template v-if="facebook?.profile.stats && Object.keys(facebook.profile.stats).length > 0">
          <div class="border-t border-[#415A77]/20" />
          <div class="flex items-center gap-6 text-xs text-[#CED4DA]">
            <div v-if="facebook.profile.stats.friends">
              <strong class="text-[#E0E1DD]">{{ facebook.profile.stats.friends }}</strong> friends
            </div>
            <div v-if="facebook.profile.stats.followers">
              <strong class="text-[#E0E1DD]">{{ facebook.profile.stats.followers }}</strong> followers
            </div>
          </div>
        </template>

        <div v-else class="border-t border-[#415A77]/20" />

        <!-- Connect Card -->
        <div class="p-4 rounded-2xl bg-[#0D1B2A]/70 border border-[#415A77]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div class="space-y-1">
            <span class="text-xs font-bold text-[#E0E1DD]">Direct Community & Social Contact</span>
            <p class="text-[11px] text-[#CED4DA]">Reach out or connect on Facebook for general inquiries and networking.</p>
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
    </div>

    <!-- 3. View B: Professional Platforms -->
    <div v-else class="space-y-6 animate-fadeIn">
      <!-- LinkedIn Card -->
      <div class="bg-[#1B263B]/60 backdrop-blur-xl border border-[#415A77]/40 rounded-3xl p-6 shadow-2xl space-y-5">
        <!-- Platform Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div class="flex items-center gap-3.5">
            <!-- LinkedIn Blue Icon -->
            <div class="w-11 h-11 rounded-2xl bg-[#0A66C2] flex items-center justify-center text-white shadow-lg flex-shrink-0">
              <svg class="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </div>
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

        <!-- Bio & Professional Summary -->
        <p class="text-xs text-[#CED4DA] leading-relaxed">
          {{ linkedin?.profile.bio || 'Information Technology Student at St. Dominic College of Asia · Aspiring Full-Stack Developer.' }}
        </p>

        <!-- Divider -->
        <div class="border-t border-[#415A77]/20" />

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
      <div class="bg-[#1B263B]/60 backdrop-blur-xl border border-[#415A77]/40 rounded-3xl p-6 shadow-2xl space-y-5">
        <!-- Platform Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div class="flex items-center gap-3.5">
            <!-- GitHub Dark Icon -->
            <div class="w-11 h-11 rounded-2xl bg-[#0D1B2A] border border-[#778DA9]/40 flex items-center justify-center text-white shadow-lg flex-shrink-0">
              <svg class="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
            </div>
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

        <p class="text-xs text-[#CED4DA] leading-relaxed">
          All public repositories auto-synced live from GitHub without static templates.
        </p>

        <!-- Divider -->
        <div class="border-t border-[#415A77]/20" />

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
    </div>
  </div>
</template>

