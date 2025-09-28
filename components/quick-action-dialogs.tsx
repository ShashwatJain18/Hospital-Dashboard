"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { DoctorSelector } from "./doctor-selector"
import { useDoctors } from "@/hooks/use-doctors"

interface NewAppointmentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function NewAppointmentDialog({ open, onOpenChange }: NewAppointmentDialogProps) {
  const { doctors, loading } = useDoctors()
  const [date, setDate] = useState<Date>()
  const [formData, setFormData] = useState({
    
    patientName: "",
    doctorId: "",
    time: "",
    type: "",
    notes: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle appointment creation
    console.log("Creating appointment:", { ...formData, date })
    onOpenChange(false)
    // Reset form
    setFormData({ patientName: "", doctorId: "", time: "", type: "", notes: "" })
    setDate(undefined)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New Appointment</DialogTitle>
          <DialogDescription>Schedule a new appointment for a patient.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="patientName">Patient Name</Label>
            <Input
              id="patientName"
              value={formData.patientName}
              onChange={(e) => setFormData((prev) => ({ ...prev, patientName: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Doctor</Label>
            <Select
  value={formData.doctorId}
  onValueChange={(value) => setFormData((prev) => ({ ...prev, doctorId: value }))}
>
  <SelectTrigger>
    <SelectValue placeholder="Select doctor" />
  </SelectTrigger>
  <SelectContent>
    {loading ? (
      <SelectItem value="" disabled>Loading doctors...</SelectItem>
    ) : (
      doctors.map((doctor) => (
        <SelectItem key={doctor.id} value={doctor.id}>
          {doctor.name} - {doctor.specialization}
        </SelectItem>
      ))
    )}
  </SelectContent>
</Select>

          </div>

          <div className="space-y-2">
            <Label>Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="time">Time</Label>
            <Input
              id="time"
              type="time"
              value={formData.time}
              onChange={(e) => setFormData((prev) => ({ ...prev, time: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Appointment Type</Label>
            <Select value={formData.type} onValueChange={(value) => setFormData((prev) => ({ ...prev, type: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="consultation">Consultation</SelectItem>
                <SelectItem value="checkup">Regular Checkup</SelectItem>
                <SelectItem value="followup">Follow-up</SelectItem>
                <SelectItem value="emergency">Emergency</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Appointment</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

interface AddPatientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: any) => void; // send patient data to parent
}

export function AddPatientDialog({ open, onOpenChange, onSave }: AddPatientDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    age: "",
    gender: "",
    height: "",
    weight: "",
    workplace: "",
    address: "",
    aadhaar: "",
    phone: "",
    email: "",
    permanent_conditions: "",
    allergies: "",
    medicines: "",
    history: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onOpenChange(false);
    setFormData({
      name: "",
      dob: "",
      age: "",
      gender: "",
      height: "",
      weight: "",
      workplace: "",
      address: "",
      aadhaar: "",
      phone: "",
      email: "",
      permanent_conditions: "",
      allergies: "",
      medicines: "",
      history: "",
    });
  };

  

   return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Patient</DialogTitle>
          <DialogDescription>Fill in all the details to add a new patient.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dob">Date of Birth</Label>
              <Input
                id="dob"
                type="date"
                value={formData.dob}
                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Gender</Label>
              <Select
                value={formData.gender}
                onValueChange={(value) => setFormData({ ...formData, gender: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="height">Height (cm)</Label>
              <Input
                id="height"
                type="number"
                value={formData.height}
                onChange={(e) => setFormData({ ...formData, height: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="workplace">Workplace</Label>
              <Input
                id="workplace"
                value={formData.workplace}
                onChange={(e) => setFormData({ ...formData, workplace: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                rows={2}
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="aadhaar">Aadhaar Number</Label>
              <Input
                id="aadhaar"
                value={formData.aadhaar}
                onChange={(e) => setFormData({ ...formData, aadhaar: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="permanent_conditions">Permanent Conditions</Label>
              <Textarea
                id="permanent_conditions"
                rows={2}
                value={formData.permanent_conditions}
                onChange={(e) => setFormData({ ...formData, permanent_conditions: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="allergies">Allergies</Label>
              <Textarea
                id="allergies"
                rows={2}
                value={formData.allergies}
                onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="medicines">Medicines</Label>
              <Textarea
                id="medicines"
                rows={2}
                value={formData.medicines}
                onChange={(e) => setFormData({ ...formData, medicines: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="history">Medical History</Label>
              <Textarea
                id="history"
                rows={2}
                value={formData.history}
                onChange={(e) => setFormData({ ...formData, history: e.target.value })}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Patient</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
interface QuickMessageDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function QuickMessageDialog({ open, onOpenChange }: QuickMessageDialogProps) {
    const { doctors, loading } = useDoctors() 
  const [formData, setFormData] = useState({
    recipient: "",
    subject: "",
    message: "",
    priority: "normal",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle message sending
    console.log("Sending message:", formData)
    onOpenChange(false)
    // Reset form
    setFormData({ recipient: "", subject: "", message: "", priority: "normal" })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Quick Message</DialogTitle>
          <DialogDescription>Send a quick message to a doctor or staff member.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Recipient</Label>
            <Select
              value={formData.recipient}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, recipient: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select recipient" />
              </SelectTrigger>
              <SelectContent>
  {loading ? (
    <SelectItem value="" disabled>Loading doctors...</SelectItem>
  ) : (
    doctors.map((doctor) => (
      <SelectItem key={doctor.id} value={doctor.id}>
        {doctor.name}
      </SelectItem>
    ))
  )}
  <SelectItem value="admin">Hospital Administration</SelectItem>
  <SelectItem value="nursing">Nursing Staff</SelectItem>
</SelectContent>

            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              value={formData.subject}
              onChange={(e) => setFormData((prev) => ({ ...prev, subject: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Priority</Label>
            <Select
              value={formData.priority}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, priority: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
              rows={4}
              required
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Send Message</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

interface CreateSupportTicketDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateSupportTicketDialog({ open, onOpenChange }: CreateSupportTicketDialogProps) {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    priority: "medium",
    description: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle ticket creation
    console.log("Creating support ticket:", formData)
    onOpenChange(false)
    // Reset form
    setFormData({ title: "", category: "", priority: "medium", description: "" })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Support Ticket</DialogTitle>
          <DialogDescription>Report an issue or request technical support.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="technical">Technical Issue</SelectItem>
                <SelectItem value="billing">Billing</SelectItem>
                <SelectItem value="feature">Feature Request</SelectItem>
                <SelectItem value="general">General</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Priority</Label>
            <Select
              value={formData.priority}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, priority: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              rows={4}
              required
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Ticket</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
