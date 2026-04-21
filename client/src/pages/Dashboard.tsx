import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { motion } from "motion/react";
import { Bike, Navigation, MapPin, Clock, Star, Phone, LogOut, Bell, Search, History, Wallet, User as UserIcon, Users, Trash2, Edit2, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "../lib/utils";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    navigate("/auth");
    return null;
  }

  const renderContent = () => {
    switch (user.role) {
      case "admin":
        return <AdminView />;
      case "driver":
        return <DriverView />;
      default:
        return <UserView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 relative overflow-hidden">
      {/* Background Mesh Gradients */}
      <div className="mesh-gradient-1 opacity-50" />
      <div className="mesh-gradient-2 opacity-50" />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto p-6 md:p-12 relative z-10">
        <header className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-3">
            <div className="bg-rapido-yellow p-2 rounded-xl">
              <Bike className="w-6 h-6 text-black" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tighter uppercase italic">Rapido</h1>
              <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.2em]">{user.role} Portal</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-white">{user.name}</p>
              <button onClick={logout} className="text-[10px] font-black text-red-400 uppercase tracking-widest hover:text-red-300 transition-colors">Sign Out</button>
            </div>
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-black text-slate-300">
              {user.name.charAt(0)}
            </div>
          </div>
        </header>

        {renderContent()}
      </main>
    </div>
  );
}

function NavItem({ icon, label, active = false }: { icon: any, label: string, active?: boolean }) {
  return (
    <button className={cn(
      "w-full flex items-center gap-4 p-4 rounded-2xl transition-all font-black uppercase tracking-widest text-[10px]",
      active ? "bg-rapido-yellow text-black shadow-lg shadow-rapido-yellow/20" : "text-slate-400 hover:bg-white/5 hover:text-white"
    )}>
      {icon}
      {label}
    </button>
  );
}

function LayoutIcon({ role }: { role: string }) {
  return <div className="w-5 h-5 border-2 border-current rounded" />;
}

// Sub-Views

