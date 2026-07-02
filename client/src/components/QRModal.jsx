import { X } from "lucide-react";
import QRCode from "react-qr-code";

export default function QRModal({ plan, duration, amount, onClose }) {
  const upiId = import.meta.env.VITE_UPI_ID || "9205084827@mbk";
  const upiLink = `upi://pay?pa=${upiId}&pn=THE%20FORGE&am=${amount}&cu=INR&tn=${plan.name}%20${duration}%20Membership`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="glass rounded-xl p-8 max-w-sm w-full mx-4" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-heading text-xl text-white">Complete Payment</h3>
          <button onClick={onClose} className="text-forge-muted hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="text-center">
          <p className="font-heading text-lg text-white mb-1">{plan.name} — {duration}</p>
          <p className="font-heading text-3xl font-bold text-forge-red mb-6">₹{amount.toLocaleString()}</p>
          <div className="inline-block p-3 bg-white rounded-xl mb-4">
            <QRCode value={upiLink} size={200} />
          </div>
          <p className="font-body text-xs text-forge-dim mb-1">Scan with any UPI app</p>
          <p className="font-body text-xs text-forge-dim">
            Or pay to: <span className="text-forge-red font-medium">{upiId}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
