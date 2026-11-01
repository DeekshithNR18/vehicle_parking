import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wrench, AlertCircle, CheckCircle, Clock, Camera, Send, X, MessageSquare, ShieldCheck } from "lucide-react";
import Button from "../components/ui/Button";
import api from "../services/api";

export default function Maintenance() {
  const [issue, setIssue] = useState("");
  const [priority, setPriority] = useState("normal");
  const [photo, setPhoto] = useState(false);`n  const [photoBase64, setPhotoBase64] = useState(null);`n`n  const handlePhotoUpload = (e) => {`n    const file = e.target.files[0];`n    if (file) {`n      const reader = new FileReader();`n      reader.onloadend = () => {`n        setPhotoBase64(reader.result);`n        setPhoto(true);`n      };`n      reader.readAsDataURL(file);`n    }`n  };
  const [toast, setToast] = useState(null);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchComplaints = async () => {
    try {
      const res = await api.get("/complaints/mine");
      setComplaints(res.data);
    } catch (err) {
      console.error("Failed to fetch complaints", err);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!issue.trim()) return;

    setLoading(true);
    try {
      const res = await api.post("/complaints", {
        title: issue,
        priority: priority,
        hasPhoto: photo,`n        photo: photoBase64
      });

      setIssue("");
      setPriority("normal");
      setPhoto(false);
      
      setToast({ type: "success", text: `Ticket ${res.data.ticketId} created successfully!`, subtext: "Our team will look into this within 24 hours." });
      setTimeout(() => setToast(null), 5000);

      await fetchComplaints();
    } catch (err) {
      alert("Failed to submit complaint.");
    }
    setLoading(false);
  };

  const getStatusIcon = (status) => {
    if (status === "resolved") return <CheckCircle size={16} className="text-mint" />;
    if (status === "in-progress") return <Clock size={16} className="text-warn" />;
    return <AlertCircle size={16} className="text-danger" />;
  };

  const getStatusColor = (status) => {
    if (status === "resolved") return "bg-mint/10 text-mint border-mint/20";
    if (status === "in-progress") return "bg-warn/10 text-warn border-warn/20";
    return "bg-danger/10 text-danger border-danger/20";
  };

  const getPriorityColor = (p) => {
    if (p === "high") return "text-danger bg-danger/10 border-danger/20";
    if (p === "low") return "text-muted bg-white/5 border-white/10";
    return "text-warn bg-warn/10 border-warn/20";
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-4xl mx-auto relative">
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: -50, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -20 }} className="fixed top-6 right-6 bg-panel border border-mint/30 px-6 py-4 rounded-2xl shadow-2xl z-[100] flex items-start gap-4 w-80">
            <div className="p-2 bg-mint/20 rounded-full text-mint"><CheckCircle size={24} /></div>
            <div>
              <p className="font-bold text-textp">{toast.text}</p>
              <p className="text-xs text-muted mt-1">{toast.subtext}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div>
        <h1 className="text-3xl font-bold text-textp">Maintenance & Support</h1>
        <p className="text-muted text-sm mt-1">Report issues and track their resolution status.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-panel/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 h-fit">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Wrench size={20} className="text-mint" /> File a New Complaint</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-muted mb-1 block">Describe the issue</label>
              <textarea value={issue} onChange={(e) => setIssue(e.target.value)} placeholder="e.g. Broken gate in Zone A..." rows="3" className="w-full bg-deep/50 border border-white/10 rounded-xl px-4 py-3 text-textp focus:outline-none focus:border-mint/50 resize-none" />
            </div>
            <div>
              <label className="text-xs text-muted mb-2 block">Priority Level</label>
              <div className="flex gap-2">
                {["low", "normal", "high"].map(p => (
                  <button key={p} type="button" onClick={() => setPriority(p)} className={`flex-1 py-2 rounded-lg border text-sm capitalize transition-all ${priority === p ? getPriorityColor(p) + " font-semibold" : "border-white/10 text-muted hover:bg-white/5"}`}>
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => setPhoto(!photo)} className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${photo ? "bg-azure/20 border-azure/30 text-azure" : "bg-white/5 border-white/10 text-muted"}`}>
                <Camera size={18} /> {photo ? "Photo Attached" : "Attach Photo"}
              </button>
            </div>
            <Button type="submit" disabled={loading} className="w-full flex justify-center items-center gap-2">
              <Send size={18} /> {loading ? "Submitting..." : "Submit Complaint"}
            </Button>
          </form>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-bold mb-4 text-textp flex items-center gap-2"><MessageSquare size={20} className="text-azure"/> My Support Tickets</h3>
          <div className="max-h-[500px] overflow-y-auto pr-2 space-y-3">
            <AnimatePresence>
              {complaints.map(c => (
                <motion.div key={c.id} layoutId={`card-${c.id}`} onClick={() => setSelectedComplaint(c)} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="bg-panel/60 border border-white/10 rounded-2xl p-4 flex flex-col gap-3 cursor-pointer hover:bg-white/5 hover:border-mint/30 transition-all group">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-textp group-hover:text-mint transition-colors">{c.title}</p>
                    <div className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border flex items-center gap-1 ${getStatusColor(c.status)}`}>
                      {getStatusIcon(c.status)} {c.status.replace("-", " ")}
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted">
                    <span className="font-mono text-azure">{c.ticket_id || "Processing..."}</span>
                    <span className={`px-2 py-0.5 rounded capitalize border ${getPriorityColor(c.priority)}`}>{c.priority}</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedComplaint && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-deep/80 backdrop-blur-sm" onClick={() => setSelectedComplaint(null)}>
            <motion.div layoutId={`card-${selectedComplaint.id}`} onClick={(e) => e.stopPropagation()} className="bg-panel border border-white/10 rounded-3xl p-6 md:p-8 w-full max-w-lg shadow-2xl relative">
              <button onClick={() => setSelectedComplaint(null)} className="absolute top-4 right-4 text-muted hover:text-textp"><X size={24} /></button>
              <div className="flex items-center gap-3 mb-6">
                <div className={`p-3 rounded-xl ${selectedComplaint.status === "resolved" ? "bg-mint/10 text-mint" : "bg-azure/10 text-azure"}`}><MessageSquare size={24} /></div>
                <div>
                  <h2 className="text-xl font-bold text-textp">Ticket Details</h2>
                  <p className="text-xs text-muted font-mono">{selectedComplaint.ticket_id || "TKT-PENDING"}</p>
                </div>
              </div>
              <div className="bg-deep/50 rounded-2xl p-4 border border-white/5 mb-4">
                <p className="text-xs text-muted mb-2 uppercase tracking-widest font-bold">My Complaint</p>
                <p className="text-textp font-semibold mb-3">{selectedComplaint.title}</p>
                <div className="flex flex-wrap items-center gap-3 text-xs">
                  <span className={`px-2 py-1 rounded-md border ${getStatusColor(selectedComplaint.status)}`}>{selectedComplaint.status.toUpperCase()}</span>
                  <span className={`px-2 py-1 rounded-md border capitalize ${getPriorityColor(selectedComplaint.priority)}`}>{selectedComplaint.priority} priority</span>
                  <span className="text-muted">{new Date(selectedComplaint.created_at).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="bg-azure/5 rounded-2xl p-4 border border-azure/20">
                <div className="flex items-center gap-2 mb-2">
                  <ShieldCheck size={16} className="text-azure" />
                  <p className="text-xs text-azure uppercase tracking-widest font-bold">Society Admin</p>
                </div>
                {selectedComplaint.reply ? (
                  <p className="text-textp text-sm">{selectedComplaint.reply}</p>
                ) : (
                  <p className="text-muted text-sm italic">{selectedComplaint.status === "open" ? "Our maintenance team has received your ticket and is reviewing it." : "Awaiting further updates..."}</p>
                )}
              </div>
              <Button onClick={() => setSelectedComplaint(null)} className="w-full mt-6">Close Ticket</Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}



