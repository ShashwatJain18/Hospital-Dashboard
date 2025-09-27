"use client"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useLocalStorage } from "@/hooks/use-local-storage"

interface Doctor {
  id: string
  name: string
  specialization: string
  avatar: string
  email: string
  phone: string
  licenseNumber: string
  bio: string
}

const doctors: Doctor[] = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    specialization: "Internal Medicine",
    avatar: "/doctor-profile.png",
    email: "sarah.johnson@hospitalhub.com",
    phone: "+1 (555) 123-4567",
    licenseNumber: "MD123456",
    bio: "Experienced internal medicine physician with over 10 years of practice.",
  },
  {
    id: "2",
    name: "Dr. Michael Chen",
    specialization: "Cardiology",
    avatar: "/caring-doctor.png",
    email: "michael.chen@hospitalhub.com",
    phone: "+1 (555) 234-5678",
    licenseNumber: "MD234567",
    bio: "Board-certified cardiologist specializing in interventional cardiology.",
  },
  {
    id: "3",
    name: "Dr. Emily Rodriguez",
    specialization: "Pediatrics",
    avatar: "/female-doctor.png",
    email: "emily.rodriguez@hospitalhub.com",
    phone: "+1 (555) 345-6789",
    licenseNumber: "MD345678",
    bio: "Pediatrician with expertise in child development and preventive care.",
  },
  {
    id: "4",
    name: "Dr. James Wilson",
    specialization: "Orthopedics",
    avatar: "/male-doctor.png",
    email: "james.wilson@hospitalhub.com",
    phone: "+1 (555) 456-7890",
    licenseNumber: "MD456789",
    bio: "Orthopedic surgeon specializing in sports medicine and joint replacement.",
  },
  {
    id: "5",
    name: "Dr. Lisa Thompson",
    specialization: "Dermatology",
    avatar: "/dermatologist.png",
    email: "lisa.thompson@hospitalhub.com",
    phone: "+1 (555) 567-8901",
    licenseNumber: "MD567890",
    bio: "Dermatologist with focus on cosmetic and medical dermatology.",
  },
]

interface DoctorSelectorProps {
  onDoctorChange?: (doctor: Doctor | null) => void
}

export function DoctorSelector({ onDoctorChange }: DoctorSelectorProps) {
  const [selectedDoctorId, setSelectedDoctorId] = useLocalStorage<string>("selected-doctor", "")

  const handleDoctorChange = (doctorId: string) => {
    setSelectedDoctorId(doctorId)
    const doctor = doctors.find((d) => d.id === doctorId) || null
    onDoctorChange?.(doctor)
  }

  const selectedDoctor = doctors.find((d) => d.id === selectedDoctorId)

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">Our Doctors</label>
      <Select value={selectedDoctorId} onValueChange={handleDoctorChange}>
        <SelectTrigger className="w-full bg-card/80 backdrop-blur-sm border-border/50">
          <SelectValue placeholder="Select a doctor" />
        </SelectTrigger>
        <SelectContent className="bg-popover/95 backdrop-blur-md border-border/50">
          {doctors.map((doctor) => (
            <SelectItem key={doctor.id} value={doctor.id} className="focus:bg-accent/50">
              <div className="flex items-center gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={doctor.avatar || "/placeholder.svg"} />
                  <AvatarFallback>
                    {doctor.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{doctor.name}</p>
                  <p className="text-xs text-muted-foreground">{doctor.specialization}</p>
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export { doctors, type Doctor }
