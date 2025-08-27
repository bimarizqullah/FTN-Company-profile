import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import authService, { type User } from '@/services/authService'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const loading = ref(false)

  const isAuthenticated = computed(() => !!token.value)
  const hasRole = (role: string) => user.value?.roles.includes(role) || false
  const hasAnyRole = (roles: string[]) => user.value?.roles.some(role => roles.includes(role)) || false

  const login = async (email: string, password: string) => {
    loading.value = true
    try {
      const response = await authService.login({ email, password })
      token.value = response.token
      user.value = response.data
      authService.setToken(response.token)
      authService.setUser(response.data)
      return response
    } catch (error) {
      throw error
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    try {
      await authService.logout()
    } finally {
      token.value = null
      user.value = null
    }
  }

  const checkAuth = async () => {
    const storedToken = authService.getToken()
    const storedUser = authService.getUser()
    
    if (storedToken && storedUser) {
      token.value = storedToken
      user.value = storedUser
      return true
    }
    return false
  }

  return {
    user,
    token,
    loading,
    isAuthenticated,
    hasRole,
    hasAnyRole,
    login,
    logout,
    checkAuth
  }
})
