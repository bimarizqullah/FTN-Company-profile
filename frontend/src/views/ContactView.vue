<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 dark:bg-gray-900">
    <!-- Hero Section -->
    <section class="bg-white dark:bg-gray-900 text-gray-900 dark:text-white py-20 relative overflow-hidden">
      <!-- Dots Tech Hero -->
      <TechAnimations variant="dots" density="high" />
      
      <div class="max-w-4xl mx-auto px-6 text-center relative z-20">
        <h1 class="text-4xl md:text-5xl font-bold mb-6" data-aos="fade-up">
          Hubungi Kami
        </h1>
        <p class="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="200">
          Mari kita diskusikan bagaimana kami dapat membantu mewujudkan visi teknologi Anda.
        </p>
      </div>
    </section>

    <!-- Contact Form & Info -->
    <section class="py-16 relative overflow-hidden">
      <!-- Minimal Dots for Contact -->
      <TechAnimations variant="minimal" density="low" />
      
      <div class="max-w-6xl mx-auto px-6 relative z-20">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <!-- Contact Form -->
          <div data-aos="fade-right" data-aos-delay="200">
            <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">Kirim Pesan</h2>
            <form @submit.prevent="submitForm" class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nama Lengkap</label>
                  <input 
                    type="text" 
                    id="name" 
                    v-model="form.name"
                    class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-300"
                    required
                  />
                </div>
                <div>
                  <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    v-model="form.email"
                    class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-300"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label for="phone" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nomor Telepon</label>
                <input 
                  type="tel" 
                  id="phone" 
                  v-model="form.phone"
                  class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-300"
                />
              </div>
              
              <div>
                <label for="subject" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Subjek</label>
                <input 
                  type="text" 
                  id="subject" 
                  v-model="form.subject"
                  class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-300"
                  required
                />
              </div>
              
              <div>
                <label for="message" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Pesan</label>
                <textarea 
                  id="message" 
                  v-model="form.message"
                  rows="5"
                  class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-300 resize-none"
                  required
                ></textarea>
              </div>
              
              <button 
                type="submit" 
                :disabled="isSubmitting"
                class="w-full bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
              >
                <span v-if="isSubmitting" class="flex items-center justify-center">
                  <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Mengirim...
                </span>
                <span v-else>Kirim Pesan</span>
              </button>
            </form>
          </div>

          <!-- Contact Information -->
          <div data-aos="fade-left" data-aos-delay="400">
            <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">Informasi Kontak</h2>
            
            <!-- Loading State -->
            <div v-if="loading" class="text-center py-8">
              <div class="text-gray-600 dark:text-gray-300">Memuat informasi kontak...</div>
            </div>
            
            <!-- Offices and Contacts -->
            <div v-else-if="offices.length > 0" class="space-y-8">
              <div 
                v-for="(office, index) in offices" 
                :key="office.id"
                class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm hover:shadow-lg transition-all duration-300"
                :data-aos="'fade-up'"
                :data-aos-delay="(index + 1) * 100"
              >
                <!-- Office Info -->
                <div class="mb-6">
                  <div class="flex items-start group mb-4">
                    <div class="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300">
                      <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-6m-2-5a2 2 0 100-4 2 2 0 000 4zm0 5a2 2 0 100-4 2 2 0 000 4z" />
                      </svg>
                    </div>
                    <div>
                      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 transition-colors duration-300">{{ office.name }}</h3>
                    </div>
                  </div>
                  
                  <div class="flex items-start group mb-3">
                    <div class="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300">
                      <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <p class="text-gray-600 dark:text-gray-300 text-sm">{{ office.address }}</p>
                    </div>
                  </div>
                  
                  <div v-if="office.phone" class="flex items-start group mb-3">
                    <div class="flex-shrink-0 w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300">
                      <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <p class="text-gray-600 dark:text-gray-300 text-sm">{{ office.phone }}</p>
                    </div>
                  </div>
                  
                  <div v-if="office.email" class="flex items-start group mb-4">
                    <div class="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300">
                      <svg class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p class="text-gray-600 dark:text-gray-300 text-sm">{{ office.email }}</p>
                    </div>
                  </div>
                </div>
                
                <!-- Contact Persons for this Office -->
                <div v-if="getOfficeContacts(office.id).length > 0" class="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <h4 class="text-md font-semibold text-gray-900 dark:text-white mb-4">Contact Person</h4>
                  <div class="space-y-3">
                    <div 
                      v-for="contact in getOfficeContacts(office.id)" 
                      :key="contact.id"
                      class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg"
                    >
                      <div class="flex items-center justify-between mb-2">
                        <h5 class="font-semibold text-gray-900 dark:text-white">{{ contact.name }}</h5>
                        <span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">{{ contact.position }}</span>
                      </div>
                      <div class="space-y-1">
                        <div v-if="contact.email" class="flex items-center text-sm text-gray-600 dark:text-gray-300">
                          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <a :href="`mailto:${contact.email}`" class="hover:text-blue-600 transition-colors">{{ contact.email }}</a>
                        </div>
                        <div v-if="contact.whatsapp" class="flex items-center text-sm text-gray-600 dark:text-gray-300">
                          <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                          </svg>
                          <a :href="`https://wa.me/${contact.whatsapp.replace(/[^0-9]/g, '')}`" target="_blank" class="hover:text-green-600 transition-colors">{{ contact.whatsapp }}</a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Fallback if no data -->
            <div v-else class="text-center py-8">
              <div class="text-gray-600 dark:text-gray-300">Tidak ada informasi kontak yang tersedia saat ini.</div>
            </div>

            <!-- Social Media -->
            <div class="mt-8">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Ikuti Kami</h3>
              <div class="flex space-x-4">
                <a href="https://www.instagram.com/fiberteknologinusantara/" class="w-10 h-10 bg-gradient-to-br from-purple-600 via-pink-600 to-yellow-500 hover:opacity-90 rounded-xl flex items-center justify-center text-white transition-all duration-300 transform hover:scale-110 hover:shadow-lg">
                  <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none">
                    <rect x="2" y="2" width="20" height="20" rx="6" stroke="white" stroke-width="2"/>
                    <circle cx="12" cy="12" r="4" stroke="white" stroke-width="2"/>
                    <circle cx="17" cy="7" r="1.5" fill="white"/>
                  </svg>
                </a>
                <a href="https://www.youtube.com/channel/UC5xdHBUD9HILw5msvdlgL2g" class="w-10 h-10 bg-red-500 hover:bg-red-600 rounded-lg flex items-center justify-center text-white transition-all duration-300 transform hover:scale-110 hover:shadow-lg">
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.615 3.184c-1.604-.11-8.01-.11-8.01-.11s-6.407 0-8.01.11C2.61 3.29 1.5 4.41 1.5 6.06v11.88c0 1.65 1.11 2.77 2.095 2.875 1.604.11 8.01.11 8.01.11s6.407 0 8.01-.11c.985-.105 2.095-1.225 2.095-2.875V6.06c0-1.65-1.11-2.77-2.095-2.875zM10 15V7l6 4-6 4z"/>
                  </svg>
                </a>
                <a href="https://www.facebook.com/profile.php?id=100084305932832" class="w-10 h-10 bg-blue-500 hover:bg-blue-600 rounded-lg flex items-center justify-center text-white transition-all duration-300 transform hover:scale-110 hover:shadow-lg">
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Scroll to Top Button -->
    <ScrollToTop />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import companyService, { type Contact, type Office } from '@/services/companyService'
