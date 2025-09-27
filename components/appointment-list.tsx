"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { Edit, Trash2, Phone, Search } from "lucide-react"
import type { Appointment } from "@/lib/types"
import { formatDateTime, getInitials } from "@/lib/utils"

interface AppointmentListProps {
  appointments: Appointment[]
  onEdit: (apt: Appointment) => void
  onDelete: (id: string) => void
}

export function AppointmentList({ appointments, onEdit, onDelete }: AppointmentListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filtered = appointments.filter((apt) => {
    const matchesSearch = apt.patient?.name.toLowerCase().includes(searchTerm.toLowerCase()) || apt.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || apt.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled": return "default"
      case "completed": return "secondary"
      case "cancelled": return "destructive"
      default: return "default"
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="scheduled">Scheduled</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        {filtered.map((apt) => (
          <div key={apt.id} className="flex items-center justify-between p-4 bg-accent rounded-lg">
            <div className="flex items-center gap-4">
              <Avatar className="w-12 h-12">
                <AvatarFallback>{getInitials(apt.patient?.name || "")}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium">{apt.patient?.name}</p>
                  <Badge variant={getStatusColor(apt.status) as any}>{apt.status}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{apt.title}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{formatDateTime(apt.startTime)}</span>
                  {apt.patient?.phone && <div className="flex items-center gap-1"><Phone className="w-3 h-3" />{apt.patient.phone}</div>}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => onEdit(apt)}><Edit className="w-4 h-4" /></Button>
              <Button variant="outline" size="sm" onClick={() => onDelete(apt.id)}><Trash2 className="w-4 h-4" /></Button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <div className="text-center py-8 text-muted-foreground">No appointments found.</div>}
      </div>
    </div>
  )
}
