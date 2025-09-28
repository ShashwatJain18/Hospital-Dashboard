"use client"

import { useState, useEffect } from "react"
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
import { supabase } from "@/lib/supabase"

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
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [dialogStates, setDialogStates] = useState({
    newAppointment: false,
    addPatient: false,
    quickMessage: false,
    createTicket: false,
  })

  // Helper to open/close dialogs
  const openDialog = (dialog: keyof typeof dialogStates) => setDialogStates((prev) => ({ ...prev, [dialog]: true }))
  const closeDialog = (dialog: keyof typeof dialogStates) => setDialogStates((prev) => ({ ...prev, [dialog]: false }))

  // Fetch metrics from Supabase
  useEffect(() => {
    async function fetchMetrics() {
      setLoading(true)
      try {
        // Count doctors
        const { count: doctorsCount } = await supabase.from("doctor").select("*", { count: "exact", head: true })

        // Count patients
        const { count: patientsCount } = await supabase.from("patient").select("*", { count: "exact", head: true })

        // Count all appointments
        const { count: appointmentsCount } = await supabase.from("appointment").select("*", { count: "exact", head: true })

        // Count today appointments
        const today = new Date().toISOString().split("T")[0]
        const { count: todayAppointmentsCount } = await supabase
          .from("appointments")
          .select("*", { count: "exact", head: true })
          .eq("date", today)

        // Count this week appointments
        const now = new Date()
        const weekStart = new Date(now.setDate(now.getDate() - now.getDay())).toISOString().split("T")[0]
        const weekEnd = new Date(now.setDate(now.getDate() - now.getDay() + 6)).toISOString().split("T")[0]
        const { count: weekAppointmentsCount } = await supabase
          .from("appointments")
          .select("*", { count: "exact", head: true })
          .gte("date", weekStart)
          .lte("date", weekEnd)

        // Count next month appointments
        const nextMonth = new Date()
        nextMonth.setMonth(nextMonth.getMonth() + 1)
        const monthStart = new Date(nextMonth.getFullYear(), nextMonth.getMonth(), 1).toISOString().split("T")[0]
        const monthEnd = new Date(nextMonth.getFullYear(), nextMonth.getMonth() + 1, 0).toISOString().split("T")[0]
        const { count: nextMonthAppointmentsCount } = await supabase
          .from("appointments")
          .select("*", { count: "exact", head: true })
          .gte("date", monthStart)
          .lte("date", monthEnd)

        setMetrics({
          doctors: doctorsCount ?? 0,
          patients: patientsCount ?? 0,
          appointments: appointmentsCount ?? 0,
          medicines: 0, // You can fetch medicine count similarly
          todayAppointments: todayAppointmentsCount ?? 0,
          thisWeekAppointments: weekAppointmentsCount ?? 0,
          nextMonthAppointments: nextMonthAppointmentsCount ?? 0,
          unreadMessages: 0,
          openTickets: 0,
        })
      } catch (err) {
        console.error("Error fetching metrics:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchMetrics()
  }, [])

  if (loading || !metrics) return <p>Loading dashboard...</p>

  const updateMetric = (key: keyof DashboardMetrics, value: number) => {
    setMetrics((prev) => ({ ...prev!, [key]: value }))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard Overview</h1>
          <p className="text-muted-foreground">Hospital reception management system</p>
        </div>
      </div>

      {/* Top Metrics */}
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

      {/* Appointments & Quick Actions */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Appointments */}
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
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Today's appointments overview</p>
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
                  <p>This week's appointments overview</p>
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
                  <p>Next month's appointments overview</p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Quick Actions */}
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

      

      {/* Dialogs */}
      <NewAppointmentDialog open={dialogStates.newAppointment} onOpenChange={() => closeDialog("newAppointment")} />
      <AddPatientDialog open={dialogStates.addPatient} onOpenChange={() => closeDialog("addPatient")} />
      <QuickMessageDialog open={dialogStates.quickMessage} onOpenChange={() => closeDialog("quickMessage")} />
      <CreateSupportTicketDialog open={dialogStates.createTicket} onOpenChange={() => closeDialog("createTicket")} />
    </div>
  )
}
