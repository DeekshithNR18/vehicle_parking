import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { User, Car, Save, CheckCircle } from "lucide-react";
import Button from "../components/ui/Button";

export default function Settings() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [plate, setPlate] = useState(localStorage.getItem("vp_plate") || "");
  const [vehicle, setVehicle] = useState(localStorage.getItem("vp_vehicle") || "car");
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem("vp_plate", plate);
    localStorage.setItem("vp_vehicle", vehicle);
    // Note: In a real app, you would update the name via AuthContext here
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-textp">Settings</h1>
        <p className="text-muted text-sm mt-1">Manage your profile and vehicle details.</p>
      </div>

      <div className="bg-panel/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-xl">
        <form onSubmit={handleSave} className="space-y-6">
          
          <div>
            <label className="text-xs text-muted font-bold tracking-wider uppercase mb-2 flex items-center gap-2"><User size={14}/> Display Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-deep/50 border border-white/10 rounded-xl px-4 py-3 text-textp focus:outline-none focus:border-mint/50" />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-muted font-bold tracking-wider uppercase mb-2 flex items-center gap-2"><Car size={14}/> Vehicle Plate</label>
              <input type="text" value={plate} onChange={(e) => setPlate(e.target.value.toUpperCase())} placeholder="e.g. KA-01-AB-1234" className="w-full bg-deep/50 border border-white/10 rounded-xl px-4 py-3 text-textp focus:outline-none focus:border-mint/50 uppercase" />
            </div>
            <div>
              <label className="text-xs text-muted font-bold tracking-wider uppercase mb-2 block">Vehicle Type</label>
              <select value={vehicle} onChange={(e) => setVehicle(e.target.value)} className="w-full bg-deep/50 border border-white/10 rounded-xl px-4 py-3 text-textp focus:outline-none focus:border-mint/50">
                <option value="car">Car (4 Wheeler)</option>
                <option value="bike">Bike (2 Wheeler)</option>
                <option value="ev">Electric Vehicle</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10">
            <Button type="submit" className="w-full flex items-center justify-center gap-2">
              {saved ? <><CheckCircle size={18}/> Saved Successfully!</> : <><Save size={18}/> Save Changes</>}
            </Button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
