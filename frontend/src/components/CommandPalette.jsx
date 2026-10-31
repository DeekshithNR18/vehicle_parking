import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, LayoutDashboard, Map, Calendar, Wallet, Users, Wrench } from "lucide-react";

const COMMANDS = [
  { name: "Go to Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Go to Parking Map", path: "/map", icon: Map },
  { name: "Go to My Bookings", path: "/bookings", icon: Calendar },
  { name: "Go to Wallet", path: "/wallet", icon: Wallet },
  { name: "Go to Visitors", path: "/visitors", icon: Users },
  { name: "Go to Maintenance", path: "/maintenance", icon: Wrench },
];

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const filtered = COMMANDS.filter((c) =>
    c.name.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (cmd) => {
    navigate(cmd.path);
    setIsOpen(false);
    setQuery("");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-deep/80 backdrop-blur-sm flex items-start justify-center pt-32 px-4"
          onClick={() => setIsOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.95, y: -20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: -20 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-panel border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10">
              <Search size={18} className="text-muted" />
              <input
                autoFocus type="text" value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search pages..."
                className="flex-1 bg-transparent text-textp placeholder-muted focus:outline-none"
              />
              <span className="text-xs text-muted bg-white/5 px-2 py-1 rounded">ESC</span>
            </div>
            <div className="max-h-80 overflow-y-auto p-2">
              {filtered.length === 0 ? (
                <p className="text-center text-muted text-sm py-6">No results</p>
              ) : (
                filtered.map((cmd) => (
                  <button
                    key={cmd.path}
                    onClick={() => handleSelect(cmd)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-textp hover:bg-mint/10 hover:text-mint transition-colors"
                  >
                    <cmd.icon size={16} />
                    <span className="text-sm">{cmd.name}</span>
                  </button>
                ))
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
