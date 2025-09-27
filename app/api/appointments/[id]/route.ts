import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const appointments = JSON.parse(localStorage?.getItem("appointments") || "[]")
    const appointment = appointments.find((a: any) => a.id === params.id)

    if (!appointment) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 })
    }

    return NextResponse.json(appointment)
  } catch (error) {
    console.error("Error fetching appointment:", error)
    return NextResponse.json({ error: "Failed to fetch appointment" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()

    const appointments = JSON.parse(localStorage?.getItem("appointments") || "[]")
    const appointmentIndex = appointments.findIndex((a: any) => a.id === params.id)

    if (appointmentIndex === -1) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 })
    }

    const updatedAppointment = {
      ...appointments[appointmentIndex],
      title: body.title,
      description: body.description,
      startTime: new Date(body.startTime),
      endTime: new Date(body.endTime),
      patientId: body.patientId,
      patientName: body.patientName || appointments[appointmentIndex].patientName,
      status: body.status,
      type: body.type || appointments[appointmentIndex].type,
      location: body.location || appointments[appointmentIndex].location,
      notes: body.notes || appointments[appointmentIndex].notes,
      updatedAt: new Date(),
    }

    appointments[appointmentIndex] = updatedAppointment
    localStorage.setItem("appointments", JSON.stringify(appointments))

    return NextResponse.json(updatedAppointment)
  } catch (error) {
    console.error("Error updating appointment:", error)
    return NextResponse.json({ error: "Failed to update appointment" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const appointments = JSON.parse(localStorage?.getItem("appointments") || "[]")
    const filteredAppointments = appointments.filter((a: any) => a.id !== params.id)

    if (appointments.length === filteredAppointments.length) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 })
    }

    localStorage.setItem("appointments", JSON.stringify(filteredAppointments))

    return NextResponse.json({ message: "Appointment deleted successfully" })
  } catch (error) {
    console.error("Error deleting appointment:", error)
    return NextResponse.json({ error: "Failed to delete appointment" }, { status: 500 })
  }
}
