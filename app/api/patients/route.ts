import { type NextRequest, NextResponse } from "next/server"

export async function GET() {
  try {
    const patients = JSON.parse(localStorage?.getItem("patients") || "[]")
    return NextResponse.json(patients)
  } catch (error) {
    console.error("Error fetching patients:", error)
    return NextResponse.json({ error: "Failed to fetch patients" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const patients = JSON.parse(localStorage?.getItem("patients") || "[]")
    const newPatient = {
      id: Date.now().toString(),
      name: body.name,
      email: body.email,
      phone: body.phone,
      dateOfBirth: body.dateOfBirth ? new Date(body.dateOfBirth) : null,
      gender: body.gender,
      address: body.address,
      emergencyContact: body.emergencyContact || "",
      medicalHistory: body.medicalHistory || "",
      allergies: body.allergies || "",
      medications: body.medications || "",
      insuranceProvider: body.insuranceProvider || "",
      insurancePolicyNumber: body.insurancePolicyNumber || "",
      notes: body.notes || "",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const updatedPatients = [newPatient, ...patients]
    localStorage.setItem("patients", JSON.stringify(updatedPatients))

    return NextResponse.json(newPatient, { status: 201 })
  } catch (error) {
    console.error("Error creating patient:", error)
    return NextResponse.json({ error: "Failed to create patient" }, { status: 500 })
  }
}
