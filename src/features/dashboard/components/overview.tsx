import { ResponsiveContainer } from "recharts"
import "mapbox-gl/dist/mapbox-gl.css"
import mapboxgl from "mapbox-gl"
import { useRef, useEffect } from "react"

function Map() {
  const mapRef = useRef(null)
  const loading = useRef(null)

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapRef.current as unknown as HTMLElement,
      // See style options here: https://docs.mapbox.com/api/maps/#styles
      style: "mapbox://styles/mapbox/streets-v11",
      center: [12.548914, 55.703588],
      zoom: 12.5,
    })
    // add navigation control (the +/- zoom buttons)
    map.addControl(new mapboxgl.NavigationControl(), "bottom-right")
    map.on("load", function () {
      map.resize()
    })
    // clean up on unmount
    return () => map?.remove()
  }, [])

  return (
    <div ref={mapRef} className="relative h-full w-full [&>*]:h-full">
      <p ref={loading}>Loading...</p>
    </div>
  )
}

export function Overview() {
  return (
    <ResponsiveContainer width="95%" height="100%">
      <div className="w-full h-full">
        {/* Add a wrapper div */}
        <ResponsiveContainer>
          <Map />
        </ResponsiveContainer>
      </div>
    </ResponsiveContainer>
  )
}
