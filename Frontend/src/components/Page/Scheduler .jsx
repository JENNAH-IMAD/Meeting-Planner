import { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardBody } from '@heroui/react';
import { CalendarDays, CheckCircle, XCircle } from 'lucide-react';
import { getAllReservations } from '../../services/Reservation';
import { useTheme } from '../../App';

const locales = { 'en-US': enUS };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

const Scheduler = () => {
  const [events, setEvents] = useState([]);
  const [toast, setToast] = useState(null);
  const { theme } = useTheme();

  useEffect(() => { fetchEvents(); }, []);

  const fetchEvents = async () => {
    try {
      const res = await getAllReservations();
      const mapped = res.data.map(r => ({
        title: r.title,
        start: new Date(r.dateMeeting + 'T' + r.timeMeetingStart),
        end:   new Date(r.dateMeeting + 'T' + r.timeMeetingEnd),
        resource: r,
      }));
      setEvents(mapped);
    } catch {
      setToast({ type: 'error', msg: 'Failed to load reservations' });
      setTimeout(() => setToast(null), 3500);
    }
  };

  const EventComponent = ({ event }) => (
    <div className="text-xs px-1">
      <strong className="block truncate">{event.title}</strong>
      <span className="opacity-80">
        {format(event.start, 'HH:mm')} – {format(event.end, 'HH:mm')}
      </span>
    </div>
  );

  const card = "border rounded-2xl overflow-hidden " + (theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white/80 border-slate-200 shadow-lg');

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
            <CalendarDays size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Calendar</h1>
            <p className={"text-sm " + (theme === 'dark' ? 'text-slate-400' : 'text-slate-500')}>
              {events.length} scheduled event{events.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        <Card className={card}>
          <CardBody className="p-0">
            <div className={"p-4 " + (theme === 'dark' ? 'dark' : '')}>
              <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 600 }}
                views={['month', 'week', 'day', 'agenda']}
                step={30}
                showMultiDayTimes
                components={{ event: EventComponent }}
                className={theme === 'dark' ? 'dark' : ''}
              />
            </div>
          </CardBody>
        </Card>
      </motion.div>

      <AnimatePresence>
        {toast && (
          <motion.div key="toast" initial={{ opacity: 0, y: 20, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className={"fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2 font-medium "
              + (toast.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white')}>
            {toast.type === 'success' ? <CheckCircle size={18} /> : <XCircle size={18} />}
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Scheduler;
