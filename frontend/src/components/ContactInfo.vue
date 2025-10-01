<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import companyService, { type Office, type Contact } from '@/services/companyService'

const loading = ref(true)
const offices = ref<Office[]>([])
const contacts = ref<Contact[]>([])

onMounted(async () => {
  try {
    const [officesRes, contactsRes] = await Promise.all([
      companyService.getOffices(),
      companyService.getContacts()
    ])
    const allOffices = Array.isArray(officesRes) ? officesRes : []
    const allContacts = Array.isArray(contactsRes) ? contactsRes : []
    offices.value = allOffices.filter(o => o.status === 'active')
    contacts.value = allContacts.filter(c => c.status === 'active')
  } finally {
    loading.value = false
  }
})

function contactsByOffice(officeId: number): Contact[] {
  return contacts.value.filter(c => c.officeId === officeId)
}

const hasData = computed(() => offices.value.length > 0 || contacts.value.length > 0)
</script>

<template>
  <div>
    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-5">Kontak</h3>
    <div v-if="loading" class="text-gray-600 dark:text-gray-300">Memuat...</div>
    <div v-else>
      <div v-if="!hasData" class="text-sm text-gray-500 dark:text-gray-400">Data kontak belum tersedia.</div>
      <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div v-for="(o, idx) in offices" :key="o.id" class="space-y-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 md:p-6 shadow-sm">
          <p class="text-sm font-semibold text-gray-900 dark:text-white px-1 flex items-center gap-3">
            <span class="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-blue-600 text-white text-xs">{{ idx + 1 }}</span>
            <span class="leading-relaxed">{{ o.name }}</span>
          </p>
          <div class="grid md:grid-cols-2 gap-6">
            <!-- Office details left -->
            <div class="space-y-3">
              <div class="flex items-start gap-4" v-if="o.address">
                <div class="flex-shrink-0 w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg class="w-3.5 h-3.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1 1 0 01-1.414 0l-4.243-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div class="pl-1">
                  <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{{ o.address }}</p>
                </div>
              </div>
              <div class="flex items-start gap-4" v-if="o.phone">
                <div class="flex-shrink-0 w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg class="w-3.5 h-3.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div class="pl-1">
                  <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{{ o.phone }}</p>
                </div>
              </div>
              <div class="flex items-start gap-4" v-if="o.email">
                <div class="flex-shrink-0 w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg class="w-3.5 h-3.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div class="pl-1">
                  <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed break-words">{{ o.email }}</p>
                </div>
              </div>
            </div>
            <!-- Contacts right -->
            <div class="space-y-3">
              <div v-for="c in contactsByOffice(o.id)" :key="c.id" class="flex items-start gap-4">
                <div class="flex-shrink-0 w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg class="w-3.5 h-3.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div class="pl-1">
                  <p class="text-sm font-medium text-gray-900 dark:text-white leading-relaxed">{{ c.name }} — {{ c.position }}</p>
                  <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed break-words" v-if="c.email">{{ c.email }}</p>
                  <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed" v-if="c.whatsapp">WA: {{ c.whatsapp }}</p>
                </div>
              </div>
            </div>
          </div>

          <hr class="border-gray-200 dark:border-gray-700 mt-4" />
        </div>
      </div>
    </div>
  </div>
</template>


