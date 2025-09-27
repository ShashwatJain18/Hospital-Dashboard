// Seed script to populate DoctorHub with sample data for development and testing
// This script uses localStorage to simulate database seeding without requiring a database connection

import type { Patient, Message, Appointment, SupportTicket } from "../lib/types"

// Sample patients data
const samplePatients: Patient[] = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@email.com",
    phone: "+1 (555) 123-4567",
    dateOfBirth: new Date("1985-03-15"),
    gender: "male",
    address: "123 Main St, New York, NY 10001",
    emergencyContact: "Jane Smith - +1 (555) 987-6543",
    medicalHistory: "Hypertension, Type 2 Diabetes",
    allergies: "Penicillin, Shellfish",
    medications: "Metformin 500mg twice daily, Lisinopril 10mg daily",
    insuranceProvider: "Blue Cross Blue Shield",
    insurancePolicyNumber: "BC123456789",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
    notes: "Patient is compliant with medication regimen. Regular follow-ups needed for diabetes management.",
  },
  {
    id: "2",
    name: "Emily Johnson",
    email: "emily.johnson@email.com",
    phone: "+1 (555) 234-5678",
    dateOfBirth: new Date("1992-07-22"),
    gender: "female",
    address: "456 Oak Ave, Los Angeles, CA 90210",
    emergencyContact: "Michael Johnson - +1 (555) 876-5432",
    medicalHistory: "Asthma, Seasonal Allergies",
    allergies: "Pollen, Dust mites",
    medications: "Albuterol inhaler as needed, Claritin 10mg daily",
    insuranceProvider: "Aetna",
    insurancePolicyNumber: "AET987654321",
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-02-01"),
    notes: "Young professional, very health-conscious. Prefers morning appointments.",
  },
  {
    id: "3",
    name: "Robert Davis",
    email: "robert.davis@email.com",
    phone: "+1 (555) 345-6789",
    dateOfBirth: new Date("1978-11-08"),
    gender: "male",
    address: "789 Pine St, Chicago, IL 60601",
    emergencyContact: "Sarah Davis - +1 (555) 765-4321",
    medicalHistory: "High cholesterol, Previous heart surgery (2020)",
    allergies: "None known",
    medications: "Atorvastatin 20mg daily, Aspirin 81mg daily",
    insuranceProvider: "United Healthcare",
    insurancePolicyNumber: "UHC456789123",
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date("2024-01-20"),
    notes: "Post-surgical patient. Excellent recovery progress. Needs regular cardiac monitoring.",
  },
  {
    id: "4",
    name: "Maria Garcia",
    email: "maria.garcia@email.com",
    phone: "+1 (555) 456-7890",
    dateOfBirth: new Date("1995-05-12"),
    gender: "female",
    address: "321 Elm St, Miami, FL 33101",
    emergencyContact: "Carlos Garcia - +1 (555) 654-3210",
    medicalHistory: "Migraine headaches, Anxiety",
    allergies: "Latex",
    medications: "Sumatriptan as needed, Sertraline 50mg daily",
    insuranceProvider: "Cigna",
    insurancePolicyNumber: "CIG789123456",
    createdAt: new Date("2024-02-10"),
    updatedAt: new Date("2024-02-10"),
    notes: "Responds well to current migraine treatment. Stress management techniques recommended.",
  },
  {
    id: "5",
    name: "David Wilson",
    email: "david.wilson@email.com",
    phone: "+1 (555) 567-8901",
    dateOfBirth: new Date("1960-09-30"),
    gender: "male",
    address: "654 Maple Dr, Seattle, WA 98101",
    emergencyContact: "Linda Wilson - +1 (555) 543-2109",
    medicalHistory: "Arthritis, Osteoporosis",
    allergies: "Sulfa drugs",
    medications: "Ibuprofen 400mg as needed, Calcium with Vitamin D daily",
    insuranceProvider: "Medicare",
    insurancePolicyNumber: "MED123789456",
    createdAt: new Date("2024-01-25"),
    updatedAt: new Date("2024-01-25"),
    notes: "Senior patient with mobility concerns. Prefers afternoon appointments. Very punctual.",
  },
]

