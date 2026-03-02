import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, UserPlus, CalendarDays, CheckCircle, XCircle } from 'lucide-react';
import { registerAPICall } from '../services/AuthService';
import { useTheme } from '../App';

const FIELDS = [
  { key: 'name',     label: 'Full Name',     placeholder: 'John Doe',              type: 'text',     half: true },
  { key: 'username', label: 'Username',       placeholder: 'johndoe',               type: 'text',     half: true },
  { key: 'email',    label: 'Email Address',  placeholder: 'john@example.com',      type: 'email',    half: false },
  { key: 'post',     label: 'Job Title',      placeholder: 'Software Engineer',     type: 'text',     half: true },
  { key: 'team',     label: 'Team',           placeholder: 'Engineering',           type: 'text',     half: true },
];

const Register = () => {
  const [form, setForm] = useState({ name: '', username: '', email: '', password: '', post: '', team: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const { theme } = useTheme();
  const navigate = useNavigate();
  const isDark = theme === 'dark';

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, username, email, password, post, team } = form;
    if (!name || !username || !email || !password || !post || !team) {
      showToast('error', 'Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      await registerAPICall(form);
      showToast('success', 'Account created! Redirecting…');
      setTimeout(() => navigate('/login'), 1500);
    } catch {
      showToast('error', 'Registration failed. Please try again.');
    }
    setLoading(false);
  };

  const inputBase =
    "w-full px-4 py-3 bg-transparent text-sm outline-none " +
    (isDark ? 'text-white placeholder-slate-500' : 'text-slate-900 placeholder-slate-400');

  const wrapBase = (val) =>
    "relative rounded-xl border transition-all duration-200 " +
    (isDark
      ? 'bg-white/5 border-white/10 hover:border-blue-500/50 focus-within:border-blue-500/70'
      : 'bg-slate-50 border-slate-200 hover:border-blue-400 focus-within:border-blue-500 focus-within:bg-white');

  const underline = (val) =>
    "absolute bottom-0 left-0 h-[2px] rounded-full transition-all duration-300 " +
    (val ? 'w-full bg-gradient-to-r from-blue-500 to-cyan-500' : 'w-0');

  return (
    <div className={"relative min-h-screen flex items-center justify-center p-4 py-10 overflow-hidden " + (isDark ? 'bg-slate-950' : 'bg-slate-50')}>

      {/* Grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-60 pointer-events-none" />

      {/* Orbs */}
      <div className={"aurora-orb absolute -top-20 -right-20 w-96 h-96 rounded-full blur-3xl pointer-events-none " + (isDark ? 'bg-blue-600/20' : 'bg-blue-400/25')} />
      <div className={"aurora-orb-2 absolute -bottom-20 -left-20 w-96 h-96 rounded-full blur-3xl pointer-events-none " + (isDark ? 'bg-cyan-600/15' : 'bg-cyan-400/20')} />

      <motion.div className="relative w-full max-w-lg z-10"
        initial={{ opacity: 0, y: 32, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>

        <div className={"relative rounded-3xl p-[1.5px] " + (isDark
          ? 'bg-gradient-to-br from-blue-500/60 via-cyan-500/40 to-violet-500/60'
          : 'bg-gradient-to-br from-blue-400/50 via-cyan-300/40 to-blue-400/50')}>

          <div className={"rounded-3xl px-8 py-10 " + (isDark ? 'bg-slate-900/95 backdrop-blur-xl' : 'bg-white/95 backdrop-blur-xl')}>

            {/* Header */}
            <div className="flex flex-col items-center mb-8">
              <motion.div className="relative w-16 h-16 mb-4"
                initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}>
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-xl shadow-blue-500/30 float-animate">
                  <CalendarDays size={32} className="text-white" />
                </div>
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-blue-500/30 to-cyan-500/30 blur-md -z-10" />
              </motion.div>
              <h1 className={"text-2xl font-bold " + (isDark ? 'text-white' : 'text-slate-900')}>Create Account</h1>
              <p className={"text-sm mt-1 " + (isDark ? 'text-slate-400' : 'text-slate-500')}>Join your team today</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Paired / full fields */}
              <div className="grid grid-cols-2 gap-4">
                {FIELDS.filter(f => f.half).map(({ key, label, placeholder, type }) => (
                  <div key={key} className="flex flex-col gap-1.5">
                    <label className={"text-xs font-semibold tracking-wide uppercase " + (isDark ? 'text-slate-400' : 'text-slate-500')}>{label}</label>
                    <div className={wrapBase(form[key])}>
                      <input type={type} value={form[key]} onChange={set(key)} placeholder={placeholder} className={inputBase} />
                      <div className={underline(form[key])} />
                    </div>
                  </div>
                ))}
              </div>

              {FIELDS.filter(f => !f.half).map(({ key, label, placeholder, type }) => (
                <div key={key} className="flex flex-col gap-1.5">
                  <label className={"text-xs font-semibold tracking-wide uppercase " + (isDark ? 'text-slate-400' : 'text-slate-500')}>{label}</label>
                  <div className={wrapBase(form[key])}>
                    <input type={type} value={form[key]} onChange={set(key)} placeholder={placeholder} className={inputBase} />
                    <div className={underline(form[key])} />
                  </div>
                </div>
              ))}

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <label className={"text-xs font-semibold tracking-wide uppercase " + (isDark ? 'text-slate-400' : 'text-slate-500')}>Password</label>
                <div className={wrapBase(form.password)}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={set('password')}
                    placeholder="Create a strong password"
                    className={inputBase + " pr-12"}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className={"absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg transition-colors "
                      + (isDark ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600')}>
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                  <div className={underline(form.password)} />
                </div>
              </div>

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="relative mt-2 w-full h-12 rounded-xl font-semibold text-white overflow-hidden btn-shimmer glow-btn cursor-pointer"
                style={{ background: 'linear-gradient(135deg, #2563eb 0%, #0891b2 50%, #2563eb 100%)' }}>
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {loading ? (
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                  ) : (
                    <><UserPlus size={18} /> Create Account</>
                  )}
                </span>
              </motion.button>
            </form>

            <p className={"text-center text-sm mt-5 " + (isDark ? 'text-slate-500' : 'text-slate-500')}>
              Already have an account?{' '}
              <NavLink to="/login" className="font-semibold text-blue-500 hover:text-blue-400 transition-colors">
                Sign in
              </NavLink>
            </p>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {toast && (
          <motion.div key="toast"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className={"fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-2.5 font-medium text-white "
              + (toast.type === 'success' ? 'bg-emerald-500' : 'bg-red-500')}>
            {toast.type === 'success' ? <CheckCircle size={18} /> : <XCircle size={18} />}
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Register;
