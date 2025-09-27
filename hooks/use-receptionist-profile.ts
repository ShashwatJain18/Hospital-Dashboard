"use client"

import { useLocalStorage } from "./use-local-storage"

export interface ReceptionistProfile {
  name: string
  email: string
  avatar: string
  initials: string
}

const defaultProfile: ReceptionistProfile = {
  name: "Receptionist Mira",
  email: "mira@hospitalhub.com",
  avatar: "/receptionist-avatar.png",
  initials: "RM",
}

export function useReceptionistProfile() {
  const [profile, setProfile] = useLocalStorage<ReceptionistProfile>("receptionist-profile", defaultProfile)

  const updateProfile = (updates: Partial<ReceptionistProfile>) => {
    setProfile((prev) => ({
      ...prev,
      ...updates,
      // Auto-generate initials from name if name is updated
      initials: updates.name
        ? updates.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2)
        : prev.initials,
    }))
  }

  return { profile, updateProfile }
}