// Sample messages data
const sampleMessages: Message[] = [
  {
    id: "1",
    patientId: "1",
    patientName: "John Smith",
    content: "Hi Dr. Johnson, I wanted to follow up on my recent blood work results. Are they available yet?",
    timestamp: new Date("2024-03-20T10:30:00"),
    isFromPatient: true,
    isRead: false,
  },
  {
    id: "2",
    patientId: "1",
    patientName: "John Smith",
    content:
      "Hello John, yes your results are in. Your A1C has improved to 7.2%. Great progress! Let's schedule a follow-up to discuss your treatment plan.",
    timestamp: new Date("2024-03-20T14:15:00"),
    isFromPatient: false,
    isRead: true,
  },
  {
    id: "3",
    patientId: "2",
    patientName: "Emily Johnson",
    content: "Doctor, I've been experiencing more frequent asthma symptoms lately. Should I increase my inhaler usage?",
    timestamp: new Date("2024-03-21T09:45:00"),
    isFromPatient: true,
    isRead: false,
  },
  {
    id: "4",
    patientId: "3",
    patientName: "Robert Davis",
    content: "Thank you for the cardiac clearance letter. I've forwarded it to my employer as requested.",
    timestamp: new Date("2024-03-19T16:20:00"),
    isFromPatient: true,
    isRead: true,
  },
  {
    id: "5",
    patientId: "4",
    patientName: "Maria Garcia",
    content:
      "The new migraine medication is working well. I've only had 2 episodes this month compared to 8 last month!",
    timestamp: new Date("2024-03-18T11:30:00"),
    isFromPatient: true,
    isRead: true,
  },
]

// Sample appointments data
const sampleAppointments: Appointment[] = [
  {
    id: "1",
    patientId: "1",
    patientName: "John Smith",
    title: "Diabetes Follow-up",
    description: "Quarterly diabetes management check-up and medication review",
    startTime: new Date("2024-03-25T09:00:00"),
    endTime: new Date("2024-03-25T09:30:00"),
    type: "follow-up",
    status: "scheduled",
    location: "Office 101",
    notes: "Review recent lab results and adjust medication if needed",
    createdAt: new Date("2024-03-15"),
    updatedAt: new Date("2024-03-15"),
  },
  {
    id: "2",
    patientId: "2",
    patientName: "Emily Johnson",
    title: "Asthma Consultation",
    description: "Evaluation of recent asthma symptoms and treatment adjustment",
    startTime: new Date("2024-03-26T14:00:00"),
    endTime: new Date("2024-03-26T14:45:00"),
    type: "consultation",
    status: "scheduled",
    location: "Office 102",
    notes: "Patient reports increased symptoms - may need to adjust treatment plan",
    createdAt: new Date("2024-03-20"),
    updatedAt: new Date("2024-03-20"),
  },
  {
    id: "3",
    patientId: "3",
    patientName: "Robert Davis",
    title: "Cardiac Check-up",
    description: "Post-surgical cardiac monitoring and general health assessment",
    startTime: new Date("2024-03-27T10:30:00"),
    endTime: new Date("2024-03-27T11:15:00"),
    type: "check-up",
    status: "scheduled",
    location: "Office 101",
    notes: "Regular post-surgical monitoring - patient doing well",
    createdAt: new Date("2024-03-18"),
    updatedAt: new Date("2024-03-18"),
  },
  {
    id: "4",
    patientId: "4",
    patientName: "Maria Garcia",
    title: "Migraine Follow-up",
    description: "Review effectiveness of new migraine treatment",
    startTime: new Date("2024-03-28T15:30:00"),
    endTime: new Date("2024-03-28T16:00:00"),
    type: "follow-up",
    status: "scheduled",
    location: "Office 102",
    notes: "Patient reports significant improvement with new medication",
    createdAt: new Date("2024-03-16"),
    updatedAt: new Date("2024-03-16"),
  },
  {
    id: "5",
    patientId: "5",
    patientName: "David Wilson",
    title: "Arthritis Management",
    description: "Quarterly arthritis check-up and pain management review",
    startTime: new Date("2024-03-29T13:00:00"),
    endTime: new Date("2024-03-29T13:30:00"),
    type: "check-up",
    status: "scheduled",
    location: "Office 101",
    notes: "Senior patient - check mobility and adjust pain management as needed",
    createdAt: new Date("2024-03-12"),
    updatedAt: new Date("2024-03-12"),
  },
  {
    id: "6",
    patientId: "1",
    patientName: "John Smith",
    title: "Annual Physical",
    description: "Comprehensive annual physical examination",
    startTime: new Date("2024-02-15T09:00:00"),
    endTime: new Date("2024-02-15T10:00:00"),
    type: "check-up",
    status: "completed",
    location: "Office 101",
    notes: "Completed annual physical - all vitals normal, continue current medications",
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date("2024-02-15"),
  },
]

