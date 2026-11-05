import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";
import { useAuth } from "./AuthContext";

const ParkingContext = createContext();
export const useParking = () => useContext(ParkingContext);

const MOCK_LEADERBOARD = [
  { name: "Rahul Sharma", points: 1250, flat: "A-102", avatar: "R" },
  { name: "Priya Patel", points: 980, flat: "B-204", avatar: "P" },
  { name: "Amit Kumar", points: 850, flat: "C-301", avatar: "A" },
  { name: "Sneha Reddy", points: 720, flat: "A-405", avatar: "S" },
  { name: "Vikram Singh", points: 540, flat: "D-102", avatar: "V" },
];

export function ParkingProvider({ children }) {
  const { user, refreshUser } = useAuth();
  const [slots, setSlots] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [wallet, setWallet] = useState(0);
  const [points, setPoints] = useState(user?.points || 0);
  const [activity, setActivity] = useState([]);

  useEffect(() => {
    fetchSlots();
    fetchBookings();
    fetchWallet();
  }, []);

  useEffect(() => {
    if (user?.points !== undefined) setPoints(user.points);
  }, [user]);

  const fetchSlots = async () => {
    try {
      const res = await api.get("/slots");
      const formatted = res.data.map(s => ({ ...s, pricePerHour: s.price_per_hour }));
      setSlots(formatted);
    } catch (err) {
      console.error("Failed to fetch slots", err);
    }
  };

  const fetchBookings = async () => {
    try {
      const res = await api.get("/bookings/mine");
      const formatted = res.data.map(b => ({
        ...b,
        slotLabel: b.slot_label,
        hours: b.duration,
        startTime: b.start_time
      }));
      setBookings(formatted);
    } catch (err) {
      console.error("Failed to fetch bookings", err);
    }
  };

  const fetchWallet = async () => {
    try {
      const res = await api.get("/wallet");
      setWallet(res.data.balance);
    } catch (err) {
      console.error("Failed to fetch wallet", err);
    }
  };
  const refreshWallet = fetchWallet;
  const addActivity = (text, type = "info") => {
    setActivity((prev) => [{ id: Date.now(), text, type, time: new Date().toLocaleTimeString() }, ...prev].slice(0, 20));
  };

  const bookSlot = async (slot, hours = 2) => {
    try {
      const res = await api.post("/bookings", {
        slotId: slot.id,
        date: new Date().toISOString().split("T")[0],
        startTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        duration: hours,
      });

      await fetchSlots();
      await fetchBookings();
      await fetchWallet();
      await refreshUser();

      addActivity(`Booked slot ${slot.label}. Earned ${res.data.earnedPoints} pts!`, "success");
      return { ok: true, booking: res.data.bookingId, earnedPoints: res.data.earnedPoints };
    } catch (err) {
      return { ok: false, message: err.response?.data?.error || "Booking failed" };
    }
  };

  const cancelBooking = async (bookingId) => {
    try {
      await api.post(`/bookings/${bookingId}/cancel`);
      await fetchSlots();
      await fetchBookings();
      await fetchWallet();
      addActivity(`Cancelled booking ${bookingId}`, "warn");
      return { ok: true };
    } catch (err) {
      return { ok: false, message: "Cancel failed" };
    }
  };

  const topUp = async (amount) => {
    try {
      await api.post("/wallet/topup", { amount });
      await fetchWallet();
      addActivity(`Wallet topped up Rs.${amount}`, "success");
      return { ok: true };
    } catch (err) {
      return { ok: false };
    }
  };

  const stats = {
    totalSlots: slots.length,
    available: slots.filter((s) => s.status === "available").length,
    occupied: slots.filter((s) => s.status === "occupied").length,
    reserved: slots.filter((s) => s.status === "reserved").length,
    ev: slots.filter((s) => s.type === "ev" && s.status === "available").length,
    activeBookings: bookings.length,
    wallet,
  };

  return (
    <ParkingContext.Provider value={{ 
      slots, bookings, wallet, points, activity, stats, 
            bookSlot, cancelBooking, topUp, addActivity, refreshWallet,
      offlineQueue: [], MOCK_LEADERBOARD 
    }}>
      {children}
    </ParkingContext.Provider>
  );
}

