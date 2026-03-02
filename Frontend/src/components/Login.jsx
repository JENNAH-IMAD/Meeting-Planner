import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, LogIn, CalendarDays, CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import { loginAPICall, saveLoggedInUser, storeToken } from '../services/AuthService';
import { useTheme } from '../App';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const { theme } = useTheme();
  const navigate = useNavigate();

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) { showToast('error', 'Please fill in all fields'); return; }
    setLoading(true);
    try {
      const response = await loginAPICall(username, password);
      const token = 'Bearer ' + response.data.accessToken;
      storeToken(token);
      saveLoggedInUser(username, response.data.role);
      navigate('/ListUser');
    } catch {
      showToast('error', 'Invalid username or password');
    }
    setLoading(false);
  };

  const isDark = theme === 'dark';

  return (
    <div className={"relative min-h-screen flex items-center justify-center p-4 overflow-hidden " + (isDark ? 'bg-slate-950' : 'bg-slate-50')}>

      {/* Grid pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-60 pointer-events-none" />

      {/* Aurora orbs */}
      <div className={"aurora-orb absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full blur-3xl pointer-events-none "
        + (isDark ? 'bg-blue-600/20' : 'bg-blue-400/25')} />
      <div className={"aurora-orb-2 absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full blur-3xl pointer-events-none "
        + (isDark ? 'bg-cyan-600/15' : 'bg-cyan-400/20')} />
      <div className={"aurora-orb-3 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full blur-3xl pointer-events-none "
        + (isDark ? 'bg-violet-600/10' : 'bg-violet-400/10')} />

      <motion.div className="relative w-full max-w-md z-10"
        initial={{ opacity: 0, y: 32, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>

        {/* Gradient border wrapper */}
        <div className={"relative rounded-3xl p-[1.5px] " + (isDark
          ? 'bg-gradient-to-br from-blue-500/60 via-cyan-500/40 to-violet-500/60'
          : 'bg-gradient-to-br from-blue-400/50 via-cyan-300/40 to-blue-400/50')}>

          {/* Card body */}
          <div className={"rounded-3xl px-8 py-10 " + (isDark
            ? 'bg-slate-900/95 backdrop-blur-xl'
            : 'bg-white/95 backdrop-blur-xl')}>

            {/* Logo */}
            <div className="flex flex-col items-center mb-8">
              <motion.div
                className="relative w-16 h-16 mb-4"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}>
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-xl shadow-blue-500/30 float-animate">
                  <CalendarDays size={32} className="text-white" />
                </div>
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-blue-500/30 to-cyan-500/30 blur-md -z-10" />
              </motion.div>

              <motion.h1 className={"text-2xl font-bold tracking-tight " + (isDark ? 'text-white' : 'text-slate-900')}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                Welcome back
              </motion.h1>
              <motion.p className={"text-sm mt-1 " + (isDark ? 'text-slate-400' : 'text-slate-500')}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
                Sign in to your account to continue
              </motion.p>
            </div>

            {/* Form */}
            <motion.form onSubmit={handleSubmit} className="flex flex-col gap-5"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>

              {/* Username field */}
              <div className="flex flex-col gap-1.5">
                <label className={"text-xs font-semibold tracking-wide uppercase " + (isDark ? 'text-slate-400' : 'text-slate-500')}>
                  Username
                </label>
                <div className={"relative group rounded-xl border transition-all duration-200 "
                  + (isDark
                    ? 'bg-white/5 border-white/10 hover:border-blue-500/50 focus-within:border-blue-500/70 focus-within:bg-white/8'
                    : 'bg-slate-50 border-slate-200 hover:border-blue-400 focus-within:border-blue-500 focus-within:bg-white')}>
                  <input
                    type="text"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    className={"w-full px-4 py-3 bg-transparent text-sm outline-none " + (isDark ? 'text-white placeholder-slate-500' : 'text-slate-900 placeholder-slate-400')}
                    autoComplete="username"
                  />
                  <div className={"absolute bottom-0 left-0 h-[2px] rounded-full transition-all duration-300 " + (username ? 'w-full bg-gradient-to-r from-blue-500 to-cyan-500' : 'w-0')} />
                </div>
              </div>

              {/* Password field */}
              <div className="flex flex-col gap-1.5">
                <label className={"text-xs font-semibold tracking-wide uppercase " + (isDark ? 'text-slate-400' : 'text-slate-500')}>
                  Password
                </label>
                <div className={"relative group rounded-xl border transition-all duration-200 "
                  + (isDark
                    ? 'bg-white/5 border-white/10 hover:border-blue-500/50 focus-within:border-blue-500/70'
                    : 'bg-slate-50 border-slate-200 hover:border-blue-400 focus-within:border-blue-500 focus-within:bg-white')}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className={"w-full px-4 py-3 pr-12 bg-transparent text-sm outline-none " + (isDark ? 'text-white placeholder-slate-500' : 'text-slate-900 placeholder-slate-400')}
                    autoComplete="current-password"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className={"absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg transition-colors "
                      + (isDark ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600')}>
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                  <div className={"absolute bottom-0 left-0 h-[2px] rounded-full transition-all duration-300 " + (password ? 'w-full bg-gradient-to-r from-blue-500 to-cyan-500' : 'w-0')} />
                </div>
              </div>

              {/* Submit button */}
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="relative mt-2 w-full h-12 rounded-xl font-semibold text-white overflow-hidden btn-shimmer glow-btn cursor-pointer"
                style={{ background: 'linear-gradient(135deg, #2563eb 0%, #0891b2 50%, #2563eb 100%)', backgroundSize: '200% 200%' }}>
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {loading ? (
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                  ) : (
                    <><LogIn size={18} /> Sign In <ArrowRight size={16} /></>
                  )}
                </span>
              </motion.button>
            </motion.form>

            <motion.p className={"text-center text-sm mt-6 " + (isDark ? 'text-slate-500' : 'text-slate-500')}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
              Don't have an account?{' '}
              <NavLink to="/register" className="font-semibold text-blue-500 hover:text-blue-400 transition-colors">
                Create one
              </NavLink>
            </motion.p>
          </div>
        </div>
      </motion.div>

      {/* Toast */}
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

export default Login;
