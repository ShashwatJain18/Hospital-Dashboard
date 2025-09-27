"use client"

import { useState, useEffect } from "react"
import { useLocalStorage } from "./use-local-storage"

export function useSyncWithServer<T>(key: string, initialValue: T, apiEndpoint?: string) {
  const [localData, setLocalData] = useLocalStorage(key, initialValue)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Check if we have database connection
  const hasDatabase = process.env.DATABASE_URL || process.env.PRISMA_URL

  useEffect(() => {
    if (hasDatabase && apiEndpoint) {
      fetchFromServer()
    }
  }, [hasDatabase, apiEndpoint])

  const fetchFromServer = async () => {
    if (!apiEndpoint) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(apiEndpoint)
      if (response.ok) {
        const serverData = await response.json()
        setLocalData(serverData)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch data")
      console.error("Error fetching from server:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const syncToServer = async (data: T) => {
    if (!apiEndpoint || !hasDatabase) {
      setLocalData(data)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        const updatedData = await response.json()
        setLocalData(updatedData)
      } else {
        throw new Error("Failed to sync with server")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to sync data")
      console.error("Error syncing to server:", err)
      // Fallback to local storage
      setLocalData(data)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    data: localData,
    setData: syncToServer,
    isLoading,
    error,
    hasDatabase: !!hasDatabase,
  }
}
