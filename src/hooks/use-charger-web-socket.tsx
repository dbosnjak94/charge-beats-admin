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

const defaultChargers: ChargerStatus[] = [
  { chargerId: 38001, location: { lat: "55.697874", long: "12.544396" }, charger_type: "DC", connector_status: "available" },
  { chargerId: 38002, location: { lat: "55.694730", long: "12.554524" }, charger_type: "AC", connector_status: "unavailable" },
  { chargerId: 38003, location: { lat: "55.711153", long: "12.566810" }, charger_type: "HOME_CHARGER", connector_status: "available" },
  { chargerId: 38004, location: { lat: "55.715436", long: "12.571116" }, charger_type: "DC", connector_status: "available" },
  { chargerId: 38005, location: { lat: "55.708988", long: "12.554492" }, charger_type: "AC", connector_status: "charging" },
  { chargerId: 38006, location: { lat: "55.715360", long: "12.563131" }, charger_type: "HOME_CHARGER", connector_status: "available" },
]

// hooks/use-charger-web-socket.ts
export function useChargerWebSocket(url: string) {
  const [chargers, setChargers] = useState<ChargerStatus[]>(defaultChargers)

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
