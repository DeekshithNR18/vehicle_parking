import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { Calendar, Clock, MapPin, XCircle, CheckCircle, Download, Plus, AlertTriangle } from "lucide-react";
import { useParking } from "../context/ParkingContext";
import Button from "../components/ui/Button";

function CountdownTimer({ endTime, date }) {
  const [remaining, setRemaining] = useState(0);
  
  useEffect(() => {
    const calculate = () => {
      try {
        const end = new Date(`${date} ${endTime}`).getTime();
        if (isNaN(end)) return 0;
        return Math.max(0, end - Date.now());
      } catch { return 0; }
    };
    setRemaining(calculate());
    const id = setInterval(() => setRemaining(calculate()), 1000);
    return () => clearInterval(id);
  }, [endTime, date]);

  if (remaining <= 0) return (
    <div className="flex items-center gap-2 text-danger font-bold text-sm"><AlertTriangle size={16} /> Time Expired!</div>
  );

  const hours = Math.floor(remaining / 3600000);
  const mins = Math.floor((remaining % 3600000) / 60000);
  const secs = Math.floor((remaining % 60000) / 1000);
  const color = remaining < 600000 ? "text-danger" : remaining < 1800000 ? "text-warn" : "text-mint";

  return (
    <div className={`flex items-center gap-2 font-bold text-lg ${color}`}>
      <Clock size={18} /> {hours}h {mins}m {secs}s remaining
    </div>
  );
}

export default function MyBookings() {
  const { bookings, cancelBooking, extendBooking } = useParking();

  const handleCancel = (id) => {
    if (window.confirm("Cancel this booking? Refund will be added to your wallet.")) cancelBooking(id);
  };

  const handleExtend = async (id) => {
    if (!window.confirm("Extend this booking by 1 hour? Rs. 25 will be charged.")) return;
    const result = await extendBooking(id);
    if (result.ok) alert(`Extended! New end time: ${result.newEndTime}`);
    else alert(result.message);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-textp">My Bookings</h1>
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-mint flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-mint animate-pulse"></span> Active Bookings
        </h2>
        {bookings.length > 0 ? (
          <AnimatePresence>
            {bookings.map((booking) => (
              <motion.div key={booking.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-panel/60 border border-mint/20 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-8">
                <div className="flex-1 space-y-6 w-full">
                  <div className="flex items-start justify-between">
                    <div><p className="text-sm text-muted mb-1">Booking ID</p><p className="text-lg font-bold text-textp">{booking.id}</p></div>
                    <div className="bg-mint/10 text-mint px-3 py-1 rounded-full text-sm font-semibold border border-mint/20">Active</div>
                  </div>
                  <CountdownTimer endTime={booking.end_time || booking.endTime} date={booking.date} />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-deep/50 p-3 rounded-xl border border-white/5"><p className="text-xs text-muted mb-1">Slot</p><p className="font-bold text-lg">{booking.slot_label || booking.slotLabel}</p></div>
                    <div className="bg-deep/50 p-3 rounded-xl border border-white/5"><p className="text-xs text-muted mb-1">Amount</p><p className="font-bold text-lg text-azure">Rs. {booking.amount}</p></div>
                    <div className="bg-deep/50 p-3 rounded-xl border border-white/5"><p className="text-xs text-muted mb-1">Start</p><p className="font-bold">{booking.start_time || booking.startTime}</p></div>
                    <div className="bg-deep/50 p-3 rounded-xl border border-white/5"><p className="text-xs text-muted mb-1">End</p><p className="font-bold">{booking.end_time || booking.endTime || "—"}</p></div>
                  </div>
                  <div className="pt-4 border-t border-white/5 flex flex-wrap gap-3">
                    <Button variant="secondary" onClick={() => handleExtend(booking.id)} className="border-mint/30 text-mint hover:bg-mint/10"><Plus size={18} /> Extend (+Rs.25)</Button>
                    <Button variant="danger" onClick={() => handleCancel(booking.id)}><XCircle size={18} /> Cancel</Button>
                  </div>
                </div>
                <div className="w-full md:w-64 bg-white p-4 rounded-2xl flex flex-col items-center shadow-lg">
                  <QRCodeSVG value={`https://vehicle-parking.vercel.app/verify?type=booking&id=${booking.id}&slot=${booking.slot_label || booking.slotLabel}`} size={180} bgColor="#ffffff" fgColor="#0B0F1A" level="H" />
                  <p className="text-deep text-xs font-bold mt-4">Scan at Gate</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        ) : (
          <div className="bg-panel/40 border border-white/5 rounded-3xl p-12 text-center flex flex-col items-center">
            <CheckCircle size={48} className="text-muted mb-4" /><h3 className="text-xl font-bold text-textp">No active bookings</h3>
          </div>
        )}
      </div>
    </motion.div>
  );
}