<script setup lang="ts">
import { ref, watch } from 'vue'
import { UPLOAD_BASE_URL } from '@/services/api'
import type { Gallery } from '@/services/companyService'

const props = defineProps<{
  modelValue: boolean
  gallery: Gallery | null
}>()

const emit = defineEmits(['update:modelValue'])

const currentImageIndex = ref(0)

// Reset current image index when gallery changes
watch(() => props.gallery, () => {
  currentImageIndex.value = 0
})

const close = () => emit('update:modelValue', false)

const nextImage = () => {
  if (!props.gallery?.images) return
  currentImageIndex.value = (currentImageIndex.value + 1) % props.gallery.images.length
}

const previousImage = () => {
  if (!props.gallery?.images) return
  currentImageIndex.value =
    currentImageIndex.value === 0
      ? props.gallery.images.length - 1
      : currentImageIndex.value - 1
}
</script>

<template>
  <div v-if="modelValue && gallery" class="fixed inset-0 z-50 overflow-hidden">
    <!-- Backdrop -->
    <div class="absolute inset-0 bg-black/90 backdrop-blur-xl transition-opacity duration-300" @click="close"></div>

    <!-- Modal Content -->
    <div class="relative z-10 min-h-screen flex items-center justify-center p-4">
      <div class="relative w-full max-w-6xl">
        <!-- Close Button -->
        <button
          @click="close"
          class="absolute -top-12 right-0 p-2 text-white/80 hover:text-white transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <!-- Image Container -->
        <div class="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
          <img
            v-if="gallery.images && gallery.images.length > 0"
            :src="`${UPLOAD_BASE_URL}${gallery.images[currentImageIndex].imagePath}`"
            :alt="gallery.description"
            class="w-full h-full object-contain"
          />
          <img
            v-else
            :src="`${UPLOAD_BASE_URL}${gallery.images}`"
            :alt="gallery.description"
            class="w-full h-full object-contain"
          />

          <!-- Navigation Arrows -->
          <div
            v-if="gallery.images && gallery.images.length > 1"
            class="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4"
          >
            <button
              @click.stop="previousImage"
              class="p-2 bg-black/50 hover:bg-black/75 text-white rounded-full backdrop-blur-sm transition-all transform hover:scale-110"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              @click.stop="nextImage"
              class="p-2 bg-black/50 hover:bg-black/75 text-white rounded-full backdrop-blur-sm transition-all transform hover:scale-110"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Image Info -->
        <div class="mt-4 text-white">
          <h3 class="text-xl font-semibold mb-2">{{ gallery.description }}</h3>
          <div v-if="gallery.images && gallery.images.length > 1" class="text-sm text-white/70">
            Gambar {{ currentImageIndex + 1 }} dari {{ gallery.images.length }}
          </div>
        </div>

        <!-- Thumbnails -->
        <div
          v-if="gallery.images && gallery.images.length > 1"
          class="mt-4 flex gap-2 overflow-x-auto pb-2"
        >
          <button
            v-for="(image, index) in gallery.images"
            :key="image.id"
            @click="currentImageIndex = index"
            class="flex-shrink-0 relative aspect-video w-24 rounded-lg overflow-hidden"
            :class="{ 'ring-2 ring-white': currentImageIndex === index }"
          >
            <img
              :src="`${UPLOAD_BASE_URL}${image.imagePath}`"
              :alt="gallery.description"
              class="w-full h-full object-cover"
            />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
