import { useState } from "react";
import { motion } from "framer-motion";
import { Wallet as WalletIcon, ArrowUpRight, ArrowDownLeft, Plus } from "lucide-react";
import { useParking } from "../context/ParkingContext";
import Button from "../components/ui/Button";

export default function Wallet() {
  const { wallet, topUp } = useParking();
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTopUp = async (e) => {
    e.preventDefault();
    const num = parseInt(amount);
    if (!num || num <= 0) return;
    
    setLoading(true);
    const result = await topUp(num);
    setLoading(false);
    
    if (result.ok) {
      setAmount("");
    } else {
      alert("Failed to top up wallet.");
    }
  };

  const transactions = [
    { id: 1, type: "debit", title: "Booking A-4", amount: 75, date: "Today, 10:30 AM" },
    { id: 2, type: "credit", title: "Wallet Top-up", amount: 500, date: "Yesterday, 4:00 PM" },
    { id: 3, type: "debit", title: "Booking B-2", amount: 25, date: "Oct 28, 2:15 PM" },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-textp">My Wallet</h1>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-mint/20 to-azure/20 border border-mint/30 rounded-3xl p-8 flex flex-col justify-between shadow-[0_0_30px_rgba(0,229,160,0.1)]">
          <div className="flex items-center justify-between mb-8">
            <WalletIcon size={32} className="text-mint" />
            <span className="bg-deep/50 px-3 py-1 rounded-full text-xs font-semibold text-mint border border-mint/20">Active</span>
          </div>
          <div>
            <p className="text-muted text-sm mb-1">Available Balance</p>
            <h2 className="text-5xl font-extrabold text-textp">Rs. {wallet}</h2>
          </div>
        </div>

        <div className="bg-panel/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
          <h3 className="text-lg font-bold mb-4">Add Money</h3>
          <form onSubmit={handleTopUp} className="space-y-4">
            <div>
              <label className="text-xs text-muted mb-1 block">Amount (Rs.)</label>
              <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Enter amount" className="w-full bg-deep/50 border border-white/10 rounded-xl px-4 py-3 text-textp focus:outline-none focus:border-mint/50" />
            </div>
            <div className="flex gap-2">
              {[100, 500, 1000].map(val => (
                <button key={val} type="button" onClick={() => setAmount(val)} className="flex-1 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-sm">
                  Rs. {val}
                </button>
              ))}
            </div>
            <Button type="submit" disabled={loading} className="w-full flex justify-center items-center gap-2">
              <Plus size={18} /> {loading ? "Processing..." : "Top Up Wallet"}
            </Button>
          </form>
        </div>
      </div>

      <div className="bg-panel/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
        <h3 className="text-lg font-bold mb-4">Recent Transactions</h3>
        <div className="space-y-4">
          {transactions.map((tx) => (
            <div key={tx.id} className="flex items-center justify-between p-4 bg-deep/30 rounded-xl border border-white/5">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type === "credit" ? "bg-mint/20 text-mint" : "bg-danger/20 text-danger"}`}>
                  {tx.type === "credit" ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                </div>
                <div>
                  <p className="font-semibold text-textp">{tx.title}</p>
                  <p className="text-xs text-muted">{tx.date}</p>
                </div>
              </div>
              <p className={`font-bold ${tx.type === "credit" ? "text-mint" : "text-textp"}`}>
                {tx.type === "credit" ? "+" : "-"} Rs. {tx.amount}
              </p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
