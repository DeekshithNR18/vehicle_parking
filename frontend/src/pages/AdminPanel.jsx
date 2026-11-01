import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Users, AlertCircle, CheckCircle, MapPin, MessageSquare, Send } from "lucide-react";
import { useParking } from "../context/ParkingContext";
import Button from "../components/ui/Button";
import api from "../services/api";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = ['#00E5A0', '#FF4D6D', '#FFB020', '#5B8CFF'];

export default function AdminPanel() {
  const { stats } = useParking();
  
  const [complaints, setComplaints] = useState([]);
  const [replyModal, setReplyModal] = useState(null);
  const [replyText, setReplyText] = useState("");

  const fetchAllComplaints = async () => {
    try {
      const res = await api.get("/complaints/all");
      setComplaints(res.data || []); 
    } catch (err) {
      console.error("Failed to fetch all complaints", err);
      setComplaints([]); 
    }
  };

  useEffect(() => {
    fetchAllComplaints();
  }, []);

  const handleReply = async () => {
    if (!replyText.trim()) return;
    try {
      await api.post(`/complaints/${replyModal.id}/reply`, { reply: replyText });
      setReplyModal(null);
      setReplyText("");
      await fetchAllComplaints();
    } catch (err) {
      alert("Failed to send reply");
    }
  };

  const resolveComplaint = async (id) => {
    try {
      await api.post(`/complaints/${id}/resolve`);
      await fetchAllComplaints();
    } catch (err) {
      alert("Failed to resolve");
    }
  };

  const pieData = [
    { name: 'Available', value: stats?.available || 0 },
    { name: 'Occupied', value: stats?.occupied || 0 },
    { name: 'Reserved', value: stats?.reserved || 0 },
    { name: 'EV Charging', value: stats?.ev || 0 },
  ];

  const safeComplaints = complaints || [];
  const openCount = safeComplaints.filter(c => c.status !== "resolved").length;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-6xl mx-auto">
      
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-azure/10 rounded-xl text-azure"><Shield size={28} /></div>
        <div>
          <h1 className="text-3xl font-bold text-textp">Admin Control Center</h1>
          <p className="text-muted text-sm mt-1">Manage society operations and emergencies.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-panel/60 border border-white/10 rounded-3xl p-6">
          <h2 className="text-lg font-bold mb-4">Live Occupancy Breakdown</h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#121828', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-panel/60 border border-white/10 rounded-2xl p-6">
            <Users size={24} className="text-mint mb-2" />
            <p className="text-muted text-sm">Total Residents</p>
            <p className="text-3xl font-bold text-textp">142</p>
          </div>
          <div className="bg-panel/60 border border-white/10 rounded-2xl p-6">
            <MapPin size={24} className="text-warn mb-2" />
            <p className="text-muted text-sm">Total Slots</p>
            <p className="text-3xl font-bold text-textp">{stats?.totalSlots || 0}</p>
          </div>
          <div className="bg-panel/60 border border-white/10 rounded-2xl p-6 col-span-2">
            <AlertCircle size={24} className="text-danger mb-2" />
            <p className="text-muted text-sm">Open Complaints</p>
            <p className="text-3xl font-bold text-textp">{openCount}</p>
          </div>
        </div>
      </div>

      <div className="bg-panel/60 border border-white/10 rounded-3xl p-6 mt-8">
        <h2 className="text-xl font-bold mb-4">Complaint Resolution Center</h2>
        <div className="space-y-3">
          {safeComplaints.length === 0 ? (
            <p className="text-muted text-sm">No complaints filed yet.</p>
          ) : (
            safeComplaints.map(c => (
              <div key={c.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-deep/50 border border-white/5 rounded-xl gap-4">
                <div>
                  <p className="font-semibold text-textp">{c.title}</p>
                  <p className="text-xs text-muted">From: {c.user_name} • {new Date(c.created_at).toLocaleDateString()} • {c.priority} priority • <span className="font-mono text-azure">{c.ticket_id}</span></p>`n                  {c.photo && (<div className="mt-2"><img src={c.photo} alt="Complaint" className="w-32 h-32 object-cover rounded-lg border border-white/10" /></div>)}
                </div>
                <div className="flex items-center gap-2">
                  {c.status !== "resolved" && (
                    <Button variant="secondary" onClick={() => { setReplyModal(c); setReplyText(c.reply || ""); }} className="p-2 text-azure hover:bg-azure/10 border-azure/30" title="Reply">
                      <MessageSquare size={16} />
                    </Button>
                  )}
                  {c.status !== "resolved" && (
                    <button onClick={() => resolveComplaint(c.id)} className="p-2 bg-mint/10 text-mint rounded-lg hover:bg-mint/20" title="Mark Resolved">
                      <CheckCircle size={16} />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <AnimatePresence>
        {replyModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-deep/80 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-panel border border-azure/30 rounded-3xl p-6 w-full max-w-md shadow-2xl">
              <h2 className="text-xl font-bold mb-2">Reply to Ticket</h2>
              <p className="text-sm text-muted mb-4">"{replyModal.title}"</p>
              <textarea value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder="Type your response to the resident..." rows="4" className="w-full bg-deep/50 border border-white/10 rounded-xl px-4 py-3 text-textp focus:outline-none focus:border-azure/50 resize-none mb-4" />
              <div className="flex gap-3">
                <Button variant="secondary" onClick={() => setReplyModal(null)} className="flex-1">Cancel</Button>
                <Button onClick={handleReply} className="flex-1 bg-azure text-white hover:bg-azure/90 flex justify-center items-center gap-2">
                  <Send size={16} /> Send Reply
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

