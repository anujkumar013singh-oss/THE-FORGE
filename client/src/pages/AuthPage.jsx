import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, ArrowLeft, Mail, Lock, User, Phone } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import API_BASE from "../lib/api.js";

function AuthInput({ icon: Icon, label, type, value, onChange, error, placeholder, ...props }) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";
  return (
    <div>
      <label className="font-body text-xs uppercase tracking-widest text-forge-dim mb-2 block">{label}</label>
      <div className={`flex items-center gap-3 bg-white/5 border-2 rounded-xl px-5 py-3.5 transition-colors ${error ? "border-forge-red" : "border-white/10 focus-within:border-forge-red"}`}>
        {Icon && <Icon size={18} className="text-forge-dim shrink-0" />}
        <input type={isPassword && show ? "text" : type} value={value} onChange={onChange} placeholder={placeholder}
          className="flex-1 bg-transparent font-body text-sm text-white placeholder:text-forge-dim/50 focus:outline-none" {...props} />
        {isPassword && (
          <button type="button" onClick={() => setShow(!show)} className="text-forge-dim hover:text-white transition-colors">
            {show ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error && <p className="font-body text-xs text-forge-red mt-1.5 ml-1">{error}</p>}
    </div>
  );
}

function OtpInput({ value, onChange, error }) {
  const inputsRef = useRef([]);
  const digits = value.split("").concat(Array(6 - value.length).fill(""));

  const handleChange = (idx, val) => {
    if (!/^\d*$/.test(val)) return;
    const newVal = value.slice(0, idx) + val.slice(-1) + value.slice(idx + 1);
    onChange({ target: { value: newVal.slice(0, 6) } });
    if (val && idx < 5) inputsRef.current[idx + 1]?.focus();
  };

  const handleKeyDown = (idx, e) => {
    if (e.key === "Backspace" && !value[idx] && idx > 0) {
      inputsRef.current[idx - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (paste) onChange({ target: { value: paste } });
  };

  return (
    <div>
      <label className="font-body text-xs uppercase tracking-widest text-forge-dim mb-3 block text-center">Enter OTP</label>
      <div className="flex gap-2 md:gap-3 justify-center" onPaste={handlePaste}>
        {digits.map((d, i) => (
          <input
            key={i}
            ref={el => inputsRef.current[i] = el}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={d}
            onChange={e => handleChange(i, e.target.value)}
            onKeyDown={e => handleKeyDown(i, e)}
            onFocus={e => e.target.select()}
            className={`w-10 h-12 md:w-12 md:h-14 text-center font-heading text-xl font-bold text-white bg-white/5 border-2 rounded-xl transition-all focus:outline-none focus:border-forge-red focus:ring-2 focus:ring-forge-red/20 ${error ? "border-forge-red" : "border-white/10"} ${d ? "border-forge-red/50 bg-forge-red/5" : ""}`}
          />
        ))}
      </div>
      {error && <p className="font-body text-xs text-forge-red mt-2 text-center">{error}</p>}
    </div>
  );
}

const signupSlides = [
  { url: "https://img.magnific.com/free-photo/attractive-fitness-couple-sporty-male-holds-barbell-slim-blond-female-holds-dumbbells-grey-background_613910-16001.jpg?semt=ais_hybrid&w=740&q=80", alt: "Couple training" },
  { url: "https://img.magnific.com/free-photo/young-woman-personal-trainer-with-dumbbell-squats-gym_496169-2692.jpg?semt=ais_hybrid&w=740&q=80", alt: "Trainer squatting" },
  { url: "https://img.magnific.com/premium-photo/hand-lifting-barbell-with-words-hands-lifting-barbell_1105043-152417.jpg?semt=ais_hybrid&w=740&q=80", alt: "Barbell lift" },
  { url: "https://img.magnific.com/free-photo/group-people-exercising-with-dumbbells-fitness-club-gym_613910-18611.jpg?semt=ais_hybrid&w=740&q=80", alt: "Group workout" }
];

const loginSlides = [
  { url: "https://media.istockphoto.com/id/479009182/photo/silhouette-of-a-strong-fighter.jpg?s=612x612&w=0&k=20&c=eqC_1o48WNIxNZIyJrHl8nDLmYC7RtSKq1lJVmDS9GU=", alt: "Fighter silhouette" },
  { url: "https://media.istockphoto.com/id/184440769/photo/gym-workout-for-back.jpg?s=612x612&w=0&k=20&c=22jk8g3HXgPlk1EfLutc1ZtQYle6CswXP35pz-OMMBc=", alt: "Back workout" },
  { url: "https://res.cloudinary.com/dhudpc4eu/image/upload/v1782970725/pixora-uploads/pixora-bg-1782970725175-xdteey.png", alt: "THE FORGE" }
];

export default function AuthPage() {
  const { login, signup, verifySignupOtp } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState("login");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [signupForm, setSignupForm] = useState({ name: "", phone: "", email: "", password: "", confirmPassword: "" });
  const [signupOtpStep, setSignupOtpStep] = useState(false);
  const [signupOtp, setSignupOtp] = useState("");

  const [forgotStep, setForgotStep] = useState(null);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotOtp, setForgotOtp] = useState("");
  const [forgotNewPass, setForgotNewPass] = useState("");
  const [forgotConfirm, setForgotConfirm] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const [message, setMessage] = useState("");

  const startResendTimer = () => {
    setResendTimer(60);
    const interval = setInterval(() => {
      setResendTimer(t => { if (t <= 1) { clearInterval(interval); return 0; } return t - 1; });
    }, 1000);
  };

  const validateLogin = () => {
    const e = {};
    if (!loginForm.email) e.email = "Email is required";
    if (!loginForm.password) e.password = "Password is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrors({});
    if (!validateLogin()) return;
    setLoading(true);
    try {
      const data = await login(loginForm.email, loginForm.password);
      navigate(data.user.role === "admin" ? "/admin" : "/dashboard");
    } catch (err) {
      setErrors({ general: err.message });
    } finally { setLoading(false); }
  };

  const validateSignup = () => {
    const e = {};
    if (!signupForm.name.trim()) e.name = "Name is required";
    if (!signupForm.phone.trim()) e.phone = "Phone is required";
    else if (!/^\d{10}$/.test(signupForm.phone)) e.phone = "Enter valid 10-digit number";
    if (!signupForm.email) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(signupForm.email)) e.email = "Invalid email";
    if (!signupForm.password) e.password = "Password is required";
    else if (signupForm.password.length < 8) e.password = "Password must be at least 8 characters";
    if (signupForm.password !== signupForm.confirmPassword) e.confirmPassword = "Passwords do not match";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setErrors({});
    if (!validateSignup()) return;
    if (!signupOtpStep) {
      setLoading(true);
      try {
        await signup(signupForm.name, signupForm.phone, signupForm.email, signupForm.password);
        setSignupOtpStep(true);
        startResendTimer();
        setMessage("OTP sent to your email");
      } catch (err) {
        setErrors({ general: err.message });
      } finally { setLoading(false); }
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setErrors({});
    if (!signupOtp) { setErrors({ otp: "Enter OTP" }); return; }
    setLoading(true);
    try {
      await verifySignupOtp(signupForm.email, signupOtp);
      navigate("/dashboard");
    } catch (err) {
      setErrors({ otp: err.message });
    } finally { setLoading(false); }
  };

  const handleForgotSendOtp = async (e) => {
    e.preventDefault();
    setErrors({});
    if (!forgotEmail) { setErrors({ forgotEmail: "Enter your email" }); return; }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/forgot-password`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setForgotStep("otp");
      startResendTimer();
      setMessage("OTP sent to your email");
    } catch (err) { setErrors({ forgotEmail: err.message }); }
    finally { setLoading(false); }
  };

  const handleVerifyResetOtp = async (e) => {
    e.preventDefault();
    setErrors({});
    if (!forgotOtp) { setErrors({ forgotOtp: "Enter OTP" }); return; }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/verify-reset-otp`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail, otp: forgotOtp })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setForgotStep("reset");
    } catch (err) { setErrors({ forgotOtp: err.message }); }
    finally { setLoading(false); }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setErrors({});
    if (forgotNewPass.length < 8) { setErrors({ forgotNewPass: "Min 8 characters" }); return; }
    if (forgotNewPass !== forgotConfirm) { setErrors({ forgotConfirm: "Passwords do not match" }); return; }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/reset-password`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail, otp: forgotOtp, password: forgotNewPass })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setMessage("Password reset successfully. Please login.");
      setForgotStep(null);
    } catch (err) { setErrors({ general: err.message }); }
    finally { setLoading(false); }
  };

  const resendOtp = async () => {
    if (resendTimer > 0) return;
    setLoading(true);
    try {
      const endpoint = forgotStep ? "/api/auth/forgot-password" : "/api/auth/signup";
      const body = forgotStep ? { email: forgotEmail } : { ...signupForm, password: undefined, confirmPassword: undefined };
      await fetch(`${API_BASE}${endpoint}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      startResendTimer();
      setMessage("OTP resent");
    } catch { }
    finally { setLoading(false); }
  };

  const currentSlides = mode === "signup" ? signupSlides : loginSlides;
  const [slideIdx, setSlideIdx] = useState(0);
  const slideIntervalRef = useRef(null);

  useEffect(() => {
    slideIntervalRef.current = setInterval(() => {
      setSlideIdx(p => (p + 1) % currentSlides.length);
    }, 4500);
    return () => clearInterval(slideIntervalRef.current);
  }, [currentSlides.length]);

  useEffect(() => {
    setSlideIdx(0);
  }, [mode]);

  return (
    <div className="min-h-screen bg-forge-black flex">
      <div className="hidden lg:block relative w-1/2 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-forge-black/90 via-forge-black/50 to-transparent z-10" />
        {currentSlides.map((s, i) => (
          <div key={i} className={`absolute inset-0 transition-opacity duration-700 ${i === slideIdx ? "opacity-100" : "opacity-0"}`}>
            <img src={s.url} alt={s.alt} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-forge-black/20" />
          </div>
        ))}
      </div>
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 md:px-12 py-10 md:py-16">
        <div className="w-full max-w-[460px]">
          <div className="glass rounded-2xl p-8 md:p-10 lg:p-12">
            <AnimatePresence mode="wait">
              {forgotStep ? (
                <motion.div key="forgot" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                  <button onClick={() => { setForgotStep(null); setMessage(""); }} className="text-forge-dim hover:text-white transition-colors mb-6 flex items-center gap-2">
                    <ArrowLeft size={16} /> Back
                  </button>
                  <h2 className="font-heading text-2xl md:text-3xl font-bold text-white mb-1">Reset Password</h2>
                  <p className="font-body text-forge-dim text-sm mb-8">
                    {forgotStep === "otp" ? "Enter the OTP sent to your email" : forgotStep === "reset" ? "Choose a new password" : "Enter your email to receive an OTP"}
                  </p>
                  {forgotStep === "email" && (
                    <form onSubmit={handleForgotSendOtp} className="space-y-5">
                      <AuthInput icon={Mail} label="Email" type="email" value={forgotEmail} onChange={e => setForgotEmail(e.target.value)} error={errors.forgotEmail} placeholder="your@email.com" />
                      <button type="submit" disabled={loading} className="w-full font-heading text-sm uppercase tracking-widest bg-forge-red text-white py-3.5 rounded-xl hover:opacity-90 transition-all disabled:opacity-50">
                        {loading ? "Sending..." : "Send OTP"}
                      </button>
                    </form>
                  )}
                  {forgotStep === "otp" && (
                    <form onSubmit={handleVerifyResetOtp} className="space-y-6">
                      <div className="text-center p-4 rounded-xl bg-white/[0.02] border border-white/5">
                        <p className="font-body text-sm text-forge-dim">OTP sent to</p>
                        <p className="font-heading text-sm font-bold text-white mt-0.5">{forgotEmail}</p>
                      </div>
                      <OtpInput value={forgotOtp} onChange={e => setForgotOtp(e.target.value)} error={errors.forgotOtp} />
                      <button type="submit" disabled={loading} className="w-full font-heading text-sm uppercase tracking-widest bg-forge-red text-white py-3.5 rounded-xl hover:opacity-90 transition-all disabled:opacity-50">
                        {loading ? "Verifying..." : "Verify OTP"}
                      </button>
                      <div className="text-center">
                        <button type="button" onClick={resendOtp} disabled={resendTimer > 0} className="font-body text-sm text-forge-dim hover:text-forge-red transition-colors disabled:opacity-50">
                          {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend OTP"}
                        </button>
                      </div>
                    </form>
                  )}
                  {forgotStep === "reset" && (
                    <form onSubmit={handleResetPassword} className="space-y-5">
                      <AuthInput icon={Lock} label="New Password" type="password" value={forgotNewPass} onChange={e => setForgotNewPass(e.target.value)} error={errors.forgotNewPass} placeholder="Min 8 characters" />
                      <AuthInput icon={Lock} label="Confirm Password" type="password" value={forgotConfirm} onChange={e => setForgotConfirm(e.target.value)} error={errors.forgotConfirm} placeholder="Re-enter password" />
                      <button type="submit" disabled={loading} className="w-full font-heading text-sm uppercase tracking-widest bg-forge-red text-white py-3.5 rounded-xl hover:opacity-90 transition-all disabled:opacity-50">
                        {loading ? "Resetting..." : "Reset Password"}
                      </button>
                    </form>
                  )}
                  {errors.general && <p className="font-body text-xs text-forge-red mt-4 text-center">{errors.general}</p>}
                  {message && <p className="font-body text-xs text-green-500 mt-4 text-center">{message}</p>}
                </motion.div>
              ) : (
                <motion.div key={mode} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                  <div className="text-center mb-10">
                    <h1 className="font-heading text-3xl md:text-4xl font-bold text-white mb-2">THE <span className="text-forge-red">FORGE</span></h1>
                    <div className="w-12 h-0.5 bg-forge-red mx-auto mb-3" />
                    <p className="font-body text-forge-dim text-sm">{mode === "login" ? "Welcome back, warrior. Ready to lift?" : "Begin your transformation today."}</p>
                  </div>
                  {mode === "login" ? (
                    <form onSubmit={handleLogin} className="space-y-5">
                      <AuthInput icon={Mail} label="Email" type="email" value={loginForm.email} onChange={e => setLoginForm({ ...loginForm, email: e.target.value })} error={errors.email} placeholder="your@email.com" />
                      <AuthInput icon={Lock} label="Password" type="password" value={loginForm.password} onChange={e => setLoginForm({ ...loginForm, password: e.target.value })} error={errors.password} placeholder="••••••••" />
                      <div className="flex justify-end">
                        <button type="button" onClick={() => { setForgotStep("email"); setMessage(""); }} className="font-body text-xs text-forge-dim hover:text-forge-red transition-colors">Forgot Password?</button>
                      </div>
                      {errors.general && <p className="font-body text-xs text-forge-red">{errors.general}</p>}
                      <button type="submit" disabled={loading} className="w-full font-heading text-sm uppercase tracking-widest bg-forge-red text-white py-3.5 rounded-xl hover:opacity-90 transition-all disabled:opacity-50">
                        {loading ? "Logging in..." : "Login"}
                      </button>
                    </form>
                  ) : !signupOtpStep ? (
                    <form onSubmit={handleSignup} className="space-y-5">
                      <AuthInput icon={User} label="Full Name" type="text" value={signupForm.name} onChange={e => setSignupForm({ ...signupForm, name: e.target.value })} error={errors.name} placeholder="John Doe" />
                      <AuthInput icon={Phone} label="Phone Number" type="tel" value={signupForm.phone} onChange={e => setSignupForm({ ...signupForm, phone: e.target.value })} error={errors.phone} placeholder="9654673316" maxLength={10} />
                      <AuthInput icon={Mail} label="Email" type="email" value={signupForm.email} onChange={e => setSignupForm({ ...signupForm, email: e.target.value })} error={errors.email} placeholder="your@email.com" />
                      <AuthInput icon={Lock} label="Password" type="password" value={signupForm.password} onChange={e => setSignupForm({ ...signupForm, password: e.target.value })} error={errors.password} placeholder="Min 8 characters" />
                      <AuthInput icon={Lock} label="Confirm Password" type="password" value={signupForm.confirmPassword} onChange={e => setSignupForm({ ...signupForm, confirmPassword: e.target.value })} error={errors.confirmPassword} placeholder="Re-enter password" />
                      {errors.general && <p className="font-body text-xs text-forge-red">{errors.general}</p>}
                      <button type="submit" disabled={loading} className="w-full font-heading text-sm uppercase tracking-widest bg-forge-red text-white py-3.5 rounded-xl hover:opacity-90 transition-all disabled:opacity-50">
                        {loading ? "Creating account..." : "Create Account"}
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handleVerifyOtp} className="space-y-6">
                      <div className="text-center p-5 rounded-xl bg-white/[0.02] border border-white/5">
                        <div className="w-12 h-12 rounded-full bg-forge-red/10 flex items-center justify-center mx-auto mb-3">
                          <Mail size={20} className="text-forge-red" />
                        </div>
                        <p className="font-body text-sm text-forge-dim">OTP sent to</p>
                        <p className="font-heading text-sm font-bold text-white mt-0.5">{signupForm.email}</p>
                      </div>
                      <OtpInput value={signupOtp} onChange={e => setSignupOtp(e.target.value)} error={errors.otp} />
                      <button type="submit" disabled={loading} className="w-full font-heading text-sm uppercase tracking-widest bg-forge-red text-white py-3.5 rounded-xl hover:opacity-90 transition-all disabled:opacity-50">
                        {loading ? "Verifying..." : "Verify & Continue"}
                      </button>
                      <div className="text-center">
                        <button type="button" onClick={resendOtp} disabled={resendTimer > 0} className="font-body text-sm text-forge-dim hover:text-forge-red transition-colors disabled:opacity-50">
                          {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend OTP"}
                        </button>
                      </div>
                      {message && <p className="font-body text-xs text-green-500 text-center">{message}</p>}
                    </form>
                  )}
                  <div className="mt-8 text-center">
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5" /></div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-forge-black px-4 text-forge-dim font-body tracking-wider">
                          {mode === "login" ? "New here?" : "Returning?"}
                        </span>
                      </div>
                    </div>
                    <button onClick={() => { setMode(mode === "login" ? "signup" : "login"); setErrors({}); setSignupOtpStep(false); setMessage(""); }}
                      className="mt-4 font-heading text-sm uppercase tracking-widest text-forge-red hover:text-white border-2 border-forge-red px-8 py-3 rounded-xl hover:bg-forge-red transition-all w-full">
                      {mode === "login" ? "Sign Up" : "Login"}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
