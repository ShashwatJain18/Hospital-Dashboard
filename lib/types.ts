export interface Patient {
  id: string
  name: string
  email?: string
  phone?: string
  dateOfBirth?: Date
  gender?: string
  address?: string
  notes?: string
  allergies?: string
  lastVisit?: Date
  createdAt: Date
  updatedAt: Date
}

export interface Message {
  id: string
  content: string
  senderId: string
  recipientId?: string
  patientId?: string
  isRead: boolean
  attachments?: string
  createdAt: Date
  updatedAt: Date
  sender?: {
    id: string
    name: string
    avatar?: string
  }
  patient?: {
    id: string
    name: string
  }
}

export interface Appointment {
  id: string
  title: string
  description?: string
  patientId: string
  doctorId?: string
  startTime: string | Date
  endTime: string | Date
  status: "scheduled" | "completed" | "cancelled"
  createdAt?: string
  patient?: Patient
  doctor?: {
    id: string
    name: string
  } // added for doctor info
}

export interface SupportTicket {
  id: string
  subject: string
  description: string
  status: "open" | "pending" | "closed"
  priority: "low" | "medium" | "high" | "urgent"
  patientId?: string
  assignedTo?: string
  createdAt: Date
  updatedAt: Date
  patient?: {
    id: string
    name: string
  }
  replies?: TicketReply[]
}

export interface TicketReply {
  id: string
  content: string
  ticketId: string
  authorId: string
  createdAt: Date
}

export interface UserSettings {
  id: string
  userId: string
  theme: string
  defaultAppointmentLength: number
  notifications: boolean
  timezone: string
  createdAt: Date
  updatedAt: Date
}

export interface User {
  id: string
  email: string
  name: string
  phone?: string
  avatar?: string
  clinicAddress?: string
  createdAt: Date
  updatedAt: Date
}
