import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Calendar, Clock, DoorOpen, User, AlignLeft, PlusCircle, ArrowLeft, CheckCircle, XCircle, ChevronDown } from 'lucide-react';
import { saveReservation, getAllReservations } from '../../services/Reservation';
import { getAllRooms } from '../../services/RoomService';
import { getLoggedInUser } from '../../services/AuthService';
import { useTheme } from '../../App';

const AddReservation = () => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [description, setDescription] = useState('');
  const [room, setRoom] = useState('');
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const { theme } = useTheme();
  const navigate = useNavigate();
  const isDark = theme === 'dark';

  useEffect(() => { getAllRooms().then(r => setRooms(r.data)).catch(() => {}); }, []);

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !date || !startTime || !endTime || !room || !description) { showToast('error', 'All fields are required'); return; }
    if (startTime >= endTime) { showToast('error', 'End time must be after start time'); return; }
    setLoading(true);
    try {
      const existing = await getAllReservations();
      const conflict = existing.data.find(r => r.room === room && r.dateMeeting === date &&
        ((startTime >= r.timeMeetingStart && startTime < r.timeMeetingEnd) ||
         (endTime > r.timeMeetingStart && endTime <= r.timeMeetingEnd)));
      if (conflict) { showToast('error', 'Room already booked for this time slot'); setLoading(false); return; }
      await saveReservation({ title, dateMeeting: date, timeMeetingStart: startTime, timeMeetingEnd: endTime, room, description, createdBy: getLoggedInUser() });
      showToast('success', 'Reservation created!');
      setTimeout(() => navigate('/ListReservation'), 1200);
    } catch { showToast('error', 'Failed to create reservation'); }
    setLoading(false);
  };

  const fieldCls = "w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all duration-200 " +
    (isDark ? 'bg-white/5 border-white/10 text-white placeholder-slate-500 hover:border-blue-500/40 focus:border-blue-500/60' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 hover:border-blue-400 focus:border-blue-500 focus:bg-white');
  const selectCls = fieldCls + " appearance-none cursor-pointer";
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
                <BookOpen size={28} className="text-white" />
              </div>
              <h1 className={"text-2xl font-bold " + (isDark ? 'text-white' : 'text-slate-900')}>New Reservation</h1>
              <p className={"text-sm mt-1 " + (isDark ? 'text-slate-400' : 'text-slate-500')}>Book a meeting room</p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className={label}>Meeting Title</label>
                <input className={fieldCls} value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Sprint Planning" />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className={label}>Date</label>
                <input className={fieldCls} type="date" value={date} onChange={e => setDate(e.target.value)} style={isDark ? { colorScheme: 'dark' } : {}} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className={label}>Start Time</label>
                  <input className={fieldCls} type="time" value={startTime} onChange={e => setStartTime(e.target.value)} style={isDark ? { colorScheme: 'dark' } : {}} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className={label}>End Time</label>
                  <input className={fieldCls} type="time" value={endTime} onChange={e => setEndTime(e.target.value)} style={isDark ? { colorScheme: 'dark' } : {}} />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className={label}>Room</label>
                <div className="relative">
                  <select className={selectCls} value={room} onChange={e => setRoom(e.target.value)} style={isDark ? { colorScheme: 'dark' } : {}}>
                    <option value="">Select a room…</option>
                    {rooms.map(r => <option key={r.id} value={r.name + ' - ' + r.typeofRoom}>{r.name + ' - ' + r.typeofRoom}</option>)}
                  </select>
                  <ChevronDown size={16} className={"absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none " + (isDark ? 'text-slate-400' : 'text-slate-400')} />
                </div>
              </div>

              <div className={"flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm border " + (isDark ? 'border-white/10 bg-white/5 text-slate-400' : 'border-slate-200 bg-slate-50 text-slate-500')}>
                <User size={15} /> Booked by: <strong className={isDark ? 'text-slate-200' : 'text-slate-700'}>{getLoggedInUser()}</strong>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className={label}>Description</label>
                <textarea className={fieldCls + " resize-none"} rows={3} value={description} onChange={e => setDescription(e.target.value)} placeholder="Meeting agenda or notes…" />
              </div>

              <div className="flex gap-3 mt-1">
                <motion.button type="button" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={() => navigate('/ListReservation')}
                  className={"flex-1 flex items-center justify-center gap-2 h-11 rounded-xl border font-semibold text-sm transition-all cursor-pointer "
                    + (isDark ? 'border-white/15 text-slate-300 hover:bg-white/5' : 'border-slate-200 text-slate-600 hover:bg-slate-50')}>
                  <ArrowLeft size={16} /> Back
                </motion.button>
                <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  className="flex-1 flex items-center justify-center gap-2 h-11 rounded-xl font-bold text-white btn-shimmer overflow-hidden cursor-pointer"
                  style={{ background: 'linear-gradient(135deg, #2563eb, #0891b2)' }}>
                  {loading ? <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                    : <><PlusCircle size={16} /> Book Room</>}
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

export default AddReservation;
