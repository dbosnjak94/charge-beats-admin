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
import { useChargerWebSocket } from "@/hooks/use-charger-web-socket"

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
      return orange600dot
  }
}

function getMarkerColor(status) {
  switch (status) {
    case "available":
      return "#10B981" // Green
    case "charging":
      return "#3B82F6" // Blue
    case "unavailable":
      return "#EF4444" // Red
    default:
      return "#6B7280" // Gray
  }
}

// function Map() {
//   const mapRef = useRef(null)

//   useEffect(() => {
//     const map = new mapboxgl.Map({
//       container: mapRef.current as unknown as HTMLElement,
//       style: "mapbox://styles/mapbox/streets-v11",
//       center: [12.548914, 55.703588],
//       zoom: 12.5,
//     })

//     map.addControl(new mapboxgl.NavigationControl(), "bottom-right")

//     map.on("load", function () {
//       map.resize()

//       // Add markers for each charge box
//       chargeBoxStatus.forEach((charger) => {
//         // Create custom marker element
//         const el = document.createElement("div")
//         el.className = "marker"
//         el.style.width = "100px"
//         el.style.height = "100px"
//         el.style.cursor = "pointer"

//         const img = document.createElement("img")
//         img.style.width = "100%"
//         img.style.height = "100%"
//         img.src = getMarkerImage(charger.connector_status)
//         el.appendChild(img)

//         // Create popup
//         const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
//             <h3>Charger ${charger.chargerId}</h3>
//             <p>Type: ${charger.charger_type}</p>
//             <p>Status: ${charger.connector_status}</p>
//           `)

//         // Add marker to map
//         new mapboxgl.Marker(el)
//           .setLngLat([parseFloat(charger.location.long), parseFloat(charger.location.lat)])
//           .setPopup(popup)
//           .addTo(map)
//       })
//     })

//     return () => map?.remove()
//   }, [])

//   return <div ref={mapRef} className="relative h-full w-full [&>*]:h-full"></div>
// }

// export function Overview() {
//   mapboxgl.accessToken = "pk.eyJ1IjoiZGFuaWVsZHJlamVyIiwiYSI6ImNrZ2twYjI5NjBqcjAyd2xsYXQwZHgyNDUifQ.C6IJplie4y-yK0X3Opf4yw"

//   return (
//     <ResponsiveContainer width="100%" height="100%">
//       <div className="w-full h-full pl-4">
//         <ResponsiveContainer>
//           <Map />
//         </ResponsiveContainer>
//       </div>
//     </ResponsiveContainer>
//   )
// }

function Map() {
  const mapRef = useRef(null)
  const markersRef = useRef<{ [key: number]: mapboxgl.Marker }>({})
  const mapInstanceRef = useRef<mapboxgl.Map | null>(null)
  const { chargers, isConnected, error } = useChargerWebSocket("ws://localhost:8080")

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapRef.current as unknown as HTMLElement,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [12.548914, 55.703588],
      zoom: 12.5,
    })

    console.log("chargers", chargers)

    mapInstanceRef.current = map
    map.addControl(new mapboxgl.NavigationControl(), "bottom-right")

    map.on("load", function () {
      map.resize()
    })

    return () => {
      // Clean up markers
      Object.values(markersRef.current).forEach((marker) => marker.remove())
      markersRef.current = {}
      map?.remove()
    }
  }, [chargers]) // Only run once on mount

  // Separate useEffect for handling marker updates
  useEffect(() => {
    if (!mapInstanceRef.current || !chargers.length) return

    chargers.forEach((charger) => {
      const existingMarker = markersRef.current[charger.chargerId]

      // Create marker element
      const el = document.createElement("div")
      el.className = "marker"
      el.style.width = "100px"
      el.style.height = "100px"
      el.style.cursor = "pointer"

      const img = document.createElement("img")
      img.style.width = "100%"
      img.style.height = "100%"
      img.src = getMarkerImage(charger.connector_status)
      el.appendChild(img)

      // Create popup
      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
        <h3>Charger ${charger.chargerId}</h3>
        <p>Type: ${charger.charger_type}</p>
        <p>Status: ${charger.connector_status}</p>
      `)

      if (existingMarker) {
        // Update existing marker
        existingMarker.setLngLat([parseFloat(charger.location.long), parseFloat(charger.location.lat)])
        existingMarker.getElement().replaceWith(el)
        existingMarker.setPopup(popup)
      } else {
        // Create new marker
        const newMarker = new mapboxgl.Marker(el)
          .setLngLat([parseFloat(charger.location.long), parseFloat(charger.location.lat)])
          .setPopup(popup)
          .addTo(mapInstanceRef.current)

        markersRef.current[charger.chargerId] = newMarker
      }
    })

    // Remove markers that are no longer in the data
    Object.entries(markersRef.current).forEach(([chargerId, marker]) => {
      if (!chargers.find((c) => c.chargerId === parseInt(chargerId))) {
        marker.remove()
        delete markersRef.current[parseInt(chargerId)]
      }
    })
  }, [chargers]) // Update whenever chargers data changes

  // Optional: Add connection status indicator
  const connectionStatus = (
    <div className="absolute top-2 right-2 z-10 space-y-2">
      {error && <div className="bg-red-500 text-white px-4 py-2 rounded shadow">{error}</div>}
      <div className={`px-4 py-2 rounded shadow ${isConnected ? "bg-green-500" : "bg-yellow-500"} text-white`}>
        {isConnected ? "Connected" : "Connecting..."}
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

// function Map() {
//   const mapRef = useRef(null)
//   const markersRef = useRef<{ [key: number]: mapboxgl.Marker }>({})
//   const mapInstanceRef = useRef<mapboxgl.Map | null>(null)
//   const { chargers, isConnected, error } = useChargerWebSocket("ws://localhost:8080")

//   // Separate map initialization - runs only once
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
//   }, []) // Empty dependency array - only run on mount

//   // Handle marker updates separately
//   useEffect(() => {
//     if (!mapInstanceRef.current || !chargers.length) return

//     chargers.forEach((charger) => {
//       const existingMarker = markersRef.current[charger.chargerId]

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
//   }, [chargers]) // Only depend on chargers data

//   // Connection status component
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

// export function Overview() {
//   mapboxgl.accessToken = "pk.eyJ1IjoiZGFuaWVsZHJlamVyIiwiYSI6ImNrZ2twYjI5NjBqcjAyd2xsYXQwZHgyNDUifQ.C6IJplie4y-yK0X3Opf4yw"

//   return (
//     <ResponsiveContainer width="100%" height="100%">
//       <div className="w-full h-full pl-4">
//         <ResponsiveContainer>
//           <Map />
//         </ResponsiveContainer>
//       </div>
//     </ResponsiveContainer>
//   )
// }
