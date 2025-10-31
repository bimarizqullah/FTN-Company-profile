&lt;script setup lang="ts"&gt;
import { ref, watch } from 'vue'
import { UPLOAD_BASE_URL } from '@/services/api'
import type { Gallery } from '@/services/companyService'

const props = defineProps&lt;{
  modelValue: boolean
  gallery: Gallery | null
}&gt;()

const emit = defineEmits(['update:modelValue'])

const currentImageIndex = ref(0)

// Reset current image index when gallery changes
watch(() => props.gallery, () => {
  currentImageIndex.value = 0
})

const close = () => {
  emit('update:modelValue', false)
}

const nextImage = () => {
  if (!props.gallery?.images) return
  currentImageIndex.value = (currentImageIndex.value + 1) % props.gallery.images.length
}

const previousImage = () => {
  if (!props.gallery?.images) return
  currentImageIndex.value = currentImageIndex.value === 0 
    ? props.gallery.images.length - 1 
    : currentImageIndex.value - 1
}
&lt;/script&gt;

&lt;template&gt;
  &lt;div v-if="modelValue && gallery" class="fixed inset-0 z-50 overflow-hidden"&gt;
    &lt;!-- Backdrop --&gt;
    &lt;div 
      class="absolute inset-0 bg-black/90 backdrop-blur-xl transition-opacity duration-300"
      @click="close"
    &gt;&lt;/div&gt;
    
    &lt;!-- Modal Content --&gt;
    &lt;div class="relative z-10 min-h-screen flex items-center justify-center p-4"&gt;
      &lt;div class="relative w-full max-w-6xl"&gt;
        &lt;!-- Close Button --&gt;
        &lt;button 
          @click="close"
          class="absolute -top-12 right-0 p-2 text-white/80 hover:text-white transition-colors"
        &gt;
          &lt;svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"&gt;
            &lt;path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /&gt;
          &lt;/svg&gt;
        &lt;/button&gt;

        &lt;!-- Image Container --&gt;
        &lt;div class="relative aspect-video bg-gray-900 rounded-lg overflow-hidden"&gt;
          &lt;img 
            v-if="gallery.images && gallery.images.length > 0"
            :src="`${UPLOAD_BASE_URL}${gallery.images[currentImageIndex].imagePath}`"
            :alt="gallery.description"
            class="w-full h-full object-contain"
          &gt;
          &lt;img 
            v-else
            :src="`${UPLOAD_BASE_URL}${gallery.imagePath}`"
            :alt="gallery.description"
            class="w-full h-full object-contain"
          &gt;

          &lt;!-- Navigation Arrows --&gt;
          &lt;div v-if="gallery.images && gallery.images.length > 1" class="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4"&gt;
            &lt;button 
              @click.stop="previousImage"
              class="p-2 bg-black/50 hover:bg-black/75 text-white rounded-full backdrop-blur-sm transition-all transform hover:scale-110"
            &gt;
              &lt;svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"&gt;
                &lt;path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /&gt;
              &lt;/svg&gt;
            &lt;/button&gt;
            &lt;button 
              @click.stop="nextImage"
              class="p-2 bg-black/50 hover:bg-black/75 text-white rounded-full backdrop-blur-sm transition-all transform hover:scale-110"
            &gt;
              &lt;svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"&gt;
                &lt;path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /&gt;
              &lt;/svg&gt;
            &lt;/button&gt;
          &lt;/div&gt;
        &lt;/div&gt;

        &lt;!-- Image Info --&gt;
        &lt;div class="mt-4 text-white"&gt;
          &lt;h3 class="text-xl font-semibold mb-2"&gt;{{ gallery.description }}&lt;/h3&gt;
          &lt;div v-if="gallery.images && gallery.images.length > 1" class="text-sm text-white/70"&gt;
            Gambar {{ currentImageIndex + 1 }} dari {{ gallery.images.length }}
          &lt;/div&gt;
        &lt;/div&gt;

        &lt;!-- Thumbnails --&gt;
        &lt;div v-if="gallery.images && gallery.images.length > 1" class="mt-4 flex gap-2 overflow-x-auto pb-2"&gt;
          &lt;button 
            v-for="(image, index) in gallery.images" 
            :key="image.id"
            @click="currentImageIndex = index"
            class="flex-shrink-0 relative aspect-video w-24 rounded-lg overflow-hidden"
            :class="{ 'ring-2 ring-white': currentImageIndex === index }"
          &gt;
            &lt;img 
              :src="`${UPLOAD_BASE_URL}${image.imagePath}`"
              :alt="gallery.description"
              class="w-full h-full object-cover"
            &gt;
          &lt;/button&gt;
        &lt;/div&gt;
      &lt;/div&gt;
    &lt;/div&gt;
  &lt;/div&gt;
&lt;/template&gt;