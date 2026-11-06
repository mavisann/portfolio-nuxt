<script setup lang="ts">
import { ref } from 'vue'
import type { TechCategory } from '~~/shared/types'
import TechCard from '~/components/TechCard.vue'
import { Effects } from '@/components/ui/effects'

// 1. Programming Languages / Frontend Local Image Assets
import htmlImg from '~/assets/images/techstack/programming-language-images/html.png'
import cssImg from '~/assets/images/techstack/programming-language-images/css.svg'
import jsImg from '~/assets/images/techstack/programming-language-images/js.png'
import javaImg from '~/assets/images/techstack/programming-language-images/java.png'
import cLangImg from '~/assets/images/techstack/programming-language-images/c-lang.png'
import pythonImg from '~/assets/images/techstack/programming-language-images/python.png'


// 2. Frameworks Local Image Assets (Newly Uploaded)
import vueImg from '~/assets/images/techstack/frameworks/vue.js.png'
import nuxtImg from '~/assets/images/techstack/frameworks/nuxt.js.png'
import tailwindcssImg from '~/assets/images/techstack/frameworks/tailwindcss.png'
import nodeImg from '~/assets/images/techstack/frameworks/node.js.png'
import typescriptImg from '~/assets/images/techstack/frameworks/typescript.png'

// 3. Database Local Image Assets
import mysqlImg from '~/assets/images/techstack/database-images/mysql.png'
import postgreImg from '~/assets/images/techstack/database-images/postgre.png'
import sqliteImg from '~/assets/images/techstack/database-images/sqlite.png'
import mongodbImg from '~/assets/images/techstack/database-images/mongodb.png'
import ssmsImg from '~/assets/images/techstack/database-images/ssms.png'
import apexOracleImg from '~/assets/images/techstack/database-images/apex-oracle.png'

// 4. Development Tools Local Image Assets
import gitImg from '~/assets/images/techstack/dev-tools-images/git.png'
import githubDarkImg from '~/assets/images/techstack/dev-tools-images/github-dark.png'
import visualStudioImg from '~/assets/images/techstack/dev-tools-images/visual-studio.png'
import androidStudioImg from '~/assets/images/techstack/dev-tools-images/android-studio.png'
import antigravityStudioImg from '~/assets/images/techstack/dev-tools-images/antigravity.png'

// Page SEO Meta
useHead({
  title: 'Tech Stack | Prince Semillano',
  meta: [
    {
      name: 'description',
      content: 'A comprehensive collection of programming languages, frameworks, databases, and development tools used by Prince Semillano.',
    },
  ],
})

// Tech Stacks
const techCategories = ref<TechCategory[]>([
  {
    categoryName: 'Frontend',
    items: [
      { title: 'HTML', fullName: 'HTML', imageSrc: htmlImg },
      { title: 'CSS', fullName: 'CSS', imageSrc: cssImg },
      { title: 'JavaScript', fullName: 'JavaScript', imageSrc: jsImg },
    ],
  },
  {
    categoryName: 'Frameworks',
    items: [
      { title: 'Vue.js', fullName: 'Vue.js', imageSrc: vueImg },
      { title: 'Nuxt.js', fullName: 'Nuxt.js', imageSrc: nuxtImg },
      { title: 'Tailwind CSS', fullName: 'Tailwind CSS', imageSrc: tailwindcssImg },
      { title: 'Node.js', fullName: 'Node.js', imageSrc: nodeImg },
      { title: 'TypeScript', fullName: 'TypeScript', imageSrc: typescriptImg },
    ],
  },
  {
    categoryName: 'Backend',
    items: [
      { title: 'Java', fullName: 'Java', imageSrc: javaImg },
      { title: 'Python', fullName: 'Python', imageSrc: pythonImg },
      { title: 'C', fullName: 'C', imageSrc: cLangImg },
    ],
  },
  {
    categoryName: 'Database',
    items: [
      { title: 'MySQL', fullName: 'MySQL', imageSrc: mysqlImg },
      { title: 'PostgreSQL', fullName: 'PostgreSQL', imageSrc: postgreImg },
      { title: 'SQLite', fullName: 'SQLite', imageSrc: sqliteImg },
      { title: 'MongoDB', fullName: 'MongoDB', imageSrc: mongodbImg },
      { title: 'SQL Server', fullName: 'SQL Server', imageSrc: ssmsImg },
      { title: 'Oracle APEX', fullName: 'Oracle APEX', imageSrc: apexOracleImg },
    ],
  },
  {
    categoryName: 'Development',
    items: [
      { title: 'Git', fullName: 'Git', imageSrc: gitImg },
      { title: 'GitHub', fullName: 'GitHub', imageSrc: githubDarkImg },
      { title: 'Visual Studio', fullName: 'Visual Studio', imageSrc: visualStudioImg },
      { title: 'Android Studio', fullName: 'Android Studio', imageSrc: androidStudioImg },
      { title: 'Antigravity', fullName: 'Antigravity', imageSrc: antigravityStudioImg },
    ],
  },
])

