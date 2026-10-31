import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Keyboard } from "lucide-react";

export default function ShortcutsHelp() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "?" && !e.target.matches("input, textarea")) {
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const shortcuts = [
    { keys: ["Ctrl", "K"], desc: "Open Command Palette" },
    { keys: ["?"], desc: "Show this help menu" },
    { keys: ["Esc"], desc: "Close any modal / palette" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-deep/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setIsOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-panel border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Keyboard size={20} className="text-mint" />
                <h3 className="font-bold">Keyboard Shortcuts</h3>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-muted hover:text-textp">
                <X size={20} />
              </button>
            </div>
            <div className="p-4 space-y-3">
              {shortcuts.map((s, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-sm text-muted">{s.desc}</span>
                  <div className="flex gap-1">
                    {s.keys.map((k) => (
                      <kbd key={k} className="px-2 py-1 text-xs bg-deep border border-white/10 rounded text-textp font-mono">
                        {k}
                      </kbd>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-deep/50 p-3 text-center text-xs text-muted border-t border-white/10">
              Press <kbd className="bg-white/10 px-1 rounded">?</kbd> anytime to open this menu.
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
