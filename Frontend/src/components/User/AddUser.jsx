import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, Eye, EyeOff, ArrowLeft, CheckCircle, XCircle, ChevronDown } from 'lucide-react';
import { saveUser, getAllUsers } from '../../services/UserService';
import { useTheme } from '../../App';

const AddUser = () => {
  const [form, setForm] = useState({ name: '', username: '', email: '', password: '', post: '', team: '' });
  const [role, setRole] = useState('');
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
    if (!form.name || !form.username || !form.email || !form.password || !role) { showToast('error', 'Required fields missing'); return; }
    setLoading(true);
    try {
      const existing = await getAllUsers();
      if (existing.data.some(u => u.username === form.username || u.email === form.email)) { showToast('error', 'Username or email already in use'); setLoading(false); return; }
      await saveUser({ ...form, role });
      showToast('success', 'User created!');
      setTimeout(() => navigate('/ListUser'), 1200);
    } catch { showToast('error', 'Failed to create user'); }
    setLoading(false);
  };

  const fieldCls = "w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all duration-200 " +
    (isDark ? 'bg-white/5 border-white/10 text-white placeholder-slate-500 hover:border-blue-500/40 focus:border-blue-500/60' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 hover:border-blue-400 focus:border-blue-500 focus:bg-white');
  const label = "text-xs font-semibold tracking-wide uppercase " + (isDark ? 'text-slate-400' : 'text-slate-500');

  return (
    <div className="relative min-h-screen flex items-center justify-center p-6">
      <div className={"aurora-orb absolute -top-20 -right-20 w-80 h-80 rounded-full blur-3xl pointer-events-none " + (isDark ? 'bg-blue-600/20' : 'bg-blue-400/20')} />
      <div className={"aurora-orb-2 absolute -bottom-20 -left-20 w-80 h-80 rounded-full blur-3xl pointer-events-none " + (isDark ? 'bg-cyan-600/15' : 'bg-cyan-400/15')} />

      <motion.div className="relative w-full max-w-lg z-10"
        initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: [0.22,1,0.36,1] }}>

        <div className={"relative rounded-3xl p-[1.5px] " + (isDark
          ? 'bg-gradient-to-br from-blue-500/50 via-cyan-500/30 to-violet-500/50'
          : 'bg-gradient-to-br from-blue-300/50 via-cyan-200/30 to-blue-300/50')}>
          <div className={"rounded-3xl px-8 py-10 " + (isDark ? 'bg-slate-900/95 backdrop-blur-xl' : 'bg-white/95 backdrop-blur-xl')}>

            <div className="flex flex-col items-center mb-8">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-4 shadow-lg shadow-blue-500/30 float-animate">
                <UserPlus size={28} className="text-white" />
              </div>
              <h1 className={"text-2xl font-bold " + (isDark ? 'text-white' : 'text-slate-900')}>Create User</h1>
              <p className={"text-sm mt-1 " + (isDark ? 'text-slate-400' : 'text-slate-500')}>Add a new team member</p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className={label}>Full Name</label>
                  <input className={fieldCls} value={form.name} onChange={set('name')} placeholder="John Doe" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className={label}>Username</label>
                  <input className={fieldCls} value={form.username} onChange={set('username')} placeholder="johndoe" />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className={label}>Email</label>
                <input className={fieldCls} type="email" value={form.email} onChange={set('email')} placeholder="john@example.com" />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className={label}>Password</label>
                <div className="relative">
                  <input className={fieldCls + " pr-12"} type={showPassword ? 'text' : 'password'} value={form.password} onChange={set('password')} placeholder="Secure password" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className={"absolute right-3 top-1/2 -translate-y-1/2 p-1 " + (isDark ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600')}>
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className={label}>Post / Title</label>
                  <input className={fieldCls} value={form.post} onChange={set('post')} placeholder="Engineer" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className={label}>Team</label>
                  <input className={fieldCls} value={form.team} onChange={set('team')} placeholder="Engineering" />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className={label}>Role</label>
                <div className="relative">
                  <select className={fieldCls + " appearance-none cursor-pointer"} value={role} onChange={e => setRole(e.target.value)} style={isDark ? { colorScheme: 'dark' } : {}}>
                    <option value="">Select role…</option>
                    <option value="ROLE_ADMIN">Admin</option>
                    <option value="ROLE_USER">User</option>
                  </select>
                  <ChevronDown size={16} className={"absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none " + (isDark ? 'text-slate-400' : 'text-slate-400')} />
                </div>
              </div>

              <div className="flex gap-3 mt-1">
                <motion.button type="button" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={() => navigate('/ListUser')}
                  className={"flex-1 flex items-center justify-center gap-2 h-11 rounded-xl border font-semibold text-sm transition-all cursor-pointer "
                    + (isDark ? 'border-white/15 text-slate-300 hover:bg-white/5' : 'border-slate-200 text-slate-600 hover:bg-slate-50')}>
                  <ArrowLeft size={16} /> Back
                </motion.button>
                <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  className="flex-1 flex items-center justify-center gap-2 h-11 rounded-xl font-bold text-white btn-shimmer overflow-hidden cursor-pointer"
                  style={{ background: 'linear-gradient(135deg, #2563eb, #0891b2)' }}>
                  {loading ? <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                    : <><UserPlus size={16} /> Create User</>}
                </motion.button>
              </div>
            </form>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {toast && (
          <motion.div key="toast" initial={{ opacity: 0, y: 20, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className={"fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-2.5 font-medium text-white " + (toast.type === 'success' ? 'bg-emerald-500' : 'bg-red-500')}>
            {toast.type === 'success' ? <CheckCircle size={18} /> : <XCircle size={18} />}
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AddUser;
