import { useState, useEffect } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useParking } from "../../context/ParkingContext";
import { Car, LayoutDashboard, Map, Calendar, Wallet, LogOut, Users, Wrench, Search, Shield, Trophy, Star, Sun, Moon, ScanLine, Settings } from "lucide-react";
import Chatbot from "../Chatbot";
import NotificationBell from "../NotificationBell";
import CommandPalette from "../CommandPalette";
import ShortcutsHelp from "../ShortcutsHelp";
import MobileNav from "../MobileNav";
import SOSButton from "../SOSButton";

export default function AppLayout() {
  const { user, logout } = useAuth();
  const { points } = useParking();
  const [isDark, setIsDark] = useState(() => localStorage.getItem("vp_theme") !== "light");

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.remove("light");
      localStorage.setItem("vp_theme", "dark");
    } else {
      document.documentElement.classList.add("light");
      localStorage.setItem("vp_theme", "light");
    }
  }, [isDark]);

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Parking Map", path: "/map", icon: Map },
    { name: "My Bookings", path: "/bookings", icon: Calendar },
    { name: "Wallet", path: "/wallet", icon: Wallet },
    { name: "Leaderboard", path: "/leaderboard", icon: Trophy },
    { name: "Visitors", path: "/visitors", icon: Users },
    { name: "Maintenance", path: "/maintenance", icon: Wrench },
    { name: "Settings", path: "/settings", icon: Settings },
  ];

  if (user?.role === "admin") navItems.push({ name: "Admin Panel", path: "/admin", icon: Shield });
  if (user?.role === "guard") navItems.push({ name: "Guard Checkpoint", path: "/guard", icon: ScanLine });

  return (
    <div className={`flex h-screen bg-deep text-textp overflow-hidden font-sans transition-colors duration-300 ${!isDark ? "light-theme" : ""}`}>
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-[40vw] h-[40vw] bg-mint/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[40vw] h-[40vw] bg-azure/5 rounded-full blur-[120px]" />
      </div>

      <aside className="hidden md:flex w-64 bg-panel/80 backdrop-blur-xl border-r border-white/5 flex-col relative z-[100]">
        <div className="p-6 flex items-center justify-between border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-mint/10 rounded-xl"><Car size={24} className="text-mint" /></div>
            <h1 className="text-lg font-bold tracking-tight">veh_parking1</h1>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setIsDark(!isDark)} className="p-2 rounded-xl bg-panel/60 border border-white/10 hover:bg-panel transition-colors">
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <NotificationBell />
          </div>
        </div>

        <div className="p-3 border-b border-white/5">
          <button
            onClick={() => {
              const event = new KeyboardEvent("keydown", { key: "k", ctrlKey: true });
              window.dispatchEvent(event);
            }}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-deep border border-white/10 hover:border-mint/30 text-muted text-sm transition-colors"
          >
            <Search size={14} />
            <span>Search...</span>
            <span className="ml-auto text-xs bg-white/5 px-1.5 py-0.5 rounded">Ctrl+K</span>
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive ? "bg-mint/10 text-mint font-semibold border border-mint/20" : "text-muted hover:bg-white/5 hover:text-textp"
                }`
              }
            >
              <item.icon size={20} />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5">
          <div className="flex items-center justify-between px-4 py-3 mb-2 bg-mint/5 rounded-xl border border-mint/10">
            <div className="flex items-center gap-2"><Star size={16} className="text-mint" /><span className="text-xs font-semibold text-mint">Eco Points</span></div>
            <span className="font-bold text-mint">{points}</span>
          </div>
          <div className="flex items-center gap-3 px-4 py-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-azure/20 flex items-center justify-center text-azure font-bold uppercase">
              {user?.name?.charAt(0) || "U"}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold truncate capitalize">{user?.name}</p>
              <p className="text-xs text-muted truncate">{user?.role}</p>
            </div>
          </div>
          <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-danger hover:bg-danger/10 transition-colors">
            <LogOut size={20} /><span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto relative z-10 pb-20 md:pb-0">
        <div className="p-4 md:p-8 max-w-7xl mx-auto"><Outlet /></div>
      </main>

      <Chatbot />
      <CommandPalette />
      <ShortcutsHelp />
      <MobileNav />
      <SOSButton />
    </div>
  );
}
