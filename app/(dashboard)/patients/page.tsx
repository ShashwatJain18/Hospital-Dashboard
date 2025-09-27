"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PatientDialog } from "@/components/patient-dialog";
import { Search, Plus, Phone, Mail, Calendar, Filter } from "lucide-react";
import { formatDate, getInitials } from "@/lib/utils";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";
import type { Patient } from "@/lib/types";

export default function PatientsPage() {
  const supabase = createClientComponentClient();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const fetchPatients = async () => {
    const { data, error } = await supabase
      .from("patient")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) console.error("Error fetching patients:", error);
    else setPatients(data || []);
  };

  useEffect(() => {
    fetchPatients();
    const patientChannel = supabase
      .channel("patient-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "patient" }, () => fetchPatients())
      .subscribe();
    return () => supabase.removeChannel(patientChannel);
  }, []);

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone?.includes(searchTerm)
  );

  // Add patient
  const handleAddPatient = async (patientData: Partial<Patient>) => {
    if (!patientData.name) return alert("Name is required");
    if (!patientData.aadhaar || patientData.aadhaar.length !== 12) return alert("Aadhaar must be 12 digits");
    if (!patientData.phone || patientData.phone.length !== 10) return alert("Phone must be 10 digits");

    const uniqueid = patientData.aadhaar.split("").reverse().join("");

    const { data, error } = await supabase
      .from("patient")
      .insert([{
        name: patientData.name,
        dob: patientData.dob,
        age: patientData.age ? Number(patientData.age) : null,
        height: patientData.height || null,
        weight: patientData.weight || null,
        workplace: patientData.workplace || null,
        address: patientData.address || null,
        aadhaar: patientData.aadhaar,
        uniqueid,
        history: patientData.history || null,
        medicines: patientData.medicines || null,
        allergies: patientData.allergies || null,
        permanent_conditions: patientData.permanent_conditions || null,
        gender: patientData.gender || null,
        phone: patientData.phone || null,
        email: patientData.email || null,
      }])
      .select();

    if (error) {
      console.error("Error adding patient:", error);
      return alert("Error adding patient: " + error.message);
    }

    if (data && data.length > 0) {
      setPatients([data[0], ...patients]);
    }

    setIsDialogOpen(false);
  };

  // Edit patient
  const handleEditPatient = async (patientData: Partial<Patient>) => {
    if (!selectedPatient) return;

    const { data, error } = await supabase
      .from("patient")
      .update({ ...patientData, age: patientData.age ? Number(patientData.age) : null })
      .eq("id", selectedPatient.id)
      .select();

    if (error) {
      console.error("Error updating patient:", error);
      return;
    }

    if (data && data.length > 0)
      setPatients(patients.map((p) => (p.id === selectedPatient.id ? data[0] : p)));

    setIsDialogOpen(false);
    setSelectedPatient(null);
  };

  const openEditDialog = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsDialogOpen(true);
  };

  const openAddDialog = () => {
    setSelectedPatient(null);
    setIsDialogOpen(true);
  };

  // Delete patient
  const handleDeletePatient = async (patient: Patient) => {
    if (!confirm(`Are you sure you want to delete ${patient.name}?`)) return;
    const { error } = await supabase.from("patient").delete().eq("id", patient.id);
    if (error) {
      alert("Error deleting patient: " + error.message);
      console.error(error);
    } else {
      setPatients((prev) => prev.filter((p) => p.id !== patient.id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Patients</h1>
          <p className="text-muted-foreground">Manage your patient records and information</p>
        </div>
        <Button onClick={openAddDialog} className="gap-2">
          <Plus className="w-4 h-4" /> Add Patient
        </Button>
      </div>

      {/* Search */}
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

      {/* Patients Grid */}
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
                    {patient.gender} • {patient.dob ? new Date().getFullYear() - new Date(patient.dob).getFullYear() : 0} years old
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                <div>
                  <strong>Allergies:</strong> {patient.allergies || "None"}
                </div>
                <div>
                  <strong>Permanent Conditions:</strong> {patient.permanent_conditions || "None"}
                </div>
                <div>
                  <strong>History:</strong> {patient.history || "None"}
                </div>
              </div>

              {patient.email && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="w-4 h-4" /> {patient.email}
                </div>
              )}
              {patient.phone && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="w-4 h-4" /> {patient.phone}
                </div>
              )}
              {patient.last_visit && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" /> Last visit: {formatDate(patient.last_visit)}
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <Button variant="outline" size="sm" onClick={() => openEditDialog(patient)}>
                  Edit
                </Button>
                <div className="flex gap-2">
                  <Link href={`/patients/${patient.id}`}>
                    <Button variant="ghost" size="sm">View Details</Button>
                  </Link>
                  <Button variant="destructive" size="sm" onClick={() => handleDeletePatient(patient)}>
                    Delete
                  </Button>
                </div>
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
  );
}
