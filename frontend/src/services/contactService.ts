import api from './api'

export interface ContactMessage {
  name: string
  email: string
  phone?: string
  subject: string
  message: string
}

export interface ContactMessageResponse {
  message: string
  id: number
}

class ContactService {
  /**
   * Mengirim pesan melalui formulir contact
   */
  async sendMessage(data: ContactMessage): Promise<ContactMessageResponse> {
    try {
      const response = await api.post('/contact/send-email', data)
      return response.data
    } catch (error: any) {
      console.error('Error sending contact message:', error)
      throw error
    }
  }
}

export default new ContactService()


