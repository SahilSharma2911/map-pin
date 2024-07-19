import { useState, useEffect } from "react";
import Map from "react-map-gl";

import "./App.css";

function App() {
  const mapboxAccessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
  return (
    <Map
      mapLib={import("mapbox-gl")}
      initialViewState={{
        longitude: 77.2090, 
        latitude: 28.6139,
        zoom: 8,
      }}
      style={{
        width: "100vw",
        height: "100vh",
      }}
      mapStyle="mapbox://styles/mapbox/streets-v9"
      onViewportChange={(newViewport) => setViewport(newViewport)}
      mapboxAccessToken={mapboxAccessToken}
    />
  );
}

export default App;
