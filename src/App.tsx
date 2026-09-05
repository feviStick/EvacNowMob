import { useState, useRef, useEffect, useCallback, lazy, Suspense } from "react";
const MapView = lazy(() => import("./MapView"));
import {
  Home,
  AlertTriangle,
  Users,
  Map,
  Shield,
  MapPin,
  Wifi,
  WifiOff,
  ChevronRight,
  Camera,
  Radio,
  Navigation,
  Phone,
  CheckCircle,
  Clock,
  Star,
  X,
  Droplets,
  Waves,
  AlertOctagon,
  Filter,
  RefreshCw,
  Info,
  ThumbsUp,
  Share2,
  Bell,
  BellOff,
  Flame,
  ArrowLeft,
  Send,
  ImagePlus,
  Mic,
  MicOff,
  ChevronDown,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type NavTab = "home" | "report" | "feed" | "map" | "safety";
type AlertLevel = "critical" | "warning" | "safe";
type ReportStep = 1 | 2 | 3;
type SeverityType = "waterlogging" | "submerged" | "breach" | "evacuation";

interface FeedItem {
  id: string;
  title: string;
  location: string;
  time: string;
  severity: SeverityType;
  verified: boolean;
  upvotes: number;
  hasImage: boolean;
  imageId?: string;
  reporter: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const SEVERITY_CONFIG: Record<
  SeverityType,
  { label: string; color: string; bg: string; icon: React.ElementType }
> = {
  waterlogging: {
    label: "Waterlogging",
    color: "text-amber-400",
    bg: "bg-amber-400/20 border-amber-400/50",
    icon: Droplets,
  },
  submerged: {
    label: "Submerged",
    color: "text-orange-400",
    bg: "bg-orange-400/20 border-orange-400/50",
    icon: Waves,
  },
  breach: {
    label: "Breach",
    color: "text-rose-400",
    bg: "bg-rose-400/20 border-rose-400/50",
    icon: AlertOctagon,
  },
  evacuation: {
    label: "Evacuation",
    color: "text-purple-400",
    bg: "bg-purple-400/20 border-purple-400/50",
    icon: Navigation,
  },
};

const FEED_DATA: FeedItem[] = [
  {
    id: "1",
    title: "Underpass completely submerged — vehicles stranded",
    location: "ITO Underpass, Delhi",
    time: "4m ago",
    severity: "submerged",
    verified: true,
    upvotes: 47,
    hasImage: true,
    imageId: "photo-1547036967-23d11aacaee0",
    reporter: "Anita R.",
  },
  {
    id: "2",
    title: "Embankment showing stress cracks near riverbank",
    location: "Yamuna Bank, Sector 4",
    time: "12m ago",
    severity: "breach",
    verified: true,
    upvotes: 89,
    hasImage: true,
    imageId: "photo-1504701954957-2010ec3bcec1",
    reporter: "Rajan M.",
  },
  {
    id: "3",
    title: "Knee-deep water on main road, traffic blocked",
    location: "Connaught Place, Delhi",
    time: "23m ago",
    severity: "waterlogging",
    verified: false,
    upvotes: 12,
    hasImage: false,
    reporter: "Priya K.",
  },
  {
    id: "4",
    title: "Residential colony issued evacuation notice",
    location: "Geeta Colony, East Delhi",
    time: "38m ago",
    severity: "evacuation",
    verified: true,
    upvotes: 134,
    hasImage: true,
    imageId: "photo-1558618666-fcd25c85cd64",
    reporter: "NDC Officer",
  },
  {
    id: "5",
    title: "Water level rising in metro station basement",
    location: "Kashmere Gate Metro",
    time: "1h ago",
    severity: "submerged",
    verified: false,
    upvotes: 31,
    hasImage: false,
    reporter: "Deepak S.",
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function OnlineStatusDot({ online }: { online: boolean }) {
  return (
    <div
      className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${
        online
          ? "text-emerald-400 border-emerald-400/30 bg-emerald-400/10"
          : "text-zinc-400 border-zinc-700 bg-zinc-800"
      }`}
    >
      {online ? (
        <Wifi className="w-3 h-3" />
      ) : (
        <WifiOff className="w-3 h-3" />
      )}
      <span className={online ? "status-blink" : ""}>{online ? "Online" : "Offline"}</span>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex gap-3">
      <div className="skeleton w-16 h-16 rounded-xl flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="skeleton h-4 w-3/4 rounded-md" />
        <div className="skeleton h-3 w-1/2 rounded-md" />
        <div className="skeleton h-3 w-1/3 rounded-md" />
      </div>
    </div>
  );
}

// ─── SOS Hold Button ──────────────────────────────────────────────────────────

function SOSButton({ onActivate }: { onActivate: () => void }) {
  const [holding, setHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const [triggered, setTriggered] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startRef = useRef<number>(0);

  const startHold = useCallback(() => {
    if (triggered) return;
    setHolding(true);
    startRef.current = Date.now();
    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startRef.current;
      const pct = Math.min((elapsed / 3000) * 100, 100);
      setProgress(pct);
      if (elapsed >= 3000) {
        clearInterval(intervalRef.current!);
        setTriggered(true);
        setHolding(false);
        onActivate();
      }
    }, 30);
  }, [triggered, onActivate]);

  const endHold = useCallback(() => {
    if (triggered) return;
    if (intervalRef.current) clearInterval(intervalRef.current);
    setHolding(false);
    setProgress(0);
  }, [triggered]);

  useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current); }, []);

  return (
    <button
      onMouseDown={startHold}
      onMouseUp={endHold}
      onMouseLeave={endHold}
      onTouchStart={startHold}
      onTouchEnd={endHold}
      className={`relative flex flex-col items-center justify-center rounded-2xl border-2 h-full w-full overflow-hidden select-none transition-all duration-150 ${
        triggered
          ? "bg-rose-600 border-rose-400 scale-95"
          : holding
          ? "bg-rose-900/80 border-rose-500 scale-98"
          : "bg-rose-950/60 border-rose-700 sos-pulse"
      }`}
    >
      {/* Hold progress */}
      {holding && (
        <div
          className="absolute bottom-0 left-0 h-1 bg-rose-400 transition-none rounded-full"
          style={{ width: `${progress}%` }}
        />
      )}
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 ${
          triggered ? "bg-white/20" : "bg-rose-600/50"
        }`}
      >
        <Radio className={`w-5 h-5 ${triggered ? "text-white" : "text-rose-300"}`} />
      </div>
      <span className={`text-sm font-800 font-black tracking-wide ${triggered ? "text-white" : "text-rose-300"}`}>
        {triggered ? "SENT!" : "SOS"}
      </span>
      <span className="text-[10px] text-rose-400/70 mt-0.5 font-medium">
        {triggered ? "Help is coming" : holding ? `${Math.round((progress / 100) * 3)}s...` : "Hold 3s"}
      </span>
    </button>
  );
}

// ─── Home View ────────────────────────────────────────────────────────────────

function HomeView({ onNavigate }: { onNavigate: (tab: NavTab) => void }) {
  const [alertLevel] = useState<AlertLevel>("critical");
  const [sosActivated, setSosActivated] = useState(false);
  const [safeMarked, setSafeMarked] = useState(false);

  const alertConfig = {
    critical: {
      bg: "bg-rose-950/80 border-rose-700",
      badge: "bg-rose-600",
      text: "text-rose-100",
      icon: AlertOctagon,
      label: "RED ALERT",
      message: "Yamuna water level at 207.8m — DANGER ZONE. Evacuate low-lying areas immediately.",
    },
    warning: {
      bg: "bg-amber-950/80 border-amber-700",
      badge: "bg-amber-600",
      text: "text-amber-100",
      icon: AlertTriangle,
      label: "ORANGE WARNING",
      message: "Water levels rising in Sector 4. Monitor updates and prepare for possible evacuation.",
    },
    safe: {
      bg: "bg-emerald-950/80 border-emerald-700",
      badge: "bg-emerald-600",
      text: "text-emerald-100",
      icon: CheckCircle,
      label: "ALL CLEAR",
      message: "Water levels receding. Stay cautious and follow official guidance.",
    },
  };

  const cfg = alertConfig[alertLevel];
  const AlertIcon = cfg.icon;

  return (
    <div className="flex flex-col h-full overflow-y-auto scrollbar-hide">
      {/* Alert Banner */}
      <div className={`mx-4 mt-4 rounded-2xl border p-4 alert-pulse ${cfg.bg}`}>
        <div className="flex items-start gap-3">
          <div className={`${cfg.badge} rounded-lg p-2 flex-shrink-0`}>
            <AlertIcon className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-xs font-black tracking-widest ${cfg.text}`}>{cfg.label}</span>
              <span className="text-xs text-zinc-500">• Now</span>
            </div>
            <p className="text-sm text-zinc-200 leading-snug">{cfg.message}</p>
          </div>
          <button className="text-zinc-500 flex-shrink-0 p-1">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="flex gap-3 mx-4 mt-4">
        {[
          { label: "Active Incidents", value: "23", color: "text-rose-400" },
          { label: "Shelters Open", value: "7", color: "text-emerald-400" },
          { label: "People Helped", value: "1.2k", color: "text-sky-400" },
        ].map((stat) => (
          <div key={stat.label} className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-center">
            <div className={`text-xl font-black ${stat.color}`}>{stat.value}</div>
            <div className="text-[10px] text-zinc-500 font-medium mt-0.5 leading-tight">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions Grid */}
      <div className="px-4 mt-5">
        <h2 className="text-xs font-bold text-zinc-500 tracking-widest uppercase mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-3">
          {/* Report Incident */}
          <button
            onClick={() => onNavigate("report")}
            className="tap-active bg-sky-950/60 border border-sky-700/60 rounded-2xl p-4 flex flex-col items-start gap-3 text-left h-28 transition-all hover:border-sky-500/80"
          >
            <div className="w-10 h-10 rounded-xl bg-sky-600/30 flex items-center justify-center">
              <Camera className="w-5 h-5 text-sky-400" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">Report</div>
              <div className="text-xs text-sky-400/80">Incident</div>
            </div>
          </button>

          {/* Find Shelter */}
          <button
            onClick={() => onNavigate("map")}
            className="tap-active bg-emerald-950/60 border border-emerald-700/60 rounded-2xl p-4 flex flex-col items-start gap-3 text-left h-28 transition-all hover:border-emerald-500/80"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-600/30 flex items-center justify-center">
              <Navigation className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">Find</div>
              <div className="text-xs text-emerald-400/80">Shelter</div>
            </div>
          </button>

          {/* I Am Safe */}
          <button
            onClick={() => setSafeMarked(!safeMarked)}
            className={`tap-active rounded-2xl p-4 flex flex-col items-start gap-3 text-left h-28 border transition-all ${
              safeMarked
                ? "bg-emerald-600/20 border-emerald-500"
                : "bg-zinc-900 border-zinc-800 hover:border-zinc-600"
            }`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${safeMarked ? "bg-emerald-500/30" : "bg-zinc-800"}`}>
              <CheckCircle className={`w-5 h-5 ${safeMarked ? "text-emerald-400" : "text-zinc-400"}`} />
            </div>
            <div>
              <div className="text-sm font-bold text-white">{safeMarked ? "Marked Safe" : "I Am Safe"}</div>
              <div className={`text-xs ${safeMarked ? "text-emerald-400/80" : "text-zinc-500"}`}>
                {safeMarked ? "✓ Broadcast sent" : "Notify contacts"}
              </div>
            </div>
          </button>

          {/* SOS */}
          <div className="h-28">
            <SOSButton onActivate={() => setSosActivated(true)} />
          </div>
        </div>
      </div>

      {/* Nearby Incidents */}
      <div className="px-4 mt-6 pb-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold text-zinc-500 tracking-widest uppercase">Nearby Incidents</h2>
          <button
            onClick={() => onNavigate("feed")}
            className="text-sky-400 text-xs font-semibold flex items-center gap-1"
          >
            See all <ChevronRight className="w-3 h-3" />
          </button>
        </div>
        <div className="space-y-2">
          {FEED_DATA.slice(0, 2).map((item) => {
            const sev = SEVERITY_CONFIG[item.severity];
            const SevIcon = sev.icon;
            return (
              <div key={item.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-3.5 flex items-center gap-3 fade-in">
                <div className={`w-10 h-10 rounded-xl border flex items-center justify-center flex-shrink-0 ${sev.bg}`}>
                  <SevIcon className={`w-5 h-5 ${sev.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{item.title}</p>
                  <p className="text-xs text-zinc-500 mt-0.5">{item.location} · {item.time}</p>
                </div>
                {item.verified && (
                  <div className="flex-shrink-0 text-emerald-400">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Report View ──────────────────────────────────────────────────────────────

function ReportView({ onBack }: { onBack: () => void }) {
  const [step, setStep] = useState<ReportStep>(1);
  const [selectedSeverity, setSelectedSeverity] = useState<SeverityType | null>(null);
  const [description, setDescription] = useState("");
  const [hasImage, setHasImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 2200);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-6 gap-6 fade-in">
        <div className="w-20 h-20 rounded-full bg-emerald-600/20 border-2 border-emerald-500 flex items-center justify-center">
          <CheckCircle className="w-10 h-10 text-emerald-400" />
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-black text-white mb-2">Report Submitted</h2>
          <p className="text-zinc-400 text-sm leading-relaxed">
            Your incident has been queued for AI verification. You'll be notified when it's reviewed.
          </p>
        </div>
        <div className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-sky-600/20 flex items-center justify-center">
              <Clock className="w-4 h-4 text-sky-400" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">AI Review in Progress</div>
              <div className="text-xs text-zinc-500">Est. 2–5 minutes</div>
            </div>
          </div>
          <div className="w-full bg-zinc-800 rounded-full h-1.5">
            <div className="bg-sky-500 h-1.5 rounded-full w-1/3 transition-all duration-1000" />
          </div>
        </div>
        <button
          onClick={onBack}
          className="tap-active w-full h-14 bg-zinc-900 border border-zinc-700 rounded-2xl text-white font-bold text-base"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Step header */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={onBack} className="tap-active w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
            <ArrowLeft className="w-5 h-5 text-zinc-400" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-black text-white">Report Incident</h1>
            <p className="text-xs text-zinc-500">Step {step} of 3</p>
          </div>
        </div>

        {/* Step indicators */}
        <div className="flex gap-1.5">
          {([1, 2, 3] as ReportStep[]).map((s) => (
            <div
              key={s}
              className={`h-1 rounded-full flex-1 transition-all duration-300 ${
                s <= step ? "bg-sky-500" : "bg-zinc-800"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Step content */}
      <div className="flex-1 overflow-y-auto scrollbar-hide px-4 py-4">
        {step === 1 && (
          <div className="space-y-4 fade-in">
            <div>
              <label className="text-xs font-bold text-zinc-400 tracking-widest uppercase block mb-3">
                Capture Evidence
              </label>
              <button
                onClick={() => setHasImage(!hasImage)}
                className={`tap-active w-full h-48 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-3 transition-all ${
                  hasImage
                    ? "border-sky-500 bg-sky-950/30"
                    : "border-zinc-700 bg-zinc-900/50"
                }`}
              >
                {hasImage ? (
                  <>
                    <div className="w-12 h-12 rounded-xl bg-sky-600/30 flex items-center justify-center">
                      <ImagePlus className="w-6 h-6 text-sky-400" />
                    </div>
                    <span className="text-sm font-semibold text-sky-400">Photo Captured</span>
                    <span className="text-xs text-zinc-500">Tap to change</span>
                  </>
                ) : (
                  <>
                    <div className="w-14 h-14 rounded-2xl bg-zinc-800 flex items-center justify-center">
                      <Camera className="w-7 h-7 text-zinc-500" />
                    </div>
                    <div className="text-center">
                      <span className="text-sm font-semibold text-zinc-300 block">Tap to Capture</span>
                      <span className="text-xs text-zinc-600">Photo or video evidence</span>
                    </div>
                  </>
                )}
              </button>
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-400 tracking-widest uppercase block mb-3">
                Incident Severity
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(Object.entries(SEVERITY_CONFIG) as [SeverityType, typeof SEVERITY_CONFIG[SeverityType]][]).map(
                  ([key, cfg]) => {
                    const Icon = cfg.icon;
                    const selected = selectedSeverity === key;
                    return (
                      <button
                        key={key}
                        onClick={() => setSelectedSeverity(key)}
                        className={`tap-active flex items-center gap-2.5 px-3 py-3 rounded-xl border text-sm font-semibold transition-all ${
                          selected
                            ? `${cfg.bg} ${cfg.color} border-opacity-100`
                            : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-600"
                        }`}
                      >
                        <Icon className="w-4 h-4 flex-shrink-0" />
                        {cfg.label}
                      </button>
                    );
                  }
                )}
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 fade-in">
            <div>
              <label className="text-xs font-bold text-zinc-400 tracking-widest uppercase block mb-3">
                Describe Situation
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what you're seeing — water depth, road blockage, people in danger..."
                className="w-full h-36 bg-zinc-900 border border-zinc-700 rounded-2xl p-4 text-base text-white placeholder-zinc-600 resize-none focus:outline-none focus:border-sky-500 leading-relaxed"
              />
              <div className="flex justify-between mt-1">
                <span className="text-xs text-zinc-600">Be specific — it helps AI verification</span>
                <span className="text-xs text-zinc-600">{description.length}/300</span>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-400 tracking-widest uppercase block mb-3">
                Location
              </label>
              <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-4 flex items-center gap-3">
                <MapPin className="w-5 h-5 text-sky-400 flex-shrink-0" />
                <div className="flex-1">
                  <div className="text-sm font-semibold text-white">Sector 4, Delhi</div>
                  <div className="text-xs text-zinc-500">28.6139° N, 77.2090° E · GPS locked</div>
                </div>
                <button className="text-xs text-sky-400 font-semibold">Edit</button>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-400 tracking-widest uppercase block mb-3">
                How Many People Affected?
              </label>
              <div className="flex gap-2">
                {["1–5", "6–20", "20–100", "100+"].map((range) => (
                  <button
                    key={range}
                    className="tap-active flex-1 h-11 rounded-xl bg-zinc-900 border border-zinc-800 text-sm font-semibold text-zinc-400 hover:border-zinc-600 transition-all"
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 fade-in">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 space-y-3">
              <h3 className="text-sm font-bold text-zinc-300">Review Your Report</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-zinc-600 w-24">Severity</span>
                  {selectedSeverity && (
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${SEVERITY_CONFIG[selectedSeverity].bg} ${SEVERITY_CONFIG[selectedSeverity].color}`}>
                      {SEVERITY_CONFIG[selectedSeverity].label}
                    </span>
                  )}
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-xs text-zinc-600 w-24">Description</span>
                  <span className="text-xs text-zinc-300 flex-1">{description || "Not provided"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-zinc-600 w-24">Location</span>
                  <span className="text-xs text-zinc-300">Sector 4, Delhi</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-zinc-600 w-24">Photo</span>
                  <span className={`text-xs font-semibold ${hasImage ? "text-emerald-400" : "text-zinc-500"}`}>
                    {hasImage ? "✓ Attached" : "None"}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-sky-950/30 border border-sky-700/40 rounded-2xl p-4">
              <div className="flex gap-3">
                <Info className="w-5 h-5 text-sky-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-sky-200/80 leading-relaxed">
                  Your report will be analyzed by HydroGuard AI for accuracy and threat level before being published to the community feed.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom action */}
      <div className="px-4 pb-6 pt-3">
        {step < 3 ? (
          <button
            onClick={() => setStep((s) => Math.min(s + 1, 3) as ReportStep)}
            disabled={step === 1 && !selectedSeverity}
            className="tap-active w-full h-14 rounded-2xl font-bold text-base transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-sky-600 hover:bg-sky-500 text-white glow-blue"
          >
            Continue →
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="tap-active w-full h-14 rounded-2xl font-bold text-base bg-sky-600 hover:bg-sky-500 text-white flex items-center justify-center gap-2 glow-blue transition-all"
          >
            {submitting ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                Submitting to AI...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Submit to AI
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Feed View ────────────────────────────────────────────────────────────────

function FeedView() {
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | SeverityType>("all");
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(t);
  }, []);

  const filtered = filter === "all" ? FEED_DATA : FEED_DATA.filter((i) => i.severity === filter);

  return (
    <div className="flex flex-col h-full">
      {/* Filter chips */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {(["all", "breach", "submerged", "waterlogging", "evacuation"] as const).map((f) => {
            const label = f === "all" ? "All" : SEVERITY_CONFIG[f].label;
            const active = filter === f;
            const cfg = f !== "all" ? SEVERITY_CONFIG[f] : null;
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`tap-active flex-shrink-0 h-9 px-4 rounded-full text-sm font-semibold border transition-all ${
                  active
                    ? f === "all"
                      ? "bg-white text-zinc-900 border-white"
                      : `${cfg!.bg} ${cfg!.color}`
                    : "bg-zinc-900 border-zinc-800 text-zinc-500"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Feed list */}
      <div className="flex-1 overflow-y-auto scrollbar-hide px-4 pb-4 space-y-3">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          : filtered.map((item, idx) => {
              const sev = SEVERITY_CONFIG[item.severity];
              const SevIcon = sev.icon;
              const liked = likedIds.has(item.id);

              return (
                <div
                  key={item.id}
                  className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden fade-in"
                  style={{ animationDelay: `${idx * 0.06}s` }}
                >
                  {/* Image */}
                  {item.hasImage && item.imageId && (
                    <div className="w-full h-40 bg-zinc-800 relative overflow-hidden">
                      <img
                        src={`https://images.unsplash.com/${item.imageId}?w=600&h=200&fit=crop&auto=format`}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/60 to-transparent" />
                      {/* Verified badge overlay */}
                      <div className="absolute top-2 right-2">
                        {item.verified ? (
                          <span className="bg-emerald-600/90 text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 backdrop-blur-sm">
                            <CheckCircle className="w-3 h-3" />
                            AI Verified
                          </span>
                        ) : (
                          <span className="bg-zinc-700/90 text-zinc-300 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 backdrop-blur-sm">
                            <Clock className="w-3 h-3" />
                            Pending
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="p-4">
                    <div className="flex items-start gap-3">
                      {/* Severity icon */}
                      <div className={`w-10 h-10 rounded-xl border flex items-center justify-center flex-shrink-0 ${sev.bg}`}>
                        <SevIcon className={`w-5 h-5 ${sev.color}`} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-white leading-snug">{item.title}</p>
                        <div className="flex items-center gap-1.5 mt-1">
                          <MapPin className="w-3 h-3 text-zinc-600" />
                          <span className="text-xs text-zinc-500">{item.location}</span>
                        </div>

                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-zinc-600">{item.reporter} · {item.time}</span>
                          </div>
                          {!item.hasImage && (
                            <div>
                              {item.verified ? (
                                <span className="bg-emerald-600/20 border border-emerald-600/40 text-emerald-400 text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                                  <CheckCircle className="w-3 h-3" />
                                  AI Verified
                                </span>
                              ) : (
                                <span className="bg-zinc-800 border border-zinc-700 text-zinc-500 text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  Pending
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 mt-3 pt-3 border-t border-zinc-800">
                      <button
                        onClick={() =>
                          setLikedIds((prev) => {
                            const next = new Set(prev);
                            liked ? next.delete(item.id) : next.add(item.id);
                            return next;
                          })
                        }
                        className={`tap-active flex items-center gap-1.5 text-xs font-semibold transition-colors ${liked ? "text-sky-400" : "text-zinc-500"}`}
                      >
                        <ThumbsUp className="w-4 h-4" />
                        {item.upvotes + (liked ? 1 : 0)}
                      </button>
                      <button className="tap-active flex items-center gap-1.5 text-xs font-semibold text-zinc-500">
                        <Share2 className="w-4 h-4" />
                        Share
                      </button>
                      <div className="flex-1" />
                      <span className={`text-xs font-bold ${sev.color}`}>{sev.label}</span>
                    </div>
                  </div>
                </div>
              );
            })}
      </div>
    </div>
  );
}

// ─── Map View (Placeholder) ───────────────────────────────────────────────────

// ─── Safety View ──────────────────────────────────────────────────────────────

function SafetyView() {
  const [notifEnabled, setNotifEnabled] = useState(true);
  const shelters = [
    { name: "Delhi Police Lines Ground", capacity: "2,000", distance: "1.2km", open: true },
    { name: "Rajghat Community Center", capacity: "800", distance: "2.4km", open: true },
    { name: "Yamuna Sports Complex", capacity: "3,500", distance: "3.1km", open: false },
  ];

  return (
    <div className="flex flex-col h-full overflow-y-auto scrollbar-hide">
      <div className="px-4 pt-4 space-y-4 pb-6">
        {/* Emergency contacts */}
        <div>
          <h2 className="text-xs font-bold text-zinc-500 tracking-widest uppercase mb-3">Emergency Contacts</h2>
          <div className="space-y-2">
            {[
              { label: "NDRF Helpline", number: "0120-2309540", color: "text-rose-400", bg: "bg-rose-950/40 border-rose-800/50" },
              { label: "Delhi Flood Control", number: "1800-110-001", color: "text-amber-400", bg: "bg-amber-950/40 border-amber-800/50" },
              { label: "Police Emergency", number: "100", color: "text-sky-400", bg: "bg-sky-950/40 border-sky-800/50" },
            ].map((c) => (
              <button key={c.label} className={`tap-active w-full flex items-center gap-3 p-4 rounded-2xl border ${c.bg} transition-all`}>
                <div className={`w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center`}>
                  <Phone className={`w-5 h-5 ${c.color}`} />
                </div>
                <div className="flex-1 text-left">
                  <div className="text-sm font-bold text-white">{c.label}</div>
                  <div className={`text-xs font-mono ${c.color}`}>{c.number}</div>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-600" />
              </button>
            ))}
          </div>
        </div>

        {/* Nearby shelters */}
        <div>
          <h2 className="text-xs font-bold text-zinc-500 tracking-widest uppercase mb-3">Nearby Shelters</h2>
          <div className="space-y-2">
            {shelters.map((s) => (
              <div key={s.name} className={`bg-zinc-900 border rounded-2xl p-4 ${s.open ? "border-zinc-800" : "border-zinc-800/50 opacity-60"}`}>
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${s.open ? "bg-emerald-600/20" : "bg-zinc-800"}`}>
                    <Shield className={`w-5 h-5 ${s.open ? "text-emerald-400" : "text-zinc-600"}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">{s.name}</span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${s.open ? "bg-emerald-600/20 text-emerald-400" : "bg-zinc-800 text-zinc-500"}`}>
                        {s.open ? "Open" : "Full"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-zinc-500">Cap. {s.capacity}</span>
                      <span className="text-xs text-zinc-500">·</span>
                      <span className="text-xs text-sky-400 font-medium">{s.distance}</span>
                    </div>
                  </div>
                  {s.open && (
                    <button className="tap-active text-xs font-bold text-emerald-400 bg-emerald-600/10 border border-emerald-600/30 px-3 py-1.5 rounded-xl">
                      Navigate
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notifications toggle */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center">
            {notifEnabled ? (
              <Bell className="w-5 h-5 text-sky-400" />
            ) : (
              <BellOff className="w-5 h-5 text-zinc-500" />
            )}
          </div>
          <div className="flex-1">
            <div className="text-sm font-bold text-white">Alert Notifications</div>
            <div className="text-xs text-zinc-500">{notifEnabled ? "Receiving emergency alerts" : "Notifications paused"}</div>
          </div>
          <button
            onClick={() => setNotifEnabled(!notifEnabled)}
            className={`tap-active w-12 h-6 rounded-full transition-all relative ${notifEnabled ? "bg-sky-600" : "bg-zinc-700"}`}
          >
            <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all ${notifEnabled ? "right-0.5" : "left-0.5"}`} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Bottom Navigation ────────────────────────────────────────────────────────

function BottomNav({
  active,
  onNavigate,
}: {
  active: NavTab;
  onNavigate: (tab: NavTab) => void;
}) {
  const tabs: { id: NavTab; label: string; icon: React.ElementType }[] = [
    { id: "home", label: "Home", icon: Home },
    { id: "feed", label: "Feed", icon: Users },
    { id: "report", label: "Report", icon: AlertTriangle },
    { id: "map", label: "Map", icon: Map },
    { id: "safety", label: "Safety", icon: Shield },
  ];

  return (
    <div className="glass-nav flex-shrink-0">
      <div className="flex items-center h-16 px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = active === tab.id;
          const isReport = tab.id === "report";

          if (isReport) {
            return (
              <button
                key={tab.id}
                onClick={() => onNavigate(tab.id)}
                className="tap-active flex-1 flex flex-col items-center justify-center h-14"
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                    isActive
                      ? "bg-rose-600 shadow-lg shadow-rose-600/40"
                      : "bg-amber-600/90 shadow-md shadow-amber-600/30"
                  }`}
                >
                  <AlertTriangle className="w-5 h-5 text-white" />
                </div>
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              className="tap-active flex-1 flex flex-col items-center justify-center gap-1 h-14 relative"
            >
              {isActive && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-sky-400 glow-blue" />
              )}
              <Icon
                className={`w-5 h-5 transition-colors ${isActive ? "text-sky-400" : "text-zinc-600"}`}
              />
              <span
                className={`text-[10px] font-semibold transition-colors ${
                  isActive ? "text-sky-400" : "text-zinc-600"
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
      {/* Safe area padding */}
      <div className="h-[env(safe-area-inset-bottom,0px)]" />
    </div>
  );
}

// ─── App Shell ────────────────────────────────────────────────────────────────

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>("home");
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const onOnline = () => setIsOnline(true);
    const onOffline = () => setIsOnline(false);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, []);

  const isReportView = activeTab === "report";

  return (
    <div className="flex items-center justify-center w-full h-full bg-zinc-950">
      <div className="relative w-full max-w-md h-[100dvh] bg-zinc-950 flex flex-col overflow-hidden">
        {/* Sticky Header */}
        {!isReportView && (
          <header className="glass-header flex-shrink-0 px-4 py-3 flex items-center justify-between z-10">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-sky-600 flex items-center justify-center">
                <Droplets className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="text-xs font-black text-white tracking-tight">HydroGuard AI</div>
                <div className="flex items-center gap-1 text-[10px] text-zinc-500">
                  <MapPin className="w-2.5 h-2.5" />
                  Sector 4, Delhi
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <OnlineStatusDot online={isOnline} />
              <button
                onClick={() => setIsOnline((v) => !v)}
                className="tap-active w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center"
              >
                <Bell className="w-4 h-4 text-zinc-400" />
              </button>
            </div>
          </header>
        )}

        {/* Content */}
        <div className="flex-1 overflow-hidden relative">
          <div
            key={activeTab}
            className="absolute inset-0 scale-in"
          >
            {activeTab === "home" && <HomeView onNavigate={setActiveTab} />}
            {activeTab === "report" && <ReportView onBack={() => setActiveTab("home")} />}
            {activeTab === "feed" && <FeedView />}
            {activeTab === "map" && (
              <Suspense fallback={
                <div className="flex items-center justify-center h-full">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 rounded-full border-2 border-sky-500 border-t-transparent animate-spin" />
                    <span className="text-xs text-zinc-500">Loading map...</span>
                  </div>
                </div>
              }>
                <MapView />
              </Suspense>
            )}
            {activeTab === "safety" && <SafetyView />}
          </div>
        </div>

        {/* Bottom Navigation */}
        <BottomNav active={activeTab} onNavigate={setActiveTab} />
      </div>
    </div>
  );
}
