import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScanLine, CheckCircle, XCircle, Shield, Clock, ShieldAlert, BellRing } from "lucide-react";
import { useParking } from "../context/ParkingContext";
import Button from "../components/ui/Button";

export default function GuardMode() {
  const { bookings, sosAlerts, resolveSOS } = useParking();
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);

  const handleScan = () => {
    setScanning(true);
    setScanResult(null);
    setTimeout(() => {
      setScanning(false);
      if (bookings.length > 0) {
        setScanResult({ success: true, booking: bookings[0] });
      } else {
        setScanResult({ success: false });
      }
    }, 2000);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-2xl mx-auto">
      
      {/* Guard SOS Alert */}
      <AnimatePresence>
        {sosAlerts.length > 0 && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="bg-danger/10 border-2 border-danger/50 rounded-3xl p-6 shadow-[0_0_30px_rgba(255,77,109,0.3)]">
            <h2 className="text-danger font-bold text-xl flex items-center gap-2 mb-4 animate-bounce">
              <ShieldAlert size={24} /> EMERGENCY ALERT!
            </h2>
            {sosAlerts.map(alert => (
              <div key={alert.id} className="bg-deep/80 border border-danger/30 rounded-xl p-4 flex justify-between items-center">
                <div>
                  <p className="font-bold text-danger flex items-center gap-2"><BellRing size={16}/> SOS from {alert.user}</p>
                  <p className="text-sm text-textp mt-1">Location: {alert.location}</p>
                </div>
                <Button onClick={() => resolveSOS(alert.id)} className="bg-mint text-deep hover:bg-mint/90">
                  Attend
                </Button>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-azure/10 rounded-xl text-azure">
          <Shield size={28} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-textp">Guard Checkpoint</h1>
          <p className="text-muted text-sm mt-1">Scan resident QR codes to verify entry/exit.</p>
        </div>
      </div>

      <div className="bg-panel/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 flex flex-col items-center justify-center text-center relative overflow-hidden">
        <div className={`relative w-64 h-64 rounded-3xl border-2 flex items-center justify-center mb-8 transition-colors ${scanning ? "border-mint shadow-[0_0_40px_rgba(0,229,160,0.3)]" : "border-white/10"}`}>
          {scanning && (
            <motion.div initial={{ top: 0 }} animate={{ top: "100%" }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }} className="absolute left-0 right-0 h-1 bg-mint shadow-[0_0_20px_#00E5A0] z-10" />
          )}
          <ScanLine size={80} className={scanning ? "text-mint animate-pulse" : "text-muted/30"} />
          <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-mint rounded-tl-3xl" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-mint rounded-tr-3xl" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-mint rounded-bl-3xl" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-mint rounded-br-3xl" />
        </div>

        <Button onClick={handleScan} disabled={scanning} className="w-full max-w-xs">
          {scanning ? "Verifying..." : "Simulate QR Scan"}
        </Button>
      </div>

      <AnimatePresence>
        {scanResult && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className={`p-6 rounded-2xl border flex items-start gap-4 ${scanResult.success ? "bg-mint/10 border-mint/30" : "bg-danger/10 border-danger/30"}`}>
            {scanResult.success ? (
              <>
                <CheckCircle size={32} className="text-mint shrink-0" />
                <div>
                  <h3 className="font-bold text-mint text-lg">Access Granted</h3>
                  <p className="text-sm text-textp mt-1">Booking ID: {scanResult.booking.id}</p>
                  <p className="text-sm text-textp">Slot: {scanResult.booking.slotLabel}</p>
                  <div className="flex items-center gap-1 text-xs text-muted mt-2"><Clock size={12} /> Valid for entry</div>
                </div>
              </>
            ) : (
              <>
                <XCircle size={32} className="text-danger shrink-0" />
                <div>
                  <h3 className="font-bold text-danger text-lg">Access Denied</h3>
                  <p className="text-sm text-textp mt-1">No active bookings found for this QR code.</p>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
