import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useParking } from "../context/ParkingContext";
import { Car, Wallet, CheckCircle, MapPin, Activity, Clock, CloudSun, Wind, Droplets } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const chartData = [
  { name: 'Mon', revenue: 400, occupancy: 24 },
  { name: 'Tue', revenue: 300, occupancy: 18 },
  { name: 'Wed', revenue: 550, occupancy: 32 },
  { name: 'Thu', revenue: 450, occupancy: 28 },
  { name: 'Fri', revenue: 700, occupancy: 40 },
  { name: 'Sat', revenue: 850, occupancy: 45 },
  { name: 'Sun', revenue: 600, occupancy: 30 },
];

function AnimatedNumber({ value }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const duration = 800;
    const start = performance.now();
    const from = display;
    const diff = value - from;
    const step = (t) => {
      const p = Math.min((t - start) / duration, 1);
      setDisplay(Math.round(from + diff * p));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [value]);
  return <span>{display}</span>;
}

export default function Dashboard() {
  const { user } = useAuth();
  const { stats, activity } = useParking();
  const [clock, setClock] = useState(new Date());
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    const id = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  // Fetch Weather from Open-Meteo (Bangalore coords)
  useEffect(() => {
    fetch("https://api.open-meteo.com/v1/forecast?latitude=12.9716&longitude=77.5946&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code")
      .then(res => res.json())
      .then(data => setWeather(data.current))
      .catch(err => console.log("Weather fetch failed", err));
  }, []);

  const kpis = [
    { label: "Available Slots", value: stats.available, total: stats.totalSlots, icon: Car, color: "text-mint", bg: "bg-mint/10", border: "border-mint/20" },
    { label: "Active Bookings", value: stats.activeBookings, icon: MapPin, color: "text-azure", bg: "bg-azure/10", border: "border-azure/20" },
    { label: "Wallet Balance", value: `Rs. ${stats.wallet}`, icon: Wallet, color: "text-warn", bg: "bg-warn/10", border: "border-warn/20" },
    { label: "Occupied", value: stats.occupied, icon: CheckCircle, color: "text-danger", bg: "bg-danger/10", border: "border-danger/20" },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-textp">
            Welcome back, <span className="text-mint capitalize">{user?.name}</span>
          </h1>
          <p className="text-muted mt-1">Here's your parking snapshot for today.</p>
        </div>
        
        {/* Weather & Clock Widget */}
        <div className="flex items-center gap-4">
          {weather && (
            <div className="hidden sm:flex items-center gap-3 bg-panel/60 backdrop-blur-xl px-4 py-2 rounded-xl border border-white/10 text-sm">
              <CloudSun size={20} className="text-warn" />
              <span className="font-bold text-textp">{weather.temperature_2m}°C</span>
              <div className="w-px h-4 bg-white/10" />
              <span className="text-muted flex items-center gap-1"><Droplets size={14}/> {weather.relative_humidity_2m}%</span>
              <span className="text-muted flex items-center gap-1"><Wind size={14}/> {weather.wind_speed_10m}km/h</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-muted text-sm bg-panel/60 backdrop-blur-xl px-4 py-2 rounded-xl border border-white/10">
            <Clock size={16} />
            {clock.toLocaleTimeString()} • {clock.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <motion.div key={kpi.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} whileHover={{ y: -4, scale: 1.02 }} className={`bg-panel/60 backdrop-blur-xl p-6 rounded-2xl border ${kpi.border} shadow-xl cursor-pointer`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl ${kpi.bg} flex items-center justify-center ${kpi.color}`}>
                <kpi.icon size={20} />
              </div>
              {kpi.total && <span className="text-xs text-muted">/ {kpi.total}</span>}
            </div>
            <p className="text-muted text-xs uppercase tracking-wider font-semibold mb-1">{kpi.label}</p>
            <p className={`text-3xl font-bold ${kpi.color}`}>
              {typeof kpi.value === "number" ? <AnimatedNumber value={kpi.value} /> : kpi.value}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="lg:col-span-2 bg-panel/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl">
          <h3 className="text-lg font-bold mb-6">Weekly Revenue & Occupancy</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00E5A0" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00E5A0" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#8A93A6" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#8A93A6" fontSize={12} tickLine={false} axisLine={false} />
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <Tooltip contentStyle={{ backgroundColor: '#121828', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }} itemStyle={{ color: '#00E5A0' }} />
                <Area type="monotone" dataKey="revenue" stroke="#00E5A0" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-panel/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center gap-2 mb-6">
            <Activity size={20} className="text-mint" />
            <h3 className="text-lg font-bold">Recent Activity</h3>
          </div>
          {activity.length === 0 ? (
            <div className="text-center py-12">
              <Activity size={32} className="text-muted mx-auto mb-3 opacity-50" />
              <p className="text-muted text-sm">No activity yet</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[300px] overflow-y-auto">
              {activity.map((item) => (
                <div key={item.id} className="flex gap-3 items-start">
                  <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${item.type === "success" ? "bg-mint" : item.type === "warn" ? "bg-warn" : "bg-azure"}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-textp">{item.text}</p>
                    <p className="text-xs text-muted mt-0.5">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
