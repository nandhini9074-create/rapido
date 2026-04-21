import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Bike, Navigation, Star, Phone, Menu, Bell, Clock, LayoutDashboard, User } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { cn } from "../lib/utils";

export default function LandingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 relative overflow-hidden">
      {/* Background Mesh Gradients */}
      <div className="mesh-gradient-1" />
      <div className="mesh-gradient-2" />

      {/* Navigation */}
      <nav className="relative z-10 px-8 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-rapido-yellow rounded-xl flex items-center justify-center">
            <Bike className="w-6 h-6 text-black" />
          </div>
          <span className="text-2xl font-black tracking-tighter uppercase italic">Rapido</span>
        </div>
        
        <div className="hidden md:flex items-center gap-8">
          <a href="#" className="font-semibold text-slate-400 hover:text-rapido-yellow transition-colors">Safety</a>
          <a href="#" className="font-semibold text-slate-400 hover:text-rapido-yellow transition-colors">Help</a>
          <a href="#" className="font-semibold text-slate-400 hover:text-rapido-yellow transition-colors">About Us</a>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <button 
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-2 px-4 py-2 glass-panel rounded-xl transition-all font-semibold hover:bg-white/10"
            >
              <LayoutDashboard className="w-5 h-5" />
              Dashboard
            </button>
          ) : (
            <button 
              onClick={() => navigate("/auth")}
              className="px-6 py-2.5 bg-rapido-yellow hover:bg-yellow-400 text-black font-bold rounded-xl shadow-lg shadow-rapido-yellow/20 transition-all uppercase tracking-wider text-sm"
            >
              Sign In
            </button>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-20 px-8">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <span className="inline-block px-4 py-1.5 glass-panel text-rapido-yellow font-bold rounded-full text-xs uppercase tracking-widest mb-6">
              #1 Bike Taxi in India
            </span>
            <h1 className="text-6xl md:text-8xl font-black leading-[0.85] tracking-tighter mb-8">
              BEAT THE <br/>TRAFFIC WITH <br/><span className="text-rapido-yellow">RAPIDO</span>
            </h1>
            <p className="text-xl text-slate-400 mb-10 max-w-lg leading-relaxed">
              India's fastest and most affordable way to travel. Join over 2 million daily riders in 50+ cities.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => navigate("/auth")}
                className="px-8 py-5 bg-rapido-yellow text-black font-black rounded-2xl text-lg flex items-center justify-center gap-3 hover:bg-yellow-300 transition-all shadow-xl shadow-rapido-yellow/20 uppercase tracking-widest"
              >
                Book a Ride
                <Navigation className="w-5 h-5" />
              </button>
              <button 
                onClick={() => navigate("/auth")}
                className="px-8 py-5 glass-panel text-white font-bold rounded-2xl text-lg hover:bg-white/10 transition-all uppercase tracking-widest"
              >
                Become a Driver
              </button>
            </div>

            <div className="mt-12 flex items-center gap-8 border-t border-white/5 pt-10">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-12 h-12 rounded-full border-2 border-slate-900 bg-slate-800 overflow-hidden">
                    <img src={`https://picsum.photos/seed/user${i}/100/100`} alt="User" referrerPolicy="no-referrer" />
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1 text-rapido-yellow">
                  <Star className="w-5 h-5 fill-current" />
                  <span className="text-xl font-bold text-white">4.8/5</span>
                </div>
                <p className="text-slate-500 font-medium text-sm">Join 10M+ users</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative"
          >
            <div className="aspect-square rounded-[3rem] bg-white/5 backdrop-blur-3xl border border-white/10 overflow-hidden relative group">
              <img 
                src="https://picsum.photos/seed/rapido-ride/800/800" 
                alt="Rapido Ride" 
                className="w-full h-full object-cover mix-blend-overlay opacity-60"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent" />
              
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-10 right-10 glass-panel p-5 rounded-3xl shadow-2xl z-10"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-rapido-yellow/20 p-3 rounded-2xl">
                    <Bike className="w-6 h-6 text-rapido-yellow" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white uppercase text-xs tracking-widest">Live Tracking</h4>
                    <p className="text-[10px] text-slate-400 font-bold">Driver arriving in 2 min</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="relative z-10 py-24 border-t border-white/5 bg-white/2">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-8 text-center">
          {[
            { icon: <Clock className="w-8 h-8 text-rapido-yellow" />, title: "Zero Wait Time", desc: "Just tap and your ride is here." },
            { icon: <Navigation className="w-8 h-8 text-indigo-400" />, title: "Quick & Easy", desc: "Squeeze through traffic effortlessly." },
            { icon: <Star className="w-8 h-8 text-emerald-400" />, title: "Economical", desc: "Affordable rides for everyone." },
          ].map((feature, i) => (
            <div key={i} className="glass-panel p-10 rounded-[2.5rem] hover:bg-white/10 transition-all group border-white/5">
              <div className="mb-6 inline-block bg-white/5 p-6 rounded-3xl group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-4 uppercase tracking-tighter italic">{feature.title}</h3>
              <p className="text-slate-400 leading-relaxed text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer class="relative z-10 px-8 py-8 flex justify-between items-end border-t border-white/5">
        <div class="space-y-1">
          <div class="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold">Current Status</div>
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span class="text-xs font-medium text-slate-300 italic">Servers Operational in Bengaluru</span>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-slate-400 hover:bg-white/5 cursor-pointer transition-colors">𝕏</div>
          <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-slate-400 hover:bg-white/5 cursor-pointer transition-colors">in</div>
          <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-slate-400 hover:bg-white/5 cursor-pointer transition-colors">ig</div>
        </div>
      </footer>
    </div>
  );
}
