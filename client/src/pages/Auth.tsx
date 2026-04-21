import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { User, ShieldCheck, Bike, ArrowRight, Loader2 } from "lucide-react";
import { cn } from "../lib/utils";

type Role = "user" | "driver" | "admin";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState<Role>("user");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [vehicleNo, setVehicleNo] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const { login, register, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    let finalPhone = phone.trim().replace(/\s+/g, "");

    if (role !== "admin") {
      const phoneRegex = /^(?:\+91|91)?[6-9]\d{9}$/;
      if (!phoneRegex.test(finalPhone)) {
        setValidationError("Invalid phone number. It must be a 10-digit number.");
        return;
      }
      
      if (finalPhone.startsWith("+91")) {
        finalPhone = finalPhone.substring(3);
      } else if (finalPhone.startsWith("91") && finalPhone.length === 12) {
        finalPhone = finalPhone.substring(2);
      }
    }

    if (!isLogin) {
      if (password.length !== 4 || !/^\d{4}$/.test(password)) {
        setValidationError("Password must be exactly a 4-digit number.");
        return;
      }
    }

    setIsLoading(true);
    try {
      if (isLogin) {
        await login(finalPhone, password, role);
      } else {
        await register({ name, phone: finalPhone, password, vehicle_no: vehicleNo, role });
      }
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const roleIcons = {
    user: <User className="w-6 h-6" />,
    driver: <Bike className="w-6 h-6" />,
    admin: <ShieldCheck className="w-6 h-6" />,
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Mesh Gradients */}
      <div className="mesh-gradient-1" />
      <div className="mesh-gradient-2" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md glass-panel rounded-[32px] p-8 shadow-2xl relative z-10"
      >
        <div className="flex justify-center mb-8">
          <div className="bg-rapido-yellow p-4 rounded-2xl shadow-lg shadow-rapido-yellow/20">
            <Bike className="w-10 h-10 text-black" />
          </div>
        </div>
        
        <h2 className="text-3xl font-bold text-center mb-2 text-white italic tracking-tighter uppercase">
          {isLogin ? "Welcome Back" : "Join Rapido"}
        </h2>
        <p className="text-slate-400 text-center mb-8 text-sm font-medium">
          {isLogin ? "Connect to your urban ride" : "Start your journey through the city"}
        </p>

        {/* Role Switcher */}
        <div className="flex bg-black/40 p-1 rounded-2xl mb-8">
          {(["user", "driver", "admin"] as Role[]).filter(r => isLogin || r !== "admin").map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              className={cn(
                "flex-1 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all rounded-xl",
                role === r 
                  ? "bg-rapido-yellow text-black" 
                  : "text-slate-400 hover:text-white"
              )}
            >
              {r}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-black tracking-widest text-slate-500 ml-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-rapido-yellow/50 transition-colors text-sm"
                placeholder="John Doe"
              />
            </div>
          )}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-black tracking-widest text-slate-500 ml-1">
                {role === "admin" ? "Email Address" : "Phone Number"}
              </label>
              <input
                type={role === "admin" ? "email" : "tel"}
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-rapido-yellow/50 transition-colors text-sm"
                placeholder={role === "admin" ? "admin@rapido.com" : "9876543210"}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-black tracking-widest text-slate-500 ml-1">Password</label>
              <input
                type="password"
                inputMode={role !== "admin" ? "numeric" : "text"}
                required
                value={password}
                onChange={(e) => {
                  if (role !== "admin" && !isLogin) {
                    const val = e.target.value.replace(/\D/g, "");
                    if (val.length <= 4) setPassword(val);
                  } else {
                    setPassword(e.target.value);
                  }
                }}
                className="w-full px-4 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-rapido-yellow/50 transition-colors text-sm"
                placeholder={role !== "admin" && !isLogin ? "•••• (4 digits)" : "••••••••"}
              />
            </div>
            {role === "driver" && !isLogin && (
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-black tracking-widest text-slate-500 ml-1">Vehicle Number</label>
                <input
                  type="text"
                  required
                  value={vehicleNo}
                  onChange={(e) => setVehicleNo(e.target.value)}
                  className="w-full px-4 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-rapido-yellow/50 transition-colors text-sm"
                  placeholder="KA-01-AB-1234"
                />
              </div>
            )}

          {(error || validationError) && (
            <p className="text-red-400 text-xs font-bold text-center mt-2">{error || validationError}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-rapido-yellow hover:bg-yellow-300 text-black font-black py-4 rounded-2xl transition-all shadow-lg shadow-rapido-yellow/20 uppercase tracking-widest text-sm mt-6 flex items-center justify-center gap-2 group disabled:opacity-70"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                {isLogin ? "Get Started" : "Register Now"}
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-white/5 text-center">
          {role !== "admin" && (
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-xs text-slate-400 hover:text-rapido-yellow font-bold uppercase tracking-widest transition-colors"
            >
              {isLogin ? "Create a new profile" : "Already registered? Sign In"}
            </button>
          )}
          {role === "admin" && (
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
              Admin accounts must be pre-authorized
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
