"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Edit, Trash2, Phone, Search } from "lucide-react"
import { formatDateTime, getInitials } from "@/lib/utils"
import type { Appointment } from "@/lib/types"

interface AppointmentListProps {
  appointments: Appointment[]
  onEdit: (appointment: Appointment) => void
  onDelete: (appointmentId: string) => void
}

export function AppointmentList({ appointments, onEdit, onDelete }: AppointmentListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<"date" | "patient" | "status">("date")

  const filteredAppointments = appointments
    .filter((apt) => {
      const matchesSearch =
        apt.patient?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.title.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === "all" || apt.status === statusFilter
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "date":
          return new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
        case "patient":
          return (a.patient?.name || "").localeCompare(b.patient?.name || "")
        case "status":
          return a.status.localeCompare(b.status)
        default:
          return 0
      }
    })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "default"
      case "completed":
        return "secondary"
      case "cancelled":
        return "destructive"
      default:
        return "default"
    }
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search appointments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="scheduled">Scheduled</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Sort by Date</SelectItem>
            <SelectItem value="patient">Sort by Patient</SelectItem>
            <SelectItem value="status">Sort by Status</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Appointments list */}
      <div className="space-y-3">
        {filteredAppointments.map((appointment) => (
          <div key={appointment.id} className="flex items-center justify-between p-4 bg-accent rounded-lg">
            <div className="flex items-center gap-4">
              <Avatar className="w-12 h-12">
                <AvatarImage src={`/patient-${appointment.patientId}.png`} />
                <AvatarFallback>{getInitials(appointment.patient?.name || "")}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium">{appointment.patient?.name}</p>
                  <Badge variant={getStatusColor(appointment.status) as any}>{appointment.status}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{appointment.title}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{formatDateTime(appointment.startTime)}</span>
                  {appointment.patient?.phone && (
                    <div className="flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      {appointment.patient.phone}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => onEdit(appointment)}>
                <Edit className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => onDelete(appointment.id)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {filteredAppointments.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No appointments found matching your criteria.</p>
        </div>
      )}
    </div>
  )
}
