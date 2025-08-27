import api from './api'

export interface User {
  id: string
  name: string
  email: string
  imagePath?: string
  status: string
  roles: Array<{
    role: {
      id: number
      role: string
    }
  }>
}

export interface CreateUserData {
  name: string
  email: string
  password: string
  imagePath?: string
  status?: string
  roleIds?: number[]
}

export interface UpdateUserData {
  name?: string
  email?: string
  imagePath?: string
  status?: string
  roleIds?: number[]
}

class UserService {
  async getUsers(): Promise<User[]> {
    const response = await api.get('/user')
    return response.data
  }

  async getUserById(id: string): Promise<User> {
    const response = await api.get(`/user/${id}`)
    return response.data
  }

  async createUser(userData: CreateUserData): Promise<{ message: string; user: User }> {
    const response = await api.post('/user', userData)
    return response.data
  }

  async updateUser(id: string, userData: UpdateUserData): Promise<{ message: string; user: User }> {
    const response = await api.put(`/user/${id}`, userData)
    return response.data
  }

  async deleteUser(id: string): Promise<{ message: string }> {
    const response = await api.delete(`/user/${id}`)
    return response.data
  }

  async getUserStats(): Promise<any> {
    const response = await api.get('/user/stats')
    return response.data
  }
}

export default new UserService()



