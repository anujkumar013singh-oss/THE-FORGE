import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext.jsx";
import API_BASE from "../lib/api.js";
import { Users, Receipt, AlertTriangle, LogOut, User, Search, Phone } from "lucide-react";

const tabs = [
  { id: "clients", label: "Clients", icon: Users },
  { id: "payments", label: "Recent Payments", icon: Receipt },
  { id: "expiring", label: "Expiring Soon", icon: AlertTriangle },
];

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("clients");
  const [clients, setClients] = useState([]);
  const [payments, setPayments] = useState([]);
  const [expiring, setExpiring] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingClient, setEditingClient] = useState(null);
  const [editForm, setEditForm] = useState({ joiningDate: "", expiryDate: "", duration: "" });
  const [newPayment, setNewPayment] = useState({ amount: "", plan: "", date: "", status: "completed" });
  const [msg, setMsg] = useState("");

  const token = () => localStorage.getItem("token");

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [c, p, e] = await Promise.all([
        fetch(`${API_BASE}/api/admin/clients`, { headers: { Authorization: `Bearer ${token()}` } }).then(r => r.json()),
        fetch(`${API_BASE}/api/admin/payments/recent`, { headers: { Authorization: `Bearer ${token()}` } }).then(r => r.json()),
        fetch(`${API_BASE}/api/admin/expiring`, { headers: { Authorization: `Bearer ${token()}` } }).then(r => r.json()),
      ]);
      setClients(c.clients || []);
      setPayments(p.payments || []);
      setExpiring(e.clients || []);
    } catch { }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, []);

  const handleLogout = () => { logout(); navigate("/"); };

  const openEdit = (client) => {
    setEditingClient(client._id);
    setEditForm({
      joiningDate: client.joiningDate?.split("T")[0] || "",
      expiryDate: client.expiryDate?.split("T")[0] || "",
      duration: client.duration || ""
    });
    setNewPayment({ amount: "", plan: "", date: "", status: "completed" });
    setMsg("");
  };

  const saveMembership = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/admin/clients/${editingClient}/membership`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token()}` },
        body: JSON.stringify(editForm)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setEditingClient(null);
      setMsg("");
      fetchAll();
    } catch (err) { setMsg(err.message); }
  };

  const addPayment = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/admin/clients/${editingClient}/payments`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token()}` },
        body: JSON.stringify(newPayment)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setNewPayment({ amount: "", plan: "", date: "", status: "completed" });
      setMsg("Payment added");
      fetchAll();
    } catch (err) { setMsg(err.message); }
  };

  const filteredClients = clients.filter(c =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase()) ||
    c.phone?.includes(search)
  );

  const statusInfo = (expiryDate) => {
    if (!expiryDate) return { label: "N/A", cls: "text-forge-dim" };
    const diff = (new Date(expiryDate) - new Date()) / (1000 * 60 * 60 * 24);
    if (diff < 0) return { label: "Expired", cls: "text-forge-red" };
    if (diff <= 3) return { label: "Expiring", cls: "text-yellow-500" };
    return { label: "Active", cls: "text-green-500" };
  };

  return (
    <div className="min-h-screen bg-forge-black flex">
      <aside className="hidden lg:flex w-64 flex-col bg-[#0A0A0A] border-r border-white/5 p-6">
        <div className="mb-8">
          <h1 className="font-heading text-xl font-bold text-white">THE <span className="text-forge-red">FORGE</span></h1>
          <p className="font-body text-xs text-forge-dim mt-1">Admin Panel</p>
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
              <p className="font-body text-xs text-forge-dim truncate">Admin</p>
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
          <button onClick={handleLogout} className="text-forge-dim hover:text-forge-red"><LogOut size={20} /></button>
        </div>
        <div className="flex lg:hidden gap-2 mb-6 overflow-x-auto pb-2">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`shrink-0 font-heading text-xs uppercase tracking-widest px-4 py-2 rounded-lg transition-all ${activeTab === tab.id ? "bg-forge-red text-white" : "bg-white/5 text-forge-dim"}`}>
              {tab.label}
            </button>
          ))}
        </div>
        {activeTab === "clients" && (
          <AnimatedTab>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading text-2xl font-bold text-white">All Clients</h2>
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-forge-dim" />
                <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..."
                  className="bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2 font-body text-sm text-white placeholder:text-forge-dim focus:outline-none focus:border-forge-red w-64" />
              </div>
            </div>
            {loading ? (
              <div className="text-center py-12"><div className="w-6 h-6 border-2 border-forge-red border-t-transparent rounded-full animate-spin mx-auto" /></div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="font-heading text-xs uppercase tracking-widest text-forge-dim pb-3 pr-3">Name</th>
                      <th className="font-heading text-xs uppercase tracking-widest text-forge-dim pb-3 pr-3">Email</th>
                      <th className="font-heading text-xs uppercase tracking-widest text-forge-dim pb-3 pr-3">Phone</th>
                      <th className="font-heading text-xs uppercase tracking-widest text-forge-dim pb-3 pr-3">Joining</th>
                      <th className="font-heading text-xs uppercase tracking-widest text-forge-dim pb-3 pr-3">Expiry</th>
                      <th className="font-heading text-xs uppercase tracking-widest text-forge-dim pb-3 pr-3">Duration</th>
                      <th className="font-heading text-xs uppercase tracking-widest text-forge-dim pb-3">Status</th>
                      <th className="font-heading text-xs uppercase tracking-widest text-forge-dim pb-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredClients.map(c => {
                      const s = statusInfo(c.expiryDate);
                      return (
                        <tr key={c._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                          <td className="font-body text-sm text-white py-3 pr-3">{c.name}</td>
                          <td className="font-body text-sm text-forge-muted py-3 pr-3">{c.email}</td>
                          <td className="font-body text-sm text-forge-muted py-3 pr-3">{c.phone}</td>
                          <td className="font-body text-sm text-forge-muted py-3 pr-3">{c.joiningDate ? new Date(c.joiningDate).toLocaleDateString() : "—"}</td>
                          <td className="font-body text-sm text-forge-muted py-3 pr-3">{c.expiryDate ? new Date(c.expiryDate).toLocaleDateString() : "—"}</td>
                          <td className="font-body text-sm text-forge-muted py-3 pr-3">{c.duration || "—"}</td>
                          <td className={`font-body text-sm py-3 pr-3 font-medium ${s.cls}`}>{s.label}</td>
                          <td className="py-3"><button onClick={() => openEdit(c)} className="font-heading text-xs uppercase tracking-widest text-forge-red hover:underline">Edit</button></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
            {editingClient && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
                <div className="glass rounded-xl p-8 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
                  <h3 className="font-heading text-xl text-white mb-6">Edit Membership</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="font-body text-xs uppercase tracking-widest text-forge-dim block mb-1">Joining Date</label>
                      <input type="date" value={editForm.joiningDate} onChange={e => setEditForm({ ...editForm, joiningDate: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 font-body text-sm text-white focus:outline-none focus:border-forge-red" />
                    </div>
                    <div>
                      <label className="font-body text-xs uppercase tracking-widest text-forge-dim block mb-1">Expiry Date</label>
                      <input type="date" value={editForm.expiryDate} onChange={e => setEditForm({ ...editForm, expiryDate: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 font-body text-sm text-white focus:outline-none focus:border-forge-red" />
                    </div>
                    <div>
                      <label className="font-body text-xs uppercase tracking-widest text-forge-dim block mb-1">Duration</label>
                        <select value={editForm.duration} onChange={e => setEditForm({ ...editForm, duration: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 font-body text-sm text-white focus:outline-none focus:border-forge-red">
                          <option value="">Select Duration</option>
                          {[...Array(12)].map((_, i) => (
                            <option key={i + 1} value={`${i + 1} Month${i > 0 ? "s" : ""}`}>{i + 1} Month{i > 0 ? "s" : ""}</option>
                          ))}
                        </select>
                    </div>
                    <div className="pt-4 border-t border-white/10">
                      <h4 className="font-heading text-sm text-white mb-3">Add Payment Record</h4>
                      <div className="space-y-3">
                        <input type="number" placeholder="Amount" value={newPayment.amount} onChange={e => setNewPayment({ ...newPayment, amount: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 font-body text-sm text-white placeholder:text-forge-dim focus:outline-none focus:border-forge-red" />
                        <input type="text" placeholder="Plan (e.g. Pro - 1 Month)" value={newPayment.plan} onChange={e => setNewPayment({ ...newPayment, plan: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 font-body text-sm text-white placeholder:text-forge-dim focus:outline-none focus:border-forge-red" />
                        <input type="date" value={newPayment.date} onChange={e => setNewPayment({ ...newPayment, date: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 font-body text-sm text-white focus:outline-none focus:border-forge-red" />
                        <button onClick={addPayment}
                          className="font-heading text-xs uppercase tracking-widest bg-forge-red/80 text-white px-4 py-2 rounded hover:bg-forge-red transition-colors">
                          Add Payment
                        </button>
                      </div>
                    </div>
                    {msg && <p className="font-body text-xs text-green-500">{msg}</p>}
                    <div className="flex gap-3 pt-4">
                      <button onClick={saveMembership}
                        className="flex-1 font-heading text-xs uppercase tracking-widest bg-forge-red text-white py-3 rounded hover:opacity-90 transition-all">
                        Save Changes
                      </button>
                      <button onClick={() => setEditingClient(null)}
                        className="flex-1 font-heading text-xs uppercase tracking-widest border border-white/20 text-white py-3 rounded hover:border-forge-red transition-all">
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </AnimatedTab>
        )}
        {activeTab === "payments" && (
          <AnimatedTab>
            <h2 className="font-heading text-2xl font-bold text-white mb-6">Recent Payments</h2>
            {loading ? (
              <div className="text-center py-12"><div className="w-6 h-6 border-2 border-forge-red border-t-transparent rounded-full animate-spin mx-auto" /></div>
            ) : payments.length === 0 ? (
              <p className="font-body text-forge-dim text-sm">No payments recorded.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="font-heading text-xs uppercase tracking-widest text-forge-dim pb-3 pr-4">Member</th>
                      <th className="font-heading text-xs uppercase tracking-widest text-forge-dim pb-3 pr-4">Plan</th>
                      <th className="font-heading text-xs uppercase tracking-widest text-forge-dim pb-3 pr-4">Amount</th>
                      <th className="font-heading text-xs uppercase tracking-widest text-forge-dim pb-3 pr-4">Date</th>
                      <th className="font-heading text-xs uppercase tracking-widest text-forge-dim pb-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((p, i) => (
                      <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="font-body text-sm text-white py-3 pr-4">{p.userId?.name || "—"}</td>
                        <td className="font-body text-sm text-forge-muted py-3 pr-4">{p.plan}</td>
                        <td className="font-body text-sm text-white py-3 pr-4">₹{p.amount?.toLocaleString()}</td>
                        <td className="font-body text-sm text-forge-muted py-3 pr-4">{new Date(p.date).toLocaleDateString()}</td>
                        <td className="font-body text-sm py-3"><span className={p.status === "completed" ? "text-green-500" : "text-yellow-500"}>{p.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </AnimatedTab>
        )}
        {activeTab === "expiring" && (
          <AnimatedTab>
            <h2 className="font-heading text-2xl font-bold text-white mb-2">Expiring Soon</h2>
            <p className="font-body text-sm text-forge-dim mb-6">Members expiring within 3 days or already expired.</p>
            {loading ? (
              <div className="text-center py-12"><div className="w-6 h-6 border-2 border-forge-red border-t-transparent rounded-full animate-spin mx-auto" /></div>
            ) : expiring.length === 0 ? (
              <p className="font-body text-forge-dim text-sm">No members expiring soon.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="font-heading text-xs uppercase tracking-widest text-forge-dim pb-3 pr-4">Name</th>
                      <th className="font-heading text-xs uppercase tracking-widest text-forge-dim pb-3 pr-4">Phone</th>
                      <th className="font-heading text-xs uppercase tracking-widest text-forge-dim pb-3 pr-4">Email</th>
                      <th className="font-heading text-xs uppercase tracking-widest text-forge-dim pb-3 pr-4">Expiry</th>
                      <th className="font-heading text-xs uppercase tracking-widest text-forge-dim pb-3">Contact</th>
                    </tr>
                  </thead>
                  <tbody>
                    {expiring.map(c => (
                      <tr key={c._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="font-body text-sm text-white py-3 pr-4">{c.name}</td>
                        <td className="font-body text-sm text-forge-muted py-3 pr-4">{c.phone}</td>
                        <td className="font-body text-sm text-forge-muted py-3 pr-4">{c.email}</td>
                        <td className="font-body text-sm text-forge-red py-3 pr-4 font-medium">
                          {c.expiryDate ? new Date(c.expiryDate).toLocaleDateString() : "—"}
                        </td>
                        <td className="py-3">
                          <a href={`tel:${c.phone}`} className="inline-flex items-center gap-1 text-forge-red hover:underline font-body text-sm">
                            <Phone size={14} /> Call
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </AnimatedTab>
        )}
      </div>
    </div>
  );
}

function AnimatedTab({ children }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
      {children}
    </motion.div>
  );
}
