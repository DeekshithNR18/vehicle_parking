import { motion } from "framer-motion";
import { Trophy, Star, Zap, ArrowUpRight } from "lucide-react";
import { useParking } from "../context/ParkingContext";
import { useAuth } from "../context/AuthContext";

export default function Leaderboard() {
  const { MOCK_LEADERBOARD, points } = useParking();
  const { user } = useAuth();

  // Combine mock data with current user
  const myName = user?.name || "You";
  const allUsers = [...MOCK_LEADERBOARD];
  const myEntry = { name: myName, points: points, flat: "Your Flat", avatar: myName.charAt(0).toUpperCase() };
  
  // Insert user and sort
  const existingIdx = allUsers.findIndex(u => u.name.toLowerCase() === myName.toLowerCase());
  if (existingIdx > -1) allUsers[existingIdx] = myEntry;
  else allUsers.push(myEntry);

  allUsers.sort((a, b) => b.points - a.points);

  const top3 = allUsers.slice(0, 3);
  const rest = allUsers.slice(3);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-textp flex items-center gap-3">
            <Trophy className="text-warn" size={32} /> Society Leaderboard
          </h1>
          <p className="text-muted text-sm mt-1">Earn points by booking slots and being an eco-friendly citizen.</p>
        </div>
        <div className="bg-panel/60 border border-mint/30 px-6 py-3 rounded-2xl flex items-center gap-3 shadow-[0_0_15px_rgba(0,229,160,0.15)]">
          <Star className="text-mint" size={24} />
          <div>
            <p className="text-xs text-muted font-semibold uppercase">Your Points</p>
            <p className="text-2xl font-bold text-mint">{points}</p>
          </div>
        </div>
      </div>

      {/* Top 3 Podium */}
      <div className="flex justify-center items-end gap-2 md:gap-6 pt-8 pb-4">
        {/* 2nd Place */}
        <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-panel border-2 border-[#C0C0C0] flex items-center justify-center text-xl font-bold mb-2 relative">
            {top3[1]?.avatar}
            <div className="absolute -bottom-2 bg-[#C0C0C0] text-deep text-[10px] font-bold px-2 py-0.5 rounded-full">#2</div>
          </div>
          <p className="text-sm font-semibold truncate w-20 text-center">{top3[1]?.name}</p>
          <p className="text-xs text-muted">{top3[1]?.points} pts</p>
          <div className="w-20 h-24 bg-panel/80 border-t border-white/10 rounded-t-lg mt-2 flex items-center justify-center text-3xl font-bold text-white/20">2</div>
        </motion.div>

        {/* 1st Place */}
        <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-panel border-2 border-warn flex items-center justify-center text-2xl font-bold mb-2 relative shadow-[0_0_20px_rgba(255,176,32,0.4)]">
            {top3[0]?.avatar}
            <div className="absolute -top-3 text-warn"><Trophy size={24} /></div>
            <div className="absolute -bottom-2 bg-warn text-deep text-[10px] font-bold px-2 py-0.5 rounded-full">#1</div>
          </div>
          <p className="text-sm font-bold truncate w-24 text-center text-warn">{top3[0]?.name}</p>
          <p className="text-xs text-warn/80">{top3[0]?.points} pts</p>
          <div className="w-24 h-32 bg-panel/90 border-t border-warn/30 rounded-t-lg mt-2 flex items-center justify-center text-4xl font-bold text-warn/20">1</div>
        </motion.div>

        {/* 3rd Place */}
        <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-panel border-2 border-[#CD7F32] flex items-center justify-center text-xl font-bold mb-2 relative">
            {top3[2]?.avatar}
            <div className="absolute -bottom-2 bg-[#CD7F32] text-deep text-[10px] font-bold px-2 py-0.5 rounded-full">#3</div>
          </div>
          <p className="text-sm font-semibold truncate w-20 text-center">{top3[2]?.name}</p>
          <p className="text-xs text-muted">{top3[2]?.points} pts</p>
          <div className="w-20 h-16 bg-panel/70 border-t border-white/10 rounded-t-lg mt-2 flex items-center justify-center text-3xl font-bold text-white/20">3</div>
        </motion.div>
      </div>

      {/* Rest of the List */}
      <div className="bg-panel/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl">
        <div className="space-y-2">
          {rest.map((u, i) => (
            <div key={u.name} className={`flex items-center justify-between p-3 rounded-xl border ${u.name === myName ? "bg-mint/10 border-mint/30" : "bg-deep/50 border-white/5"}`}>
              <div className="flex items-center gap-4">
                <span className="w-6 text-center font-bold text-muted">#{i + 4}</span>
                <div className="w-8 h-8 rounded-full bg-azure/20 text-azure flex items-center justify-center font-bold text-sm">
                  {u.avatar}
                </div>
                <div>
                  <p className={`font-semibold text-sm ${u.name === myName ? "text-mint" : "text-textp"}`}>{u.name}</p>
                  <p className="text-xs text-muted">{u.flat}</p>
                </div>
              </div>
              <div className="font-bold text-textp">{u.points} <span className="text-xs text-muted font-normal">pts</span></div>
            </div>
          ))}
        </div>
      </div>

      {/* How to earn points */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-panel/40 border border-white/10 rounded-2xl p-5 flex items-start gap-3">
          <div className="p-2 bg-mint/10 text-mint rounded-lg"><Zap size={20} /></div>
          <div>
            <h3 className="font-bold text-textp text-sm">Go Electric!</h3>
            <p className="text-xs text-muted mt-1">Book an EV charging bay and earn <strong className="text-mint">50 points</strong> per booking.</p>
          </div>
        </div>
        <div className="bg-panel/40 border border-white/10 rounded-2xl p-5 flex items-start gap-3">
          <div className="p-2 bg-azure/10 text-azure rounded-lg"><ArrowUpRight size={20} /></div>
          <div>
            <h3 className="font-bold text-textp text-sm">Regular Parking</h3>
            <p className="text-xs text-muted mt-1">Book any standard car or bike slot and earn <strong className="text-azure">20 points</strong>.</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
