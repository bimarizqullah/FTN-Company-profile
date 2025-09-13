import api from './api'

export interface Slider {
  id: number
  title: string
  subtitle?: string
  tagline?: string
  imagePath: string
  status: string
  createdAt: string
  updatedAt: string
  createdBy: number
}

export interface Service {
  id: number
  name: string
  description: string
  imagePath?: string
  createdAt: string
  updatedAt: string
  createdBy: number
}

export interface Management {
  id: number
  name: string
  position: string
  imagePath?: string
  status: string
  createdAt: string
  updatedAt: string
  createdBy: number
  user?: {
    id: number
    name: string
    email: string
    imagePath?: string
    status: string
  }
}

export interface Gallery {
  id: number
  title?: string
  description?: string
  imagePath: string
  category?: string
  status: string
  createdAt: string
  updatedAt: string
  createdBy: number
}

export interface Project {
  id: number
  name: string
  location: string
  description: string
  imagePath: string
  startDate?: string
  endDate?: string
  status: string
  createdAt: string
  updatedAt: string
  createdBy: number
}

export interface Contact {
  id: number
  officeId: number
  name: string
  position: string
  email?: string
  whatsapp?: string
  status: string
  createdAt: string
  updatedAt: string
  createdBy: number
  office?: Office
}

export interface Office {
  id: number
  name: string
  address: string
  phone?: string
  email?: string
  status: string
  createdAt: string
  updatedAt: string
  createdBy: number
  contacts?: Contact[]
}

class CompanyService {
  // Sliders untuk homepage
  async getSliders(): Promise<Slider[]> {
    const response = await api.get('/public/sliders')
    return response.data
  }

  // Services
  async getServices(): Promise<Service[]> {
    const response = await api.get('/public/services')
    return response.data
  }

  async getServiceById(id: string): Promise<Service> {
    const response = await api.get(`/services/${id}`)
    return response.data
  }

  // Management
  async getManagement(): Promise<Management[]> {
    const response = await api.get('/public/management')
    return response.data
  }

  async getManagementById(id: string): Promise<Management> {
    const response = await api.get(`/management/${id}`)
    return response.data.data || response.data
  }

  // Gallery
  async getGallery(): Promise<Gallery[]> {
    const response = await api.get('/public/gallery')
    return response.data
  }

  async getGalleryById(id: string): Promise<Gallery> {
    const response = await api.get(`/gallery/${id}`)
    return response.data
  }

  // Projects
  async getProjects(): Promise<Project[]> {
    const response = await api.get('/public/projects')
    return response.data
  }

  async getProjectById(id: string): Promise<Project> {
    const response = await api.get(`/project/${id}`)
    return response.data
  }

  // Contact
  async submitContact(contactData: Omit<Contact, 'id' | 'status' | 'createdAt'>): Promise<{ message: string }> {
    const response = await api.post('/contact', contactData)
    return response.data
  }

  // Office
  async getOffices(): Promise<Office[]> {
    const response = await api.get('/office')
    return response.data.data || response.data
  }

  async getOfficeById(id: number): Promise<Office> {
    const response = await api.get(`/office/${id}`)
    return response.data.data || response.data
  }

  async getContacts(): Promise<Contact[]> {
    const response = await api.get('/contact')
    return response.data.data || response.data
  }

  async getContactById(id: number): Promise<Contact> {
    const response = await api.get(`/contact/${id}`)
    return response.data.data || response.data
  }

  async getProjects(): Promise<Project[]> {
    const response = await api.get('/project')
    return response.data.data || response.data
  }

  async getProjectById(id: number): Promise<Project> {
    const response = await api.get(`/project/${id}`)
    return response.data.data || response.data
  }

  // Dashboard stats (untuk admin)
  async getDashboardStats(): Promise<any> {
    const response = await api.get('/dashboard')
    return response.data
  }

  async getSummaryStats(): Promise<any> {
    const response = await api.get('/summary/stats')
    return response.data
  }
}

export default new CompanyService()
