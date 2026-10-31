import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, X } from "lucide-react";

export default function InstallBanner() {
  const [show, setShow] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Show banner after 3 seconds of being on the site
      setTimeout(() => setShow(true), 3000);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          setShow(false);
        }
      });
    }
  };

  if (!show) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-[100] w-11/12 max-w-md bg-panel border border-mint/30 rounded-2xl shadow-[0_0_30px_rgba(0,229,160,0.2)] p-4 flex items-center gap-4"
      >
        <div className="w-12 h-12 bg-mint/20 rounded-xl flex items-center justify-center text-mint shrink-0">
          <Download size={24} />
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-textp text-sm">Install App</h4>
          <p className="text-xs text-muted">Get quick access to your parking.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleInstall} className="px-4 py-2 bg-mint text-deep rounded-lg text-xs font-bold hover:bg-mint/90">Install</button>
          <button onClick={() => setShow(false)} className="p-2 text-muted hover:text-textp"><X size={18}/></button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
