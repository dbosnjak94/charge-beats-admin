import { ResponsiveContainer } from "recharts"
import "mapbox-gl/dist/mapbox-gl.css"
import mapboxgl from "mapbox-gl"
import { useRef, useEffect } from "react"
import green400dot from "@/assets/green-400-dot.png"
import green600dot from "@/assets/green-600-dot.png"
import green800dot from "@/assets/green-800-dot.png"
import orange600dot from "@/assets/orange-600-dot.png"
import red600dot from "@/assets/red-600-dot.png"
import blue500dot from "@/assets/blue-500-dot.png"
import greydot from "@/assets/grey-dot.png"
import { useChargerWebSocket } from "@/hooks/use-charger-web-socket"
import TechnoDrumButton from "@/sounds/techno/tehcno-drum"
import AngryRobotBassButton from "@/sounds/drum-and-bass/angry-robot-bass"

const chargeBoxStatus = [
  { chargerId: 38001, location: { lat: "55.697874", long: "12.544396" }, charger_type: "DC", connector_status: "available" },
  { chargerId: 38002, location: { lat: "55.694730", long: "12.554524" }, charger_type: "AC", connector_status: "unavailable" },
  { chargerId: 38003, location: { lat: "55.711153", long: "12.566810" }, charger_type: "HOME_CHARGER", connector_status: "available" },
  { chargerId: 38004, location: { lat: "55.715436", long: "12.571116" }, charger_type: "DC", connector_status: "available" },
  { chargerId: 38005, location: { lat: "55.708988", long: "12.554492" }, charger_type: "AC", connector_status: "charging" },
  { chargerId: 38006, location: { lat: "55.715360", long: "12.563131" }, charger_type: "HOME_CHARGER", connector_status: "available" },
]

