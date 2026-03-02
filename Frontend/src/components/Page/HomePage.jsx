import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { CalendarDays, Users, DoorOpen, Zap, Shield, Bell, ArrowRight, CheckCircle, Sparkles, Clock } from 'lucide-react';
import { isUserLoggedIn } from '../../services/AuthService';
import { useTheme } from '../../App';

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
const fadeUp  = { hidden: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22,1,0.36,1] } } };

const WORDS = ['Effortlessly', 'Smarter', 'Beautifully', 'Together'];

const HomePage = () => {
  const { theme } = useTheme();
  const isAuth = isUserLoggedIn();
  const isDark = theme === 'dark';
  const [wordIdx, setWordIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setWordIdx(i => (i + 1) % WORDS.length), 2800);
    return () => clearInterval(id);
  }, []);

  const features = [
    { icon: CalendarDays, color: 'from-blue-500 to-blue-600',    glow: 'shadow-blue-500/30',    title: 'Smart Scheduling',        desc: 'Book rooms instantly with real-time availability and conflict detection.' },
    { icon: Users,        color: 'from-cyan-500 to-cyan-600',    glow: 'shadow-cyan-500/30',    title: 'Team Collaboration',      desc: 'Coordinate participants, assign roles, and manage your whole team.' },
    { icon: Zap,          color: 'from-yellow-500 to-orange-500',glow: 'shadow-yellow-500/30',  title: 'Conflict Detection',      desc: 'Automatic double-booking prevention keeps your schedule clean.' },
    { icon: Shield,       color: 'from-emerald-500 to-emerald-600',glow:'shadow-emerald-500/30',title: 'Role-Based Access',       desc: 'Secure, scoped permissions for admins and team members.' },
    { icon: DoorOpen,     color: 'from-purple-500 to-purple-600',glow: 'shadow-purple-500/30',  title: 'Room Management',         desc: 'Manage 5+ room types: conference, boardroom, training & more.' },
    { icon: Bell,         color: 'from-pink-500 to-rose-500',    glow: 'shadow-pink-500/30',    title: 'Calendar View',           desc: 'Month, week, and day views with an elegant interactive calendar.' },
  ];

  const stats = [
    { value: '5+',   label: 'Room Types',    color: 'from-blue-400 to-cyan-400' },
    { value: '100%', label: 'Conflict Free', color: 'from-cyan-400 to-emerald-400' },
    { value: '50+',  label: 'Teams Served',  color: 'from-purple-400 to-pink-400' },
    { value: '99.9%',label: 'Uptime',        color: 'from-emerald-400 to-teal-400' },
  ];

  return (
    <div className={"relative min-h-screen overflow-hidden " + (isDark ? 'text-white' : 'text-slate-900')}>

      {/* Background grid + orbs */}
      <div className="absolute inset-0 bg-dot-pattern pointer-events-none" />
      <div className={"aurora-orb absolute -top-40 -left-40 w-[700px] h-[700px] rounded-full blur-3xl pointer-events-none " + (isDark ? 'bg-blue-600/15' : 'bg-blue-400/20')} />
      <div className={"aurora-orb-2 absolute -bottom-40 -right-40 w-[700px] h-[700px] rounded-full blur-3xl pointer-events-none " + (isDark ? 'bg-cyan-600/12' : 'bg-cyan-400/18')} />
      <div className={"aurora-orb-3 absolute top-1/3 right-1/4 w-[400px] h-[400px] rounded-full blur-3xl pointer-events-none " + (isDark ? 'bg-violet-600/10' : 'bg-violet-400/10')} />

      {/* ── Hero ── */}
      <section className="relative pt-24 pb-16 px-6">
        <motion.div className="max-w-4xl mx-auto text-center"
          variants={stagger} initial="hidden" animate="show">

          <motion.div variants={fadeUp}>
            <span className={"inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-8 border "
              + (isDark ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : 'bg-blue-50 border-blue-200 text-blue-600')}>
              <Sparkles size={14} className="animate-pulse" />
              Smart Meeting Management Platform
            </span>
          </motion.div>

          <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl font-black leading-none mb-6 tracking-tight">
            Plan Meetings
            <br />
            <AnimatePresence mode="wait">
              <motion.span key={wordIdx}
                className="animated-gradient-text inline-block"
                initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -20, filter: 'blur(8px)' }}
                transition={{ duration: 0.4 }}>
                {WORDS[wordIdx]}
              </motion.span>
            </AnimatePresence>
          </motion.h1>

          <motion.p variants={fadeUp}
            className={"text-xl leading-relaxed mb-10 max-w-2xl mx-auto " + (isDark ? 'text-slate-400' : 'text-slate-500')}>
            Manage meeting rooms, schedule reservations, and coordinate teams — all in one modern, intuitive platform built for real teams.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-4">
            {isAuth ? (
              <>
                <NavLink to="/ListReservation">
                  <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                    className="relative flex items-center gap-2 px-8 py-3.5 rounded-2xl font-bold text-white overflow-hidden btn-shimmer glow-btn cursor-pointer"
                    style={{ background: 'linear-gradient(135deg, #2563eb, #0891b2)' }}>
                    <span className="relative z-10 flex items-center gap-2">View Reservations <ArrowRight size={18} /></span>
                  </motion.button>
                </NavLink>
                <NavLink to="/Scheduler">
                  <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                    className={"flex items-center gap-2 px-8 py-3.5 rounded-2xl font-bold border-2 transition-all cursor-pointer "
                      + (isDark ? 'border-white/20 text-white hover:border-blue-500/60 hover:bg-blue-500/10' : 'border-slate-300 text-slate-700 hover:border-blue-400 hover:bg-blue-50')}>
                    <CalendarDays size={18} /> Open Calendar
                  </motion.button>
                </NavLink>
              </>
            ) : (
              <>
                <NavLink to="/register">
                  <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                    className="relative flex items-center gap-2 px-8 py-3.5 rounded-2xl font-bold text-white overflow-hidden btn-shimmer glow-btn cursor-pointer"
                    style={{ background: 'linear-gradient(135deg, #2563eb, #0891b2)' }}>
                    <span className="relative z-10 flex items-center gap-2">Get Started Free <ArrowRight size={18} /></span>
                  </motion.button>
                </NavLink>
                <NavLink to="/login">
                  <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                    className={"flex items-center gap-2 px-8 py-3.5 rounded-2xl font-bold border-2 transition-all cursor-pointer "
                      + (isDark ? 'border-white/20 text-white hover:border-blue-500/60 hover:bg-blue-500/10' : 'border-slate-300 text-slate-700 hover:border-blue-400 hover:bg-blue-50')}>
                    Sign In
                  </motion.button>
                </NavLink>
              </>
            )}
          </motion.div>

          {/* Trust badges */}
          <motion.div variants={fadeUp} className={"flex flex-wrap justify-center gap-6 mt-10 text-sm " + (isDark ? 'text-slate-500' : 'text-slate-400')}>
            {['Free to use', 'No credit card', 'Setup in 2 min', 'JWT Secured'].map(t => (
              <span key={t} className="flex items-center gap-1.5">
                <CheckCircle size={14} className="text-emerald-500" /> {t}
              </span>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ── Stats ── */}
      <section className="py-12 px-6">
        <motion.div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4"
          variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}>
          {stats.map(({ value, label, color }) => (
            <motion.div key={label} variants={fadeUp} whileHover={{ scale: 1.05 }} transition={{ type: 'spring', stiffness: 300 }}>
              <div className={"relative rounded-2xl p-px overflow-hidden "
                + (isDark ? 'bg-gradient-to-br from-white/10 to-white/5' : 'bg-gradient-to-br from-slate-200 to-slate-100')}>
                <div className={"rounded-2xl p-6 text-center " + (isDark ? 'bg-slate-900/80' : 'bg-white/90')}>
                  <div className={"text-3xl font-black bg-gradient-to-r " + color + " bg-clip-text text-transparent"}>{value}</div>
                  <div className={"text-xs font-medium mt-1 " + (isDark ? 'text-slate-400' : 'text-slate-500')}>{label}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── Features ── */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div className="text-center mb-14"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-4xl font-black mb-3">Everything You Need</h2>
            <p className={"text-lg max-w-xl mx-auto " + (isDark ? 'text-slate-400' : 'text-slate-500')}>
              Powerful features designed to make meeting management simple.
            </p>
          </motion.div>

          <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
            variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}>
            {features.map(({ icon: Icon, color, glow, title, desc }) => (
              <motion.div key={title} variants={fadeUp}
                whileHover={{ scale: 1.03, y: -4 }} transition={{ type: 'spring', stiffness: 300 }}>
                <div className={"relative rounded-2xl p-px overflow-hidden card-glow h-full "
                  + (isDark ? 'bg-gradient-to-br from-white/10 to-white/[0.03]' : 'bg-gradient-to-br from-slate-200 to-slate-100')}>
                  <div className={"rounded-2xl p-6 h-full " + (isDark ? 'bg-slate-900/90' : 'bg-white/95')}>
                    <div className={"w-12 h-12 rounded-xl flex items-center justify-center mb-5 shadow-lg bg-gradient-to-br " + color + " " + glow}>
                      <Icon size={24} className="text-white" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">{title}</h3>
                    <p className={"text-sm leading-relaxed " + (isDark ? 'text-slate-400' : 'text-slate-500')}>{desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA ── */}
      {!isAuth && (
        <section className="py-16 px-6">
          <motion.div className="max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className={"relative rounded-3xl p-px overflow-hidden "
              + (isDark ? 'bg-gradient-to-br from-blue-500/50 via-cyan-500/40 to-violet-500/50' : 'bg-gradient-to-br from-blue-400/40 via-cyan-300/30 to-blue-400/40')}>
              <div className={"rounded-3xl py-14 px-10 text-center " + (isDark ? 'bg-slate-900/90' : 'bg-white/90')}>
                <div className={"aurora-orb absolute -top-10 -right-10 w-48 h-48 rounded-full blur-3xl pointer-events-none " + (isDark ? 'bg-blue-600/20' : 'bg-blue-400/20')} />
                <Clock size={40} className="mx-auto mb-4 text-blue-500 float-animate" />
                <h2 className="text-3xl font-black mb-3">Ready to Get Started?</h2>
                <p className={"mb-8 text-lg " + (isDark ? 'text-slate-300' : 'text-slate-600')}>
                  Join your team and start scheduling smarter today.
                </p>
                <NavLink to="/register">
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                    className="relative inline-flex items-center gap-2 px-10 py-4 rounded-2xl font-bold text-white overflow-hidden btn-shimmer glow-btn cursor-pointer"
                    style={{ background: 'linear-gradient(135deg, #2563eb, #0891b2)' }}>
                    <span className="relative z-10 flex items-center gap-2">Create Account <ArrowRight size={18} /></span>
                  </motion.button>
                </NavLink>
              </div>
            </div>
          </motion.div>
        </section>
      )}
    </div>
  );
};

export default HomePage;