// Sample support tickets data
const sampleSupportTickets: SupportTicket[] = [
  {
    id: "1",
    subject: "Unable to access patient records",
    description:
      "I'm having trouble accessing patient records from yesterday. The system seems to be loading indefinitely when I click on the patient list.",
    status: "in-progress",
    priority: "high",
    category: "technical",
    createdAt: new Date("2024-03-21T08:30:00"),
    updatedAt: new Date("2024-03-21T10:15:00"),
    responses: [
      {
        id: "1",
        content:
          "Thank you for reporting this issue. Our technical team is investigating the patient records loading issue. We'll update you within 2 hours.",
        timestamp: new Date("2024-03-21T09:45:00"),
        isFromSupport: true,
      },
    ],
  },
  {
    id: "2",
    subject: "Request for additional calendar views",
    description:
      "It would be helpful to have a weekly view option in the calendar module. Currently, only monthly and daily views are available.",
    status: "open",
    priority: "medium",
    category: "feature-request",
    createdAt: new Date("2024-03-20T14:20:00"),
    updatedAt: new Date("2024-03-20T14:20:00"),
    responses: [],
  },
  {
    id: "3",
    subject: "Billing integration question",
    description:
      "How can I integrate the patient management system with our existing billing software? We use QuickBooks for our practice.",
    status: "resolved",
    priority: "medium",
    category: "general",
    createdAt: new Date("2024-03-18T11:00:00"),
    updatedAt: new Date("2024-03-19T16:30:00"),
    responses: [
      {
        id: "2",
        content:
          "We have a QuickBooks integration guide available. I'll send you the documentation and setup instructions via email.",
        timestamp: new Date("2024-03-19T09:15:00"),
        isFromSupport: true,
      },
      {
        id: "3",
        content: "Perfect! The integration is working smoothly now. Thank you for the detailed instructions.",
        timestamp: new Date("2024-03-19T16:30:00"),
        isFromSupport: false,
      },
    ],
  },
  {
    id: "4",
    subject: "Mobile app availability",
    description:
      "Is there a mobile app version of DoctorHub available? It would be convenient to check messages and appointments on the go.",
    status: "closed",
    priority: "low",
    category: "general",
    createdAt: new Date("2024-03-15T13:45:00"),
    updatedAt: new Date("2024-03-16T10:20:00"),
    responses: [
      {
        id: "4",
        content:
          "Currently, DoctorHub is optimized for mobile browsers. A native mobile app is in our development roadmap for Q3 2024.",
        timestamp: new Date("2024-03-16T10:20:00"),
        isFromSupport: true,
      },
    ],
  },
]

