import { motion, AnimatePresence } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { Calendar, Clock, MapPin, XCircle, CheckCircle, Download } from "lucide-react";
import { useParking } from "../context/ParkingContext";
import Button from "../components/ui/Button";
import jsPDF from "jspdf";

export default function MyBookings() {
  const { bookings, cancelBooking } = useParking();

  const handleCancel = (id) => {
    if (window.confirm("Cancel this booking? Refund will be added to your wallet.")) {
      cancelBooking(id);
    }
  };

  const downloadReceipt = (booking) => {
    const doc = new jsPDF();
    
    doc.setFontSize(22);
    doc.setTextColor(11, 15, 26);
    doc.text("Smart Society Parking", 20, 20);
    
    doc.setFontSize(10);
    doc.setTextColor(120, 120, 120);
    doc.text("Official Parking Receipt", 20, 27);
    
    doc.setDrawColor(0, 229, 160);
    doc.setLineWidth(1);
    doc.line(20, 32, 190, 32);
    
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Booking ID: ${booking.id}`, 20, 45);
    doc.text(`Slot: ${booking.slotLabel}`, 20, 55);
    doc.text(`Start Time: ${booking.startTime}`, 20, 65);
    doc.text(`End Time: ${booking.endTime}`, 20, 75);
    doc.text(`Amount Paid: Rs. ${booking.amount}`, 20, 85);
    
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text("Thank you for parking with us!", 20, 110);
    doc.text("Scan the QR code at the gate for entry/exit.", 20, 117);
    
    doc.save(`Receipt_${booking.id}.pdf`);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-textp">My Bookings</h1>
        <p className="text-muted text-sm mt-1">Manage your active and past parking sessions.</p>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-mint flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-mint animate-pulse"></span>
          Active Bookings
        </h2>

        {bookings.length > 0 ? (
          <AnimatePresence>
            {bookings.map((booking) => (
              <motion.div key={booking.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-panel/60 backdrop-blur-xl border border-mint/20 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-8 shadow-[0_0_30px_rgba(0,229,160,0.1)]">
                <div className="flex-1 space-y-6 w-full">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted mb-1">Booking ID</p>
                      <p className="text-lg font-bold text-textp">{booking.id}</p>
                    </div>
                    <div className="bg-mint/10 text-mint px-3 py-1 rounded-full text-sm font-semibold border border-mint/20">Active</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-deep/50 p-3 rounded-xl border border-white/5">
                      <p className="text-xs text-muted mb-1 flex items-center gap-1"><MapPin size={12}/> Slot</p>
                      <p className="font-bold text-lg">{booking.slotLabel}</p>
                    </div>
                    <div className="bg-deep/50 p-3 rounded-xl border border-white/5">
                      <p className="text-xs text-muted mb-1 flex items-center gap-1"><Calendar size={12}/> Amount</p>
                      <p className="font-bold text-lg text-azure">Rs. {booking.amount}</p>
                    </div>
                    <div className="bg-deep/50 p-3 rounded-xl border border-white/5">
                      <p className="text-xs text-muted mb-1 flex items-center gap-1"><Clock size={12}/> Start</p>
                      <p className="font-bold">{booking.startTime}</p>
                    </div>
                    <div className="bg-deep/50 p-3 rounded-xl border border-white/5">
                      <p className="text-xs text-muted mb-1 flex items-center gap-1"><Clock size={12}/> End</p>
                      <p className="font-bold">{booking.endTime}</p>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-white/5 flex flex-wrap gap-3">
                    <Button variant="danger" onClick={() => handleCancel(booking.id)} className="flex-1 md:flex-none flex items-center justify-center gap-2">
                      <XCircle size={18} /> Cancel
                    </Button>
                    <Button variant="secondary" onClick={() => downloadReceipt(booking)} className="flex-1 md:flex-none flex items-center justify-center gap-2 border-mint/30 text-mint hover:bg-mint/10">
                      <Download size={18} /> Receipt
                    </Button>
                  </div>
                </div>
                <div className="w-full md:w-64 bg-white p-4 rounded-2xl flex flex-col items-center justify-center shadow-lg">
                  <QRCodeSVG value={`BOOKING:${booking.id}|SLOT:${booking.slotLabel}`} size={180} bgColor="#ffffff" fgColor="#0B0F1A" level="H" />
                  <p className="text-deep text-xs font-bold mt-4 text-center">Scan at Gate</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        ) : (
          <div className="bg-panel/40 border border-white/5 rounded-3xl p-12 text-center flex flex-col items-center">
            <CheckCircle size={48} className="text-muted mb-4" />
            <h3 className="text-xl font-bold text-textp">No active bookings</h3>
            <p className="text-muted text-sm mt-2">Book a slot from the Parking Map to get started.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
