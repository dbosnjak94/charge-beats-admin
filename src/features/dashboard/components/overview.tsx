import { ResponsiveContainer } from "recharts"
import "mapbox-gl/dist/mapbox-gl.css"
import mapboxgl from "mapbox-gl"
import { useRef, useEffect } from "react"
import green600dot from "@/assets/green-600-dot.png"
import red600dot from "@/assets/red-600-dot.png"
import blue500dot from "@/assets/blue-500-dot.png"
import greydot from "@/assets/grey-dot.png"
import { useChargerWebSocket } from "@/hooks/use-charger-web-socket"
import { playAngryRobotBass } from "@/sounds/drum-and-bass/angry-robot-bass"
import { toggleTechnoSynth } from "@/sounds/drum-and-bass/techno-synth"

const chargeBoxStatus = [
  { chargerId: 38001, location: { lat: "55.697874", long: "12.544396" }, charger_type: "DC", connector_status: "available" },
  { chargerId: 38002, location: { lat: "55.694730", long: "12.554524" }, charger_type: "AC", connector_status: "unavailable" },
  { chargerId: 38003, location: { lat: "55.711153", long: "12.566810" }, charger_type: "HOME_CHARGER", connector_status: "available" },
  { chargerId: 38004, location: { lat: "55.715436", long: "12.571116" }, charger_type: "DC", connector_status: "available" },
  { chargerId: 38005, location: { lat: "55.708988", long: "12.554492" }, charger_type: "AC", connector_status: "charging" },
  { chargerId: 38006, location: { lat: "55.715360", long: "12.563131" }, charger_type: "HOME_CHARGER", connector_status: "available" },
]

function getMarkerImage(status: string) {
  switch (status) {
    case "available":
      return green600dot
    case "charging":
      return blue500dot
    case "unavailable":
      return red600dot
    default:
      return greydot
  }
}

function musicMapper(connectorStatus: string) {
  switch (connectorStatus) {
    case "available":
      return playAngryRobotBass // Return function reference
    case "charging":
      return () => toggleTechnoSynth(false, () => {}, { current: null }, { current: null })
    default:
      return playAngryRobotBass
  }
}

function Map() {
  const mapRef = useRef(null)
  const markersRef = useRef<{ [key: number]: mapboxgl.Marker }>({})
  const mapInstanceRef = useRef<mapboxgl.Map | null>(null)
  const { chargers = chargeBoxStatus, isConnected, error } = useChargerWebSocket("ws://localhost:8080")

  // First useEffect - Map initialization
  useEffect(() => {
    if (!mapRef.current) return

    const map = new mapboxgl.Map({
      container: mapRef.current as unknown as HTMLElement,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [12.548914, 55.703588],
      zoom: 12.5,
    })

    mapInstanceRef.current = map
    map.addControl(new mapboxgl.NavigationControl(), "bottom-right")

    map.on("load", () => {
      map.resize()
    })

    return () => {
      Object.values(markersRef.current).forEach((marker) => marker.remove())
      markersRef.current = {}
      map?.remove()
    }
  }, [])

  useEffect(() => {
    const map = mapInstanceRef.current
    if (!map) return

    if (!map.loaded()) {
      map.on("load", () => updateMarkers())
      return
    }

    updateMarkers()

    function updateMarkers() {
      Object.values(markersRef.current).forEach((marker) => {
        marker.remove()
      })
      markersRef.current = {}

      chargers.forEach((charger) => {
        const el = document.createElement("button") // Change div to button for better accessibility
        el.className = "marker focus:outline-none focus:ring-2 focus:ring-violet-500"
        el.style.width = "100px"
        el.style.height = "100px"
        el.style.cursor = "pointer"
        el.style.border = "none"
        el.style.background = "none"
        el.style.padding = "0"
        el.setAttribute("aria-label", `Charger ${charger.chargerId} - ${charger.charger_type} - ${charger.connector_status}`)

        const img = document.createElement("img")
        img.style.width = "100%"
        img.style.height = "100%"
        img.src = getMarkerImage(charger.connector_status)
        img.alt = `Charger ${charger.chargerId} status indicator`
        img.setAttribute("aria-hidden", "true") // Image is decorative
        el.appendChild(img)

        el.addEventListener("click", (e) => {
          e.preventDefault() // Prevent default button behavior
          const playSound = musicMapper(charger.connector_status)
          playSound() // Execute the function on click
        })

        // Create popup with accessible interactive content
        const popup = new mapboxgl.Popup({
          offset: 25,
          closeButton: true,
          focusAfterOpen: false, // Prevent automatic focus management
        }).setHTML(`
          <div class="p-2" role="dialog" aria-label="Charger Details">
            <h3 class="font-bold text-lg">Charger ${charger.chargerId}</h3>
            <p class="text-sm">Type: ${charger.charger_type}</p>
            <p class="text-sm">Status: ${charger.connector_status}</p>
            <button onclick="${musicMapper(charger.connector_status)}"</button>
          </div>
        `)

        const newMarker = new mapboxgl.Marker({
          element: el,
          anchor: "bottom",
        })
          .setLngLat([parseFloat(charger.location.long), parseFloat(charger.location.lat)])
          .setPopup(popup)
          .addTo(map)

        markersRef.current[charger.chargerId] = newMarker
      })
    }
  }, [chargers])

  // Connection status indicator
  const connectionStatus = (
    <div className="absolute top-2 right-2 z-10 space-y-2">
      {error && <div className="bg-red-500 text-white px-4 py-2 rounded shadow">{error}</div>}
      <div className={`px-4 py-2 rounded shadow ${isConnected ? "bg-green-500" : "bg-yellow-500"} text-white`}>
        {isConnected ? `Connected (${chargers.length} chargers)` : "Connecting..."}
      </div>
    </div>
  )

  return (
    <div ref={mapRef} className="relative h-full w-full [&>*]:h-full">
      {connectionStatus}
    </div>
  )
}

export function Overview() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <div className="w-full h-full pl-4">
        <ResponsiveContainer>
          <Map />
        </ResponsiveContainer>
      </div>
    </ResponsiveContainer>
  )
}
