import { CalendarDays, Mail, Github, Linkedin, Heart } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { Divider } from '@heroui/react';
import { useTheme } from '../../App';

const FooterComponent = () => {
  const { theme } = useTheme();
  const year = new Date().getFullYear();

  const footerLinks = [
    { label: 'Home',         to: '/' },
    { label: 'Rooms',        to: '/ListRooms' },
    { label: 'Reservations', to: '/ListReservation' },
    { label: 'Calendar',     to: '/Scheduler' },
  ];

  return (
    <footer className={"mt-auto border-t " + (theme === 'dark' ? 'bg-slate-900/90 border-white/10' : 'bg-white/80 border-slate-200')}>
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <CalendarDays size={18} className="text-white" />
              </div>
              <span className="font-bold text-lg bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Meeting Planner
              </span>
            </div>
            <p className={"text-sm leading-relaxed " + (theme === 'dark' ? 'text-slate-400' : 'text-slate-500')}>
              Streamline your team collaboration. Schedule meetings, manage rooms,
              and stay organized effortlessly.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className={"font-semibold mb-3 " + (theme === 'dark' ? 'text-slate-200' : 'text-slate-700')}>Quick Links</h3>
            <ul className="space-y-2">
              {footerLinks.map(({ label, to }) => (
                <li key={to}>
                  <NavLink to={to}
                    className={"text-sm transition-colors " + (theme === 'dark' ? 'text-slate-400 hover:text-blue-400' : 'text-slate-500 hover:text-blue-600')}
                    style={{ textDecoration: 'none' }}>
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className={"font-semibold mb-3 " + (theme === 'dark' ? 'text-slate-200' : 'text-slate-700')}>Contact</h3>
            <div className="space-y-2">
              <a href="mailto:contact@meetingplanner.io"
                className={"flex items-center gap-2 text-sm transition-colors " + (theme === 'dark' ? 'text-slate-400 hover:text-blue-400' : 'text-slate-500 hover:text-blue-600')}>
                <Mail size={14} /> contact@meetingplanner.io
              </a>
              <div className="flex gap-3 mt-4">
                <a href="#" className={"p-2 rounded-lg transition-colors " + (theme === 'dark' ? 'text-slate-400 hover:text-blue-400 hover:bg-white/5' : 'text-slate-500 hover:text-blue-600 hover:bg-blue-50')}>
                  <Github size={16} />
                </a>
                <a href="#" className={"p-2 rounded-lg transition-colors " + (theme === 'dark' ? 'text-slate-400 hover:text-blue-400 hover:bg-white/5' : 'text-slate-500 hover:text-blue-600 hover:bg-blue-50')}>
                  <Linkedin size={16} />
                </a>
              </div>
            </div>
          </div>
        </div>

        <Divider className={theme === 'dark' ? 'bg-white/10' : 'bg-slate-200'} />
        <div className={"flex flex-col sm:flex-row items-center justify-between mt-6 gap-2 text-sm " + (theme === 'dark' ? 'text-slate-500' : 'text-slate-400')}>
          <p>© {year} Meeting Planner. All rights reserved.</p>
          <p className="flex items-center gap-1">Made with <Heart size={13} className="text-red-500" /> by the team</p>
        </div>
      </div>
    </footer>
  );
};

export default FooterComponent;
