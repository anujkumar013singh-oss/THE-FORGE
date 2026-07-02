import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext.jsx";
import API_BASE from "../lib/api.js";
import { plans } from "../data/offers.js";
import QRModal from "../components/QRModal.jsx";
import testimonials from "../data/testimonials.js";
import { LayoutDashboard, Receipt, Dumbbell, Tags, LogOut, User, MessageSquare } from "lucide-react";

const tabs = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "membership", label: "Membership", icon: Dumbbell },
  { id: "billing", label: "Billing", icon: Receipt },
  { id: "reviews", label: "Reviews", icon: MessageSquare },
  { id: "offers", label: "Offers", icon: Tags },
];

export default function UserDashboard() {
  const { user, logout, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [qrPlan, setQrPlan] = useState(null);

  useEffect(() => {
    refreshUser();
    fetch(`${API_BASE}/api/user/payments`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
      .then(res => res.json())
      .then(data => setPayments(data.payments || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const statusBadge = () => {
    if (!user?.expiryDate) return { label: "N/A", cls: "text-forge-dim" };
    const now = new Date();
    const expiry = new Date(user.expiryDate);
    const diff = (expiry - now) / (1000 * 60 * 60 * 24);
    if (diff < 0) return { label: "Expired", cls: "text-forge-red" };
    if (diff <= 3) return { label: "Expiring Soon", cls: "text-yellow-500" };
    return { label: "Active", cls: "text-green-500" };
  };

  const badge = statusBadge();

  return (
    <div className="min-h-screen bg-forge-black flex">
      <aside className="hidden lg:flex w-64 flex-col bg-[#0A0A0A] border-r border-white/5 p-6">
        <div className="mb-8">
          <h1 className="font-heading text-xl font-bold text-white">THE <span className="text-forge-red">FORGE</span></h1>
          <p className="font-body text-xs text-forge-dim mt-1">Member Dashboard</p>
        </div>
        <nav className="flex-1 space-y-1">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 font-heading text-sm uppercase tracking-widest px-4 py-3 rounded-lg transition-all ${activeTab === tab.id ? "bg-forge-red/10 text-forge-red border border-forge-red/20" : "text-forge-dim hover:text-white hover:bg-white/5"}`}>
              <tab.icon size={16} /> {tab.label}
            </button>
          ))}
        </nav>
        <div className="pt-6 border-t border-white/5 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-forge-red/20 flex items-center justify-center">
              <User size={14} className="text-forge-red" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-heading text-sm text-white truncate">{user?.name}</p>
              <p className="font-body text-xs text-forge-dim truncate">{user?.email}</p>
            </div>
          </div>
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 font-heading text-xs uppercase tracking-widest text-forge-dim hover:text-forge-red transition-colors px-4 py-2">
            <LogOut size={14} /> Logout
          </button>
        </div>
      </aside>
      <div className="flex-1 p-6 lg:p-10 overflow-y-auto">
        <div className="flex lg:hidden items-center justify-between mb-8">
          <h1 className="font-heading text-lg font-bold text-white">THE <span className="text-forge-red">FORGE</span></h1>
          <button onClick={handleLogout} className="text-forge-dim hover:text-forge-red transition-colors"><LogOut size={20} /></button>
        </div>
        <div className="flex lg:hidden gap-2 mb-6 overflow-x-auto pb-2">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`shrink-0 font-heading text-xs uppercase tracking-widest px-4 py-2 rounded-lg transition-all ${activeTab === tab.id ? "bg-forge-red text-white" : "bg-white/5 text-forge-dim"}`}>
              {tab.label}
            </button>
          ))}
        </div>
        <AnimatedTab active={activeTab === "overview"}>
          <h2 className="font-heading text-2xl font-bold text-white mb-6">Welcome back, {user?.name?.split(" ")[0]}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white/5 rounded-xl p-6 border border-white/5">
              <p className="font-body text-xs text-forge-dim uppercase tracking-widest">Status</p>
              <p className={`font-heading text-xl font-bold mt-1 ${badge.cls}`}>{badge.label}</p>
            </div>
            <div className="bg-white/5 rounded-xl p-6 border border-white/5">
              <p className="font-body text-xs text-forge-dim uppercase tracking-widest">Member Since</p>
              <p className="font-heading text-xl font-bold mt-1 text-white">
                {user?.joiningDate ? new Date(user.joiningDate).toLocaleDateString() : "N/A"}
              </p>
            </div>
            <div className="bg-white/5 rounded-xl p-6 border border-white/5">
              <p className="font-body text-xs text-forge-dim uppercase tracking-widest">Expiry</p>
              <p className="font-heading text-xl font-bold mt-1 text-white">
                {user?.expiryDate ? new Date(user.expiryDate).toLocaleDateString() : "N/A"}
              </p>
            </div>
          </div>
          <div className="bg-white/5 rounded-xl p-6 border border-white/5">
            <h3 className="font-heading text-lg font-bold text-white mb-3">Profile</h3>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="font-body text-sm text-forge-dim">Name</span>
                <span className="font-body text-sm text-white">{user?.name || "N/A"}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="font-body text-sm text-forge-dim">Email</span>
                <span className="font-body text-sm text-white">{user?.email || "N/A"}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="font-body text-sm text-forge-dim">Phone</span>
                <span className="font-body text-sm text-white">{user?.phone || "N/A"}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="font-body text-sm text-forge-dim">Duration</span>
                <span className="font-body text-sm text-white">{user?.duration || "N/A"}</span>
              </div>
            </div>
          </div>
        </AnimatedTab>
        <AnimatedTab active={activeTab === "membership"}>
          <h2 className="font-heading text-2xl font-bold text-white mb-6">Membership Details</h2>
          <div className="bg-white/5 rounded-xl p-6 border border-white/5">
            <div className="space-y-4">
              <div className="flex justify-between py-3 border-b border-white/5">
                <span className="font-body text-sm text-forge-dim">Plan Duration</span>
                <span className="font-heading text-sm text-white">{user?.duration || "N/A"}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-white/5">
                <span className="font-body text-sm text-forge-dim">Joining Date</span>
                <span className="font-heading text-sm text-white">{user?.joiningDate ? new Date(user.joiningDate).toLocaleDateString() : "N/A"}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-white/5">
                <span className="font-body text-sm text-forge-dim">Expiry Date</span>
                <span className="font-heading text-sm text-white">{user?.expiryDate ? new Date(user.expiryDate).toLocaleDateString() : "N/A"}</span>
              </div>
              <div className="flex justify-between py-3">
                <span className="font-body text-sm text-forge-dim">Status</span>
                <span className={`font-heading text-sm font-bold ${badge.cls}`}>{badge.label}</span>
              </div>
            </div>
          </div>
        </AnimatedTab>
        <AnimatedTab active={activeTab === "billing"}>
          <h2 className="font-heading text-2xl font-bold text-white mb-6">Payment History</h2>
          {loading ? (
            <div className="text-center py-12"><div className="w-6 h-6 border-2 border-forge-red border-t-transparent rounded-full animate-spin mx-auto" /></div>
          ) : payments.length === 0 ? (
            <p className="font-body text-forge-dim text-sm">No payments recorded yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="font-heading text-xs uppercase tracking-widest text-forge-dim pb-3 pr-4">Date</th>
                    <th className="font-heading text-xs uppercase tracking-widest text-forge-dim pb-3 pr-4">Plan</th>
                    <th className="font-heading text-xs uppercase tracking-widest text-forge-dim pb-3 pr-4">Amount</th>
                    <th className="font-heading text-xs uppercase tracking-widest text-forge-dim pb-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((p, i) => (
                    <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="font-body text-sm text-white py-3 pr-4">{new Date(p.date).toLocaleDateString()}</td>
                      <td className="font-body text-sm text-forge-muted py-3 pr-4">{p.plan}</td>
                      <td className="font-body text-sm text-white py-3 pr-4">₹{p.amount?.toLocaleString()}</td>
                      <td className="font-body text-sm py-3">
                        <span className={p.status === "completed" ? "text-green-500" : "text-yellow-500"}>{p.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </AnimatedTab>
        <AnimatedTab active={activeTab === "reviews"}>
          <h2 className="font-heading text-2xl font-bold text-white mb-6">What Members Say</h2>
          <p className="font-body text-forge-dim text-sm mb-8 max-w-lg">Real reviews from the Forge community.</p>
          <div className="flex justify-center gap-5 overflow-hidden max-h-[900px] -mx-6 px-6"
            style={{ maskImage: "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)", WebkitMaskImage: "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)" }}>
            <TestimonialColumn testimonials={testimonials.slice(0, 3)} duration={12} className="w-full max-w-sm" />
            <TestimonialColumn testimonials={testimonials.slice(3, 6)} duration={16} className="hidden md:block w-full max-w-sm" />
            <TestimonialColumn testimonials={testimonials.slice(6, 9)} duration={14} className="hidden lg:block w-full max-w-sm" />
          </div>
        </AnimatedTab>
        <AnimatedTab active={activeTab === "offers"}>
          <h2 className="font-heading text-2xl font-bold text-white mb-6">Plans & Offers</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {plans.map(plan => (
              <div key={plan.id} className={`rounded-xl p-6 border flex flex-col ${plan.popular ? "border-forge-red bg-forge-red/5" : "border-white/10 bg-white/5"}`}>
                <h3 className="font-heading text-lg font-bold text-white">
                  {plan.name}
                  {plan.popular && <span className="ml-2 font-body text-xs text-forge-red">(Popular)</span>}
                </h3>
                <p className="font-body text-forge-dim text-sm mt-1">{plan.gymTime} · {plan.tagline}</p>
                <div className="mt-4 space-y-2 flex-1">
                  {plan.features.slice(0, 5).map(f => (
                    <div key={f} className="flex items-center gap-2 text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-forge-red shrink-0" />
                      <span className="font-body text-forge-muted">{f}</span>
                    </div>
                  ))}
                </div>
                <button onClick={() => setQrPlan(plan)}
                  className="mt-5 w-full font-heading text-xs uppercase tracking-widest bg-forge-red text-white py-3 rounded-lg hover:opacity-90 transition-all">
                  Pay ₹{plan.price?.toLocaleString()} →
                </button>
              </div>
            ))}
          </div>
        </AnimatedTab>
      </div>
      {qrPlan && (
        <QRModal
          plan={qrPlan}
          duration={qrPlan.gymTime}
          amount={qrPlan.price}
          onClose={() => setQrPlan(null)}
        />
      )}
    </div>
  );
}

function TestimonialColumn({ testimonials, duration, className }) {
  const duplicated = [...testimonials, ...testimonials, ...testimonials];
  return (
    <div className={className}>
      <motion.div
        animate={{ translateY: "-50%" }}
        transition={{ duration: duration || 15, repeat: Infinity, ease: "linear", repeatType: "loop" }}
        className="flex flex-col gap-5 pb-5"
      >
        {duplicated.map((t, i) => (
          <div key={`${t.name}-${i}`} className="glass rounded-xl p-5 md:p-6 w-full border border-white/5">
            <p className="font-body text-forge-muted text-sm leading-relaxed">"{t.text}"</p>
            <div className="flex items-center gap-3 mt-4">
              <img src={t.image} alt={t.name} className="w-10 h-10 rounded-full object-cover border border-forge-red/20" />
              <div>
                <p className="font-heading text-sm text-white font-semibold">{t.name}</p>
                <p className="font-body text-xs text-forge-dim">{t.role}</p>
              </div>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

function AnimatedTab({ active, children }) {
  if (!active) return null;
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
      {children}
    </motion.div>
  );
}
