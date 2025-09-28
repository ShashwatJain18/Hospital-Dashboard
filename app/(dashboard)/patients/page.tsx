"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
  const [dialogMode, setDialogMode] = useState<"add" | "edit" | "find">("add");

  // Fetch patients from Supabase
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
    patient.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phone?.toString().includes(searchTerm)
);

  // Open dialogs
  const openAddDialog = () => {
    setSelectedPatient(null);
    setDialogMode("add");
    setIsDialogOpen(true);
  };

  const openEditDialog = (patient: Patient) => {
    setSelectedPatient(patient);
    setDialogMode("edit");
    setIsDialogOpen(true);
  };

  const openFindFaceDialog = () => {
    setSelectedPatient(null);
    setDialogMode("find");
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
        <div className="flex gap-2">
          <Button onClick={openAddDialog} className="gap-2">
            <Plus className="w-4 h-4" /> Add Patient
          </Button>
          <Button variant="outline" onClick={openFindFaceDialog}>
            Find Patient by Face
          </Button>
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6 flex flex-col md:flex-row items-start md:items-center gap-4">
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
                <div><strong>ABHA ID:</strong> {patient.abha_id || "N/A"}</div>
                <div><strong>Allergies:</strong> {patient.allergies || "None"}</div>
                <div><strong>Permanent Conditions:</strong> {patient.permanent_conditions || "None"}</div>
                <div><strong>Height:</strong> {patient.height || "N/A"} cm</div>
                <div><strong>Weight:</strong> {patient.weight || "N/A"} kg</div>
              </div>
              {patient.email && <div className="flex items-center gap-2 text-sm text-muted-foreground"><Mail className="w-4 h-4" /> {patient.email}</div>}
              {patient.phone && <div className="flex items-center gap-2 text-sm text-muted-foreground"><Phone className="w-4 h-4" /> {patient.phone}</div>}
              {patient.last_visit && <div className="flex items-center gap-2 text-sm text-muted-foreground"><Calendar className="w-4 h-4" /> Last visit: {formatDate(patient.last_visit)}</div>}

              <div className="flex items-center justify-between pt-2">
                <Button variant="outline" size="sm" onClick={() => openEditDialog(patient)}>Edit</Button>
                <div className="flex gap-2">
                  <Link href={`/patients/${patient.id}`}><Button variant="ghost" size="sm">View Details</Button></Link>
                  <Button variant="destructive" size="sm" onClick={() => handleDeletePatient(patient)}>Delete</Button>
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

      {/* Patient Dialog */}
      <PatientDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        patient={selectedPatient}
        mode={dialogMode}
        onSave={(data) => {
          if (dialogMode === "find") {
            console.log("Face descriptor captured for search:", data.face_descriptor);
            setIsDialogOpen(false);
            return;
          }

          // Add or update patient
          (async () => {
            if (dialogMode === "edit" && selectedPatient) {
              const { error } = await supabase.from("patient").update(data).eq("id", selectedPatient.id);
              if (error) return alert("Error updating patient: " + error.message);
              setPatients((prev) => prev.map((p) => (p.id === selectedPatient.id ? { ...p, ...data } : p)));
            } else {
              const { data: newPatient, error } = await supabase.from("patient").insert(data).select().single();
              if (error) return alert("Error adding patient: " + error.message);
              setPatients((prev) => [newPatient, ...prev]);
            }
            setIsDialogOpen(false);
          })();
        }}
      />
    </div>
  );
}
