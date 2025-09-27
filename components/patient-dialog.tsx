"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Patient } from "@/lib/types";

interface PatientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patient: Patient | null;
  onSave: (patientData: Partial<Patient>) => void;
}

export function PatientDialog({ open, onOpenChange, patient, onSave }: PatientDialogProps) {
  const [formData, setFormData] = useState<Partial<Patient>>({});

  useEffect(() => {
    setFormData(patient || {});
  }, [patient]);

  // Calculate age automatically from DOB
  useEffect(() => {
    if (formData.dob) {
      const birthDate = new Date(formData.dob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      setFormData((prev) => ({ ...prev, age }));
    }
  }, [formData.dob]);

  const handleChange = (field: keyof Patient, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = () => {
    // Validations
    if (!formData.name || !/^[A-Za-z\s]+$/.test(formData.name)) return alert("Name must be alphabetic");
    if (!formData.aadhaar || !/^\d{12}$/.test(formData.aadhaar)) return alert("Aadhaar must be 12 digits");
    if (!formData.phone || !/^\d{10}$/.test(formData.phone)) return alert("Phone must be 10 digits");
    if (formData.height && !/^\d+$/.test(String(formData.height))) return alert("Height must be numeric");
    if (formData.weight && !/^\d+$/.test(String(formData.weight))) return alert("Weight must be numeric");
    if (!formData.email || !/^[\w.%+-]+@[\w.-]+\.[A-Za-z]{2,}$/.test(formData.email)) return alert("Invalid email");
    if (!formData.biometrics_otp || !/^\d+$/.test(String(formData.biometrics_otp))) return alert("Biometrics/OTP must be numeric");

    // Auto-generate ABHA ID = reverse of Aadhaar
    if (formData.aadhaar) formData.abha_id = formData.aadhaar.split("").reverse().join("");

    onSave(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{patient ? "Edit Patient" : "Add Patient"}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-4">
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
            <Label>Gender</Label>
            <Input value={formData.gender || ""} onChange={(e) => handleChange("gender", e.target.value)} />
          </div>

          <div>
            <Label>Height</Label>
            <Input value={formData.height || ""} onChange={(e) => handleChange("height", e.target.value)} />
          </div>

          <div>
            <Label>Weight</Label>
            <Input value={formData.weight || ""} onChange={(e) => handleChange("weight", e.target.value)} />
          </div>

          <div>
            <Label>Address</Label>
            <Input value={formData.address || ""} onChange={(e) => handleChange("address", e.target.value)} />
          </div>

          <div>
            <Label>Aadhaar</Label>
            <Input value={formData.aadhaar || ""} onChange={(e) => handleChange("aadhaar", e.target.value)} />
          </div>

          <div>
            <Label>ABHA ID</Label>
            <Input value={formData.abha_id || ""} readOnly />
          </div>

          <div>
            <Label>Phone</Label>
            <Input value={formData.phone || ""} onChange={(e) => handleChange("phone", e.target.value)} />
          </div>

          <div>
            <Label>Email</Label>
            <Input value={formData.email || ""} onChange={(e) => handleChange("email", e.target.value)} />
          </div>

          <div>
            <Label>Biometrics/OTP</Label>
            <Input value={formData.biometrics_otp || ""} onChange={(e) => handleChange("biometrics_otp", e.target.value)} />
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
            <Input value={formData.permanent_conditions || ""} onChange={(e) => handleChange("permanent_conditions", e.target.value)} />
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleSubmit}>{patient ? "Update" : "Add"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
  