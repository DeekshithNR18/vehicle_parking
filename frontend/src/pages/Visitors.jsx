import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { Users, Clock, Plus, X, Car } from "lucide-react";
import Button from "../components/ui/Button";

export default function Visitors() {
  const [visitorName, setVisitorName] = useState("");
  const [guestCount, setGuestCount] = useState(1);
  const [vehicleNo, setVehicleNo] = useState("");
  const [activePass, setActivePass] = useState(null);

  const handleGenerate = (e) => {
    e.preventDefault();
    if (!visitorName) return;
    setActivePass({
      id: `VP-${Math.floor(1000 + Math.random() * 9000)}`,
      name: visitorName,
      guests: guestCount,
      vehicle: vehicleNo || "N/A",
      expires: "Valid for 4 hours",
      validUntil: new Date(Date.now() + 4 * 3600000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    setVisitorName("");
    setVehicleNo("");
    setGuestCount(1);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-textp">Visitor Management</h1>
        <p className="text-muted text-sm mt-1">Generate one-time QR passes for your guests.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Form */}
        <div className="bg-panel/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 h-fit">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Users size={20} className="text-mint"/> Issue New Pass</h3>
          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label className="text-xs text-muted mb-1 block">Primary Visitor Name</label>
              <input 
                type="text" value={visitorName} onChange={(e) => setVisitorName(e.target.value)}
                placeholder="e.g. John Doe"
                className="w-full bg-deep/50 border border-white/10 rounded-xl px-4 py-3 text-textp focus:outline-none focus:border-mint/50"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted mb-1 block">No. of Guests</label>
                <select value={guestCount} onChange={(e) => setGuestCount(e.target.value)} className="w-full bg-deep/50 border border-white/10 rounded-xl px-4 py-3 text-textp focus:outline-none focus:border-mint/50">
                  {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} Person{n>1?"s":""}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-muted mb-1 block">Vehicle No.</label>
                <input type="text" value={vehicleNo} onChange={(e) => setVehicleNo(e.target.value.toUpperCase())} placeholder="KA-01-AB-1234" className="w-full bg-deep/50 border border-white/10 rounded-xl px-4 py-3 text-textp focus:outline-none focus:border-mint/50 uppercase" />
              </div>
            </div>

            <Button type="submit" className="w-full flex justify-center items-center gap-2">
              <Plus size={18} /> Generate Pass
            </Button>
          </form>
        </div>

        {/* Active Pass Display */}
        <AnimatePresence>
          {activePass ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              className="bg-white rounded-3xl overflow-hidden flex flex-col shadow-2xl relative"
            >
              <div className="bg-mint p-4 text-deep flex justify-between items-center">
                <div>
                  <p className="font-bold text-lg">Visitor Pass</p>
                  <p className="text-xs font-semibold opacity-80">{activePass.id}</p>
                </div>
                <button onClick={() => setActivePass(null)} className="text-deep/60 hover:text-deep"><X size={20}/></button>
              </div>
              
              <div className="p-6 flex flex-col items-center">
                <QRCodeSVG value={`https://vehicle-parking.vercel.app/verify?type=visitor&id=${activePass.id}&name=${activePass.name}`} size={160} bgColor="#ffffff" fgColor="#0B0F1A" level="H" />
                
                <div className="w-full mt-6 space-y-2">
                  <div className="flex justify-between text-sm border-b border-gray-100 pb-2">
                    <span className="text-gray-500">Host:</span>
                    <span className="font-bold text-deep">{activePass.name}</span>
                  </div>
                  <div className="flex justify-between text-sm border-b border-gray-100 pb-2">
                    <span className="text-gray-500">Guests:</span>
                    <span className="font-bold text-deep">{activePass.guests} Person(s)</span>
                  </div>
                  <div className="flex justify-between text-sm border-b border-gray-100 pb-2">
                    <span className="text-gray-500">Vehicle:</span>
                    <span className="font-bold text-deep">{activePass.vehicle}</span>
                  </div>
                  <div className="flex justify-between text-sm pt-1">
                    <span className="text-gray-500 flex items-center gap-1"><Clock size={12}/> Valid Until:</span>
                    <span className="font-bold text-deep">{activePass.validUntil}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="bg-panel/40 border border-white/5 rounded-3xl p-8 flex flex-col items-center justify-center text-center h-full">
              <Users size={48} className="text-muted mb-4 opacity-50" />
              <p className="text-muted font-semibold">No active passes</p>
              <p className="text-xs text-muted/60 mt-2">Fill the form to issue a new visitor pass.</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

