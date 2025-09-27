import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const patientId = searchParams.get("patientId")
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")

    const appointments = JSON.parse(localStorage?.getItem("appointments") || "[]")

    let filteredAppointments = appointments

    // Filter by patient ID if provided
    if (patientId) {
      filteredAppointments = filteredAppointments.filter((a: any) => a.patientId === patientId)
    }

    // Filter by date range if provided
    if (startDate && endDate) {
      const start = new Date(startDate)
      const end = new Date(endDate)
      filteredAppointments = filteredAppointments.filter((a: any) => {
        const appointmentDate = new Date(a.startTime)
        return appointmentDate >= start && appointmentDate <= end
      })
    }

    // Sort by start time
    const sortedAppointments = filteredAppointments.sort(
      (a: any, b: any) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
    )

    return NextResponse.json(sortedAppointments)
  } catch (error) {
    console.error("Error fetching appointments:", error)
    return NextResponse.json({ error: "Failed to fetch appointments" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const appointments = JSON.parse(localStorage?.getItem("appointments") || "[]")
    const newAppointment = {
      id: Date.now().toString(),
      patientId: body.patientId,
      patientName: body.patientName,
      title: body.title,
      description: body.description || "",
      startTime: new Date(body.startTime),
      endTime: new Date(body.endTime),
      type: body.type || "consultation",
      status: body.status || "scheduled",
      location: body.location || "Office 101",
      notes: body.notes || "",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const updatedAppointments = [...appointments, newAppointment]
    localStorage.setItem("appointments", JSON.stringify(updatedAppointments))

    return NextResponse.json(newAppointment, { status: 201 })
  } catch (error) {
    console.error("Error creating appointment:", error)
    return NextResponse.json({ error: "Failed to create appointment" }, { status: 500 })
  }
}
