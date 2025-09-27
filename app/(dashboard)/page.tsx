"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Calendar,
  MessageSquare,
  Users,
  HeadphonesIcon,
  Plus,
  Clock,
  UserPlus,
  Send,
  Stethoscope,
  Pill,
} from "lucide-react"
import { DoctorSelector } from "@/components/doctor-selector"
import { EditableMetric } from "@/components/editable-metric"
import {
  NewAppointmentDialog,
  AddPatientDialog,
  QuickMessageDialog,
  CreateSupportTicketDialog,
} from "@/components/quick-action-dialogs"
import { useLocalStorage } from "@/hooks/use-local-storage"

interface DashboardMetrics {
  doctors: number
  patients: number
  appointments: number
  medicines: number
  todayAppointments: number
  thisWeekAppointments: number
  nextMonthAppointments: number
  unreadMessages: number
  openTickets: number
}

export default function DashboardPage() {
  const [metrics, setMetrics] = useLocalStorage<DashboardMetrics>("dashboard-metrics", {
    doctors: 5,
    patients: 247,
    appointments: 12,
    medicines: 156,
    todayAppointments: 8,
    thisWeekAppointments: 45,
    nextMonthAppointments: 127,
    unreadMessages: 3,
    openTickets: 2,
  })

  const [dialogStates, setDialogStates] = useState({
    newAppointment: false,
    addPatient: false,
    quickMessage: false,
    createTicket: false,
  })

  const updateMetric = (key: keyof DashboardMetrics, value: number) => {
    setMetrics((prev) => ({ ...prev, [key]: value }))
  }

  const openDialog = (dialog: keyof typeof dialogStates) => {
    setDialogStates((prev) => ({ ...prev, [dialog]: true }))
  }

  const closeDialog = (dialog: keyof typeof dialogStates) => {
    setDialogStates((prev) => ({ ...prev, [dialog]: false }))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard Overview</h1>
          <p className="text-muted-foreground">Hospital reception management system</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-6">
        <div className="lg:col-span-2">
          <DoctorSelector />
        </div>
        <div className="lg:col-span-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">DOCTORS:</CardTitle>
                <Stethoscope className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <EditableMetric value={metrics.doctors} onSave={(value) => updateMetric("doctors", value)} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">PATIENTS:</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <EditableMetric value={metrics.patients} onSave={(value) => updateMetric("patients", value)} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">APPOINTMENTS:</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <EditableMetric value={metrics.appointments} onSave={(value) => updateMetric("appointments", value)} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">MEDICINES:</CardTitle>
                <Pill className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <EditableMetric value={metrics.medicines} onSave={(value) => updateMetric("medicines", value)} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Appointments Schedule</CardTitle>
            <CardDescription>Manage appointment schedules</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="today" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="today">Today's Appointments</TabsTrigger>
                <TabsTrigger value="week">This Week</TabsTrigger>
                <TabsTrigger value="month">Next Month</TabsTrigger>
              </TabsList>

              <TabsContent value="today" className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Total Today:</span>
                  <EditableMetric
                    value={metrics.todayAppointments}
                    onSave={(value) => updateMetric("todayAppointments", value)}
                    className="text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-accent rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-full">
                        <Clock className="w-4 h-4 text-primary-foreground" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">John Smith</p>
                        <p className="text-xs text-muted-foreground">Regular Checkup</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">9:00 AM</p>
                      <Badge variant="secondary" className="text-xs">
                        Confirmed
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-accent rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-full">
                        <Clock className="w-4 h-4 text-primary-foreground" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Emily Davis</p>
                        <p className="text-xs text-muted-foreground">Follow-up Visit</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">10:30 AM</p>
                      <Badge variant="secondary" className="text-xs">
                        Confirmed
                      </Badge>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="week" className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Total This Week:</span>
                  <EditableMetric
                    value={metrics.thisWeekAppointments}
                    onSave={(value) => updateMetric("thisWeekAppointments", value)}
                    className="text-sm"
                  />
                </div>
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Weekly appointments overview</p>
                </div>
              </TabsContent>

              <TabsContent value="month" className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Total Next Month:</span>
                  <EditableMetric
                    value={metrics.nextMonthAppointments}
                    onSave={(value) => updateMetric("nextMonthAppointments", value)}
                    className="text-sm"
                  />
                </div>
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Monthly appointments overview</p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              className="w-full justify-start gap-3 bg-transparent"
              variant="outline"
              onClick={() => openDialog("newAppointment")}
            >
              <Plus className="w-4 h-4" />
              New Appointment
            </Button>
            <Button
              className="w-full justify-start gap-3 bg-transparent"
              variant="outline"
              onClick={() => openDialog("addPatient")}
            >
              <UserPlus className="w-4 h-4" />
              Add Patient
            </Button>
            <Button
              className="w-full justify-start gap-3 bg-transparent"
              variant="outline"
              onClick={() => openDialog("quickMessage")}
            >
              <Send className="w-4 h-4" />
              Quick Message
            </Button>
            <Button
              className="w-full justify-start gap-3 bg-transparent"
              variant="outline"
              onClick={() => openDialog("createTicket")}
            >
              <HeadphonesIcon className="w-4 h-4" />
              Create Support Ticket
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unread Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <EditableMetric value={metrics.unreadMessages} onSave={(value) => updateMetric("unreadMessages", value)} />
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Support Tickets</CardTitle>
            <HeadphonesIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <EditableMetric value={metrics.openTickets} onSave={(value) => updateMetric("openTickets", value)} />
            <p className="text-xs text-muted-foreground">Support requests</p>
          </CardContent>
        </Card>
      </div>

      {/* Dialog components */}
      <NewAppointmentDialog open={dialogStates.newAppointment} onOpenChange={(open) => closeDialog("newAppointment")} />
      <AddPatientDialog open={dialogStates.addPatient} onOpenChange={(open) => closeDialog("addPatient")} />
      <QuickMessageDialog open={dialogStates.quickMessage} onOpenChange={(open) => closeDialog("quickMessage")} />
      <CreateSupportTicketDialog
        open={dialogStates.createTicket}
        onOpenChange={(open) => closeDialog("createTicket")}
      />
    </div>
  )
}
