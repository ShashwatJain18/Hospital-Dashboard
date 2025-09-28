"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Patient } from "@/lib/types";
import * as faceapi from "face-api.js";

interface PatientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patient: Patient | null;
  onSave: (patientData: Partial<Patient>) => void;
  mode?: "add" | "edit" | "find"; // <-- define mode
}

export function PatientDialog({ open, onOpenChange, patient, onSave, mode = "add" }: PatientDialogProps) {
  const [formData, setFormData] = useState<Partial<Patient>>({});
  const [videoRef, setVideoRef] = useState<HTMLVideoElement | null>(null);
  const [capturedFace, setCapturedFace] = useState<string | null>(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);

  // Load face-api models
  useEffect(() => {
    async function loadModels() {
      const MODEL_URL = "/models";
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
      ]);
      setModelsLoaded(true);
    }
    loadModels();
  }, []);

  // Start camera
  useEffect(() => {
    if (!videoRef) return;
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.srcObject = stream;
      } catch (err) {
        console.error("Camera error:", err);
      }
    };
    if (mode === "find" || mode === "add" || mode === "edit") startCamera();

    return () => {
      if (videoRef?.srcObject) {
        (videoRef.srcObject as MediaStream)
          .getTracks()
          .forEach((track) => track.stop());
      }
    };
  }, [videoRef, mode]);

  // Load patient data if editing
  useEffect(() => {
    if (patient) setFormData(patient);
    else setFormData({});
  }, [patient]);

  // Auto-calculate age
  useEffect(() => {
    if (formData.dob) {
      const birthDate = new Date(formData.dob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
      setFormData((prev) => ({ ...prev, age }));
    }
  }, [formData.dob]);

  const handleChange = (field: keyof Patient, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const captureFace = async () => {
    if (!videoRef) return alert("Video not ready");
    if (!modelsLoaded) return alert("Models not loaded yet");

    const canvas = document.createElement("canvas");
    canvas.width = videoRef.videoWidth;
    canvas.height = videoRef.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return alert("Cannot get canvas context");
    ctx.drawImage(videoRef, 0, 0, canvas.width, canvas.height);

    const detection = await faceapi
      .detectSingleFace(canvas, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!detection) return alert("No face detected. Try again.");

    const descriptorArray = Array.from(detection.descriptor);
    if (mode !== "find") setFormData({ ...formData, face_descriptor: descriptorArray });
    setCapturedFace(canvas.toDataURL());

    alert("Face captured successfully!");
  };

  const handleSubmit = () => {
    if (mode === "find") return; // no form submission in find mode

    // Basic validation
    if (!formData.name || !/^[A-Za-z\s]+$/.test(formData.name)) return alert("Name must be alphabetic");
    if (!formData.aadhaar || !/^\d{12}$/.test(formData.aadhaar)) return alert("Aadhaar must be 12 digits");
    if (!formData.phone || !/^\d{10}$/.test(formData.phone)) return alert("Phone must be 10 digits");
    if (formData.height && !/^\d+$/.test(String(formData.height))) return alert("Height must be numeric");
    if (formData.weight && !/^\d+$/.test(String(formData.weight))) return alert("Weight must be numeric");
    if (!formData.email || !/^[\w.%+-]+@[\w.-]+\.[A-Za-z]{2,}$/.test(formData.email)) return alert("Invalid email");

    if (formData.aadhaar && !formData.abha_id) {
      formData.abha_id = formData.aadhaar.split("").reverse().join("");
    }

    onSave(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
  className={
    mode === "find"
      ? "w-[400px] max-w-full flex flex-col items-center justify-center gap-4"
      : "max-w-[90vw] w-[90vw] h-[80vh] overflow-auto flex flex-col md:flex-row gap-6"
  }
>

        {/* Form fields only if mode is add/edit */}
        {(mode === "add" || mode === "edit") && (
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Name</Label>
              <Input value={formData.name || ""} onChange={(e) => handleChange("name", e.target.value)} />
            </div>
            <div>
              <Label>DOB</Label>
              <Input type="date" value={formData.dob || ""} onChange={(e) => handleChange("dob", e.target.value)} />
            </div>
            <div>
              <Label>Age</Label>
              <Input type="number" value={formData.age || ""} readOnly />
            </div>
            <div>
              <Label>Email</Label>
              <Input value={formData.email || ""} onChange={(e) => handleChange("email", e.target.value)} />
            </div>
            <div>
              <Label>Phone</Label>
              <Input value={formData.phone || ""} onChange={(e) => handleChange("phone", e.target.value)} />
            </div>
            <div>
              <Label>Aadhaar</Label>
              <Input value={formData.aadhaar || ""} onChange={(e) => handleChange("aadhaar", e.target.value)} />
            </div>
            <div>
              <Label>ABHA ID</Label>
              <Input value={formData.abha_id || ""} onChange={(e) => handleChange("abha_id", e.target.value)} />
            </div>
            <div>
              <Label>Gender</Label>
              <Input value={formData.gender || ""} onChange={(e) => handleChange("gender", e.target.value)} />
            </div>
            <div>
              <Label>Height (cm)</Label>
              <Input value={formData.height || ""} onChange={(e) => handleChange("height", e.target.value)} />
            </div>
            <div>
              <Label>Weight (kg)</Label>
              <Input value={formData.weight || ""} onChange={(e) => handleChange("weight", e.target.value)} />
            </div>
            <div>
              <Label>Address</Label>
              <Input value={formData.address || ""} onChange={(e) => handleChange("address", e.target.value)} />
            </div>
            <div>
              <Label>Medicines</Label>
              <Input value={formData.medicines || ""} onChange={(e) => handleChange("medicines", e.target.value)} />
            </div>
            <div>
              <Label>Allergies</Label>
              <Input value={formData.allergies || ""} onChange={(e) => handleChange("allergies", e.target.value)} />
            </div>
            <div>
              <Label>Permanent Conditions</Label>
              <Input
                value={formData.permanent_conditions || ""}
                onChange={(e) => handleChange("permanent_conditions", e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Face Capture */}
        <div className="flex flex-col items-center gap-4">
          <Label>Capture Face</Label>
          <video ref={setVideoRef} autoPlay muted width={250} height={200} className="border rounded" />
          <Button onClick={captureFace} className="mt-2">Capture Face</Button>
          {capturedFace && <img src={capturedFace} className="mt-2 w-32 h-32 rounded border" />}
        </div>

        <DialogFooter className="absolute bottom-4 right-4">
          {mode !== "find" && <Button onClick={handleSubmit}>{mode === "edit" ? "Update" : "Add"}</Button>}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
