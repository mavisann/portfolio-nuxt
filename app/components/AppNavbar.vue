<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue'
import logoImg from '~/assets/logos/website-logo-darkmode.png'
import ContactDialog from '~/components/ContactDialog.vue'

const route = useRoute()
const mobileMenuOpen = ref(false)

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Certifications', path: '/certifications' },
  { name: 'Stack', path: '/stack' },
  { name: 'Projects', path: '/projects' },
  { name: 'Contact', path: '/contact' },
]

const tabContainerRef = ref<HTMLElement | null>(null)
const tabRefs = ref<HTMLElement[]>([])

// ForgeUI Spring Pill Position State
const indicatorStyle = ref({
  left: 0,
  width: 0,
  height: 0,
  opacity: 0,
})

const isActive = (path: string) => {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}

const updateIndicator = () => {
  nextTick(() => {
    const activeIndex = navLinks.findIndex(l => isActive(l.path))
    if (activeIndex !== -1 && tabRefs.value[activeIndex]) {
      const activeEl = tabRefs.value[activeIndex]
      indicatorStyle.value = {
        left: activeEl.offsetLeft,
        width: activeEl.offsetWidth,
        height: activeEl.offsetHeight,
        opacity: 1,
      }
    } else {
      indicatorStyle.value.opacity = 0
    }
  })
}

onMounted(() => {
  updateIndicator()
  window.addEventListener('resize', updateIndicator)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateIndicator)
})

watch(() => route.path, () => {
  updateIndicator()
})
</script>

<template>
  <header class="fixed top-4 inset-x-0 z-50 px-4 max-w-5xl mx-auto">
    <!-- Wide Floating Navbar -->
    <nav class="bg-[#0D1B2A]/85 backdrop-blur-xl border border-[#415A77]/40 rounded-full px-5 py-2 shadow-2xl shadow-black/60 flex items-center justify-between">
      
      <!-- Left: Brand Logo & Name -->
      <NuxtLink
        to="/"
        class="flex items-center gap-2.5 group pl-1 pr-2"
        aria-label="Prince Semillano Portfolio Home"
      >
        <div class="relative w-8 h-8 flex items-center justify-center overflow-hidden rounded-lg">
          <img
            :src="logoImg"
            alt="Prince Semillano Logo"
            class="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
          />
        </div>
        <span class="font-serif tracking-tight font-bold text-sm md:text-base text-[#E0E1DD] group-hover:text-white transition-colors">
          Prince Semillano
        </span>
      </NuxtLink>

      <!-- Center: Concentric ForgeUI Animated Tabs (w-fit, symmetrical padding, exact left-0 alignment) -->
      <div
        ref="tabContainerRef"
        class="hidden md:flex relative items-center gap-1 w-fit rounded-full border border-[#415A77]/40 bg-[#1B263B]/70 p-1.5 backdrop-blur-md shadow-inner"
      >
        <!-- Sliding Spring Pill (Deep Sea steel blue accent) -->
        <div
          class="absolute left-0 top-1.5 rounded-full bg-[#415A77]/60 border border-[#778DA9]/50 shadow-md shadow-black/40 pointer-events-none will-change-transform"
          :style="{
            transform: `translateX(${indicatorStyle.left}px)`,
            width: `${indicatorStyle.width}px`,
            height: `${indicatorStyle.height}px`,
            opacity: indicatorStyle.opacity,
            transition: 'transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), width 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.2s ease',
          }"
        />

        <!-- Tab Items (Crystal-clear visibility) -->
        <NuxtLink
          v-for="(link, index) in navLinks"
          :key="link.path"
          :ref="(el) => { if (el) tabRefs[index] = (el as any).$el || el }"
          :to="link.path"
          class="relative z-10 flex h-8 items-center justify-center text-center rounded-full px-4 text-sm font-medium transition-colors duration-200 select-none"
          :class="[
            isActive(link.path)
              ? 'text-white font-semibold'
              : 'text-[#CED4DA] hover:text-white'
          ]"
        >
          <span class="inline-block leading-none">{{ link.name }}</span>
        </NuxtLink>
      </div>

      <!-- Right: CTA Button & Mobile Toggle -->
      <div class="flex items-center gap-2">
        <!-- Desktop CTA Button: Get in touch Dialog -->
        <ContactDialog
          from="top"
          button-variant="outline"
          button-size="sm"
          button-text="Get in touch"
          button-class="hidden sm:inline-flex rounded-full text-xs font-semibold text-[#E0E1DD] bg-[#415A77]/70 hover:bg-[#415A77] border border-[#778DA9]/40 shadow-sm transition-all duration-200 hover:scale-[1.03]"
        />

        <!-- Mobile Menu Toggle Button -->
        <button
          type="button"
          class="md:hidden p-2 rounded-full text-[#E0E1DD] hover:text-white hover:bg-[#415A77]/40 transition-colors"
          aria-label="Toggle mobile menu"
          @click="mobileMenuOpen = !mobileMenuOpen"
        >
          <svg
            v-if="!mobileMenuOpen"
            class="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
          <svg
            v-else
            class="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </nav>

    <!-- Mobile Dropdown Menu -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2 scale-95"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 -translate-y-2 scale-95"
    >
      <div
        v-if="mobileMenuOpen"
        class="md:hidden mt-2 bg-[#0D1B2A]/95 backdrop-blur-2xl border border-[#415A77]/40 rounded-2xl p-3 shadow-2xl flex flex-col gap-1"
      >
        <NuxtLink
          v-for="link in navLinks"
          :key="link.path"
          :to="link.path"
          class="px-4 py-2.5 rounded-xl text-sm font-medium transition-colors"
          :class="[
            isActive(link.path)
              ? 'bg-[#415A77]/50 text-white font-semibold'
              : 'text-[#CED4DA] hover:text-white hover:bg-[#415A77]/20'
          ]"
          @click="mobileMenuOpen = false"
        >
          {{ link.name }}
        </NuxtLink>
        <div class="pt-2 mt-1 border-t border-[#415A77]/30">
          <ContactDialog
            from="top"
            button-variant="default"
            button-text="Get in touch"
            button-class="w-full inline-flex items-center justify-center py-2 rounded-xl text-xs font-semibold text-[#E0E1DD] bg-[#415A77] hover:bg-[#778DA9] transition-colors"
            @click="mobileMenuOpen = false"
          />
        </div>
      </div>
    </Transition>
  </header>
</template>
