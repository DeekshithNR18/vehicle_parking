import { NavLink } from "react-router-dom";
import { LayoutDashboard, Map, Calendar, Wallet, User } from "lucide-react";

export default function MobileNav() {
  const items = [
    { path: "/dashboard", icon: LayoutDashboard, label: "Home" },
    { path: "/map", icon: Map, label: "Map" },
    { path: "/bookings", icon: Calendar, label: "Bookings" },
    { path: "/wallet", icon: Wallet, label: "Wallet" },
    { path: "/profile", icon: User, label: "Profile" },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-panel/95 backdrop-blur-xl border-t border-white/10 z-40 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.3)]">
      <div className="flex justify-around items-center h-16">
        {items.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${
                isActive ? "text-mint" : "text-muted hover:text-textp"
              }`
            }
          >
            <item.icon size={20} />
            <span className="text-[10px] font-medium">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
