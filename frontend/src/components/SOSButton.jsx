import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, PhoneCall, ShieldAlert, CheckCircle, X, Radio } from "lucide-react";
import { useParking } from "../context/ParkingContext";
import { useAuth } from "../context/AuthContext";
import Button from "./ui/Button";

export default function SOSButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [alertStatus, setAlertStatus] = useState("idle");
  const { triggerSOS } = useParking();
  const { user } = useAuth();

  const handleSOS = () => {
    setAlertStatus("sending");
    
    setTimeout(() => {
      setAlertStatus("sent");
      triggerSOS(user?.name); // Triggers the global alert
      
      setTimeout(() => {
        setAlertStatus("idle");
        setIsOpen(false);
      }, 5000);
    }, 2000);
  };

  return (
    <>
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 w-14 h-14 bg-danger text-white rounded-full shadow-[0_0_20px_rgba(255,77,109,0.6)] flex items-center justify-center z-50 hover:bg-danger/90 transition-colors animate-pulse"
      >
        <ShieldAlert size={26} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-deep/90 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="bg-panel border border-danger/30 rounded-3xl p-6 w-full max-w-md shadow-[0_0_50px_rgba(255,77,109,0.2)] relative"
            >
              <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 text-muted hover:text-textp" disabled={alertStatus === "sending"}>
                <X size={24} />
              </button>

              {alertStatus === "idle" && (
                <>
                  <div className="flex flex-col items-center text-center mb-6">
                    <div className="w-16 h-16 bg-danger/10 rounded-full flex items-center justify-center text-danger mb-4">
                      <AlertTriangle size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-textp">Emergency Assistance</h2>
                    <p className="text-muted text-sm mt-1">If you are in danger, use the options below.</p>
                  </div>

                  <div className="space-y-3">
                    <a href="tel:+919876543210" className="w-full flex items-center justify-between p-4 bg-mint/10 border border-mint/30 rounded-xl hover:bg-mint/20 transition-all text-mint font-bold">
                      <div className="flex items-center gap-3"><PhoneCall size={20} /> Call Security Guard</div>
                      <span className="text-xs bg-mint/20 px-2 py-1 rounded">Gate 1</span>
                    </a>

                    <a href="tel:+919123456789" className="w-full flex items-center justify-between p-4 bg-azure/10 border border-azure/30 rounded-xl hover:bg-azure/20 transition-all text-azure font-bold">
                      <div className="flex items-center gap-3"><PhoneCall size={20} /> Call Society President</div>
                      <span className="text-xs bg-azure/20 px-2 py-1 rounded">Admin</span>
                    </a>

                    <div className="pt-4 border-t border-white/10">
                      <Button variant="danger" onClick={handleSOS} className="w-full flex justify-center items-center gap-2">
                        <Radio size={20} /> Trigger SOS Alarm
                      </Button>
                      <p className="text-center text-xs text-muted mt-3">Alerts all on-duty guards and admin instantly.</p>
                    </div>
                  </div>
                </>
              )}

              {alertStatus === "sending" && (
                <div className="flex flex-col items-center text-center py-10">
                  <motion.div animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }} transition={{ duration: 1, repeat: Infinity }} className="w-20 h-20 bg-danger/20 rounded-full flex items-center justify-center text-danger mb-6">
                    <Radio size={40} />
                  </motion.div>
                  <h2 className="text-2xl font-bold text-danger mb-2">Broadcasting SOS...</h2>
                  <p className="text-muted">Connecting to Security & Admin.</p>
                </div>
              )}

              {alertStatus === "sent" && (
                <div className="flex flex-col items-center text-center py-10">
                  <div className="w-20 h-20 bg-mint/20 rounded-full flex items-center justify-center text-mint mb-6">
                    <CheckCircle size={40} />
                  </div>
                  <h2 className="text-2xl font-bold text-mint mb-2">Help is on the way!</h2>
                  <p className="text-textp">Security has been alerted.</p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
