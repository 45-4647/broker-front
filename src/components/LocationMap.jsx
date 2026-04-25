import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix broken default marker icons in webpack/CRA
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function LocationMap({ lat, lng, label, isDark }) {
  if (!lat || !lng) return null;

  const position = [parseFloat(lat), parseFloat(lng)];

  return (
    <div
      className={`rounded-2xl overflow-hidden border ${isDark ? "border-slate-800" : "border-slate-200"}`}
      style={{ height: 300, width: "100%" }}
    >
      <MapContainer
        key={`${lat}-${lng}`}
        center={position}
        zoom={15}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={false}
        attributionControl={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        <Marker position={position}>
          <Popup>{label || "Product Location"}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}