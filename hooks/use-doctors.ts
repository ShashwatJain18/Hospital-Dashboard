"use client"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"

export function useDoctors() {
  const [doctors, setDoctors] = useState<any[]>([])
  const [loading, setLoading] = useState(true) // add loading state
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchDoctors() {
      setLoading(true)
      const { data, error } = await supabase
        .from("doctor")
        .select("id, name, specialization")
      if (error) {
        console.error("Error fetching doctors:", error)
        setError(error.message)
      } else {
        setDoctors(data || [])
      }
      setLoading(false)
    }
    fetchDoctors()
  }, [])

  return { doctors, loading, error }
}
