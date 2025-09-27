"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarView } from "@/components/calendar-view"
import { AppointmentDialog } from "@/components/appointment-dialog"
import { AppointmentList } from "@/components/appointment-list"
import { Plus, Download, Upload, CalendarIcon } from "lucide-react"
import { useSyncWithServer } from "@/hooks/use-sync-with-server"
import type { Appointment, Patient } from "@/lib/types"

// Sample data
const samplePatients: Patient[] = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@email.com",
    phone: "(555) 123-4567",
    dateOfBirth: new Date("1985-03-15"),
    gender: "Male",
    address: "123 Main St, Anytown, ST 12345",
    notes: "Regular checkups, no known allergies",
    allergies: "None",
    lastVisit: new Date("2024-01-15"),
    createdAt: new Date("2023-06-01"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    name: "Emily Davis",
    email: "emily.davis@email.com",
    phone: "(555) 234-5678",
    dateOfBirth: new Date("1992-07-22"),
    gender: "Female",
    address: "456 Oak Ave, Somewhere, ST 67890",
    notes: "Hypertension monitoring",
    allergies: "Penicillin",
    lastVisit: new Date("2024-01-10"),
    createdAt: new Date("2023-08-15"),
    updatedAt: new Date("2024-01-10"),
  },
  {
    id: "3",
    name: "Michael Brown",
    email: "michael.brown@email.com",
    phone: "(555) 345-6789",
    dateOfBirth: new Date("1978-11-08"),
    gender: "Male",
    address: "789 Pine Rd, Elsewhere, ST 13579",
    notes: "Diabetes management, quarterly visits",
    allergies: "Shellfish",
    lastVisit: new Date("2024-01-05"),
    createdAt: new Date("2023-05-20"),
    updatedAt: new Date("2024-01-05"),
  },
]

