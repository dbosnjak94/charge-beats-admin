import { ResponsiveContainer } from "recharts"
import "mapbox-gl/dist/mapbox-gl.css"
import mapboxgl from "mapbox-gl"
import { useRef, useEffect } from "react"
import dot from "@/assets/dot.png"

const chargeBoxStatus = [
  { chargerId: 38001, location: { lat: "55.697874", long: "12.544396" }, charger_type: "DC", connector_status: "available" },
  { chargerId: 38002, location: { lat: "55.694730", long: "12.554524" }, charger_type: "AC", connector_status: "unavailable" },
  { chargerId: 38003, location: { lat: "55.711153", long: "12.566810" }, charger_type: "HOME_CHARGER", connector_status: "available" },
  { chargerId: 38004, location: { lat: "55.715436", long: "12.571116" }, charger_type: "DC", connector_status: "available" },
  { chargerId: 38005, location: { lat: "55.708988", long: "12.554492" }, charger_type: "AC", connector_status: "charging" },
  { chargerId: 38006, location: { lat: "55.715360", long: "12.563131" }, charger_type: "HOME_CHARGER", connector_status: "available" },
]

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

function Map() {
  const mapRef = useRef(null)

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapRef.current as unknown as HTMLElement,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [12.548914, 55.703588],
      zoom: 12.5,
    })

    map.addControl(new mapboxgl.NavigationControl(), "bottom-right")

    map.on("load", function () {
      map.resize()

      // Add markers for each charge box
      chargeBoxStatus.forEach((charger) => {
        // Create custom marker element
        const el = document.createElement("div")
        el.className = "marker"
        el.style.width = "100px"
        el.style.height = "100px"
        el.style.cursor = "pointer"

        const img = document.createElement("img")
        img.style.width = "100%"
        img.style.height = "100%"
        img.src = dot
        el.appendChild(img)

        // Create popup
        const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
            <h3>Charger ${charger.chargerId}</h3>
            <p>Type: ${charger.charger_type}</p>
            <p>Status: ${charger.connector_status}</p>
          `)

        // Add marker to map
        new mapboxgl.Marker(el)
          .setLngLat([parseFloat(charger.location.long), parseFloat(charger.location.lat)])
          .setPopup(popup)
          .addTo(map)
      })
    })

    return () => map?.remove()
  }, [])

  return (
    <div ref={mapRef} className="relative h-full w-full [&>*]:h-full">
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
