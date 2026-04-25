import { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";

// Fix default marker icon broken by webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function ClickHandler({ onPick }) {
  useMapEvents({ click: (e) => onPick(e.latlng.lat, e.latlng.lng) });
  return null;
}

export default function LocationPicker({ lat, lng, onPick, isDark }) {
  const [searching, setSearching] = useState(false);
  const [query, setQuery] = useState("");

  const defaultCenter = [9.03, 38.74]; // Addis Ababa
  const center = lat && lng ? [lat, lng] : defaultCenter;

  const searchAddress = async () => {
    if (!query.trim()) return;
    setSearching(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`
      );
      const data = await res.json();
      if (data.length > 0) {
        onPick(parseFloat(data[0].lat), parseFloat(data[0].lon), data[0].display_name);
      }
    } catch {
      // silently fail
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="space-y-3">
      {/* Search bar */}
      <div className={`flex gap-2 rounded-xl border overflow-hidden ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), searchAddress())}
          placeholder="Search address (e.g. Bole, Addis Ababa)..."
          className={`flex-1 px-4 py-2.5 text-sm bg-transparent outline-none ${isDark ? "text-slate-100 placeholder-slate-500" : "text-slate-800 placeholder-slate-400"}`}
        />
        <button
          type="button"
          onClick={searchAddress}
          disabled={searching}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition disabled:opacity-60 shrink-0"
        >
          {searching ? "..." : "Search"}
        </button>
      </div>

      {/* Map */}
      <div className="rounded-xl overflow-hidden border border-slate-700/50" style={{ height: 280 }}>
        <MapContainer center={center} zoom={lat ? 15 : 12} style={{ height: "100%", width: "100%" }} key={`${lat}-${lng}`}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='Â© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          <ClickHandler onPick={(la, ln) => onPick(la, ln)} />
          {lat && lng && <Marker position={[lat, lng]} />}
        </MapContainer>
      </div>

      <p className={`text-xs ${isDark ? "text-slate-500" : "text-slate-400"}`}>
        ðŸ“ Search an address or click on the map to pin your location.
      </p>
    </div>
  );
}

