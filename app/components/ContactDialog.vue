<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

const props = withDefaults(
  defineProps<{
    from?: 'top' | 'bottom' | 'left' | 'right'
    showCloseButton?: boolean
    buttonVariant?: 'default' | 'outline' | 'teal' | 'secondary' | 'ghost'
    buttonSize?: 'default' | 'sm' | 'lg'
    buttonText?: string
    buttonClass?: string
  }>(),
  {
    from: 'top',
    showCloseButton: true,
    buttonVariant: 'teal',
    buttonSize: 'default',
    buttonText: 'Get in touch',
    buttonClass: '',
  }
)

const name = ref('')
const email = ref('')
const message = ref('')
const isSubmitted = ref(false)
const isSubmitting = ref(false)

const handleSubmit = (e: Event) => {
  e.preventDefault()
  if (!name.value || !email.value || !message.value) return

  isSubmitting.value = true

  // Simulate network dispatch / prepare mailto fallback
  setTimeout(() => {
    isSubmitting.value = false
    isSubmitted.value = true

    // Open user's email client with pre-filled content
    if (typeof window !== 'undefined') {
      const subject = encodeURIComponent(`Portfolio Inquiry from ${name.value}`)
      const body = encodeURIComponent(
        `Name: ${name.value}\nEmail: ${email.value}\n\nMessage:\n${message.value}`
      )
      window.location.href = `mailto:prince.semillanoquilantang@gmail.com?subject=${subject}&body=${body}`
    }
  }, 400)
}

const handleReset = () => {
  name.value = ''
  email.value = ''
  message.value = ''
  isSubmitted.value = false
}
</script>

<template>
  <Dialog>
    <DialogTrigger as-child>
      <slot name="trigger">
        <Button
          :variant="buttonVariant"
          :size="buttonSize"
          :class="buttonClass"
        >
          <svg
            class="w-4 h-4 mr-2"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M22 2L11 13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
          <span>{{ buttonText }}</span>
        </Button>
      </slot>
    </DialogTrigger>

    <DialogContent
      class="sm:max-w-[460px]"
      :from="from"
      :show-close-button="showCloseButton"
    >
      <!-- Success State View -->
      <div v-if="isSubmitted" class="py-6 text-center space-y-4">
        <div
          class="w-14 h-14 mx-auto rounded-2xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-400 shadow-[0_0_20px_rgba(45,212,191,0.25)]"
        >
          <svg
            class="w-7 h-7"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <div class="space-y-1.5">
          <h3 class="text-2xl font-serif font-bold text-[#E0E1DD]">Message Ready!</h3>
          <p class="text-sm text-[#CED4DA] max-w-xs mx-auto leading-relaxed">
            Your message has been composed. If your mail client didn't launch automatically, feel free to email directly at
            <a href="mailto:princesemillano@gmail.com" class="text-teal-400 underline font-mono">prince.semillanoquilantang@gmail.com</a>.
          </p>
        </div>
        <div class="pt-4 flex justify-center gap-3">
          <Button variant="outline" size="sm" @click="handleReset">
            Send Another
          </Button>
          <DialogClose as-child>
            <Button variant="teal" size="sm">
              Done
            </Button>
          </DialogClose>
        </div>
      </div>

      <!-- Main Contact Form View -->
      <form v-else @submit="handleSubmit">
        <DialogHeader>
          <DialogTitle>Get in touch</DialogTitle>
          <DialogDescription>
            Have a project, idea, or opportunity in mind? Send a message and let's talk.
          </DialogDescription>
        </DialogHeader>

        <div class="grid gap-4.5 my-5">
          <!-- Name Input -->
          <div class="grid gap-2">
            <Label for="contact-name">Name</Label>
            <Input
              id="contact-name"
              name="name"
              v-model="name"
              placeholder="Your full name"
              required
            />
          </div>

          <!-- Email Input -->
          <div class="grid gap-2">
            <Label for="contact-email">Email</Label>
            <Input
              id="contact-email"
              name="email"
              type="email"
              v-model="email"
              placeholder="name@example.com"
              required
            />
          </div>

          <!-- Message Textarea (Slightly bigger space for message) -->
          <div class="grid gap-2">
            <Label for="contact-message">Message</Label>
            <Textarea
              id="contact-message"
              name="message"
              v-model="message"
              placeholder="Tell me about what you'd like to build..."
              :rows="4"
              required
            />
          </div>
        </div>

        <DialogFooter>
          <DialogClose as-child>
            <Button variant="outline" type="button">
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit" variant="teal" :disabled="isSubmitting">
            <span v-if="isSubmitting">Sending...</span>
            <span v-else>Send Message</span>
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>

