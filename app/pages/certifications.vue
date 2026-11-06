<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import type { Certification } from '~~/shared/types'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

// Badge images
import excelBadge from '~/components/images/badges/ms-office-excel-associate.png'
import wordBadge from '~/components/images/badges/ms-office-word-associate.png'
import cBadge from '~/components/images/badges/c-essentials-1.png'
import pythonBadge from '~/components/images/badges/python-essentials-1.png'

// Certificate vector graphics
import excelCert from '~/components/images/certificates/excel-cert.svg'
import wordCert from '~/components/images/certificates/word-cert.svg'

// Page-level SEO
usePortfolioSeo({
  title: 'Certifications — Prince Semillano',
  description:
    'Verified professional certifications and technical course credentials acquired by Prince Semillano, including Microsoft Office Specialist (MOS) and Cisco Networking Academy achievements.',
})

type CertCategory = 'Professional Certification' | 'Course Certificates'

// Reactive Active Tab (default: 'Professional Certification')
const activeTab = ref<CertCategory>('Professional Certification')

// Static Array of Verified Certifications with Assigned Badges & Documents
const certifications = ref<Certification[]>([
  {
    id: 1,
    category: 'Professional Certification',
    title: 'Microsoft Office Specialist',
    subtitle:
      'Microsoft Excel Associate',
    issuer: 'Microsoft',
    date: 'May 2025',
    imageUrl: excelBadge,
    certificateUrl: excelCert,
    verifyLink: 'https://www.credly.com/badges/f5ace52e-59d0-4e44-8358-79a58c53c8e0',
  },
  {
    id: 2,
    category: 'Professional Certification',
    title: 'Microsoft Office Specialist',
    subtitle:
      'Microsoft Word Associate',
    issuer: 'Microsoft',
    date: 'Feb 2025',
    imageUrl: wordBadge,
    certificateUrl: wordCert,
    verifyLink: 'https://www.credly.com/badges/7cacd046-f6ce-42cf-93a8-21ab58ac84f5',
  },
  {
    id: 3,
    category: 'Course Certificates',
    title: 'Cisco Networking Academy',
    subtitle:
      'C Essentials 1',
    issuer: 'Cisco Networking Academy',
    date: 'August 2025',
    imageUrl: cBadge,
    verifyLink: 'https://www.credly.com/badges/36378591-b1cc-4033-975c-40afe5232739',
  },
  {
    id: 4,
    category: 'Course Certificates',
    title: 'Cisco Networking Academy',
    subtitle:
      'Python Essentials 1',
    issuer: 'Cisco Networking Academy',
    date: 'March 2026',
    imageUrl: pythonBadge,
    verifyLink: 'https://www.credly.com/badges/7d1f2939-c4d9-4ff4-af75-0e91ef26f0c9',
  },
])

// Counts for Category Badges
const professionalCount = computed(
  () => certifications.value.filter(c => c.category === 'Professional Certification').length
)
const courseCount = computed(
  () => certifications.value.filter(c => c.category === 'Course Certificates').length
)

// Independent category certification arrays for seamless tab transitions
const professionalCerts = computed(() =>
  certifications.value.filter(cert => cert.category === 'Professional Certification')
)
const courseCerts = computed(() =>
  certifications.value.filter(cert => cert.category === 'Course Certificates')
)

// Dynamic Responsive Grid Layout: automatically auto-adjusts as certifications
// are added while guaranteeing cards stay perfectly centered on the page
const getGridClass = (count: number) => {
  if (count === 1) return 'grid-cols-1 max-w-md mx-auto'
  if (count === 2) return 'grid-cols-1 md:grid-cols-2 max-w-3xl mx-auto'
  if (count === 3) return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto'
  return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 max-w-7xl mx-auto'
}

const professionalGridClass = computed(() => getGridClass(professionalCerts.value.length))
const courseGridClass = computed(() => getGridClass(courseCerts.value.length))

