import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const patients = JSON.parse(localStorage?.getItem("patients") || "[]")
    const patient = patients.find((p: any) => p.id === params.id)

    if (!patient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 })
    }

    return NextResponse.json(patient)
  } catch (error) {
    console.error("Error fetching patient:", error)
    return NextResponse.json({ error: "Failed to fetch patient" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()

    const patients = JSON.parse(localStorage?.getItem("patients") || "[]")
    const patientIndex = patients.findIndex((p: any) => p.id === params.id)

    if (patientIndex === -1) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 })
    }

    const updatedPatient = {
      ...patients[patientIndex],
      name: body.name,
      email: body.email,
      phone: body.phone,
      dateOfBirth: body.dateOfBirth ? new Date(body.dateOfBirth) : null,
      gender: body.gender,
      address: body.address,
      emergencyContact: body.emergencyContact || patients[patientIndex].emergencyContact,
      medicalHistory: body.medicalHistory || patients[patientIndex].medicalHistory,
      allergies: body.allergies || patients[patientIndex].allergies,
      medications: body.medications || patients[patientIndex].medications,
      insuranceProvider: body.insuranceProvider || patients[patientIndex].insuranceProvider,
      insurancePolicyNumber: body.insurancePolicyNumber || patients[patientIndex].insurancePolicyNumber,
      notes: body.notes || patients[patientIndex].notes,
      updatedAt: new Date(),
    }

    patients[patientIndex] = updatedPatient
    localStorage.setItem("patients", JSON.stringify(patients))

    return NextResponse.json(updatedPatient)
  } catch (error) {
    console.error("Error updating patient:", error)
    return NextResponse.json({ error: "Failed to update patient" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const patients = JSON.parse(localStorage?.getItem("patients") || "[]")
    const filteredPatients = patients.filter((p: any) => p.id !== params.id)

    if (patients.length === filteredPatients.length) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 })
    }

    localStorage.setItem("patients", JSON.stringify(filteredPatients))

    return NextResponse.json({ message: "Patient deleted successfully" })
  } catch (error) {
    console.error("Error deleting patient:", error)
    return NextResponse.json({ error: "Failed to delete patient" }, { status: 500 })
  }
}
