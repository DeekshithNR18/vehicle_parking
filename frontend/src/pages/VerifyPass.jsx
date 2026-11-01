import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Shield, ArrowLeft } from "lucide-react";
import Button from "../components/ui/Button";

export default function VerifyPass() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const type = searchParams.get("type");
  const id = searchParams.get("id");
  const name = searchParams.get("name");
  const slot = searchParams.get("slot");

  const isValid = !!id && (type === "booking" || type === "visitor");

  return (
    <div className="min-h-screen bg-deep flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        className={`w-full max-w-md bg-panel border rounded-3xl p-8 shadow-2xl text-center ${isValid ? "border-mint/40" : "border-danger/40"}`}
      >
        <div className="flex justify-center mb-6">
          {isValid ? (
            <div className="w-24 h-24 bg-mint/10 rounded-full flex items-center justify-center text-mint">
              <CheckCircle size={64} />
            </div>
          ) : (
            <div className="w-24 h-24 bg-danger/10 rounded-full flex items-center justify-center text-danger">
              <XCircle size={64} />
            </div>
          )}
        </div>

        <h1 className={`text-3xl font-bold mb-2 ${isValid ? "text-mint" : "text-danger"}`}>
          {isValid ? "Access Granted" : "Invalid Pass"}
        </h1>
        <p className="text-muted mb-8">
          {isValid ? "This pass is valid for entry." : "This pass is fake or expired."}
        </p>

        {isValid && (
          <div className="bg-deep/50 rounded-2xl p-4 text-left space-y-3 mb-8 border border-white/5">
            <div className="flex justify-between border-b border-white/5 pb-2">
              <span className="text-muted text-sm">Type</span>
              <span className="font-bold text-textp capitalize">{type}</span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-2">
              <span className="text-muted text-sm">Pass ID</span>
              <span className="font-bold text-textp font-mono">{id}</span>
            </div>
            {name && (
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-muted text-sm">Guest Name</span>
                <span className="font-bold text-textp">{name}</span>
              </div>
            )}
            {slot && (
              <div className="flex justify-between">
                <span className="text-muted text-sm">Parking Slot</span>
                <span className="font-bold text-azure text-lg">{slot}</span>
              </div>
            )}
          </div>
        )}

        <Button onClick={() => navigate("/")} className="w-full flex items-center justify-center gap-2">
          <ArrowLeft size={18} /> Return to App
        </Button>
        
        <div className="mt-6 flex items-center justify-center gap-2 text-muted text-xs">
          <Shield size={14} /> Verified by veh_parking1
        </div>
      </motion.div>
    </div>
  );
}
