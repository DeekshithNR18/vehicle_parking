import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, X } from "lucide-react";
import { useParking } from "../context/ParkingContext";

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const { activity } = useParking();
  const unread = Math.min(activity.length, 9);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl bg-panel/60 border border-white/10 hover:bg-panel transition-colors"
      >
        <Bell size={18} className="text-textp" />
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 bg-danger text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
            {unread}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              className="absolute right-0 top-12 w-80 bg-deep border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden"
            >
              <div className="bg-panel px-4 py-3 border-b border-white/10 flex items-center justify-between">
                <h3 className="font-bold text-sm">Notifications</h3>
                <button onClick={() => setIsOpen(false)} className="text-muted hover:text-textp">
                  <X size={16} />
                </button>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {activity.length === 0 ? (
                  <p className="p-6 text-center text-sm text-muted">No notifications yet</p>
                ) : (
                  activity.map((item) => (
                    <div key={item.id} className="p-3 border-b border-white/5 last:border-0 hover:bg-white/5">
                      <p className="text-sm text-textp">{item.text}</p>
                      <p className="text-xs text-muted mt-0.5">{item.time}</p>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