// Modal State for Certificate Document Preview
const selectedCert = ref<Certification | null>(null)

const openModal = (cert: Certification) => {
  if (cert.certificateUrl) {
    selectedCert.value = cert
  }
}

const closeModal = () => {
  selectedCert.value = null
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && selectedCert.value) {
    closeModal()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  if (import.meta.client) {
    document.body.style.overflow = ''
  }
})

// Prevent background scrolling when modal is active
watch(selectedCert, (val) => {
  if (import.meta.client) {
    if (val) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }
})
</script>

<template>
  <div class="space-y-10 md:space-y-12 text-[#E0E1DD]">
    <!-- 1. Centered Page Header -->
    <header class="space-y-3 text-center max-w-2xl mx-auto">
      <h1 class="text-4xl sm:text-5xl font-serif font-black tracking-tight text-[#E0E1DD]">
        Certifications
      </h1>
      <span class="text-xs font-bold uppercase tracking-widest text-[#778DA9]">
        Academic & Professional Credentials
      </span>
      <p class="text-sm sm:text-base text-[#CED4DA] font-normal leading-relaxed">
        Verified industry certifications and technical course credentials highlighting verified expertise and continuous development.
      </p>
    </header>

    <!-- 2. Centered Segmented Control (Tabs with Smooth Transitions) -->
    <Tabs v-model="activeTab" default-value="Professional Certification" class="w-full space-y-8">
      <div class="flex justify-center">
        <TabsList>
          <!-- Professional Certification Trigger -->
          <TabsTrigger value="Professional Certification" class="flex items-center gap-2 py-2.5">
            <span>Professional Certification</span>
            <span
              class="inline-flex items-center justify-center px-1.5 py-0.5 rounded-full text-[10px] font-mono transition-colors"
              :class="activeTab === 'Professional Certification' ? 'bg-[#0D1B2A]/70 text-white' : 'bg-[#0D1B2A]/40 text-[#778DA9]'"
            >
              {{ professionalCount }}
            </span>
          </TabsTrigger>

          <!-- Course Certificates Trigger -->
          <TabsTrigger value="Course Certificates" class="flex items-center gap-2 py-2.5">
            <span>Course Certificates</span>
            <span
              class="inline-flex items-center justify-center px-1.5 py-0.5 rounded-full text-[10px] font-mono transition-colors"
              :class="activeTab === 'Course Certificates' ? 'bg-[#0D1B2A]/70 text-white' : 'bg-[#0D1B2A]/40 text-[#778DA9]'"
            >
              {{ courseCount }}
            </span>
          </TabsTrigger>
        </TabsList>
      </div>

      <!-- 3. Professional Certification Tab Content -->
      <TabsContent value="Professional Certification" class="mt-0">
        <div
          v-if="professionalCerts.length > 0"
          class="grid gap-6 justify-center w-full"
          :class="professionalGridClass"
        >
          <CertificationCard
            v-for="cert in professionalCerts"
            :key="cert.id"
            :certificate="cert"
            @open-certificate="openModal"
          />
        </div>
        <!-- Empty State Fallback -->
        <div
          v-else
          class="p-12 rounded-3xl bg-[#1B263B]/60 backdrop-blur-xl border border-dashed border-[#415A77]/40 text-center space-y-3 max-w-md mx-auto"
        >
          <div class="w-12 h-12 rounded-2xl bg-[#0D1B2A] border border-[#415A77]/40 flex items-center justify-center mx-auto text-[#778DA9]">
            <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <h3 class="text-base font-serif font-bold text-[#E0E1DD]">No Certifications Found</h3>
          <p class="text-xs text-[#CED4DA]">There are currently no items listed under this category.</p>
        </div>
      </TabsContent>

      <!-- 4. Course Certificates Tab Content -->
      <TabsContent value="Course Certificates" class="mt-0">
        <div
          v-if="courseCerts.length > 0"
          class="grid gap-6 justify-center w-full"
          :class="courseGridClass"
        >
          <CertificationCard
            v-for="cert in courseCerts"
            :key="cert.id"
            :certificate="cert"
            @open-certificate="openModal"
          />
        </div>
        <!-- Empty State Fallback -->
        <div
          v-else
          class="p-12 rounded-3xl bg-[#1B263B]/60 backdrop-blur-xl border border-dashed border-[#415A77]/40 text-center space-y-3 max-w-md mx-auto"
        >
          <div class="w-12 h-12 rounded-2xl bg-[#0D1B2A] border border-[#415A77]/40 flex items-center justify-center mx-auto text-[#778DA9]">
            <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <h3 class="text-base font-serif font-bold text-[#E0E1DD]">No Certifications Found</h3>
          <p class="text-xs text-[#CED4DA]">There are currently no items listed under this category.</p>
        </div>
      </TabsContent>
    </Tabs>

    <!-- 4. Certificate Pop-up Modal (Blurs the Background) -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="selectedCert"
          class="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-10 backdrop-blur-xl bg-black/60 overflow-y-auto"
          @click.self="closeModal"
        >
          <!-- Modal Card Container -->
          <div
            class="relative w-full max-w-4xl max-h-[92vh] flex flex-col items-center bg-[#1B263B]/95 backdrop-blur-2xl border border-[#415A77]/60 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4"
            role="dialog"
            aria-modal="true"
            :aria-label="selectedCert.title + ' Certificate Preview'"
          >
            <!-- Header bar: Title, Issuer, Close Button -->
            <div class="w-full flex items-center justify-between gap-4 border-b border-[#415A77]/30 pb-3">
              <div class="space-y-0.5 min-w-0 flex-1">
                <span class="text-[10px] font-bold uppercase tracking-widest text-[#778DA9]">
                  Official Certificate Verification
                </span>
                <h3 class="text-base sm:text-lg font-serif font-bold text-[#E0E1DD] truncate">
                  {{ selectedCert.title }}
                </h3>
                <p class="text-xs text-[#CED4DA] font-mono truncate">
                  {{ selectedCert.issuer }} &bull; {{ selectedCert.date }}
                </p>
              </div>

              <!-- Close Button -->
              <button
                type="button"
                class="w-9 h-9 rounded-full bg-[#0D1B2A]/80 border border-[#415A77]/50 hover:bg-[#415A77] text-[#CED4DA] hover:text-white flex items-center justify-center transition-all duration-200 shadow-md flex-shrink-0 cursor-pointer"
                aria-label="Close Certificate Preview"
                @click="closeModal"
              >
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M18 6L6 18M6 6l12 12" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </button>
            </div>

            <!-- Certificate Picture Frame -->
            <div
              class="relative w-full max-h-[70vh] overflow-hidden rounded-2xl bg-[#0D1B2A] border border-[#415A77]/40 flex items-center justify-center p-2 sm:p-3 shadow-inner"
            >
              <img
                :src="selectedCert.certificateUrl"
                :alt="selectedCert.title"
                class="max-h-[66vh] w-auto max-w-full object-contain rounded-xl shadow-2xl"
              />
            </div>

            <!-- Bottom Actions -->
            <div class="w-full flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
              <span class="text-xs text-[#778DA9] font-mono text-center sm:text-left">
                Press <kbd class="px-1.5 py-0.5 rounded bg-[#0D1B2A] border border-[#415A77]/40 text-[#CED4DA] text-[10px]">ESC</kbd> or click outside to dismiss
              </span>

              <a
                :href="selectedCert.verifyLink"
                target="_blank"
                rel="noopener noreferrer"
                class="btn btn-sm w-full sm:w-auto rounded-xl bg-[#415A77] hover:bg-[#778DA9] text-white border-0 shadow-md flex items-center justify-center gap-1.5"
              >
                <span>Verify Credential</span>
                <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M7 17L17 7M17 7H7M17 7V17" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
