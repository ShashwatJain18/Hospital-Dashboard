"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Appointment, Patient } from "@/lib/types"

interface AppointmentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  appointment?: Appointment | null
  patients: Patient[]
  selectedDate?: Date
  onSave: (appointment: Omit<Appointment, "id" | "createdAt" | "updatedAt">) => void
}

export function AppointmentDialog({
  open,
  onOpenChange,
  appointment,
  patients,
  selectedDate,
  onSave,
}: AppointmentDialogProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    patientId: "",
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
        startDate: startDate.toISOString().split("T")[0],
        startTime: startDate.toTimeString().slice(0, 5),
        endTime: endDate.toTimeString().slice(0, 5),
        status: appointment.status,
      })
    } else {
      const defaultDate = selectedDate || new Date()
      const defaultEndTime = new Date(defaultDate.getTime() + 30 * 60000) // 30 minutes later

      setFormData({
        title: "",
        description: "",
        patientId: "",
        startDate: defaultDate.toISOString().split("T")[0],
        startTime: defaultDate.toTimeString().slice(0, 5),
        endTime: defaultEndTime.toTimeString().slice(0, 5),
        status: "scheduled",
      })
    }
  }, [appointment, selectedDate, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`)
    const endDateTime = new Date(`${formData.startDate}T${formData.endTime}`)

    const appointmentData = {
      title: formData.title,
      description: formData.description,
      patientId: formData.patientId,
      doctorId: "doc1", // In a real app, this would come from auth
      startTime: startDateTime,
      endTime: endDateTime,
      status: formData.status,
    }

    onSave(appointmentData)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{appointment ? "Edit Appointment" : "New Appointment"}</DialogTitle>
          <DialogDescription>
            {appointment ? "Update appointment details" : "Schedule a new appointment with a patient"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="patient">Patient *</Label>
            <Select
              value={formData.patientId}
              onValueChange={(value) => setFormData({ ...formData, patientId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a patient" />
              </SelectTrigger>
              <SelectContent>
                {patients.map((patient) => (
                  <SelectItem key={patient.id} value={patient.id}>
                    {patient.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Regular Checkup, Follow-up Visit"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Additional details about the appointment..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Date *</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time *</Label>
              <Input
                id="startTime"
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endTime">End Time *</Label>
              <Input
                id="endTime"
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value: any) => setFormData({ ...formData, status: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{appointment ? "Update Appointment" : "Schedule Appointment"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
