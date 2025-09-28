"use client"

import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLocalStorage } from "@/hooks/use-local-storage"
import type { Doctor } from "@/hooks/use-doctors"
import { useDoctors } from "@/hooks/use-doctors"

interface DoctorSelectorProps {
  onDoctorChange?: (doctor: Doctor | null) => void
}

export function DoctorSelector({ onDoctorChange }: DoctorSelectorProps) {
  const { doctors, loading } = useDoctors()
  const [selectedDoctorId, setSelectedDoctorId] = useLocalStorage<string>("selected-doctor", "")

  const handleDoctorChange = (doctorId: string) => {
    setSelectedDoctorId(doctorId)
    const doctor = doctors.find((d) => d.id === doctorId) || null
    onDoctorChange?.(doctor)
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">Our Doctors</label>
      <Select value={selectedDoctorId} onValueChange={handleDoctorChange}>
        <SelectTrigger className="w-full bg-card/80 backdrop-blur-sm border-border/50">
          <SelectValue placeholder={loading ? "Loading doctors..." : "Select a doctor"} />
        </SelectTrigger>
        <SelectContent className="bg-popover/95 backdrop-blur-md border-border/50">
          {doctors.map((doctor) => (
            <SelectItem key={doctor.id} value={doctor.id} className="focus:bg-accent/50">
              <div className="flex items-center gap-3">
                                <div>
                  <p className="font-medium">{doctor.name}</p>
                  <p className="text-xs text-muted-foreground">{doctor.specialization}</p>
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
