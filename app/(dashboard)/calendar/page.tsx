"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import type { Appointment, Patient } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { CalendarView } from "@/components/calendar-view"
import { AppointmentDialog } from "@/components/appointment-dialog"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { formatTime } from "@/lib/utils"

export default function CalendarPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [patients, setPatients] = useState<Patient[]>([])
  const [doctors, setDoctors] = useState<{ id: string; name: string }[]>([])
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [isAppointmentDialogOpen, setIsAppointmentDialogOpen] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)

  // Fetch patients
  useEffect(() => {
    supabase.from("patient").select("*").then(({ data }) => {
      if (data) setPatients(data)
    })
  }, [])

  // Fetch doctors
  useEffect(() => {
    supabase.from("doctor").select("*").then(({ data }) => {
      if (data) setDoctors(data)
    })
  }, [])

  // Fetch appointments
  const fetchAppointments = async (doctorId?: string) => {
    let query = supabase
      .from("appointment")
      .select(`
        *,
        patient:patient_id(id, name),
        doctor:doctor_id(id, name)
      `)

    if (doctorId) query = query.eq("doctor_id", doctorId)

    const { data } = await query
    if (!data) return

    // Map Supabase columns to frontend fields
    const mappedAppointments = (data as any[]).map(a => ({
      id: a.id,
      title: a.title,
      description: a.description,
      startTime: a.start_time,
      endTime: a.end_time,
      patientId: a.patient_id,
      doctorId: a.doctor_id,
      patient: a.patient,
      doctor: a.doctor,
      status: a.status,
    }))

    setAppointments(mappedAppointments)
  }

  useEffect(() => {
    fetchAppointments(selectedDoctor || undefined)
  }, [selectedDoctor, isAppointmentDialogOpen])

  // Add appointment
  const handleAddAppointment = async (appointmentData: Omit<Appointment, "id" | "createdAt" | "updatedAt">) => {
    const { data } = await supabase
      .from("appointment")
      .insert({
        title: appointmentData.title,
        description: appointmentData.description,
        patient_id: appointmentData.patientId,
        doctor_id: appointmentData.doctorId,
        start_time: appointmentData.startTime,
        end_time: appointmentData.endTime,
        status: appointmentData.status,
      })
      .select(`
        *,
        patient:patient_id(id, name),
        doctor:doctor_id(id, name)
      `)
    if (data) setAppointments([...appointments, {
      id: data[0].id,
      title: data[0].title,
      description: data[0].description,
      startTime: data[0].start_time,
      endTime: data[0].end_time,
      patientId: data[0].patient_id,
      doctorId: data[0].doctor_id,
      patient: data[0].patient,
      doctor: data[0].doctor,
      status: data[0].status,
    }])
    setIsAppointmentDialogOpen(false)
  }

  // Edit appointment
  const handleEditAppointment = async (appointmentData: Omit<Appointment, "id" | "createdAt" | "updatedAt">) => {
    if (!selectedAppointment) return
    const { data } = await supabase
      .from("appointment")
      .update({
        title: appointmentData.title,
        description: appointmentData.description,
        patient_id: appointmentData.patientId,
        doctor_id: appointmentData.doctorId,
        start_time: appointmentData.startTime,
        end_time: appointmentData.endTime,
        status: appointmentData.status,
      })
      .eq("id", selectedAppointment.id)
      .select(`
        *,
        patient:patient_id(id, name),
        doctor:doctor_id(id, name)
      `)
    if (data) {
      setAppointments(appointments.map(a => a.id === selectedAppointment.id ? {
        id: data[0].id,
        title: data[0].title,
        description: data[0].description,
        startTime: data[0].start_time,
        endTime: data[0].end_time,
        patientId: data[0].patient_id,
        doctorId: data[0].doctor_id,
        patient: data[0].patient,
        doctor: data[0].doctor,
        status: data[0].status,
      } : a))
      setSelectedAppointment(null)
      setIsAppointmentDialogOpen(false)
    }
  }

  // Delete appointment
  const handleDeleteAppointment = async (id: string) => {
    await supabase.from("appointment").delete().eq("id", id)
    setAppointments(appointments.filter(a => a.id !== id))
  }

  // Open dialogs
  const openEditDialog = (apt: Appointment) => {
    setSelectedAppointment(apt)
    setIsAppointmentDialogOpen(true)
  }

  const openAddDialog = (date?: Date) => {
    setSelectedAppointment(null)
    if (date) setSelectedDate(date)
    setIsAppointmentDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Calendar</h1>

        {/* Doctor filter */}
        <Select value={selectedDoctor || ""} onValueChange={val => setSelectedDoctor(val || null)}>
          <SelectTrigger className="w-52">
            <SelectValue placeholder="Select Doctor" />
          </SelectTrigger>
          <SelectContent>
            {doctors.map(doc => <SelectItem key={doc.id} value={doc.id}>{doc.name}</SelectItem>)}
          </SelectContent>
        </Select>

        <Button onClick={() => openAddDialog()}>New Appointment</Button>
      </div>

      <CalendarView
        appointments={appointments}
        selectedDate={selectedDate}
        onAppointmentClick={openEditDialog}
        onDateClick={openAddDialog}
      />

      <AppointmentDialog
        open={isAppointmentDialogOpen}
        onOpenChange={setIsAppointmentDialogOpen}
        appointment={selectedAppointment}
        patients={patients}
        doctors={doctors}
        selectedDate={selectedDate}
        onSave={selectedAppointment ? handleEditAppointment : handleAddAppointment}
        onDelete={selectedAppointment ? handleDeleteAppointment : undefined}
      />
    </div>
  )
}
