import { useState, useRef, useEffect, useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  Polyline,
  useMap,
  ZoomControl,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  Layers,
  Navigation,
  Filter,
  ChevronDown,
  CheckCircle,
  Clock,
  AlertOctagon,
  Droplets,
  Waves,
  X,
  Phone,
  Shield,
  MapPin,
  Thermometer,
  Wind,
  Eye,
  TrendingUp,
  TrendingDown,
  Minus,
  Radio,
  RefreshCw,
  Maximize2,
  LocateFixed,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type SeverityType = "waterlogging" | "submerged" | "breach" | "evacuation" | "shelter";
type MapLayer = "incidents" | "floodZones" | "shelters" | "routes";

interface Incident {
  id: string;
  title: string;
  location: string;
  lat: number;
  lng: number;
  severity: SeverityType;
  verified: boolean;
  time: string;
  reporter: string;
  depth?: string;
  affected?: number;
  trend?: "rising" | "stable" | "receding";
}

interface GaugeStation {
  id: string;
  name: string;
  lat: number;
  lng: number;
  level: number;      // metres
  danger: number;     // danger level
  warning: number;
  trend: "rising" | "stable" | "receding";
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const INCIDENTS: Incident[] = [
  {
    id: "1",
    title: "Embankment Breach — Critical",
    location: "Yamuna Bank, Civil Lines",
    lat: 28.6848,
    lng: 77.2367,
    severity: "breach",
    verified: true,
    time: "4m ago",
    reporter: "NDRF Team 3",
    depth: "1.8m",
    affected: 340,
    trend: "rising",
  },
  {
    id: "2",
    title: "ITO Underpass Submerged",
    location: "ITO, Central Delhi",
    lat: 28.6272,
    lng: 77.2402,
    severity: "submerged",
    verified: true,
    time: "11m ago",
    reporter: "Rajan M.",
    depth: "1.2m",
    affected: 120,
    trend: "stable",
  },
  {
    id: "3",
    title: "Knee-deep Waterlogging",
    location: "Connaught Place",
    lat: 28.6315,
    lng: 77.2167,
    severity: "waterlogging",
    verified: false,
    time: "23m ago",
    reporter: "Priya K.",
    depth: "0.4m",
    affected: 60,
    trend: "receding",
  },
  {
    id: "4",
    title: "Evacuation Order Issued",
    location: "Geeta Colony, East Delhi",
    lat: 28.6517,
    lng: 77.2729,
    severity: "evacuation",
    verified: true,
    time: "38m ago",
    reporter: "NDC Officer",
    affected: 1200,
    trend: "stable",
  },
  {
    id: "5",
    title: "Flood at Kashmere Gate Metro",
    location: "Kashmere Gate",
    lat: 28.6671,
    lng: 77.2283,
    severity: "submerged",
    verified: false,
    time: "1h ago",
    reporter: "Deepak S.",
    depth: "0.9m",
    affected: 400,
    trend: "rising",
  },
  {
    id: "6",
    title: "Minto Road Completely Blocked",
    location: "Minto Road, Paharganj",
    lat: 28.6395,
    lng: 77.2150,
    severity: "waterlogging",
    verified: true,
    time: "45m ago",
    reporter: "Traffic Police",
    depth: "0.6m",
    affected: 85,
    trend: "rising",
  },
  // Shelters
  {
    id: "s1",
    title: "Delhi Police Lines Shelter",
    location: "Kingsway Camp",
    lat: 28.7041,
    lng: 77.2028,
    severity: "shelter",
    verified: true,
    time: "Open",
    reporter: "Delhi Govt",
    affected: 2000,
    trend: "stable",
  },
  {
    id: "s2",
    title: "Rajghat Community Centre",
    location: "Rajghat",
    lat: 28.6517,
    lng: 77.2512,
    severity: "shelter",
    verified: true,
    time: "Open",
    reporter: "MCD",
    affected: 800,
    trend: "stable",
  },
];

const GAUGE_STATIONS: GaugeStation[] = [
  { id: "g1", name: "Old Railway Bridge", lat: 28.6753, lng: 77.2435, level: 207.8, danger: 206.0, warning: 204.5, trend: "rising" },
  { id: "g2", name: "Palla Gauge", lat: 28.7513, lng: 77.1093, level: 203.2, danger: 206.0, warning: 204.5, trend: "stable" },
  { id: "g3", name: "ISBT Gauge", lat: 28.6671, lng: 77.2218, level: 205.4, danger: 206.0, warning: 204.5, trend: "receding" },
];

// Flood zone polygons (rough approximations around Yamuna floodplain)
const FLOOD_ZONES = [
  {
    id: "fz1",
    center: [28.672, 77.245] as [number, number],
    radius: 1400,
    color: "#dc2626",
    fillOpacity: 0.15,
    label: "Critical",
  },
  {
    id: "fz2",
    center: [28.648, 77.258] as [number, number],
    radius: 900,
    color: "#f59e0b",
    fillOpacity: 0.12,
    label: "Warning",
  },
  {
    id: "fz3",
    center: [28.635, 77.218] as [number, number],
    radius: 600,
    color: "#f59e0b",
    fillOpacity: 0.1,
    label: "Warning",
  },
];

// Evacuation route
const EVAC_ROUTE: [number, number][] = [
  [28.6517, 77.2729],
  [28.6600, 77.2600],
  [28.6680, 77.2450],
  [28.6800, 77.2200],
  [28.7041, 77.2028],
];

// ─── Color helpers ─────────────────────────────────────────────────────────────

const SEV_COLORS: Record<SeverityType, { fill: string; stroke: string; glow: string; text: string }> = {
  breach:       { fill: "#dc2626", stroke: "#fca5a5", glow: "#dc2626", text: "text-rose-400" },
  submerged:    { fill: "#ea580c", stroke: "#fdba74", glow: "#ea580c", text: "text-orange-400" },
  waterlogging: { fill: "#d97706", stroke: "#fcd34d", glow: "#d97706", text: "text-amber-400" },
  evacuation:   { fill: "#9333ea", stroke: "#d8b4fe", glow: "#9333ea", text: "text-purple-400" },
  shelter:      { fill: "#16a34a", stroke: "#86efac", glow: "#16a34a", text: "text-emerald-400" },
};

const SEV_LABELS: Record<SeverityType, string> = {
  breach: "Breach",
  submerged: "Submerged",
  waterlogging: "Waterlogging",
  evacuation: "Evacuation",
  shelter: "Shelter",
};

const SEV_ICONS: Record<SeverityType, React.ElementType> = {
  breach: AlertOctagon,
  submerged: Waves,
  waterlogging: Droplets,
  evacuation: Navigation,
  shelter: Shield,
};

// ─── Custom Leaflet Icons ──────────────────────────────────────────────────────

function makeSvgIcon(severity: SeverityType, verified: boolean, pulse: boolean): L.DivIcon {
  const c = SEV_COLORS[severity];
  const size = severity === "breach" ? 42 : severity === "shelter" ? 36 : 32;
  const r = size / 2;

  const svgInner = severity === "shelter"
    ? `<path d="M${r} 6 L${size - 6} ${r + 4} L${size - 6} ${size - 6} L6 ${size - 6} L6 ${r + 4} Z" fill="${c.fill}" opacity="0.9"/><text x="${r}" y="${r + 5}" text-anchor="middle" font-size="12" fill="white">⛺</text>`
    : `<circle cx="${r}" cy="${r}" r="${r - 3}" fill="${c.fill}" opacity="0.9"/><circle cx="${r}" cy="${r}" r="${r - 8}" fill="white" opacity="0.2"/>`;

  const pulseRing = pulse
    ? `<circle cx="${r}" cy="${r}" r="${r - 1}" fill="none" stroke="${c.fill}" stroke-width="2" opacity="0.5"><animate attributeName="r" from="${r - 1}" to="${r + 8}" dur="1.4s" repeatCount="indefinite"/><animate attributeName="opacity" from="0.6" to="0" dur="1.4s" repeatCount="indefinite"/></circle>`
    : "";

  const verifiedCheck = verified
    ? `<circle cx="${size - 6}" cy="6" r="6" fill="#16a34a"/><text x="${size - 6}" y="10" text-anchor="middle" font-size="8" fill="white">✓</text>`
    : "";

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size + 16}" height="${size + 16}" viewBox="-8 -8 ${size + 16} ${size + 16}">
    <filter id="glow"><feGaussianBlur stdDeviation="3" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    <g filter="url(#glow)">
      ${pulseRing}
      ${svgInner}
      ${verifiedCheck}
    </g>
    <polygon points="${r},${size + 2} ${r - 5},${size - 4} ${r + 5},${size - 4}" fill="${c.fill}" opacity="0.9"/>
  </svg>`;

  return L.divIcon({
    html: svg,
    className: "",
    iconSize: [size + 16, size + 20],
    iconAnchor: [r + 8, size + 14],
    popupAnchor: [0, -(size + 10)],
  });
}

function makeGaugeIcon(station: GaugeStation): L.DivIcon {
  const pct = Math.min((station.level / station.danger) * 100, 100);
  const color = station.level >= station.danger ? "#dc2626"
    : station.level >= station.warning ? "#f59e0b"
    : "#16a34a";
  const trendArrow = station.trend === "rising" ? "↑" : station.trend === "receding" ? "↓" : "→";

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="52" height="52" viewBox="0 0 52 52">
    <circle cx="26" cy="26" r="22" fill="#18181b" stroke="#3f3f46" stroke-width="1.5"/>
    <circle cx="26" cy="26" r="18" fill="none" stroke="#27272a" stroke-width="4"/>
    <circle cx="26" cy="26" r="18" fill="none" stroke="${color}" stroke-width="4" stroke-dasharray="${pct * 1.13} 113" stroke-dashoffset="28" stroke-linecap="round" transform="rotate(-90 26 26)"/>
    <text x="26" y="23" text-anchor="middle" font-size="9" font-weight="bold" fill="white" font-family="monospace">${station.level}m</text>
    <text x="26" y="34" text-anchor="middle" font-size="11" fill="${color}">${trendArrow}</text>
  </svg>`;

  return L.divIcon({
    html: svg,
    className: "",
    iconSize: [52, 52],
    iconAnchor: [26, 26],
    popupAnchor: [0, -30],
  });
}

// ─── Map control sub-components ───────────────────────────────────────────────

function RecenterButton({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  return (
    <button
      onClick={() => map.flyTo([lat, lng], 13, { duration: 1.2 })}
      className="tap-active w-10 h-10 rounded-xl bg-zinc-900/95 border border-zinc-700 flex items-center justify-center shadow-lg"
    >
      <LocateFixed className="w-4 h-4 text-sky-400" />
    </button>
  );
}

function MapControls({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  return (
    <div className="absolute top-3 right-3 z-[1000] flex flex-col gap-2">
      <button
        onClick={() => map.zoomIn()}
        className="tap-active w-10 h-10 rounded-xl bg-zinc-900/95 border border-zinc-700 flex items-center justify-center shadow-lg text-white text-xl font-bold leading-none"
      >
        +
      </button>
      <button
        onClick={() => map.zoomOut()}
        className="tap-active w-10 h-10 rounded-xl bg-zinc-900/95 border border-zinc-700 flex items-center justify-center shadow-lg text-white text-xl font-bold leading-none"
      >
        −
      </button>
      <RecenterButton lat={lat} lng={lng} />
    </div>
  );
}

// ─── Main MapView ─────────────────────────────────────────────────────────────

export default function MapView() {
  const [selected, setSelected] = useState<Incident | null>(null);
  const [activeLayers, setActiveLayers] = useState<Set<MapLayer>>(
    new Set(["incidents", "floodZones", "shelters", "routes"])
  );
  const [showLayerPanel, setShowLayerPanel] = useState(false);
  const [tileStyle, setTileStyle] = useState<"dark" | "satellite">("dark");
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);
  const userLat = 28.6519;
  const userLng = 77.2315;

  const tileSources = {
    dark: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    satellite: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  };

  const tileAttrib = tileStyle === "dark"
    ? '&copy; <a href="https://carto.com">CARTO</a>'
    : '&copy; Esri';

  const toggleLayer = (l: MapLayer) =>
    setActiveLayers((prev) => {
      const next = new Set(prev);
      next.has(l) ? next.delete(l) : next.add(l);
      return next;
    });

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => { setRefreshing(false); setLastUpdated(new Date()); }, 1400);
  };

  const incidentMarkers = useMemo(
    () =>
      INCIDENTS.filter(
        (i) =>
          (i.severity !== "shelter" && activeLayers.has("incidents")) ||
          (i.severity === "shelter" && activeLayers.has("shelters"))
      ),
    [activeLayers]
  );

  const trendIcon = (t?: "rising" | "stable" | "receding") =>
    t === "rising" ? <TrendingUp className="w-3 h-3 text-rose-400" /> :
    t === "receding" ? <TrendingDown className="w-3 h-3 text-emerald-400" /> :
    <Minus className="w-3 h-3 text-zinc-400" />;

  return (
    <div className="flex flex-col h-full relative bg-zinc-950">
      {/* Top toolbar */}
      <div className="flex-shrink-0 px-4 pt-3 pb-2 flex items-center gap-2 z-10">
        <div className="flex-1 bg-zinc-900/90 border border-zinc-800 rounded-xl px-3 py-2 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-sky-400 flex-shrink-0" />
          <span className="text-sm text-zinc-300 flex-1 truncate">Sector 4, Delhi — Live</span>
          <span className="text-[10px] text-zinc-600 font-mono whitespace-nowrap">
            {lastUpdated.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
          </span>
        </div>
        <button
          onClick={handleRefresh}
          className="tap-active w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center flex-shrink-0"
        >
          <RefreshCw className={`w-4 h-4 text-sky-400 ${refreshing ? "animate-spin" : ""}`} />
        </button>
        <button
          onClick={() => setShowLayerPanel((v) => !v)}
          className={`tap-active w-10 h-10 rounded-xl border flex items-center justify-center flex-shrink-0 transition-colors ${showLayerPanel ? "bg-sky-600 border-sky-500" : "bg-zinc-900 border-zinc-800"}`}
        >
          <Layers className={`w-4 h-4 ${showLayerPanel ? "text-white" : "text-zinc-400"}`} />
        </button>
      </div>

      {/* Layer panel */}
      {showLayerPanel && (
        <div className="mx-4 mb-2 bg-zinc-900/95 border border-zinc-800 rounded-2xl p-3 z-10 flex-shrink-0 scale-in">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-zinc-400 tracking-widest uppercase">Map Layers</span>
            <div className="flex gap-2">
              <button
                onClick={() => setTileStyle(tileStyle === "dark" ? "satellite" : "dark")}
                className="text-[10px] font-semibold text-sky-400 bg-sky-400/10 border border-sky-400/30 px-2 py-1 rounded-lg"
              >
                {tileStyle === "dark" ? "→ Satellite" : "→ Dark"}
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {(
              [
                { id: "incidents", label: "Incidents", color: "bg-rose-500" },
                { id: "floodZones", label: "Flood Zones", color: "bg-amber-500" },
                { id: "shelters", label: "Shelters", color: "bg-emerald-500" },
                { id: "routes", label: "Evac Routes", color: "bg-purple-500" },
              ] as { id: MapLayer; label: string; color: string }[]
            ).map((layer) => (
              <button
                key={layer.id}
                onClick={() => toggleLayer(layer.id)}
                className={`tap-active flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold transition-all ${
                  activeLayers.has(layer.id)
                    ? "bg-zinc-800 border-zinc-600 text-white"
                    : "bg-zinc-950 border-zinc-800 text-zinc-600"
                }`}
              >
                <div className={`w-2 h-2 rounded-full ${activeLayers.has(layer.id) ? layer.color : "bg-zinc-700"}`} />
                {layer.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Stat ribbon */}
      <div className="flex gap-2 px-4 mb-2 flex-shrink-0 overflow-x-auto scrollbar-hide">
        {[
          { label: "Active", value: "6", icon: Radio, color: "text-rose-400", bg: "bg-rose-500/10 border-rose-500/20" },
          { label: "Shelters", value: "2", icon: Shield, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
          { label: "Gauge Stations", value: "3", icon: Thermometer, color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
          { label: "Affected", value: "2.2k", icon: Eye, color: "text-sky-400", bg: "bg-sky-500/10 border-sky-500/20" },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl border ${s.bg}`}>
              <Icon className={`w-3 h-3 ${s.color}`} />
              <span className={`text-xs font-black ${s.color}`}>{s.value}</span>
              <span className="text-[10px] text-zinc-600">{s.label}</span>
            </div>
          );
        })}
      </div>

      {/* Map */}
      <div className="flex-1 relative mx-4 rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl">
        <MapContainer
          center={[userLat, userLng]}
          zoom={13}
          zoomControl={false}
          attributionControl={false}
          className="w-full h-full"
          style={{ background: "#09090b" }}
        >
          <TileLayer url={tileSources[tileStyle]} attribution={tileAttrib} />

          {/* Flood zone overlays */}
          {activeLayers.has("floodZones") &&
            FLOOD_ZONES.map((fz) => (
              <Circle
                key={fz.id}
                center={fz.center}
                radius={fz.radius}
                pathOptions={{
                  color: fz.color,
                  fillColor: fz.color,
                  fillOpacity: fz.fillOpacity,
                  weight: 1.5,
                  dashArray: "6 4",
                }}
              />
            ))}

          {/* Evacuation route */}
          {activeLayers.has("routes") && (
            <Polyline
              positions={EVAC_ROUTE}
              pathOptions={{
                color: "#a855f7",
                weight: 3,
                dashArray: "10 6",
                opacity: 0.85,
              }}
            />
          )}

          {/* Incident + shelter markers */}
          {incidentMarkers.map((incident) => (
            <Marker
              key={incident.id}
              position={[incident.lat, incident.lng]}
              icon={makeSvgIcon(
                incident.severity,
                incident.verified,
                incident.severity === "breach"
              )}
              eventHandlers={{ click: () => setSelected(incident) }}
            />
          ))}

          {/* Gauge station markers */}
          {GAUGE_STATIONS.map((gs) => (
            <Marker
              key={gs.id}
              position={[gs.lat, gs.lng]}
              icon={makeGaugeIcon(gs)}
            >
              <Popup className="custom-popup">
                <div className="bg-zinc-900 text-white rounded-xl p-3 min-w-40 text-xs">
                  <div className="font-bold text-sm mb-1">{gs.name}</div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Level</span>
                    <span className={gs.level >= gs.danger ? "text-rose-400 font-bold" : gs.level >= gs.warning ? "text-amber-400 font-bold" : "text-emerald-400 font-bold"}>{gs.level}m</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Danger</span>
                    <span className="text-rose-400">{gs.danger}m</span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-zinc-400">Trend</span>
                    <span className={gs.trend === "rising" ? "text-rose-400" : gs.trend === "receding" ? "text-emerald-400" : "text-zinc-300"}>
                      {gs.trend === "rising" ? "↑ Rising" : gs.trend === "receding" ? "↓ Receding" : "→ Stable"}
                    </span>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* User location */}
          <Circle
            center={[userLat, userLng]}
            radius={80}
            pathOptions={{ color: "#0ea5e9", fillColor: "#0ea5e9", fillOpacity: 0.25, weight: 2 }}
          />
          <Circle
            center={[userLat, userLng]}
            radius={20}
            pathOptions={{ color: "#38bdf8", fillColor: "#38bdf8", fillOpacity: 0.9, weight: 3 }}
          />

          {/* Custom controls */}
          <MapControls lat={userLat} lng={userLng} />
        </MapContainer>

        {/* Map attribution */}
        <div className="absolute bottom-2 left-2 z-[999] text-[9px] text-zinc-600 bg-zinc-950/70 px-1.5 py-0.5 rounded">
          © CARTO · OpenStreetMap
        </div>
      </div>

      {/* Bottom: incident detail sheet */}
      {selected ? (
        <div className="mx-4 mb-3 mt-2 flex-shrink-0 bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden slide-up-enter">
          <div className="p-4">
            <div className="flex items-start gap-3">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${SEV_COLORS[selected.severity].fill}22`, border: `1px solid ${SEV_COLORS[selected.severity].fill}55` }}
              >
                {(() => { const Icon = SEV_ICONS[selected.severity]; return <Icon className={`w-5 h-5 ${SEV_COLORS[selected.severity].text}`} />; })()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-bold text-white leading-snug">{selected.title}</p>
                  <button onClick={() => setSelected(null)} className="tap-active flex-shrink-0 w-6 h-6 rounded-lg bg-zinc-800 flex items-center justify-center">
                    <X className="w-3.5 h-3.5 text-zinc-400" />
                  </button>
                </div>
                <p className="text-xs text-zinc-500 mt-0.5">{selected.location}</p>
              </div>
            </div>

            {/* Stat row */}
            <div className="flex gap-2 mt-3">
              {selected.depth && (
                <div className="flex-1 bg-zinc-800 rounded-xl p-2 text-center">
                  <div className="text-sm font-black text-amber-400">{selected.depth}</div>
                  <div className="text-[10px] text-zinc-500">Depth</div>
                </div>
              )}
              {selected.affected && (
                <div className="flex-1 bg-zinc-800 rounded-xl p-2 text-center">
                  <div className="text-sm font-black text-sky-400">{selected.affected >= 1000 ? `${(selected.affected / 1000).toFixed(1)}k` : selected.affected}</div>
                  <div className="text-[10px] text-zinc-500">Affected</div>
                </div>
              )}
              {selected.trend && (
                <div className="flex-1 bg-zinc-800 rounded-xl p-2 text-center flex flex-col items-center justify-center">
                  {trendIcon(selected.trend)}
                  <div className="text-[10px] text-zinc-500 mt-0.5 capitalize">{selected.trend}</div>
                </div>
              )}
              <div className="flex-1 bg-zinc-800 rounded-xl p-2 text-center flex flex-col items-center justify-center">
                {selected.verified
                  ? <CheckCircle className="w-4 h-4 text-emerald-400" />
                  : <Clock className="w-4 h-4 text-zinc-400" />}
                <div className="text-[10px] text-zinc-500 mt-0.5">{selected.verified ? "Verified" : "Pending"}</div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-zinc-800">
              <span className="text-xs text-zinc-600">{selected.reporter} · {selected.time}</span>
              {selected.severity === "shelter" ? (
                <button className="tap-active bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                  <Navigation className="w-3.5 h-3.5" /> Navigate
                </button>
              ) : (
                <button className="tap-active bg-zinc-800 text-zinc-300 text-xs font-semibold px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5" /> Report More
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Legend bar when no selection */
        <div className="mx-4 mb-3 mt-2 flex-shrink-0 bg-zinc-900/80 border border-zinc-800 rounded-xl px-3 py-2 flex items-center gap-3 overflow-x-auto scrollbar-hide">
          <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest flex-shrink-0">Legend</span>
          {(["breach", "submerged", "waterlogging", "evacuation", "shelter"] as SeverityType[]).map((s) => (
            <div key={s} className="flex items-center gap-1.5 flex-shrink-0">
              <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: SEV_COLORS[s].fill }} />
              <span className="text-[10px] text-zinc-500">{SEV_LABELS[s]}</span>
            </div>
          ))}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <div className="w-2.5 h-2.5 rounded-full bg-sky-400" />
            <span className="text-[10px] text-zinc-500">You</span>
          </div>
        </div>
      )}
    </div>
  );
}
