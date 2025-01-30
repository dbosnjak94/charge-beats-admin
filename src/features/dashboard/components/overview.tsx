import { ResponsiveContainer } from 'recharts'
import 'mapbox-gl/dist/mapbox-gl.css'
import mapboxgl from 'mapbox-gl'
import { useRef, useEffect } from 'react'
import styled from 'styled-components'

const StyledMap = styled.div`
  position: relative;
  height: 100%;
  width: 100%;

  & * {
    height: 100%;
  }
`;

function Map() {
  const mapRef = useRef(null);
  const loading = useRef(null);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapRef.current as unknown as HTMLElement,
      // See style options here: https://docs.mapbox.com/api/maps/#styles
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-104.9876, 39.7405],
      zoom: 12.5,
    });
    // add navigation control (the +/- zoom buttons)
    map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');
    map.on('load', function () {
      map.resize();
    });
    // clean up on unmount
    return () => map?.remove();
  }, []);

  return <StyledMap ref={mapRef}><p ref={loading}>Loading...</p></StyledMap>;
}

export function Overview() {
  mapboxgl.accessToken = 'pk.eyJ1IjoiZGFuaWVsZHJlamVyIiwiYSI6ImNrZ2twYjI5NjBqcjAyd2xsYXQwZHgyNDUifQ.C6IJplie4y-yK0X3Opf4yw';

  return (
    <ResponsiveContainer width='70%' height='100%'>
      <Map />
    </ResponsiveContainer>
  )
}
