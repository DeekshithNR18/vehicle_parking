import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ParkingProvider } from "./context/ParkingContext";
import Login from "./pages/Login";
import Welcome from "./pages/Welcome";
import AppLayout from "./components/layout/AppLayout";
import ErrorBoundary from "./components/ErrorBoundary";

import Dashboard from "./pages/Dashboard";
import ParkingMap from "./pages/ParkingMap";
import MyBookings from "./pages/MyBookings";
import Wallet from "./pages/Wallet";
import Visitors from "./pages/Visitors";
import Maintenance from "./pages/Maintenance";
import Profile from "./pages/Profile";
import AdminPanel from "./pages/AdminPanel";
import Leaderboard from "./pages/Leaderboard";
import GuardMode from "./pages/GuardMode";
import Settings from "./pages/Settings";
import CustomCursor from "./components/CustomCursor";
import VerifyPass from "./pages/VerifyPass";

function AdminRoute() {
  const { user } = useAuth();
  if (user?.role !== "admin") return <Navigate to="/dashboard" replace />;
  return <Outlet />;
}

function GuardRoute() {
  const { user } = useAuth();
  if (user?.role !== "guard" && user?.role !== "admin") return <Navigate to="/dashboard" replace />;
  return <Outlet />;
}

function AppContent() {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen bg-deep flex items-center justify-center text-mint">Loading...</div>;
  if (!user) return <Login />;

  return (
    <ParkingProvider>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route element={<AppLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="map" element={<ParkingMap />} />
          <Route path="bookings" element={<MyBookings />} />
          <Route path="wallet" element={<Wallet />} />
          <Route path="visitors" element={<Visitors />} />
          <Route path="maintenance" element={<Maintenance />} />
          <Route path="profile" element={<Profile />} />
          <Route path="leaderboard" element={<Leaderboard />} />
          <Route path="settings" element={<Settings />} />
          <Route element={<AdminRoute />}><Route path="admin" element={<AdminPanel />} /></Route>
          <Route element={<GuardRoute />}><Route path="guard" element={<GuardMode />} /></Route>
        </Route>
        <Route path="/verify" element={<VerifyPass />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ParkingProvider>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <CustomCursor />
      <BrowserRouter>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}


