"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Appointment, Patient } from "@/lib/types";

// UI Components
import { Button } from "@/components/ui/button";

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select"; // named exports

// Functional Components
import { CalendarView } from "@/components/calendar-view"; // named export
import { AppointmentDialog } from "@/components/appointment-dialog";

export default function CalendarPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<{ id: string; name: string }[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<string>("all");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);

  // Fetch patients
  useEffect(() => {
    supabase
      .from("patient")
      .select("*")
      .then(({ data }) => data && setPatients(data));
  }, []);

  // Fetch doctors
  useEffect(() => {
    supabase
      .from("doctor")
      .select("*")
      .then(({ data }) => data && setDoctors(data));
  }, []);

  // Fetch appointments
  const fetchAppointments = async (doctorId?: string) => {
    let query = supabase
      .from("appointment")
      .select(`
        *,
        patient:patient_id(id, name),
        doctor:doctor_id(id, name)
      `)
      .order("start_time", { ascending: true });

    if (doctorId && doctorId !== "all") query = query.eq("doctor_id", doctorId);

    const { data, error } = await query;
    if (error) return console.error("Error fetching appointments:", error);

    const mapped = (data as any[]).map((a) => ({
      id: a.id,
      title: a.title,
      description: a.description,
      startTime: a.start_time,
      endTime: a.end_time,
      patientId: a.patient_id,
      doctorId: a.doctor_id,
      patient: a.patient,
      doctor: a.doctor,
      status: a.status,
    }));

    setAppointments(mapped);
  };

  useEffect(() => {
    fetchAppointments(selectedDoctor);
  }, [selectedDoctor, isDialogOpen]);

  // Add / Edit / Delete appointment
  const handleAddAppointment = async (
    appointment: Omit<Appointment, "id" | "createdAt" | "updatedAt">
  ) => {
    const { data } = await supabase
      .from("appointment")
      .insert({
        title: appointment.title,
        description: appointment.description,
        patient_id: appointment.patientId,
        doctor_id: appointment.doctorId,
        start_time: appointment.startTime,
        end_time: appointment.endTime,
        status: appointment.status,
      })
      .select(`*, patient:patient_id(id, name), doctor:doctor_id(id, name)`);

    if (data)
      setAppointments([
        ...appointments,
        {
          id: data[0].id,
          title: data[0].title,
          description: data[0].description,
          startTime: data[0].start_time,
          endTime: data[0].end_time,
          patientId: data[0].patient_id,
          doctorId: data[0].doctor_id,
          patient: data[0].patient,
          doctor: data[0].doctor,
          status: data[0].status,
        },
      ]);

    setIsDialogOpen(false);
  };

  const handleEditAppointment = async (
    appointment: Omit<Appointment, "id" | "createdAt" | "updatedAt">
  ) => {
    if (!selectedAppointment) return;

    const { data } = await supabase
      .from("appointment")
      .update({
        title: appointment.title,
        description: appointment.description,
        patient_id: appointment.patientId,
        doctor_id: appointment.doctorId,
        start_time: appointment.startTime,
        end_time: appointment.endTime,
        status: appointment.status,
      })
      .eq("id", selectedAppointment.id)
      .select(`*, patient:patient_id(id, name), doctor:doctor_id(id, name)`);

    if (data) {
      setAppointments(
        appointments.map((a) =>
          a.id === selectedAppointment.id
            ? {
                id: data[0].id,
                title: data[0].title,
                description: data[0].description,
                startTime: data[0].start_time,
                endTime: data[0].end_time,
                patientId: data[0].patient_id,
                doctorId: data[0].doctor_id,
                patient: data[0].patient,
                doctor: data[0].doctor,
                status: data[0].status,
              }
            : a
        )
      );
    }

    setSelectedAppointment(null);
    setIsDialogOpen(false);
  };

  const handleDeleteAppointment = async (id: string) => {
    await supabase.from("appointment").delete().eq("id", id);
    setAppointments(appointments.filter((a) => a.id !== id));
  };

  // Dialog helpers
  const openEditDialog = (apt: Appointment) => {
    setSelectedAppointment(apt);
    setIsDialogOpen(true);
  };

  const openAddDialog = (date?: Date) => {
    setSelectedAppointment(null);
    if (date) setSelectedDate(date);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Calendar</h1>

        <Select
      value={selectedDoctor}
      onValueChange={(val) => {
        setSelectedDoctor(val);
        onDoctorChange?.(val);
      }}
    >
      <SelectTrigger className="bg-white text-black h-10 w-44 text-base">
        {selectedDoctor === "all"
          ? "All Doctors"
          : doctors.find((d) => d.id === selectedDoctor)?.name}
      </SelectTrigger>
      <SelectContent className="bg-white text-black">
        <SelectItem value="all">All Doctors</SelectItem>
        {doctors.map((doctor) => (
          <SelectItem key={doctor.id} value={doctor.id}>
            {doctor.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>


        <Button onClick={() => openAddDialog()}>New Appointment</Button>
      </div>

      <CalendarView
        appointments={appointments}
        selectedDate={selectedDate}
        onAppointmentClick={openEditDialog}
        onDateClick={openAddDialog}
      />

      <AppointmentDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        appointment={selectedAppointment}
        patients={patients}
        doctors={doctors}
        selectedDate={selectedDate}
        selectedDoctor={selectedDoctor}
        onSave={selectedAppointment ? handleEditAppointment : handleAddAppointment}
        onDelete={selectedAppointment ? handleDeleteAppointment : undefined}
      />
    </div>
  );
}
