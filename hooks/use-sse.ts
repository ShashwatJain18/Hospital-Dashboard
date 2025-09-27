"use client"

import { useEffect, useState } from "react"

export function useSSE<T>(url: string, initialData: T) {
  const [data, setData] = useState<T>(initialData)
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!url) return

    const eventSource = new EventSource(url)

    eventSource.onopen = () => {
      setIsConnected(true)
      setError(null)
    }

    eventSource.onmessage = (event) => {
      try {
        const newData = JSON.parse(event.data)
        setData(newData)
      } catch (err) {
        console.error("Error parsing SSE data:", err)
        setError("Failed to parse server data")
      }
    }

    eventSource.onerror = () => {
      setIsConnected(false)
      setError("Connection to server lost")
    }

    return () => {
      eventSource.close()
      setIsConnected(false)
    }
  }, [url])

  return { data, isConnected, error }
}
