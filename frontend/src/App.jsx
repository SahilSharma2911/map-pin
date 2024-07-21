import { useState, useEffect } from "react";
import axios from "axios";
import Map, { Marker, Popup } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { FaMapMarkerAlt } from "react-icons/fa";
import { AiFillStar } from "react-icons/ai";
import { format } from "timeago.js";
import "./App.css";

function App() {
  const currentUsername = "john";
  const mapboxAccessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
  const [viewport, setViewport] = useState({
    latitude: 28.6448,
    longitude: 77.216721,
    zoom: 7,
  });
  const [pins, setPins] = useState([]);
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [newPlace, setNewPlace] = useState(null);
  const [title, setTitle] = useState(null);
  const [desc, setDesc] = useState(null);
  const [star, setStar] = useState(0);

  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    const getPins = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/pins`);
        setPins(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getPins();
  }, []);

  const handleMarkerClick = (id, lat, long) => {
    setCurrentPlaceId(id);
    setViewport({ latitude: lat, longitude: long, zoom: 6 });
  };

  return (
    <Map
      mapLib={import("mapbox-gl")}
      initialViewState={{
        longitude: 77.209,
        latitude: 28.6139,
        zoom: 7,
      }}
      style={{
        width: "100vw",
        height: "100vh",
      }}
      mapStyle="mapbox://styles/mapbox/streets-v9"
      onViewportChange={(newViewport) => setViewport(newViewport)}
      mapboxAccessToken={mapboxAccessToken}
    >
      {pins.map((p) => (
        <>
          <Marker longitude={p.long} latitude={p.lat} anchor="bottom">
            <div className="marker">
              <FaMapMarkerAlt
                size={32}
                onClick={() => handleMarkerClick(p._id, p.lat, p.long)}
                
                style={{
                  color:
                    currentUsername === p.username ? "tomato" : "slateblue",
                  cursor: "pointer",
                }}
              />
            </div>
          </Marker>
          {p._id === currentPlaceId && (
            <Popup
              longitude={p.long}
              latitude={p.lat}
              anchor="bottom"
              onClose={() => setCurrentPlaceId(null)}
              closeButton={true}
              closeOnClick={false}
              offsetTop={-30}
            >
              <div className="card">
                <span className="card-item">
                  <label>Place</label>
                  <h4 className="place">{p.title}</h4>
                </span>
                <span className="card-item">
                  <label>Review</label>
                  <p className="desc">{p.desc}</p>
                </span>
                <span className="card-item">
                  <label>Rating</label>
                  <div className="stars">
                    {Array(p.rating).fill(<AiFillStar className="star" />)}
                  </div>
                </span>
                <span className="card-item item-r">
                  <label>Information</label>
                  <span className="username">
                    Created by <b>{p.username}</b>
                  </span>
                </span>
                <span className="date">{format(p.createdAt)}</span>
              </div>
            </Popup>
          )}
        </>
      ))}
    </Map>
  );
}

export default App;
