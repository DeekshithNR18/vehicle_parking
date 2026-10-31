import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useParking } from "../context/ParkingContext";
import { Mail, Car, Wallet, LogOut } from "lucide-react";
import Button from "../components/ui/Button";

export default function Profile() {
  const { user, logout } = useAuth();
  const { wallet, stats } = useParking();

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-textp">My Profile</h1>

      <div className="bg-panel/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-xl text-center">
        <div className="w-24 h-24 bg-azure/20 rounded-full mx-auto mb-4 flex items-center justify-center text-azure text-4xl font-bold uppercase border-4 border-azure/30">
          {user?.name?.charAt(0) || "U"}
        </div>
        <h2 className="text-2xl font-bold text-textp capitalize">{user?.name}</h2>
        <p className="text-muted text-sm">{user?.role}</p>
      </div>

      <div className="grid gap-3">
        <div className="bg-panel/60 border border-white/10 rounded-2xl p-4 flex items-center gap-4">
          <div className="w-10 h-10 bg-mint/10 rounded-xl flex items-center justify-center text-mint">
            <Mail size={18} />
          </div>
          <div>
            <p className="text-xs text-muted">Email</p>
            <p className="font-semibold text-textp">{user?.email}</p>
          </div>
        </div>

        <div className="bg-panel/60 border border-white/10 rounded-2xl p-4 flex items-center gap-4">
          <div className="w-10 h-10 bg-azure/10 rounded-xl flex items-center justify-center text-azure">
            <Wallet size={18} />
          </div>
          <div>
            <p className="text-xs text-muted">Wallet Balance</p>
            <p className="font-semibold text-textp">Rs. {wallet}</p>
          </div>
        </div>

        <div className="bg-panel/60 border border-white/10 rounded-2xl p-4 flex items-center gap-4">
          <div className="w-10 h-10 bg-warn/10 rounded-xl flex items-center justify-center text-warn">
            <Car size={18} />
          </div>
          <div>
            <p className="text-xs text-muted">Active Bookings</p>
            <p className="font-semibold text-textp">{stats.activeBookings}</p>
          </div>
        </div>
      </div>

      <Button variant="danger" onClick={logout} className="w-full flex items-center justify-center gap-2">
        <LogOut size={18} /> Logout
      </Button>
    </motion.div>
  );
}
