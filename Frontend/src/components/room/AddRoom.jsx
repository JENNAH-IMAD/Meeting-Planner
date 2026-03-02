import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { DoorOpen, Users, Tag, PlusCircle, ArrowLeft, CheckCircle, XCircle, ChevronDown } from 'lucide-react';
import { saveRoom, getAllRooms } from '../../services/RoomService';
import { useTheme } from '../../App';

const ROOM_TYPES = ['Conference room', 'Boardroom', 'Meeting room', 'Training room', 'Presentation room'];

const AddRoom = () => {
  const [name, setName] = useState('');
  const [typeofRoom, setTypeofRoom] = useState('');
  const [capacity, setCapacity] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const { theme } = useTheme();
  const navigate = useNavigate();
  const isDark = theme === 'dark';

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !typeofRoom || !capacity) { showToast('error', 'All fields are required'); return; }
    setLoading(true);
    try {
      const existing = await getAllRooms();
      if (existing.data.some(r => r.name === name && r.typeofRoom === typeofRoom)) {
        showToast('error', 'A room with the same name and type already exists');
        setLoading(false);
        return;
      }
      await saveRoom({ name, typeofRoom, capacity: parseInt(capacity) });
      navigate('/ListRooms');
    } catch {
      showToast('error', 'Failed to create room');
    }
    setLoading(false);
  };

  const fieldCls = "w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all duration-200 " +
    (isDark ? 'bg-white/5 border-white/10 text-white placeholder-slate-500 hover:border-blue-500/40 focus:border-blue-500/60' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 hover:border-blue-400 focus:border-blue-500 focus:bg-white');
  const selectCls = fieldCls + " appearance-none cursor-pointer";

  return (
    <div className={"relative min-h-screen flex items-center justify-center p-6 " + (isDark ? '' : '')}>
      <div className={"aurora-orb absolute -top-20 -right-20 w-96 h-96 rounded-full blur-3xl pointer-events-none " + (isDark ? 'bg-blue-600/20' : 'bg-blue-400/20')} />
      <div className={"aurora-orb-2 absolute -bottom-20 -left-20 w-80 h-80 rounded-full blur-3xl pointer-events-none " + (isDark ? 'bg-cyan-600/15' : 'bg-cyan-400/15')} />

      <motion.div className="relative w-full max-w-md z-10"
        initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: [0.22,1,0.36,1] }}>

        <div className={"relative rounded-3xl p-[1.5px] " + (isDark
          ? 'bg-gradient-to-br from-blue-500/50 via-cyan-500/30 to-violet-500/50'
          : 'bg-gradient-to-br from-blue-300/50 via-cyan-200/30 to-blue-300/50')}>
          <div className={"rounded-3xl px-8 py-10 " + (isDark ? 'bg-slate-900/95 backdrop-blur-xl' : 'bg-white/95 backdrop-blur-xl')}>

            {/* Icon + title */}
            <div className="flex flex-col items-center mb-8">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-4 shadow-lg shadow-blue-500/30 float-animate">
                <DoorOpen size={28} className="text-white" />
              </div>
              <h1 className={"text-2xl font-bold " + (isDark ? 'text-white' : 'text-slate-900')}>Create Room</h1>
              <p className={"text-sm mt-1 " + (isDark ? 'text-slate-400' : 'text-slate-500')}>Add a new meeting room</p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <label className={"text-xs font-semibold tracking-wide uppercase " + (isDark ? 'text-slate-400' : 'text-slate-500')}>Room Name</label>
                <input className={fieldCls} value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Innovation Hub" />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className={"text-xs font-semibold tracking-wide uppercase " + (isDark ? 'text-slate-400' : 'text-slate-500')}>Room Type</label>
                <div className="relative">
                  <select className={selectCls} value={typeofRoom} onChange={e => setTypeofRoom(e.target.value)}
                    style={isDark ? { colorScheme: 'dark' } : {}}>
                    <option value="">Select a type…</option>
                    {ROOM_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <ChevronDown size={16} className={"absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none " + (isDark ? 'text-slate-400' : 'text-slate-400')} />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className={"text-xs font-semibold tracking-wide uppercase " + (isDark ? 'text-slate-400' : 'text-slate-500')}>Capacity</label>
                <input className={fieldCls} type="number" value={capacity} onChange={e => setCapacity(e.target.value)} placeholder="e.g. 12" min="1" />
              </div>

              <div className="flex gap-3 mt-1">
                <motion.button type="button" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  onClick={() => navigate('/ListRooms')}
                  className={"flex-1 flex items-center justify-center gap-2 h-11 rounded-xl border font-semibold text-sm transition-all cursor-pointer "
                    + (isDark ? 'border-white/15 text-slate-300 hover:bg-white/5' : 'border-slate-200 text-slate-600 hover:bg-slate-50')}>
                  <ArrowLeft size={16} /> Back
                </motion.button>
                <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  className="flex-1 flex items-center justify-center gap-2 h-11 rounded-xl font-bold text-white btn-shimmer overflow-hidden cursor-pointer"
                  style={{ background: 'linear-gradient(135deg, #2563eb, #0891b2)' }}>
                  {loading ? <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                    : <><PlusCircle size={16} /> Create Room</>}
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

export default AddRoom;
