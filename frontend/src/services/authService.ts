import api from './api'

export interface LoginData {
  email: string
  password: string
}

export interface User {
  id: string
  name: string
  email: string
  roles: string[]
  imagePath?: string
  status: string
}

export interface LoginResponse {
  success: boolean
  token: string
  data: User
}

class AuthService {
  async login(credentials: LoginData): Promise<LoginResponse> {
    const response = await api.post('/auth/login', credentials)
    return response.data
  }

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout')
    } catch (error) {
      console.error('Error during logout:', error)
    } finally {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
  }

  async getProfile(): Promise<User> {
    const response = await api.get('/user/me')
    return response.data.data
  }

  async checkAuth(): Promise<boolean> {
    try {
      const response = await api.get('/check-auth')
      return response.data.authenticated
    } catch (error) {
      return false
    }
  }

  setToken(token: string): void {
    localStorage.setItem('token', token)
  }

  getToken(): string | null {
    return localStorage.getItem('token')
  }

  setUser(user: User): void {
    localStorage.setItem('user', JSON.stringify(user))
  }

  getUser(): User | null {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
  }

  isAuthenticated(): boolean {
    return !!this.getToken()
  }

  hasRole(role: string): boolean {
    const user = this.getUser()
    return user ? user.roles.includes(role) : false
  }

  hasAnyRole(roles: string[]): boolean {
    const user = this.getUser()
    return user ? roles.some(role => user.roles.includes(role)) : false
  }
}

export default new AuthService()