// Single-open accordion behavior:
// Starts closed (null), only opens when clicked, and closes any other open category
const openCategory = ref<string | null>(null)

function toggleCategory(name: string) {
  // If clicked category is already open, collapse it; otherwise open it and close others
  openCategory.value = openCategory.value === name ? null : name
}
</script>

<template>
  <div class="space-y-10 md:space-y-12 text-[#E0E1DD]">
    <!-- 1. Header Section -->
    <header class="space-y-3 text-center max-w-2xl mx-auto">
      <h1 class="text-4xl sm:text-5xl font-serif font-black tracking-tight text-[#E0E1DD]">
        Tech Stack
      </h1>
      <span class="text-xs font-bold uppercase tracking-widest text-[#778DA9]">
        Tech Arsenal & Skills
      </span>
      <p class="text-sm sm:text-base text-[#CED4DA] leading-relaxed">
        A curated collection of languages, frameworks, databases, and development environments I use to design and build scalable, full-stack software solutions.
      </p>
    </header>

    <!-- 2. Single-Open Accordion Container (Exact UI Preserved) -->
    <section class="space-y-5">
      <div
        v-for="category in techCategories"
        :key="category.categoryName"
        class="bg-[#1B263B]/60 backdrop-blur-xl border border-[#415A77]/40 rounded-2xl shadow-xl transition-all duration-300 overflow-hidden"
      >
        <!-- Accordion Header Button -->
        <button
          type="button"
          class="w-full flex items-center justify-between p-5 sm:p-6 text-left cursor-pointer transition-colors duration-200 hover:bg-[#415A77]/10"
          @click="toggleCategory(category.categoryName)"
        >
          <div class="flex items-center gap-3 sm:gap-4">
            <h2 class="text-xl sm:text-2xl font-serif font-bold text-[#E0E1DD] tracking-wide">
              {{ category.categoryName }}
            </h2>
            <span class="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-[#0D1B2A]/70 border border-[#415A77]/40 text-[#778DA9]">
              {{ category.items.length }} {{ category.items.length === 1 ? 'tech' : 'techs' }}
            </span>
          </div>

          <!-- Chevron Indicator with 180deg Rotation on Open -->
          <div
            class="w-8 h-8 rounded-full bg-[#0D1B2A]/60 border border-[#415A77]/30 flex items-center justify-center text-[#778DA9] transition-transform duration-300 flex-shrink-0"
            :class="openCategory === category.categoryName ? 'rotate-180 text-[#E0E1DD]' : 'rotate-0'"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </div>
        </button>

        <!-- Accordion Collapsible Content (Fluid CSS Grid Smooth Transition) -->
        <div
          class="grid transition-[grid-template-rows,opacity] duration-300 ease-out"
          :class="openCategory === category.categoryName ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0 pointer-events-none'"
        >
          <div class="overflow-hidden min-h-0">
            <div class="px-5 pb-6 sm:px-6 sm:pb-7 pt-2 border-t border-[#415A77]/25">
              <!-- Symmetrically Centered Cards Grid with Staggered Scroll/Reveal Effects -->
              <Effects
                :key="openCategory ?? 'closed'"
                :hold-delay="70"
                class="flex flex-wrap justify-center gap-4 sm:gap-6 pt-3"
              >
                <TechCard
                  v-for="item in category.items"
                  :key="item.title"
                  :title="item.title"
                  :full-name="item.fullName"
                  :image-src="item.imageSrc"
                />
              </Effects>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