function getMarkerImage(status) {
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

function getMarkerColor(status) {
  switch (status) {
    case "available":
      return "#10B981" // Green
    case "charging":
      return "#3B82F6" // tailwind color: blue-500
    case "unavailable":
      return "#EF4444" // Red
    default:
      return "#6B7280" // Gray
  }
}

// function Map() {
//   const mapRef = useRef(null)
//   const markersRef = useRef<{ [key: number]: mapboxgl.Marker }>({})
//   const mapInstanceRef = useRef<mapboxgl.Map | null>(null)
//   const { chargers, isConnected, error } = useChargerWebSocket("ws://localhost:8080")

//   useEffect(() => {
//     const map = new mapboxgl.Map({
//       container: mapRef.current as unknown as HTMLElement,
//       style: "mapbox://styles/mapbox/streets-v11",
//       center: [12.548914, 55.703588],
//       zoom: 12.5,
//     })

//     mapInstanceRef.current = map
//     map.addControl(new mapboxgl.NavigationControl(), "bottom-right")

//     map.on("load", function () {
//       map.resize()
//     })

//     return () => {
//       // Clean up markers
//       Object.values(markersRef.current).forEach((marker) => marker.remove())
//       markersRef.current = {}
//       map?.remove()
//     }
//   }, []) // Only run once on mount

//   // Separate useEffect for handling marker updates
//   useEffect(() => {
//     console.log("chargers", chargers)
//     if (!mapInstanceRef.current || !chargers.length) return

//     chargers.forEach((charger) => {
//       const existingMarker = markersRef.current[charger.chargerId]

//       // Create marker element
//       const el = document.createElement("div")
//       el.className = "marker"
//       el.style.width = "100px"
//       el.style.height = "100px"
//       el.style.cursor = "pointer"
//       // el.onclick(() => {
//       //   console.log("evo me doma")
//       // })

//       const img = document.createElement("img")
//       img.style.width = "100%"
//       img.style.height = "100%"
//       img.src = getMarkerImage(charger.connector_status)
//       // img.onclick(() => console.log("evo me doma"))
//       el.appendChild(img)

//       // Create popup
//       const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
//         <h3>Charger ${charger.chargerId}</h3>
//         <p>Type: ${charger.charger_type}</p>
//         <p>Status: ${charger.connector_status}</p>
//       `)

//       if (existingMarker) {
//         // Update existing marker
//         existingMarker.setLngLat([parseFloat(charger.location.long), parseFloat(charger.location.lat)])
//         existingMarker.getElement().replaceWith(el)
//         existingMarker.setPopup(popup)
//       } else {
//         // Create new marker
//         const newMarker = new mapboxgl.Marker(el)
//           .setLngLat([parseFloat(charger.location.long), parseFloat(charger.location.lat)])
//           .setPopup(popup)
//           .addTo(mapInstanceRef.current)

//         markersRef.current[charger.chargerId] = newMarker
//       }
//     })

//     // Remove markers that are no longer in the data
//     Object.entries(markersRef.current).forEach(([chargerId, marker]) => {
//       if (!chargers.find((c) => c.chargerId === parseInt(chargerId))) {
//         marker.remove()
//         delete markersRef.current[parseInt(chargerId)]
//       }
//     })
//   }, [chargers]) // Update whenever chargers data changes

//   // Optional: Add connection status indicator
//   const connectionStatus = (
//     <div className="absolute top-2 right-2 z-10 space-y-2">
//       {error && <div className="bg-red-500 text-white px-4 py-2 rounded shadow">{error}</div>}
//       <div className={`px-4 py-2 rounded shadow ${isConnected ? "bg-green-500" : "bg-yellow-500"} text-white`}>
//         {isConnected ? "Connected" : "Connecting..."}
//       </div>
//     </div>
//   )

//   return (
//     <div ref={mapRef} className="relative h-full w-full [&>*]:h-full">
//       {connectionStatus}
//     </div>
//   )
// }

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

  // Second useEffect - Marker management
  // useEffect(() => {
  //   const map = mapInstanceRef.current
  //   if (!map) return

  //   // Wait for map to be loaded
  //   if (!map.loaded()) {
  //     map.on("load", () => updateMarkers())
  //     return
  //   }

  //   updateMarkers()

  //   function updateMarkers() {
  //     console.log("Updating markers with chargers:", chargers)

  //     // Remove all existing markers first
  //     Object.values(markersRef.current).forEach((marker) => {
  //       marker.remove()
  //     })
  //     markersRef.current = {}

  //     // Add new markers
  //     chargers.forEach((charger) => {
  //       // Create marker element
  //       const el = document.createElement("div")
  //       el.className = "marker"
  //       el.style.width = "100px"
  //       el.style.height = "100px"
  //       el.style.cursor = "pointer"

  //       const img = document.createElement("img")
  //       img.style.width = "100%"
  //       img.style.height = "100%"
  //       img.src = getMarkerImage(charger.connector_status)
  //       el.appendChild(img)

  //       // Add click handler
  //       el.addEventListener("click", () => {
  //         console.log("Marker clicked:", charger)
  //         // Add your click handling logic here
  //       })

  //       // Create popup
  //       const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
  //         <h3>Charger ${charger.chargerId}</h3>
  //         <p>Type: ${charger.charger_type}</p>
  //         <p>Status: ${charger.connector_status}</p>
  //       `)

  //       // Create new marker
  //       const newMarker = new mapboxgl.Marker(el)
  //         .setLngLat([parseFloat(charger.location.long), parseFloat(charger.location.lat)])
  //         .setPopup(popup)
  //         .addTo(map)

  //       markersRef.current[charger.chargerId] = newMarker
  //     })
  //   }
  // }, [chargers])

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
          handleMarkerClick(charger)
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
            <AngryRobotBassButton></AngryRobotBassButton>
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
  mapboxgl.accessToken = "pk.eyJ1IjoiZGFuaWVsZHJlamVyIiwiYSI6ImNrZ2twYjI5NjBqcjAyd2xsYXQwZHgyNDUifQ.C6IJplie4y-yK0X3Opf4yw"

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
