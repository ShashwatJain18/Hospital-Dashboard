"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { formatTime } from "@/lib/utils"
import type { Appointment } from "@/lib/types"

interface CalendarViewProps {
  appointments: Appointment[]
  selectedDate: Date
  onDateSelect: (date: Date) => void
  onAppointmentClick: (appointment: Appointment) => void
  onDateClick: (date: Date) => void
  view: "month" | "week" | "day"
}

export function CalendarView({
  appointments,
  selectedDate,
  onDateSelect,
  onAppointmentClick,
  onDateClick,
  view,
}: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(selectedDate)

  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate)
    if (direction === "prev") {
      newDate.setMonth(newDate.getMonth() - 1)
    } else {
      newDate.setMonth(newDate.getMonth() + 1)
    }
    setCurrentDate(newDate)
  }

  const navigateWeek = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate)
    if (direction === "prev") {
      newDate.setDate(newDate.getDate() - 7)
    } else {
      newDate.setDate(newDate.getDate() + 7)
    }
    setCurrentDate(newDate)
  }

  const navigateDay = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate)
    if (direction === "prev") {
      newDate.setDate(newDate.getDate() - 1)
    } else {
      newDate.setDate(newDate.getDate() + 1)
    }
    setCurrentDate(newDate)
  }

  const getAppointmentsForDate = (date: Date) => {
    return appointments.filter((apt) => {
      const aptDate = new Date(apt.startTime)
      return (
        aptDate.getDate() === date.getDate() &&
        aptDate.getMonth() === date.getMonth() &&
        aptDate.getFullYear() === date.getFullYear()
      )
    })
  }

  const renderMonthView = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())

    const days = []
    const currentDateObj = new Date(startDate)

    for (let i = 0; i < 42; i++) {
      days.push(new Date(currentDateObj))
      currentDateObj.setDate(currentDateObj.getDate() + 1)
    }

    return (
      <div className="grid grid-cols-7 gap-1">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
            {day}
          </div>
        ))}
        {days.map((day, index) => {
          const isCurrentMonth = day.getMonth() === month
          const isToday = day.toDateString() === new Date().toDateString()
          const isSelected = day.toDateString() === selectedDate.toDateString()
          const dayAppointments = getAppointmentsForDate(day)

          return (
            <div
              key={index}
              className={`min-h-[100px] p-2 border border-border cursor-pointer hover:bg-accent transition-colors ${
                !isCurrentMonth ? "text-muted-foreground bg-muted/30" : ""
              } ${isSelected ? "bg-primary/10 border-primary" : ""} ${isToday ? "bg-accent" : ""}`}
              onClick={() => {
                onDateSelect(day)
                onDateClick(day)
              }}
            >
              <div className={`text-sm font-medium ${isToday ? "text-primary" : ""}`}>{day.getDate()}</div>
              <div className="space-y-1 mt-1">
                {dayAppointments.slice(0, 2).map((apt) => (
                  <div
                    key={apt.id}
                    className="text-xs p-1 bg-primary/20 text-primary rounded cursor-pointer hover:bg-primary/30"
                    onClick={(e) => {
                      e.stopPropagation()
                      onAppointmentClick(apt)
                    }}
                  >
                    {formatTime(apt.startTime)} {apt.patient?.name}
                  </div>
                ))}
                {dayAppointments.length > 2 && (
                  <div className="text-xs text-muted-foreground">+{dayAppointments.length - 2} more</div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  const renderWeekView = () => {
    const startOfWeek = new Date(currentDate)
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay())

    const weekDays = []
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek)
      day.setDate(startOfWeek.getDate() + i)
      weekDays.push(day)
    }

    const hours = Array.from({ length: 12 }, (_, i) => i + 8) // 8 AM to 7 PM

    return (
      <div className="grid grid-cols-8 gap-1">
        <div className="p-2"></div>
        {weekDays.map((day) => (
          <div key={day.toISOString()} className="p-2 text-center border-b border-border">
            <div className="text-sm font-medium">{day.toLocaleDateString("en-US", { weekday: "short" })}</div>
            <div className={`text-lg ${day.toDateString() === new Date().toDateString() ? "text-primary" : ""}`}>
              {day.getDate()}
            </div>
          </div>
        ))}

        {hours.map((hour) => (
          <>
            <div key={hour} className="p-2 text-sm text-muted-foreground text-right border-r border-border">
              {hour}:00
            </div>
            {weekDays.map((day) => {
              const dayAppointments = getAppointmentsForDate(day).filter((apt) => {
                const aptHour = new Date(apt.startTime).getHours()
                return aptHour === hour
              })

              return (
                <div
                  key={`${day.toISOString()}-${hour}`}
                  className="min-h-[60px] p-1 border border-border cursor-pointer hover:bg-accent"
                  onClick={() => {
                    const clickedDate = new Date(day)
                    clickedDate.setHours(hour, 0, 0, 0)
                    onDateClick(clickedDate)
                  }}
                >
                  {dayAppointments.map((apt) => (
                    <div
                      key={apt.id}
                      className="text-xs p-1 bg-primary text-primary-foreground rounded mb-1 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation()
                        onAppointmentClick(apt)
                      }}
                    >
                      {apt.patient?.name}
                    </div>
                  ))}
                </div>
              )
            })}
          </>
        ))}
      </div>
    )
  }

  const renderDayView = () => {
    const hours = Array.from({ length: 12 }, (_, i) => i + 8) // 8 AM to 7 PM
    const dayAppointments = getAppointmentsForDate(currentDate)

    return (
      <div className="space-y-1">
        <div className="text-center p-4 border-b border-border">
          <h3 className="text-lg font-medium">
            {currentDate.toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </h3>
        </div>

        {hours.map((hour) => {
          const hourAppointments = dayAppointments.filter((apt) => {
            const aptHour = new Date(apt.startTime).getHours()
            return aptHour === hour
          })

          return (
            <div key={hour} className="flex border-b border-border">
              <div className="w-20 p-4 text-sm text-muted-foreground text-right border-r border-border">{hour}:00</div>
              <div
                className="flex-1 min-h-[80px] p-2 cursor-pointer hover:bg-accent"
                onClick={() => {
                  const clickedDate = new Date(currentDate)
                  clickedDate.setHours(hour, 0, 0, 0)
                  onDateClick(clickedDate)
                }}
              >
                {hourAppointments.map((apt) => (
                  <div
                    key={apt.id}
                    className="p-2 bg-primary text-primary-foreground rounded mb-2 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation()
                      onAppointmentClick(apt)
                    }}
                  >
                    <div className="font-medium">{apt.patient?.name}</div>
                    <div className="text-sm opacity-90">{apt.title}</div>
                    <div className="text-xs opacity-75">
                      {formatTime(apt.startTime)} - {formatTime(apt.endTime)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  const getNavigationLabel = () => {
    switch (view) {
      case "month":
        return currentDate.toLocaleDateString("en-US", { year: "numeric", month: "long" })
      case "week":
        const startOfWeek = new Date(currentDate)
        startOfWeek.setDate(currentDate.getDate() - currentDate.getDay())
        const endOfWeek = new Date(startOfWeek)
        endOfWeek.setDate(startOfWeek.getDate() + 6)
        return `${startOfWeek.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })} - ${endOfWeek.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`
      case "day":
        return currentDate.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })
    }
  }

  const handleNavigation = (direction: "prev" | "next") => {
    switch (view) {
      case "month":
        navigateMonth(direction)
        break
      case "week":
        navigateWeek(direction)
        break
      case "day":
        navigateDay(direction)
        break
    }
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">{getNavigationLabel()}</h2>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => handleNavigation("prev")}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
              Today
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleNavigation("next")}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {view === "month" && renderMonthView()}
        {view === "week" && renderWeekView()}
        {view === "day" && renderDayView()}
      </CardContent>
    </Card>
  )
}