function UserView() {
  const { user } = useAuth();
  const [selectedVehicle, setSelectedVehicle] = useState<"Bike" | "Auto">("Bike");
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const [activeRide, setActiveRide] = useState<any>(null);

  const checkRideStatus = async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/v1/rides/`);
      const data = await res.json();
      // Find the latest ride for this user
      const latestRide = data
        .filter((r: any) => r.user_id === user?.id)
        .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];
      
      if (latestRide && (latestRide.status === "assigned" || latestRide.status === "requested")) {
        setActiveRide(latestRide);
      } else {
        setActiveRide(null);
      }
    } catch (err) {
      console.error("Failed to check ride status", err);
    }
  };

  useEffect(() => {
    const interval = setInterval(checkRideStatus, 3000);
    return () => clearInterval(interval);
  }, [user]);

  const handleBookRide = async () => {
    if (!source || !destination) return;
    
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("http://localhost:8000/api/v1/rides/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user?.id,
          source,
          destination
        }),
      });

      if (!res.ok) throw new Error("Booking failed");
      const newRide = await res.json();
      setActiveRide(newRide);
      setMessage("Ride booked successfully! Searching for driver...");
      setSource("");
      setDestination("");
    } catch (err) {
      setMessage("Failed to book ride. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (activeRide) {
    return (
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="glass-panel p-8 rounded-[2.5rem] shadow-sm text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-rapido-yellow p-4 rounded-full animate-bounce">
              <Bike className="w-8 h-8 text-black" />
            </div>
          </div>
          <h3 className="text-2xl font-black mb-2 uppercase tracking-widest italic">
            {activeRide.status === "assigned" ? "Ride starts here!" : "Searching for Driver..."}
          </h3>
          <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest mb-8">
            {activeRide.source} → {activeRide.destination}
          </p>
          
          {activeRide.status === "assigned" && (
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10 text-left mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center font-black text-xl text-rapido-yellow">
                  R
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Your Captain</p>
                  <p className="font-black text-white italic">{activeRide.driver_name || "Driver"} (KA-01-RE-1234)</p>
                </div>
                <div className="ml-auto">
                  <button className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl hover:bg-emerald-500/20 transition-all">
                    <Phone className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
            <Clock className="w-5 h-5 text-rapido-yellow" />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Estimated Arrival: 4 mins</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Search / Booking */}
      <div className="glass-panel p-8 rounded-[2.5rem] shadow-sm">
        <h3 className="text-xl font-black mb-6 uppercase tracking-widest italic">Where to?</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 focus-within:border-rapido-yellow transition-all">
            <MapPin className="w-6 h-6 text-emerald-400" />
            <input 
              placeholder="Starting Location"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="bg-transparent border-none outline-none w-full font-bold text-white placeholder-slate-500"
            />
          </div>
          <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 focus-within:border-rapido-yellow transition-all">
            <MapPin className="w-6 h-6 text-rose-400" />
            <input 
              placeholder="Destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="bg-transparent border-none outline-none w-full font-bold text-white placeholder-slate-500"
            />
          </div>
          <button 
            onClick={handleBookRide}
            disabled={loading || !source || !destination}
            className="w-full py-5 bg-rapido-yellow text-black font-black rounded-2xl text-lg hover:bg-yellow-300 transition-all shadow-xl shadow-rapido-yellow/20 uppercase tracking-[0.2em] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Searching..." : `Find My ${selectedVehicle} Ride`}
          </button>
          {message && (
            <p className={cn(
              "text-center text-[10px] font-black uppercase tracking-widest mt-4",
              message.includes("success") ? "text-emerald-400" : "text-rose-400"
            )}>
              {message}
            </p>
          )}
        </div>
      </div>

      {/* Categories */}
      <div className="grid grid-cols-2 gap-4">
        <CategoryCard 
          icon={<Bike className="w-8 h-8" />} 
          title="Bike" 
          active={selectedVehicle === "Bike"} 
          onClick={() => setSelectedVehicle("Bike")}
        />
        <CategoryCard 
          icon={<Navigation className="w-8 h-8" />} 
          title="Auto" 
          active={selectedVehicle === "Auto"} 
          onClick={() => setSelectedVehicle("Auto")}
        />
      </div>
    </div>
  );
}

function DriverView() {
  const { user } = useAuth();
  const [rides, setRides] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [declinedRideIds, setDeclinedRideIds] = useState<string[]>([]);
  const [activeRide, setActiveRide] = useState<any>(null);

  const fetchRides = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/v1/rides/");
      const data = await res.json();
      
      // Check for active ride assigned to this driver
      const assignedRide = data.find((r: any) => r.driver_id === user?.id && r.status === "assigned");
      if (assignedRide) {
        setActiveRide(assignedRide);
        setLoading(false);
        return;
      } else {
        setActiveRide(null);
      }

      // Filter for requested rides only AND those NOT declined by this driver
      setRides(data.filter((r: any) => r.status === "requested" && !declinedRideIds.includes(r.id)));
    } catch (err) {
      console.error("Failed to fetch rides", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRides();
    const interval = setInterval(fetchRides, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, [declinedRideIds, user]);

  const handleDeclineRide = (rideId: string) => {
    setDeclinedRideIds((prev) => [...prev, rideId]);
  };

  const handleAcceptRide = async (rideId: string) => {
    if (!user) return;
    setActionLoading(rideId);
    try {
      const res = await fetch(`http://localhost:8000/api/v1/rides/${rideId}/assign?driver_id=${user.id}`, {
        method: "POST",
      });
      if (res.ok) {
        const updatedRide = await res.json();
        setActiveRide(updatedRide);
        fetchRides();
      }
    } catch (err) {
      console.error("Failed to accept ride", err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleCompleteRide = async (rideId: string) => {
    setActionLoading(rideId);
    try {
      const res = await fetch(`http://localhost:8000/api/v1/rides/${rideId}/complete`, {
        method: "POST",
      });
      if (res.ok) {
        setActiveRide(null);
        fetchRides();
      }
    } catch (err) {
      console.error("Failed to complete ride", err);
    } finally {
      setActionLoading(null);
    }
  };

  if (activeRide) {
    return (
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="glass-panel p-8 rounded-[2.5rem] shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black uppercase tracking-widest italic">Active Ride</h3>
            <span className="bg-emerald-500 text-black px-4 py-1.5 rounded-full text-[10px] font-black italic tracking-tighter animate-pulse uppercase">Driver is on the way</span>
          </div>
          
          <div className="p-6 bg-white/5 rounded-[2rem] border border-white/10 mb-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Passenger</p>
                <h4 className="font-black text-xl italic text-white leading-tight">{activeRide.user_name || "Customer"}</h4>
              </div>
            </div>
            
            <div className="flex gap-12 mb-0 relative">
              <div className="absolute left-[7px] top-3 bottom-3 w-[2px] border-l border-dashed border-slate-700" />
              <div className="space-y-6">
                <div className="flex items-center gap-3 relative z-10">
                  <div className="w-4 h-4 rounded-full border-2 border-emerald-400 bg-[#0f172a]" />
                  <div className="flex flex-col">
                    <span className="text-[8px] font-black text-emerald-400 uppercase tracking-[0.2em] mb-0.5">Pickup</span>
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{activeRide.source}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 relative z-10">
                  <div className="w-4 h-4 rounded-full border-2 border-rose-400 bg-[#0f172a]" />
                  <div className="flex flex-col">
                    <span className="text-[8px] font-black text-rose-400 uppercase tracking-[0.2em] mb-0.5">Drop</span>
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{activeRide.destination}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button 
            onClick={() => handleCompleteRide(activeRide.id)}
            disabled={actionLoading === activeRide.id}
            className="w-full py-5 bg-rapido-yellow text-black font-black rounded-2xl text-lg hover:bg-yellow-300 transition-all shadow-xl shadow-rapido-yellow/20 uppercase tracking-[0.2em]"
          >
            {actionLoading === activeRide.id ? "Completing..." : "Complete Ride"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-3">
        <div className="glass-panel p-8 rounded-[2.5rem] min-h-[400px]">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black uppercase tracking-widest italic">Pending Requests</h3>
            <span className="bg-rapido-yellow text-black px-4 py-1.5 rounded-full text-[10px] font-black italic tracking-tighter">
              {rides.length} {rides.length === 1 ? "NEW QUEUED" : "NEW QUEUED"}
            </span>
          </div>
          
          <div className="space-y-4">
            {loading ? (
              <div className="flex items-center justify-center h-48">
                <p className="text-slate-500 font-black uppercase tracking-widest animate-pulse">Loading Requests...</p>
              </div>
            ) : rides.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 text-center">
                <Bike className="w-12 h-12 text-slate-800 mb-4" />
                <p className="text-slate-500 font-black uppercase tracking-widest">No pending rides</p>
                <p className="text-[10px] text-slate-600 uppercase tracking-widest mt-2 italic">Searching for new opportunities...</p>
              </div>
            ) : (
              rides.map((ride) => (
                <div key={ride.id} className="p-6 bg-white/5 rounded-[2rem] border border-white/5 hover:border-white/10 transition-colors">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h4 className="font-black text-lg mb-1 uppercase tracking-tighter italic text-white leading-tight">
                        {ride.user_name || "Unknown User"}
                      </h4>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest italic">
                        {new Date(ride.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-12 mb-8 relative">
                    <div className="absolute left-[7px] top-3 bottom-3 w-[2px] border-l border-dashed border-slate-700" />
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 relative z-10">
                        <div className="w-4 h-4 rounded-full border-2 border-emerald-400 bg-[#0f172a]" />
                        <div className="flex flex-col">
                          <span className="text-[8px] font-black text-emerald-400 uppercase tracking-[0.2em] mb-0.5">Pickup</span>
                          <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{ride.source}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 relative z-10">
                        <div className="w-4 h-4 rounded-full border-2 border-rose-400 bg-[#0f172a]" />
                        <div className="flex flex-col">
                          <span className="text-[8px] font-black text-rose-400 uppercase tracking-[0.2em] mb-0.5">Drop</span>
                          <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{ride.destination}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={() => handleDeclineRide(ride.id)}
                      className="py-3 bg-white/5 text-slate-500 font-black rounded-2xl hover:bg-white/10 transition-all uppercase tracking-widest text-[10px]"
                    >
                      Decline
                    </button>
                    <button 
                      onClick={() => handleAcceptRide(ride.id)}
                      disabled={actionLoading === ride.id}
                      className="py-3 bg-rapido-yellow text-black font-black rounded-2xl hover:bg-yellow-300 transition-all shadow-lg shadow-rapido-yellow/20 uppercase tracking-widest text-[10px] disabled:opacity-50"
                    >
                      {actionLoading === ride.id ? "Accepting..." : "Accept Ride"}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminView() {
  const [activeTab, setActiveTab] = useState<"users" | "drivers" | "rides">("users");
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      let endpoint = "/admin/users";
      if (activeTab === "drivers") endpoint = "/admin/drivers";
      if (activeTab === "rides") endpoint = "/rides/";

      const res = await fetch(`http://localhost:8000/api/v1${endpoint}`);
      const result = await res.json();
      setData(Array.isArray(result) ? result : []);
    } catch (err) {
      console.error("Failed to fetch admin data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const [editingItem, setEditingItem] = useState<any>(null);
  const [editData, setEditData] = useState<any>({});

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this?")) return;
    try {
      let endpoint = `/admin/users/${id}`;
      if (activeTab === "drivers") endpoint = `/admin/drivers/${id}`;
      if (activeTab === "rides") endpoint = `/rides/${id}`;

      const res = await fetch(`http://localhost:8000/api/v1${endpoint}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const handleEditClick = (item: any) => {
    setEditingItem(item);
    setEditData(item);
  };

  const handleUpdate = async () => {
    try {
      let endpoint = `/admin/users/${editingItem.id}`;
      if (activeTab === "drivers") endpoint = `/admin/drivers/${editingItem.id}`;
      if (activeTab === "rides") endpoint = `/rides/${editingItem.id}`;

      // Prepare body - exclude internal fields if necessary
      const { id, created_at, updated_at, status, ...rest } = editData;
      
      const res = await fetch(`http://localhost:8000/api/v1${endpoint}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rest),
      });

      if (res.ok) {
        setEditingItem(null);
        fetchData();
      } else {
        const err = await res.json();
        alert(`Update failed: ${err.detail || "Unknown error"}`);
      }
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  return (
    <div className="space-y-8">
      {/* Admin Navigation Cards */}
      <div className="grid grid-cols-3 gap-6">
        <AdminNavCard 
          icon={<Users className="w-8 h-8" />} 
          title="Users" 
          active={activeTab === "users"} 
          onClick={() => setActiveTab("users")}
        />
        <AdminNavCard 
          icon={<Bike className="w-8 h-8" />} 
          title="Drivers" 
          active={activeTab === "drivers"} 
          onClick={() => setActiveTab("drivers")}
        />
        <AdminNavCard 
          icon={<History className="w-8 h-8" />} 
          title="Rides" 
          active={activeTab === "rides"} 
          onClick={() => setActiveTab("rides")}
        />
      </div>

      {/* Data Table / List */}
      <div className="glass-panel p-8 rounded-[2.5rem] min-h-[400px]">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-black uppercase tracking-widest italic">
            Manage {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
          </h3>
          <span className="bg-rapido-yellow text-black px-4 py-1.5 rounded-full text-[10px] font-black italic tracking-tighter">
            {data.length} {activeTab.toUpperCase()} FOUND
          </span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-slate-500 font-black uppercase tracking-widest animate-pulse">Loading {activeTab}...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {data.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <Search className="w-12 h-12 text-slate-800 mb-4" />
                <p className="text-slate-500 font-black uppercase tracking-widest">No {activeTab} found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-slate-500 italic">
                        {activeTab === "rides" ? "Route" : "Name"}
                      </th>
                      <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-slate-500 italic">
                        {activeTab === "rides" ? "User / Driver" : "Contact / Vehicle"}
                      </th>
                      <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-slate-500 italic">Identity</th>
                      <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-slate-500 italic text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {data.map((item) => (
                      <tr key={item.id} className="group hover:bg-white/[0.02] transition-colors">
                        <td className="py-6">
                          {activeTab === "rides" ? (
                            <div>
                              <p className="font-black text-white italic">{item.source} → {item.destination}</p>
                              <span className={cn(
                                "text-[8px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded-full border",
                                item.status === "completed" ? "border-emerald-500/50 text-emerald-400 bg-emerald-500/5" :
                                item.status === "assigned" ? "border-rapido-yellow/50 text-rapido-yellow bg-rapido-yellow/5" :
                                "border-slate-700 text-slate-500 bg-slate-800/50"
                              )}>
                                {item.status}
                              </span>
                            </div>
                          ) : (
                            <p className="font-black text-white italic text-lg">{item.name}</p>
                          )}
                        </td>
                        <td className="py-6">
                          {activeTab === "rides" ? (
                            <div>
                              <p className="text-[10px] text-white font-black uppercase tracking-widest italic">{item.user_name || "Guest"}</p>
                              <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest italic">
                                {item.driver_name ? `Driver: ${item.driver_name}` : "No Driver Assigned"}
                              </p>
                            </div>
                          ) : activeTab === "drivers" ? (
                            <div>
                              <p className="text-[10px] text-white font-black uppercase tracking-widest italic">{item.phone}</p>
                              <p className="text-[10px] text-rapido-yellow font-black uppercase tracking-widest italic">
                                {item.vehicle_no || "No Vehicle"}
                              </p>
                            </div>
                          ) : (
                            <p className="text-[10px] text-white font-black uppercase tracking-widest italic">{item.phone || item.email}</p>
                          )}
                        </td>
                        <td className="py-6">
                          <code className="text-[10px] bg-white/5 px-2 py-1 rounded text-slate-400 font-mono">{item.id.slice(0, 8)}</code>
                        </td>
                        <td className="py-6 text-right">
                          <div className="flex justify-end gap-2 transition-all">
                            <button 
                              onClick={() => handleEditClick(item)}
                              className="p-3 bg-rapido-yellow/10 text-rapido-yellow rounded-xl hover:bg-rapido-yellow/20 transition-all"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDelete(item.id)}
                              className="p-3 bg-rose-500/10 text-rose-500 rounded-xl hover:bg-rose-500/20 transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setEditingItem(null)} />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="glass-panel w-full max-w-lg p-8 rounded-[2.5rem] relative z-10 border border-white/10"
          >
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black uppercase tracking-widest italic">Edit {activeTab.slice(0, -1)}</h3>
              <button onClick={() => setEditingItem(null)} className="p-2 hover:bg-white/5 rounded-full text-slate-500">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              {activeTab !== "rides" ? (
                <>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 italic px-4">Name</label>
                    <input 
                      className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 font-bold text-white focus:border-rapido-yellow outline-none transition-all"
                      value={editData.name || ""}
                      onChange={(e) => setEditData({...editData, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 italic px-4">Phone</label>
                    <input 
                      className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 font-bold text-white focus:border-rapido-yellow outline-none transition-all"
                      value={editData.phone || ""}
                      onChange={(e) => setEditData({...editData, phone: e.target.value})}
                    />
                  </div>
                  {activeTab === "drivers" && (
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 italic px-4">Vehicle Number</label>
                      <input 
                        className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 font-bold text-white focus:border-rapido-yellow outline-none transition-all"
                        value={editData.vehicle_no || ""}
                        onChange={(e) => setEditData({...editData, vehicle_no: e.target.value})}
                      />
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 italic px-4">Source</label>
                    <input 
                      className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 font-bold text-white focus:border-rapido-yellow outline-none transition-all"
                      value={editData.source || ""}
                      onChange={(e) => setEditData({...editData, source: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 italic px-4">Destination</label>
                    <input 
                      className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 font-bold text-white focus:border-rapido-yellow outline-none transition-all"
                      value={editData.destination || ""}
                      onChange={(e) => setEditData({...editData, destination: e.target.value})}
                    />
                  </div>
                </>
              )}

              <div className="pt-4 flex gap-4">
                <button 
                  onClick={() => setEditingItem(null)}
                  className="flex-1 py-4 bg-white/5 text-slate-500 font-black rounded-2xl uppercase tracking-widest text-[10px] hover:bg-white/10"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleUpdate}
                  className="flex-1 py-4 bg-rapido-yellow text-black font-black rounded-2xl uppercase tracking-widest text-[10px] hover:bg-yellow-300 shadow-xl shadow-rapido-yellow/20"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

function AdminNavCard({ icon, title, active = false, onClick }: { icon: any, title: string, active?: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "w-full p-8 rounded-[2.5rem] transition-all relative overflow-hidden group glass-panel text-center",
        active ? "border-rapido-yellow bg-rapido-yellow/5 shadow-xl shadow-rapido-yellow/10 ring-1 ring-rapido-yellow/30" : "border-white/5 hover:bg-white/10"
      )}
    >
      <div className={cn("flex justify-center mb-4 transition-all group-hover:scale-110 duration-500", active ? "text-rapido-yellow" : "text-slate-700")}>
        {icon}
      </div>
      <h4 className="text-xl font-black uppercase tracking-tighter italic text-white">{title}</h4>
      {active && <div className="absolute top-4 right-4 w-3 h-3 bg-rapido-yellow rounded-full shadow-lg shadow-rapido-yellow/50" />}
    </button>
  );
}

function CategoryCard({ icon, title, active = false, onClick }: { icon: any, title: string, active?: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "w-full text-left p-6 rounded-[2rem] transition-all relative overflow-hidden group glass-panel",
        active ? "border-rapido-yellow bg-rapido-yellow/5 shadow-xl shadow-rapido-yellow/10 ring-1 ring-rapido-yellow/30" : "border-white/5 hover:bg-white/10"
      )}
    >
      <div className={cn("mb-6 transition-all group-hover:scale-110 duration-500 px-2", active ? "text-rapido-yellow" : "text-slate-700")}>
        {icon}
      </div>
      <h4 className="text-xl font-black mb-1 uppercase tracking-tighter italic text-white">{title}</h4>
      {active && <div className="absolute top-4 right-4 w-3 h-3 bg-rapido-yellow rounded-full shadow-lg shadow-rapido-yellow/50" />}
    </button>
  );
}

function StatCard({ title, value, delta, positive = true }: { title: string, value: string, delta: string, positive?: boolean }) {
  return (
    <div className="glass-panel p-8 rounded-[2rem]">
      <p className="text-slate-500 font-black text-[10px] uppercase tracking-widest mb-2 italic">{title}</p>
      <h2 className="text-3xl font-black mb-2 text-white italic tracking-tighter">{value}</h2>
      <span className={cn("text-[10px] font-black uppercase tracking-widest", positive ? "text-emerald-400" : "text-rose-400")}>{delta}</span>
    </div>
  );
}

function HealthItem({ label, status }: { label: string, status: "operational" | "issue" | "down" }) {
  const colors = {
    operational: "bg-emerald-500 shadow-emerald-500/20",
    issue: "bg-rapido-yellow shadow-rapido-yellow/20",
    down: "bg-rose-500 shadow-rose-500/20"
  };
  
  return (
    <div className="flex items-center justify-between">
      <span className="font-black text-[10px] uppercase tracking-widest text-slate-400 italic">{label}</span>
      <div className="flex items-center gap-3">
        <span className="text-[10px] font-black text-slate-600 uppercase tracking-tighter italic">{status}</span>
        <div className={cn("w-2 h-2 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.5)]", colors[status])} />
      </div>
    </div>
  );
}
