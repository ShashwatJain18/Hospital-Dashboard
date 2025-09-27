"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import type { Appointment } from "@/lib/types"
import { formatTime } from "@/lib/utils"

interface CalendarViewProps {
  appointments: Appointment[]
  selectedDate: Date
  onAppointmentClick: (apt: Appointment) => void
  onDateClick: (date: Date) => void
}

export function CalendarView({
  appointments,
  selectedDate,
  onAppointmentClick,
  onDateClick,
}: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(selectedDate)

  const getAppointmentsForDate = (date: Date) =>
    appointments.filter((apt) => new Date(apt.startTime).toDateString() === date.toDateString())

  const getDaysInMonth = (year: number, month: number) => {
    const date = new Date(year, month, 1)
    const days = []
    while (date.getMonth() === month) {
      days.push(new Date(date))
      date.setDate(date.getDate() + 1)
    }
    return days
  }

  const days = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth())

  return (
    <Card>
      <CardContent className="p-6">
        <div className="grid grid-cols-7 gap-1 text-center font-medium text-sm text-muted-foreground mb-1">
          {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => <div key={d}>{d}</div>)}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {days.map((d, i) => {
            const isToday = d.toDateString() === new Date().toDateString()
            const isSelected = d.toDateString() === selectedDate.toDateString()
            const dayAppointments = getAppointmentsForDate(d)

            return (
              <div key={i} 
                   className={`min-h-[100px] p-2 border cursor-pointer hover:bg-accent ${isSelected ? "bg-primary/10 border-primary" : ""} ${isToday ? "bg-accent" : ""}`} 
                   onClick={() => onDateClick(d)}>
                <div className={`text-sm font-medium ${isToday ? "text-primary" : ""}`}>{d.getDate()}</div>
                <div className="space-y-1 mt-1 text-xs">
                  {dayAppointments.map(apt => (
                    <div key={apt.id} 
                         className="p-1 bg-primary/20 text-primary rounded cursor-pointer hover:bg-primary/30"
                         onClick={(e)=>{e.stopPropagation(); onAppointmentClick(apt)}}>
                      {formatTime(apt.startTime)} - {formatTime(apt.endTime)} : {apt.patient?.name} | {apt.title}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
