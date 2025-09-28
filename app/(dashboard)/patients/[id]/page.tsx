"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PatientDialog } from "@/components/patient-dialog";
import { ArrowLeft, Edit, Upload, FileText } from "lucide-react";
import { formatDate, getInitials } from "@/lib/utils";
import type { Patient } from "@/lib/types";
import { supabase } from "@/lib/supabase";

interface MedicalRecord {
  id: string;
  patient_id: string;
  filename: string;
  upload_date: string;
  uploaded_by: string;
  summary: string;
  type: string;
  storage_path: string;
}

export default function PatientDetailPage() {
  const params = useParams();
  const patientId = params.id as string;
  const router = useRouter();

  const [patient, setPatient] = useState<Patient | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  // Fetch patient info
  const fetchPatient = async () => {
    const { data, error } = await supabase.from("patient").select("*").eq("id", patientId).single();
    if (error) console.error("Error fetching patient:", error);
    else setPatient(data);
  };

  // Fetch medical records
  const fetchRecords = async () => {
    const { data, error } = await supabase
      .from("medical_records")
      .select("*")
      .eq("patient_id", patientId)
      .order("upload_date", { ascending: false });
    if (error) console.error("Error fetching medical records:", error);
    else setRecords(data || []);
  };

  useEffect(() => {
    fetchPatient();
    fetchRecords();
  }, [patientId]);

  if (!patient) return <p className="text-center py-12">Loading patient details...</p>;

  // Handle file upload
  const handleUploadRecord = async () => {
    if (!selectedFile) return alert("Please select a file to upload.");
    setUploading(true);

    try {
      const fileName = `${patientId}/${Date.now()}_${selectedFile.name}`;
      
      // Upload to Supabase Storage
      const { error: storageError } = await supabase.storage
        .from("medical-files")
        .upload(fileName, selectedFile, { upsert: true });

      if (storageError) throw storageError;

      // Save record metadata in DB
      const { error: dbError } = await supabase
        .from("medical_records")
        .insert([{
          patient_id: patientId,
          filename: selectedFile.name,
          upload_date: new Date().toISOString(),
          uploaded_by: "Dr. Admin",
          summary: "",
          type: selectedFile.type,
          storage_path: fileName
        }]);

      if (dbError) throw dbError;

      // Refresh records and reset
      await fetchRecords();
      setSelectedFile(null);
      alert("File uploaded successfully!");
    } catch (err: any) {
      console.error("Upload error:", err);
      alert("Failed to upload fil: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.push("/patients")}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-foreground">{patient.name}</h1>
          <p className="text-muted-foreground">Patient Details</p>
        </div>
        <Button onClick={() => setIsEditDialogOpen(true)} className="gap-2">
          <Edit className="w-4 h-4" />
          Edit Patient
        </Button>
      </div>

      {/* Patient Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={`/patient-${patient.id}.png`} />
              <AvatarFallback>{getInitials(patient.name)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <CardTitle className="text-2xl">{patient.name}</CardTitle>
              <CardDescription className="text-base">
                {patient.gender} • {patient.dob ? new Date().getFullYear() - new Date(patient.dob).getFullYear() : "—"} years old
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <div>Email: {patient.email || "None"}</div>
            <div>Phone: {patient.phone || "None"}</div>
            <div>Address: {patient.address || "None"}</div>
            <div>Last Visit: {patient.last_visit ? formatDate(patient.last_visit) : "None"}</div>
            <div>Allergies: {patient.allergies || "None"}</div>
            <div>Medical Conditions: {patient.medical_conditions || "None"}</div>
            <div>Height: {patient.height ? `${patient.height} cm` : "None"}</div>
            <div>Weight: {patient.weight ? `${patient.weight} kg` : "None"}</div>
            <div>Workplace: {patient.workplace || "None"}</div>
          </div>
        </CardContent>
      </Card>

      {/* Upload PDF */}
      <Card>
        <CardHeader>
          <CardTitle>Add Medical Record</CardTitle>
          <CardDescription>Select a file to upload</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <label htmlFor="record-file" className="flex-1 cursor-pointer">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">{selectedFile ? selectedFile.name : "Choose File"}</p>
              </div>
            </label>
           <input
  id="record-file"
  type="file"
  className="hidden"
  accept="application/pdf,image/*"  // Accept PDF and images
  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
/>

            <Button
              onClick={handleUploadRecord}
              disabled={!selectedFile || uploading}
              className="bg-black hover:bg-gray-800 h-12 px-6"
            >
              {uploading ? "Uploading..." : "Upload"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Past Records */}
      <Card className="max-h-[400px] overflow-y-auto">
        <CardHeader>
          <CardTitle>Past Medical Records</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {records.length === 0 && <p className="text-muted-foreground italic">No medical records found.</p>}
          {records.map((rec) => (
            <div key={rec.id} className="flex justify-between items-center p-3 border rounded hover:shadow-sm transition-shadow">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="font-medium">{rec.filename}</p>
                  <p className="text-sm text-muted-foreground">{rec.type} • {new Date(rec.upload_date).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <a
                  href={supabase.storage.from("medical-files").getPublicUrl(rec.storage_path).data.publicUrl}
                  target="_blank"
                  className="text-blue-600 hover:underline flex items-center gap-1"
                >
                  View
                </a>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Edit Patient Dialog */}
      <PatientDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        patient={patient}
        onSave={(updatedPatient) => { setPatient(updatedPatient as Patient); setIsEditDialogOpen(false); }}
      />
    </div>
  );
}