import contactService from '@/services/contactService'
import TechAnimations from '@/components/TechAnimations.vue'
import ScrollToTop from '@/components/ScrollToTop.vue'

const form = ref({
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: ''
})

const offices = ref<Office[]>([])
const contacts = ref<Contact[]>([])
const loading = ref(true)

const fetchOfficesAndContacts = async () => {
  try {
    const [officesData, contactsData] = await Promise.all([
      companyService.getOffices(),
      companyService.getContacts()
    ])
    offices.value = officesData
    contacts.value = contactsData
    console.log('Offices loaded:', offices.value.length, 'offices')
    console.log('Contacts loaded:', contacts.value.length, 'contacts')
  } catch (error) {
    console.error('Error fetching offices and contacts:', error)
  } finally {
    loading.value = false
  }
}

const getOfficeContacts = (officeId: number) => {
  return contacts.value.filter(contact => contact.officeId === officeId && contact.status === 'active')
}

const isSubmitting = ref(false)

const submitForm = async () => {
  if (isSubmitting.value) return
  
  try {
    isSubmitting.value = true
    
    // Prepare form data sesuai dengan yang diharapkan backend
    const formData = {
      name: form.value.name,
      email: form.value.email,
      phone: form.value.phone || undefined,
      subject: form.value.subject,
      message: form.value.message
    }
    
    // Kirim ke backend API menggunakan service
    const response = await contactService.sendMessage(formData)
    
    // Success notification
    alert('✅ Pesan berhasil dikirim! Kami akan segera menghubungi Anda.')
    
    // Reset form
    form.value = {
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    }
    
  } catch (error: any) {
    console.error('Error sending message:', error)
    
    // Tampilkan error message yang lebih spesifik
    let errorMessage = 'Gagal mengirim pesan. Silakan coba lagi.'
    
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message
    } else if (error.response?.status === 400) {
      errorMessage = 'Data yang dikirim tidak valid. Pastikan semua field wajib diisi.'
    } else if (error.response?.status === 500) {
      errorMessage = 'Terjadi kesalahan server. Silakan coba lagi nanti.'
    } else if (error.code === 'NETWORK_ERROR' || !error.response) {
      errorMessage = 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.'
    }
    
    alert(`❌ ${errorMessage}`)
    
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => {
  fetchOfficesAndContacts()
})
</script>
