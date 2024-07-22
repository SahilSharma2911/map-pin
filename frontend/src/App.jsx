import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Map, { Marker, Popup } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { FaMapMarkerAlt } from "react-icons/fa";
import { AiFillStar } from "react-icons/ai";
import { format } from "timeago.js";
import "./App.css";

function App() {
  const currentUsername = "martha";
  const mapboxAccessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
  const [pins, setPins] = useState([]);
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [newPlace, setNewPlace] = useState(null);
  const [title, setTitle] = useState(null);
  const [desc, setDesc] = useState(null);
  const [star, setStar] = useState(0);

  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const mapRef = useRef(null);

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
    if (mapRef.current) {
      mapRef.current.easeTo({
        center: [long, lat],
        zoom: 7,
        duration: 1000,
      });
    }
  };

  const handleAddClick = (e) => {
    const { lng, lat } = e.lngLat;
    setNewPlace({
      lat: lat,
      long: lng,
    });
    console.log(e);
  };

  const handleSubmit = async (e) => {
    if (mapRef.current) {
      mapRef.current.easeTo({
        zoom: 7,
        duration: 1000,
      });
    }
    e.preventDefault();
    const newPin = {
      username: currentUsername,
      title,
      desc,
      rating: star,
      lat: newPlace.lat,
      long: newPlace.long,
    };

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/pins`,
        newPin
      );
      setPins([...pins, res.data]);
      setNewPlace(null);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Map
      ref={mapRef}
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
      mapboxAccessToken={mapboxAccessToken}
      onDblClick={handleAddClick}
    >
      {pins.map((p) => (
        <div key={p._id}>
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
        </div>
      ))}
      {newPlace && (
        <Popup
          latitude={newPlace.lat}
          longitude={newPlace.long}
          closeButton={true}
          closeOnClick={false}
          onClose={() => setNewPlace(null)}
          anchor="left"
        >
          <div>
            <form onSubmit={handleSubmit}>
              <span className="card-item">
                <label>Title</label>
                <input
                  placeholder="Enter a title"
                  autoFocus
                  onChange={(e) => setTitle(e.target.value)}
                />
              </span>
              <span className="card-item">
                <label>Description</label>
                <textarea
                  placeholder="Say us something about this place."
                  onChange={(e) => setDesc(e.target.value)}
                />
              </span>
              <span className="card-item">
                <label>Rating</label>
                <select
                  onChange={(e) => setStar(e.target.value)}
                  className="form-select"
                >
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
              </span>
              <span className="card-item">
                <button type="submit" className="submitButton">
                  Add Pin
                </button>
              </span>
            </form>
          </div>
        </Popup>
      )}
    </Map>
  );
}

export default App;
