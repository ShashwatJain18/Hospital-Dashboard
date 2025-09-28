"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import type { Appointment, Patient } from "@/lib/types"

interface AppointmentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  appointment?: Appointment | null
  patients: Patient[]
  doctors?: { id: string; name: string }[]
  selectedDate?: Date
  selectedDoctor?: string | null
  onSave: (appointment: Omit<Appointment, "id" | "createdAt">, id?: string) => void
  onDelete?: (id: string) => void
}

export function AppointmentDialog({
  open,
  onOpenChange,
  appointment,
  patients,
  doctors = [],
  selectedDate,
  selectedDoctor,
  onSave,
  onDelete,
}: AppointmentDialogProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    patientId: "",
    doctorId: selectedDoctor || doctors[0]?.id || "",
    startDate: "",
    startTime: "",
    endTime: "",
    status: "scheduled" as "scheduled" | "completed" | "cancelled",
  })

  useEffect(() => {
    if (appointment) {
      const startDate = new Date(appointment.startTime)
      const endDate = new Date(appointment.endTime)
      setFormData({
        title: appointment.title || "",
        description: appointment.description || "",
        patientId: appointment.patientId || "",
        doctorId: appointment.doctorId || selectedDoctor || doctors[0]?.id || "",
        startDate: startDate.toISOString().split("T")[0],
        startTime: startDate.toTimeString().slice(0, 5),
        endTime: endDate.toTimeString().slice(0, 5),
        status: appointment.status,
      })
    } else {
      const defaultDate = selectedDate || new Date()
      const defaultEndTime = new Date(defaultDate.getTime() + 30 * 60000)
      setFormData({
        title: "",
        description: "",
        patientId: "",
        doctorId: selectedDoctor || doctors[0]?.id || "",
        startDate: defaultDate.toISOString().split("T")[0],
        startTime: defaultDate.toTimeString().slice(0, 5),
        endTime: defaultEndTime.toTimeString().slice(0, 5),
        status: "scheduled",
      })
    }
  }, [appointment, selectedDate, open, selectedDoctor])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.startDate || !formData.startTime || !formData.endTime) return

    // ⚡ FIXED: Create date manually to prevent 1-day-back issue
    const [year, month, day] = formData.startDate.split("-").map(Number)
    const [startHour, startMinute] = formData.startTime.split(":").map(Number)
    const [endHour, endMinute] = formData.endTime.split(":").map(Number)

    const startTime = new Date(year, month - 1, day, startHour, startMinute)
    const endTime = new Date(year, month - 1, day, endHour, endMinute)

    onSave(
      {
        title: formData.title,
        description: formData.description,
        patientId: formData.patientId,
        doctorId: formData.doctorId,
        startTime,
        endTime,
        status: formData.status,
      },
      appointment?.id
    )
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{appointment ? "Edit Appointment" : "New Appointment"}</DialogTitle>
          <DialogDescription>{appointment ? "Update appointment details" : "Schedule a new appointment"}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Patient *</Label>
            <Select value={formData.patientId} onValueChange={(val) => setFormData({ ...formData, patientId: val })}>
              <SelectTrigger>
                <SelectValue placeholder="Select a patient" />
              </SelectTrigger>
              <SelectContent>
                {patients.map((p) => (
                  <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Doctor *</Label>
            <Select value={formData.doctorId} onValueChange={(val) => setFormData({ ...formData, doctorId: val })}>
              <SelectTrigger>
                <SelectValue placeholder="Select a doctor" />
              </SelectTrigger>
              <SelectContent>
                {doctors.map((d) => (
                  <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Title *</Label>
            <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Date *</Label>
              <Input type="date" value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} required />
            </div>
            <div>
              <Label>Start Time *</Label>
              <Input type="time" value={formData.startTime} onChange={(e) => setFormData({ ...formData, startTime: e.target.value })} required />
            </div>
            <div>
              <Label>End Time *</Label>
              <Input type="time" value={formData.endTime} onChange={(e) => setFormData({ ...formData, endTime: e.target.value })} required />
            </div>
          </div>

          <DialogFooter className="flex justify-between">
            {appointment && onDelete && (
              <Button variant="destructive" onClick={() => onDelete(appointment.id)}>Delete</Button>
            )}
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button type="submit">{appointment ? "Update" : "Schedule"}</Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
