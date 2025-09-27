"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { PatientDialog } from "@/components/patient-dialog"
import { Search, Plus, Phone, Mail, Calendar, Filter } from "lucide-react"
import { formatDate, getInitials } from "@/lib/utils"
import { useSyncWithServer } from "@/hooks/use-sync-with-server"
import type { Patient } from "@/lib/types"
import Link from "next/link"

const samplePatients: Patient[] = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@email.com",
    phone: "(555) 123-4567",
    dateOfBirth: new Date("1985-03-15"),
    gender: "Male",
    address: "123 Main St, Anytown, ST 12345",
    notes: "Regular checkups, no known allergies",
    allergies: "None",
    lastVisit: new Date("2024-01-15"),
    createdAt: new Date("2023-06-01"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    name: "Emily Davis",
    email: "emily.davis@email.com",
    phone: "(555) 234-5678",
    dateOfBirth: new Date("1992-07-22"),
    gender: "Female",
    address: "456 Oak Ave, Somewhere, ST 67890",
    notes: "Hypertension monitoring",
    allergies: "Penicillin",
    lastVisit: new Date("2024-01-10"),
    createdAt: new Date("2023-08-15"),
    updatedAt: new Date("2024-01-10"),
  },
  {
    id: "3",
    name: "Michael Brown",
    email: "michael.brown@email.com",
    phone: "(555) 345-6789",
    dateOfBirth: new Date("1978-11-08"),
    gender: "Male",
    address: "789 Pine Rd, Elsewhere, ST 13579",
    notes: "Diabetes management, quarterly visits",
    allergies: "Shellfish",
    lastVisit: new Date("2024-01-05"),
    createdAt: new Date("2023-05-20"),
    updatedAt: new Date("2024-01-05"),
  },
]

export default function PatientsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)

  const { data: patients, setData: setPatients } = useSyncWithServer<Patient[]>(
    "patients",
    samplePatients,
    "/api/patients",
  )

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone?.includes(searchTerm),
  )

  const handleAddPatient = (patientData: Omit<Patient, "id" | "createdAt" | "updatedAt">) => {
    const newPatient: Patient = {
      ...patientData,
      id: Math.random().toString(36).substring(2),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setPatients([...patients, newPatient])
    setIsDialogOpen(false)
  }

  const handleEditPatient = (patientData: Omit<Patient, "id" | "createdAt" | "updatedAt">) => {
    if (!selectedPatient) return

    const updatedPatient: Patient = {
      ...selectedPatient,
      ...patientData,
      updatedAt: new Date(),
    }

    setPatients(patients.map((p) => (p.id === selectedPatient.id ? updatedPatient : p)))
    setIsDialogOpen(false)
    setSelectedPatient(null)
  }

  const openEditDialog = (patient: Patient) => {
    setSelectedPatient(patient)
    setIsDialogOpen(true)
  }

  const openAddDialog = () => {
    setSelectedPatient(null)
    setIsDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Patients</h1>
          <p className="text-muted-foreground">Manage your patient records and information</p>
        </div>
        <Button onClick={openAddDialog} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Patient
        </Button>
      </div>

      {/* Search and filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search patients by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Patients grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredPatients.map((patient) => (
          <Card key={patient.id} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={`/patient-${patient.id}.png`} />
                  <AvatarFallback>{getInitials(patient.name)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <CardTitle className="text-lg">
                    <Link href={`/patients/${patient.id}`} className="hover:text-primary transition-colors">
                      {patient.name}
                    </Link>
                  </CardTitle>
                  <CardDescription>
                    {patient.gender} •{" "}
                    {patient.dateOfBirth && new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear()}{" "}
                    years old
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {patient.email && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  {patient.email}
                </div>
              )}
              {patient.phone && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="w-4 h-4" />
                  {patient.phone}
                </div>
              )}
              {patient.lastVisit && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  Last visit: {formatDate(patient.lastVisit)}
                </div>
              )}
              {patient.allergies && patient.allergies !== "None" && (
                <div className="flex items-center gap-2">
                  <Badge variant="destructive" className="text-xs">
                    Allergies: {patient.allergies}
                  </Badge>
                </div>
              )}
              <div className="flex items-center justify-between pt-2">
                <Button variant="outline" size="sm" onClick={() => openEditDialog(patient)}>
                  Edit
                </Button>
                <Link href={`/patients/${patient.id}`}>
                  <Button variant="ghost" size="sm">
                    View Details
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPatients.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No patients found matching your search.</p>
          </CardContent>
        </Card>
      )}

      <PatientDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        patient={selectedPatient}
        onSave={selectedPatient ? handleEditPatient : handleAddPatient}
      />
    </div>
  )
}
