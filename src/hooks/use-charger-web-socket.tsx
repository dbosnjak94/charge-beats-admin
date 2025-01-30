// hooks/useChargerWebSocket.ts
import { useState, useEffect, useCallback, useRef } from "react"

interface Location {
  lat: string
  long: string
}

interface ChargerStatus {
  chargerId: number
  location: Location
  charger_type: string
  connector_status: string
}

interface WSMessage {
  type: "welcome" | "station_update" | "error"
  message?: string
  streamId?: number
  data?: ChargerStatus
}

export function useChargerWebSocket(url: string) {
  const [chargers, setChargers] = useState<ChargerStatus[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const wsRef = useRef<WebSocket | null>(null)

  const connect = useCallback(() => {
    try {
      const ws = new WebSocket(url)
      wsRef.current = ws

      ws.onopen = () => {
        setIsConnected(true)
        setError(null)
      }

      ws.onmessage = (event) => {
        try {
          const message: WSMessage = JSON.parse(event.data)

          switch (message.type) {
            case "station_update":
              if (message.data) {
                setChargers((prev) => {
                  const updated = [...prev]
                  const index = updated.findIndex((c) => c.chargerId === message.data!.chargerId)
                  if (index >= 0) {
                    updated[index] = message.data!
                  } else {
                    updated.push(message.data!)
                  }
                  return updated
                })
              }
              break
            case "error":
              setError(message.message || "Unknown error occurred")
              break
          }
        } catch (err) {
          setError("Failed to parse WebSocket message")
        }
      }

      ws.onerror = () => {
        setError("WebSocket error occurred")
        setIsConnected(false)
      }

      ws.onclose = () => {
        setIsConnected(false)
        // Implement reconnection logic
        setTimeout(() => connect(), 3000)
      }

      return () => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.close()
        }
      }
    } catch (err) {
      setError("Failed to establish WebSocket connection")
      setIsConnected(false)
    }
  }, [url])

  useEffect(() => {
    const cleanup = connect()
    return () => {
      if (cleanup) cleanup()
    }
  }, [connect])

  return {
    chargers,
    isConnected,
    error,
  }
}
