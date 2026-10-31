import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Button from "../components/ui/Button";
import { Car, Shield, User, Wrench } from "lucide-react";
import { motion } from "framer-motion";

function AnimatedBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 bg-deep">
      <motion.div
        animate={{ x: [0, 100, -50, 0], y: [0, -80, 60, 0], scale: [1, 1.2, 0.9, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] bg-mint/10 rounded-full blur-[120px]"
      />
      <motion.div
        animate={{ x: [0, -120, 80, 0], y: [0, 100, -70, 0], scale: [1, 0.8, 1.3, 1] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-1/4 right-1/4 w-[35vw] h-[35vw] bg-azure/10 rounded-full blur-[120px]"
      />
    </div>
  );
}

export default function Login() {
  const { login, register } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [role, setRole] = useState("resident");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("admin@veh.in");
  const [password, setPassword] = useState("admin1234");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const roles = [
    { id: "resident", label: "Resident", icon: User, color: "text-mint", bg: "bg-mint/10 border-mint/30" },
    { id: "guard", label: "Security", icon: Shield, color: "text-azure", bg: "bg-azure/10 border-azure/30" },
    { id: "admin", label: "Admin", icon: Wrench, color: "text-warn", bg: "bg-warn/10 border-warn/30" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = isRegister
      ? await register(name, email, password, role)
      : await login(email, password);
    setLoading(false);
    if (!result.ok) setError(result.message);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <AnimatedBackground />
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md bg-panel/60 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl relative z-10"
      >
        <div className="flex flex-col items-center mb-8">
          <motion.div
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="p-3 bg-mint/10 rounded-2xl mb-4 shadow-[0_0_30px_rgba(0,229,160,0.2)]"
          >
            <Car size={40} className="text-mint" />
          </motion.div>
          <h1 className="text-2xl font-extrabold text-textp">veh_parking1</h1>
          <p className="text-muted text-sm mt-1">Smart Society Parking</p>
        </div>

        <div className="flex gap-2 mb-6 bg-deep/50 p-1 rounded-xl">
          <button onClick={() => { setIsRegister(false); setError(""); }} className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${!isRegister ? "bg-mint text-deep" : "text-muted"}`}>Login</button>
          <button onClick={() => { setIsRegister(true); setError(""); }} className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${isRegister ? "bg-mint text-deep" : "text-muted"}`}>Register</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="text-xs text-muted font-bold tracking-wider uppercase mb-2 block">Full Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" required className="w-full bg-deep/50 border border-white/10 rounded-xl px-4 py-3 text-textp focus:outline-none focus:border-mint/50" />
            </div>
          )}

          <div>
            <label className="text-xs text-muted font-bold tracking-wider uppercase mb-2 block">Select Role</label>
            <div className="grid grid-cols-3 gap-2">
              {roles.map((r) => (
                <button key={r.id} type="button" onClick={() => setRole(r.id)} className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${role === r.id ? `${r.bg} border-current ${r.color}` : "border-white/5 text-muted hover:bg-white/5"}`}>
                  <r.icon size={20} className="mb-1" />
                  <span className="text-xs font-semibold">{r.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs text-muted font-bold tracking-wider uppercase mb-2 block">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full bg-deep/50 border border-white/10 rounded-xl px-4 py-3 text-textp focus:outline-none focus:border-mint/50" />
          </div>

          <div>
            <label className="text-xs text-muted font-bold tracking-wider uppercase mb-2 block">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full bg-deep/50 border border-white/10 rounded-xl px-4 py-3 text-textp focus:outline-none focus:border-mint/50" />
          </div>

          {error && (
            <div className="p-3 bg-danger/10 border border-danger/30 rounded-xl text-danger text-sm">{error}</div>
          )}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Please wait..." : isRegister ? "Create Account" : "Login"}
          </Button>
        </form>

        <p className="text-center text-xs text-muted/60 mt-6">Demo admin: admin@veh.in / admin1234</p>
      </motion.div>
    </div>
  );
}
