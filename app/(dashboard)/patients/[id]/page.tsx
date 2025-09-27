"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { PatientDialog } from "@/components/patient-dialog"
import { ArrowLeft, Edit, Phone, Mail, MapPin, Calendar, AlertTriangle, MessageSquare, Clock, Save } from "lucide-react"
import { formatDate, formatDateTime, getInitials } from "@/lib/utils"
import { useSyncWithServer } from "@/hooks/use-sync-with-server"
import type { Patient, Appointment, Message } from "@/lib/types"
import Link from "next/link"

// Sample data - would come from API in real app
const samplePatients: Patient[] = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@email.com",
    phone: "(555) 123-4567",
    dateOfBirth: new Date("1985-03-15"),
    gender: "Male",
    address: "123 Main St, Anytown, ST 12345",
    notes: "Regular checkups, no known allergies. Patient is compliant with medication and follows up regularly.",
    allergies: "None",
    lastVisit: new Date("2024-01-15"),
    createdAt: new Date("2023-06-01"),
    updatedAt: new Date("2024-01-15"),
  },
]

const sampleAppointments: Appointment[] = [
  {
    id: "1",
    title: "Regular Checkup",
    description: "Annual physical examination",
    startTime: new Date("2024-01-15T09:00:00"),
    endTime: new Date("2024-01-15T09:30:00"),
    patientId: "1",
    doctorId: "doc1",
    status: "completed",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    title: "Follow-up Visit",
    description: "Blood pressure monitoring",
    startTime: new Date("2024-02-15T10:00:00"),
    endTime: new Date("2024-02-15T10:30:00"),
    patientId: "1",
    doctorId: "doc1",
    status: "scheduled",
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date("2024-01-20"),
  },
]

const sampleMessages: Message[] = [
  {
    id: "1",
    content:
      "Hi Dr. Johnson, I wanted to follow up on my recent blood work results. When would be a good time to discuss them?",
    senderId: "1",
    patientId: "1",
    isRead: true,
    createdAt: new Date("2024-01-16T14:30:00"),
    updatedAt: new Date("2024-01-16T14:30:00"),
  },
  {
    id: "2",
    content:
      "Thank you for your message. Your blood work looks good overall. I'd like to schedule a brief follow-up to discuss the results in detail.",
    senderId: "doc1",
    patientId: "1",
    isRead: true,
    createdAt: new Date("2024-01-16T16:45:00"),
    updatedAt: new Date("2024-01-16T16:45:00"),
  },
]

export default function PatientDetailPage() {
  const params = useParams()
  const patientId = params.id as string

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [medicalNotes, setMedicalNotes] = useState("")
  const [isNotesEditing, setIsNotesEditing] = useState(false)

  const { data: patients, setData: setPatients } = useSyncWithServer<Patient[]>(
    "patients",
    samplePatients,
    "/api/patients",
  )

  const patient = patients.find((p) => p.id === patientId)

  if (!patient) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground">Patient Not Found</h2>
          <p className="text-muted-foreground mt-2">The patient you're looking for doesn't exist.</p>
          <Link href="/patients">
            <Button className="mt-4">Back to Patients</Button>
          </Link>
        </div>
      </div>
    )
  }

  const handleEditPatient = (patientData: Omit<Patient, "id" | "createdAt" | "updatedAt">) => {
    const updatedPatient: Patient = {
      ...patient,
      ...patientData,
      updatedAt: new Date(),
    }

    setPatients(patients.map((p) => (p.id === patient.id ? updatedPatient : p)))
    setIsEditDialogOpen(false)
  }

  const handleSaveNotes = () => {
    const updatedPatient: Patient = {
      ...patient,
      notes: medicalNotes,
      updatedAt: new Date(),
    }

    setPatients(patients.map((p) => (p.id === patient.id ? updatedPatient : p)))
    setIsNotesEditing(false)
  }

  return (
    <div className="space-y-6">
      {/* Back button and header */}
      <div className="flex items-center gap-4">
        <Link href="/patients">
          <Button variant="outline" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-foreground">{patient.name}</h1>
          <p className="text-muted-foreground">Patient Details</p>
        </div>
        <Button onClick={() => setIsEditDialogOpen(true)} className="gap-2">
          <Edit className="w-4 h-4" />
          Edit Patient
        </Button>
      </div>

      {/* Patient summary card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={`/patient-${patient.id}.png`} />
              <AvatarFallback className="text-lg">{getInitials(patient.name)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <CardTitle className="text-2xl">{patient.name}</CardTitle>
              <CardDescription className="text-base">
                {patient.gender} •{" "}
                {patient.dateOfBirth && new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear()} years
                old
              </CardDescription>
            </div>
            {patient.allergies && patient.allergies !== "None" && (
              <Badge variant="destructive" className="gap-1">
                <AlertTriangle className="w-3 h-3" />
                Allergies: {patient.allergies}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {patient.email && (
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{patient.email}</span>
              </div>
            )}
            {patient.phone && (
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{patient.phone}</span>
              </div>
            )}
            {patient.address && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{patient.address}</span>
              </div>
            )}
            {patient.lastVisit && (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">Last visit: {formatDate(patient.lastVisit)}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tabs for different sections */}
      <Tabs defaultValue="appointments" className="space-y-4">
        <TabsList>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="notes">Medical Notes</TabsTrigger>
        </TabsList>

        <TabsContent value="appointments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Appointment History</CardTitle>
              <CardDescription>Past and upcoming appointments for this patient</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sampleAppointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between p-4 bg-accent rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-full">
                        <Clock className="w-5 h-5 text-primary-foreground" />
                      </div>
                      <div>
                        <p className="font-medium">{appointment.title}</p>
                        <p className="text-sm text-muted-foreground">{appointment.description}</p>
                        <p className="text-sm text-muted-foreground">{formatDateTime(appointment.startTime)}</p>
                      </div>
                    </div>
                    <Badge variant={appointment.status === "completed" ? "default" : "secondary"}>
                      {appointment.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="messages" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Message History</CardTitle>
                <CardDescription>Communication with this patient</CardDescription>
              </div>
              <Link href={`/messages?patient=${patient.id}`}>
                <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                  <MessageSquare className="w-4 h-4" />
                  Open Chat
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sampleMessages.map((message) => (
                  <div key={message.id} className="p-4 bg-accent rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium">
                        {message.senderId === patient.id ? patient.name : "Dr. Johnson"}
                      </p>
                      <p className="text-xs text-muted-foreground">{formatDateTime(message.createdAt)}</p>
                    </div>
                    <p className="text-sm">{message.content}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Medical Notes</CardTitle>
                <CardDescription>Clinical notes and observations</CardDescription>
              </div>
              {!isNotesEditing ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setMedicalNotes(patient.notes || "")
                    setIsNotesEditing(true)
                  }}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Notes
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setIsNotesEditing(false)}>
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleSaveNotes}>
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent>
              {isNotesEditing ? (
                <Textarea
                  value={medicalNotes}
                  onChange={(e) => setMedicalNotes(e.target.value)}
                  placeholder="Enter medical notes, observations, treatment plans..."
                  rows={8}
                  className="resize-none"
                />
              ) : (
                <div className="min-h-[200px] p-4 bg-accent rounded-lg">
                  {patient.notes ? (
                    <p className="text-sm whitespace-pre-wrap">{patient.notes}</p>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">
                      No medical notes available. Click "Edit Notes" to add notes.
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <PatientDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        patient={patient}
        onSave={handleEditPatient}
      />
    </div>
  )
}