const sampleAppointments: Appointment[] = [
  {
    id: "1",
    title: "Regular Checkup",
    description: "Annual physical examination",
    startTime: new Date("2024-01-25T09:00:00"),
    endTime: new Date("2024-01-25T09:30:00"),
    patientId: "1",
    doctorId: "doc1",
    status: "scheduled",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
    patient: { id: "1", name: "John Smith", phone: "(555) 123-4567" },
  },
  {
    id: "2",
    title: "Follow-up Visit",
    description: "Blood pressure monitoring",
    startTime: new Date("2024-01-25T10:30:00"),
    endTime: new Date("2024-01-25T11:00:00"),
    patientId: "2",
    doctorId: "doc1",
    status: "scheduled",
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date("2024-01-20"),
    patient: { id: "2", name: "Emily Davis", phone: "(555) 234-5678" },
  },
  {
    id: "3",
    title: "Consultation",
    description: "Diabetes management review",
    startTime: new Date("2024-01-26T14:00:00"),
    endTime: new Date("2024-01-26T14:45:00"),
    patientId: "3",
    doctorId: "doc1",
    status: "scheduled",
    createdAt: new Date("2024-01-22"),
    updatedAt: new Date("2024-01-22"),
    patient: { id: "3", name: "Michael Brown", phone: "(555) 345-6789" },
  },
  {
    id: "4",
    title: "Emergency Consultation",
    description: "Urgent care visit",
    startTime: new Date("2024-01-24T16:00:00"),
    endTime: new Date("2024-01-24T16:30:00"),
    patientId: "1",
    doctorId: "doc1",
    status: "completed",
    createdAt: new Date("2024-01-24"),
    updatedAt: new Date("2024-01-24"),
    patient: { id: "1", name: "John Smith", phone: "(555) 123-4567" },
  },
]

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [isAppointmentDialogOpen, setIsAppointmentDialogOpen] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [currentView, setCurrentView] = useState<"month" | "week" | "day">("month")

  const { data: appointments, setData: setAppointments } = useSyncWithServer<Appointment[]>(
    "appointments",
    sampleAppointments,
    "/api/appointments",
  )

  const { data: patients } = useSyncWithServer<Patient[]>("patients", samplePatients, "/api/patients")

  const handleAddAppointment = (appointmentData: Omit<Appointment, "id" | "createdAt" | "updatedAt">) => {
    const patient = patients.find((p) => p.id === appointmentData.patientId)
    const newAppointment: Appointment = {
      ...appointmentData,
      id: Math.random().toString(36).substring(2),
      createdAt: new Date(),
      updatedAt: new Date(),
      patient: patient ? { id: patient.id, name: patient.name, phone: patient.phone } : undefined,
    }
    setAppointments([...appointments, newAppointment])
    setIsAppointmentDialogOpen(false)
  }

  const handleEditAppointment = (appointmentData: Omit<Appointment, "id" | "createdAt" | "updatedAt">) => {
    if (!selectedAppointment) return

    const patient = patients.find((p) => p.id === appointmentData.patientId)
    const updatedAppointment: Appointment = {
      ...selectedAppointment,
      ...appointmentData,
      updatedAt: new Date(),
      patient: patient ? { id: patient.id, name: patient.name, phone: patient.phone } : undefined,
    }

    setAppointments(appointments.map((a) => (a.id === selectedAppointment.id ? updatedAppointment : a)))
    setIsAppointmentDialogOpen(false)
    setSelectedAppointment(null)
  }

  const handleDeleteAppointment = (appointmentId: string) => {
    setAppointments(appointments.filter((a) => a.id !== appointmentId))
  }

  const openEditDialog = (appointment: Appointment) => {
    setSelectedAppointment(appointment)
    setIsAppointmentDialogOpen(true)
  }

  const openAddDialog = (date?: Date) => {
    setSelectedAppointment(null)
    if (date) {
      setSelectedDate(date)
    }
    setIsAppointmentDialogOpen(true)
  }

  const handleExportCalendar = () => {
    const dataStr = JSON.stringify(appointments, null, 2)
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)
    const exportFileDefaultName = `appointments-${new Date().toISOString().split("T")[0]}.json`

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()
  }

  const handleImportCalendar = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const importedAppointments = JSON.parse(e.target?.result as string)
        if (Array.isArray(importedAppointments)) {
          setAppointments([...appointments, ...importedAppointments])
        }
      } catch (error) {
        console.error("Error importing calendar:", error)
      }
    }
    reader.readAsText(file)
  }

  // Get upcoming appointments
  const upcomingAppointments = appointments
    .filter((apt) => new Date(apt.startTime) > new Date() && apt.status === "scheduled")
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
    .slice(0, 5)

  // Get today's appointments
  const today = new Date()
  const todayAppointments = appointments.filter((apt) => {
    const aptDate = new Date(apt.startTime)
    return (
      aptDate.getDate() === today.getDate() &&
      aptDate.getMonth() === today.getMonth() &&
      aptDate.getFullYear() === today.getFullYear()
    )
  })

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Calendar</h1>
          <p className="text-muted-foreground">Manage appointments and schedule</p>
        </div>
        <div className="flex items-center gap-2">
          <input type="file" accept=".json" onChange={handleImportCalendar} className="hidden" id="import-calendar" />
          <Button variant="outline" size="sm" onClick={handleExportCalendar} className="gap-2 bg-transparent">
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => document.getElementById("import-calendar")?.click()}
            className="gap-2"
          >
            <Upload className="w-4 h-4" />
            Import
          </Button>
          <Button onClick={() => openAddDialog()} className="gap-2">
            <Plus className="w-4 h-4" />
            New Appointment
          </Button>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayAppointments.length}</div>
            <p className="text-xs text-muted-foreground">
              {todayAppointments.filter((apt) => apt.status === "scheduled").length} scheduled
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                appointments.filter((apt) => {
                  const aptDate = new Date(apt.startTime)
                  const weekStart = new Date(today)
                  weekStart.setDate(today.getDate() - today.getDay())
                  const weekEnd = new Date(weekStart)
                  weekEnd.setDate(weekStart.getDate() + 6)
                  return aptDate >= weekStart && aptDate <= weekEnd
                }).length
              }
            </div>
            <p className="text-xs text-muted-foreground">appointments scheduled</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Month</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                appointments.filter((apt) => {
                  const aptDate = new Date(apt.startTime)
                  const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1)
                  const monthEnd = new Date(today.getFullYear(), today.getMonth() + 2, 0)
                  return aptDate >= nextMonth && aptDate <= monthEnd
                }).length
              }
            </div>
            <p className="text-xs text-muted-foreground">appointments planned</p>
          </CardContent>
        </Card>
      </div>

      {/* Calendar tabs */}
      <Tabs value={currentView} onValueChange={(value) => setCurrentView(value as "month" | "week" | "day")}>
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="month">Month</TabsTrigger>
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="day">Day</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="month" className="space-y-4">
          <CalendarView
            appointments={appointments}
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
            onAppointmentClick={openEditDialog}
            onDateClick={openAddDialog}
            view="month"
          />
        </TabsContent>

        <TabsContent value="week" className="space-y-4">
          <CalendarView
            appointments={appointments}
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
            onAppointmentClick={openEditDialog}
            onDateClick={openAddDialog}
            view="week"
          />
        </TabsContent>

        <TabsContent value="day" className="space-y-4">
          <CalendarView
            appointments={appointments}
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
            onAppointmentClick={openEditDialog}
            onDateClick={openAddDialog}
            view="day"
          />
        </TabsContent>
      </Tabs>

      {/* Upcoming appointments sidebar */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>All Appointments</CardTitle>
              <CardDescription>Complete list of appointments</CardDescription>
            </CardHeader>
            <CardContent>
              <AppointmentList appointments={appointments} onEdit={openEditDialog} onDelete={handleDeleteAppointment} />
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Upcoming</CardTitle>
              <CardDescription>Next 5 appointments</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingAppointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-3 bg-accent rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{appointment.patient?.name}</p>
                    <p className="text-xs text-muted-foreground">{appointment.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(appointment.startTime).toLocaleDateString()} at{" "}
                      {new Date(appointment.startTime).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <Badge variant={appointment.status === "scheduled" ? "default" : "secondary"}>
                    {appointment.status}
                  </Badge>
                </div>
              ))}
              {upcomingAppointments.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">No upcoming appointments</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <AppointmentDialog
        open={isAppointmentDialogOpen}
        onOpenChange={setIsAppointmentDialogOpen}
        appointment={selectedAppointment}
        patients={patients}
        selectedDate={selectedDate}
        onSave={selectedAppointment ? handleEditAppointment : handleAddAppointment}
      />
    </div>
  )
}
