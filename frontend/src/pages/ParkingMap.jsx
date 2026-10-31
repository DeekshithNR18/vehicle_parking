import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Navigation, Wifi, WifiOff, Car, Bike, Zap, X, CheckCircle, Clock, Map as MapIcon, Route } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useParking } from "../context/ParkingContext";
import Button from "../components/ui/Button";
import { fireConfetti } from "../utils/confetti";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const SOCIETY_LOCATION = [12.9716, 77.5946];
const USER_LOCATION = [12.9725, 77.5960];

export default function ParkingMap() {
  const { slots, bookSlot, offlineQueue } = useParking();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [justBooked, setJustBooked] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const handleLocate = () => {
    setIsLocating(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
          setIsLocating(false);
        },
        () => {
          alert("Please enable location permissions.");
          setIsLocating(false);
        }
      );
    } else {
      alert("Geolocation not supported.");
      setIsLocating(false);
    }
  };

  const handleBook = async () => {
    setError("");
    const result = await bookSlot(selectedSlot);
    if (!result.ok) {
      const msg = result.message || "Booking failed. Please try again.";
      setError(msg);
      alert(msg);
      return;
    }
    if (result.isOffline || !isOnline) {
      setJustBooked({ slotLabel: selectedSlot.label, isOffline: true });
    } else {
      fireConfetti();
      setJustBooked({ slotLabel: selectedSlot.label, earnedPoints: result.earnedPoints });
    }
    setSelectedSlot(null);
    setTimeout(() => setJustBooked(null), 4000);
  };

  const getIcon = (type) => {
    if (type === "car") return <Car size={20} />;
    if (type === "bike") return <Bike size={20} />;
    return <Zap size={20} />;
  };

  const getStatusColor = (status, type) => {
    if (status === "occupied") return "bg-danger/10 border-danger/30 text-danger opacity-60 cursor-not-allowed";
    if (status === "reserved") return "bg-warn/10 border-warn/30 text-warn cursor-not-allowed";
    if (type === "ev") return "bg-azure/10 border-azure/30 text-azure hover:shadow-[0_0_20px_rgba(91,140,255,0.4)] cursor-pointer";
    return "bg-mint/10 border-mint/30 text-mint hover:shadow-[0_0_20px_rgba(0,229,160,0.4)] cursor-pointer";
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <AnimatePresence>
        {justBooked && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className={`fixed top-6 right-6 px-6 py-4 rounded-2xl shadow-2xl z-50 flex items-center gap-3 font-semibold ${justBooked.isOffline ? "bg-warn text-deep" : "bg-mint text-deep"}`}>
            {justBooked.isOffline ? <WifiOff size={20} /> : <CheckCircle size={20} />}
            {justBooked.isOffline ? `Slot ${justBooked.slotLabel} saved offline!` : `Booked ${justBooked.slotLabel}. Earned ${justBooked.earnedPoints} pts!`}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-panel/60 backdrop-blur-xl p-6 rounded-2xl border border-white/10 shadow-xl">
        <div>
          <h1 className="text-3xl font-bold text-textp">Parking Map</h1>
          <p className="text-muted text-sm mt-1">Select an available slot to book</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button onClick={() => setShowMap(!showMap)} className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${showMap ? "bg-azure/10 border-azure/30 text-azure" : "bg-panel border-white/10 text-textp"}`}>
            {showMap ? <MapPin size={18} /> : <MapIcon size={18} />}
            {showMap ? "View Slots" : "View Live Map"}
          </button>
          <button onClick={handleLocate} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-panel border border-white/10 text-textp hover:bg-white/5 transition-all">
            <Navigation size={18} className={isLocating ? "animate-spin" : ""} />
            {isLocating ? "Locating..." : "Find Nearby"}
          </button>
          <button onClick={() => setIsOnline(!isOnline)} className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${isOnline ? "bg-mint/10 border-mint/30 text-mint" : "bg-danger/10 border-danger/30 text-danger"}`}>
            {isOnline ? <Wifi size={18} /> : <WifiOff size={18} />}
            {isOnline ? "Online" : "Offline Mode"}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {offlineQueue.length > 0 && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="bg-warn/10 border border-warn/30 text-warn p-4 rounded-xl flex items-center gap-3">
            <Clock size={20} className="animate-pulse" />
            <div>
              <p className="font-semibold text-sm">Pending Sync</p>
              <p className="text-xs opacity-80">You have {offlineQueue.length} offline booking(s).</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {userLocation && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="bg-azure/10 border border-azure/30 text-azure p-4 rounded-xl flex items-center gap-3">
            <MapPin size={24} />
            <div>
              <p className="font-semibold text-sm">GPS Location Active</p>
              <p className="text-xs opacity-80">Lat: {userLocation.lat.toFixed(5)} | Lng: {userLocation.lng.toFixed(5)}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {showMap ? (
          <motion.div key="map" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="bg-panel/60 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden h-[500px] relative z-0">
            <MapContainer center={SOCIETY_LOCATION} zoom={16} style={{ height: "100%", width: "100%", zIndex: 0 }} scrollWheelZoom={true}>
              <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={SOCIETY_LOCATION}><Popup>veh_parking1 Society</Popup></Marker>
              <Marker position={USER_LOCATION}><Popup>Your Location</Popup></Marker>
              <Polyline positions={[USER_LOCATION, SOCIETY_LOCATION]} color="#00E5A0" weight={4} dashArray="10, 10" />
            </MapContainer>
            <div className="absolute bottom-6 left-6 right-6 md:right-auto md:w-80 bg-deep/90 backdrop-blur-md border border-white/10 p-5 rounded-2xl shadow-2xl z-[400]">
              <h3 className="font-bold text-textp flex items-center gap-2 mb-2"><Route size={18} className="text-mint"/> Route to Gate A</h3>
              <p className="text-sm text-muted mb-4">Distance: 250m • Est. time: 2 mins</p>
              <div className="space-y-2 text-sm text-textp">
                <p>1. Head <strong className="text-mint">South</strong> toward Main Rd.</p>
                <p>2. Turn <strong className="text-mint">Right</strong> at the Society entrance.</p>
                <p>3. Scan QR code at Gate A.</p>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
            <div className="flex flex-wrap gap-4 text-sm bg-panel/40 p-4 rounded-xl border border-white/5">
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-mint"></div> Available</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-danger"></div> Occupied</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-warn"></div> Reserved</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-azure"></div> EV</div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {slots.map((slot, i) => (
                <motion.div key={slot.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.008 }} whileHover={slot.status === "available" ? { scale: 1.05, y: -2 } : {}} onClick={() => slot.status === "available" && setSelectedSlot(slot)} className={`p-4 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all duration-300 ${getStatusColor(slot.status, slot.type)}`}>
                  {getIcon(slot.type)}
                  <span className="font-bold text-lg">{slot.label}</span>
                  <span className="text-xs opacity-80">Rs.{slot.pricePerHour}/hr</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedSlot && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-deep/80 backdrop-blur-sm" onClick={() => setSelectedSlot(null)}>
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} onClick={(e) => e.stopPropagation()} className="bg-panel border border-white/10 rounded-3xl p-6 w-full max-w-md shadow-2xl relative">
              <button onClick={() => setSelectedSlot(null)} className="absolute top-4 right-4 text-muted hover:text-textp">
                <X size={24} />
              </button>
              <h2 className="text-2xl font-bold mb-2">Book Slot {selectedSlot.label}</h2>
              <p className="text-muted mb-6">Total: Rs.{selectedSlot.pricePerHour * 2} (2 hrs)</p>
              
              {error && (
                <div className="mb-4 p-3 bg-danger/10 border border-danger/30 rounded-xl text-danger text-sm">
                  {error}
                </div>
              )}

              {!isOnline && (
                <div className="mb-4 p-3 bg-warn/10 border border-warn/30 rounded-xl text-warn text-sm flex items-start gap-2">
                  <WifiOff size={16} className="mt-0.5 shrink-0" />
                  <p>You are offline. This booking will be queued.</p>
                </div>
              )}
              
              <Button onClick={handleBook} className="w-full">
                Confirm Booking
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