// Function to seed localStorage with sample data
function seedLocalStorage() {
  try {
    // Clear existing data
    localStorage.removeItem("patients")
    localStorage.removeItem("messages")
    localStorage.removeItem("appointments")
    localStorage.removeItem("support-tickets")

    // Seed patients
    localStorage.setItem("patients", JSON.stringify(samplePatients))
    console.log(`✅ Seeded ${samplePatients.length} patients`)

    // Seed messages
    localStorage.setItem("messages", JSON.stringify(sampleMessages))
    console.log(`✅ Seeded ${sampleMessages.length} messages`)

    // Seed appointments
    localStorage.setItem("appointments", JSON.stringify(sampleAppointments))
    console.log(`✅ Seeded ${sampleAppointments.length} appointments`)

    // Seed support tickets
    localStorage.setItem("support-tickets", JSON.stringify(sampleSupportTickets))
    console.log(`✅ Seeded ${sampleSupportTickets.length} support tickets`)

    console.log("🎉 Database seeding completed successfully!")
    console.log("📊 Summary:")
    console.log(`   • ${samplePatients.length} patients`)
    console.log(`   • ${sampleMessages.length} messages`)
    console.log(`   • ${sampleAppointments.length} appointments`)
    console.log(`   • ${sampleSupportTickets.length} support tickets`)

    return {
      success: true,
      message: "Sample data has been loaded successfully!",
      data: {
        patients: samplePatients.length,
        messages: sampleMessages.length,
        appointments: sampleAppointments.length,
        supportTickets: sampleSupportTickets.length,
      },
    }
  } catch (error) {
    console.error("❌ Error seeding database:", error)
    return {
      success: false,
      message: "Failed to load sample data",
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

// Function to clear all data
function clearAllData() {
  try {
    localStorage.removeItem("patients")
    localStorage.removeItem("messages")
    localStorage.removeItem("appointments")
    localStorage.removeItem("support-tickets")
    localStorage.removeItem("user-settings")

    console.log("🗑️ All data cleared successfully!")
    return {
      success: true,
      message: "All data has been cleared successfully!",
    }
  } catch (error) {
    console.error("❌ Error clearing data:", error)
    return {
      success: false,
      message: "Failed to clear data",
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

// Function to get current data statistics
function getDataStats() {
  try {
    const patients = JSON.parse(localStorage.getItem("patients") || "[]")
    const messages = JSON.parse(localStorage.getItem("messages") || "[]")
    const appointments = JSON.parse(localStorage.getItem("appointments") || "[]")
    const supportTickets = JSON.parse(localStorage.getItem("support-tickets") || "[]")

    const stats = {
      patients: patients.length,
      messages: messages.length,
      appointments: appointments.length,
      supportTickets: supportTickets.length,
      totalRecords: patients.length + messages.length + appointments.length + supportTickets.length,
    }

    console.log("📊 Current Data Statistics:")
    console.log(`   • Patients: ${stats.patients}`)
    console.log(`   • Messages: ${stats.messages}`)
    console.log(`   • Appointments: ${stats.appointments}`)
    console.log(`   • Support Tickets: ${stats.supportTickets}`)
    console.log(`   • Total Records: ${stats.totalRecords}`)

    return stats
  } catch (error) {
    console.error("❌ Error getting data stats:", error)
    return null
  }
}

// Export functions for use in browser console or components
if (typeof window !== "undefined") {
  // Make functions available globally for browser console usage
  ;(window as any).seedDoctorHub = seedLocalStorage
  ;(window as any).clearDoctorHubData = clearAllData
  ;(window as any).getDoctorHubStats = getDataStats

  console.log("🔧 DoctorHub Seed Functions Available:")
  console.log("   • seedDoctorHub() - Load sample data")
  console.log("   • clearDoctorHubData() - Clear all data")
  console.log("   • getDoctorHubStats() - View data statistics")
}

// Auto-seed on first load if no data exists
if (typeof window !== "undefined") {
  const hasExistingData = localStorage.getItem("patients") || localStorage.getItem("appointments")
  if (!hasExistingData) {
    console.log("🌱 No existing data found. Auto-seeding with sample data...")
    seedLocalStorage()
  }
}

export {
  seedLocalStorage,
  clearAllData,
  getDataStats,
  samplePatients,
  sampleMessages,
  sampleAppointments,
  sampleSupportTickets,
}
