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

// hooks/use-charger-web-socket.ts
export function useChargerWebSocket(url: string) {
  const [chargers, setChargers] = useState<ChargerStatus[]>([])

  useEffect(() => {
    const ws = new WebSocket(url)

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data)
        console.log("WebSocket message received:", message) // Debug log

        if (message.type === "station_update" && message.data) {
          setChargers((prev) => {
            // Find and update existing charger or add new one
            const updated = [...prev]
            const index = updated.findIndex((c) => c.chargerId === message.data.chargerId)
            if (index >= 0) {
              updated[index] = message.data
            } else {
              updated.push(message.data)
            }
            return updated
          })
        }
      } catch (error) {
        console.error("Error processing WebSocket message:", error)
      }
    }

    return () => ws.close()
  }, [url])

  return { chargers, isConnected: true, error: null }
}
