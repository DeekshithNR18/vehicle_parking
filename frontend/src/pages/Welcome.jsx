import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Car, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Welcome() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsAnimating(false), 3500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-deep flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none z-0">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute top-1/4 left-1/4 w-[50vw] h-[50vw] bg-mint/20 rounded-full blur-[150px]"
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 5, repeat: Infinity, delay: 1 }}
          className="absolute bottom-1/4 right-1/4 w-[50vw] h-[50vw] bg-azure/20 rounded-full blur-[150px]"
        />
      </div>

      <div className="relative z-10 flex flex-col items-center">
        <div className="relative w-40 h-40 flex items-center justify-center mb-8">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full border-t-2 border-r-2 border-mint border-opacity-50 shadow-[0_0_30px_rgba(0,229,160,0.3)]"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="absolute inset-4 rounded-full border-b-2 border-l-2 border-azure border-opacity-50"
          />
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-20 h-20 bg-panel border border-white/10 rounded-2xl flex items-center justify-center shadow-2xl"
          >
            <Car size={40} className="text-mint" />
          </motion.div>
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-extrabold text-textp mb-2"
        >
          veh_parking1
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-muted text-sm tracking-widest uppercase"
        >
          Smart Society Parking
        </motion.p>

        {!isAnimating && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12"
          >
            <button
              onClick={() => navigate("/dashboard")}
              className="group flex items-center gap-3 px-8 py-4 bg-mint text-deep rounded-full font-bold text-lg hover:bg-mint/90 transition-all hover:scale-105 shadow-[0_0_30px_rgba(0,229,160,0.4)]"
            >
              Welcome, {user?.name || "User"}
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
