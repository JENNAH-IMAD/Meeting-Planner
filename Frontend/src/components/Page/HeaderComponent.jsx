import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Navbar, NavbarBrand, NavbarContent, NavbarItem,
  NavbarMenuToggle, NavbarMenu, NavbarMenuItem,
} from '@heroui/react';
import {
  CalendarDays, Home, Users, BookOpen, PlusSquare,
  DoorOpen, LogOut, Moon, Sun, UserPlus, LogIn,
} from 'lucide-react';
import { isUserLoggedIn, isAdminUser, logout } from '../../services/AuthService';
import { useTheme } from '../../App';

const HeaderComponent = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const isAuth = isUserLoggedIn();
  const isAdmin = isAdminUser();
  const isDark = theme === 'dark';

  const handleLogout = () => { logout(); setIsMenuOpen(false); navigate('/login'); };

  const navCls = ({ isActive }) => [
    'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200',
    isActive
      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
      : isDark
        ? 'text-slate-400 hover:text-blue-400 hover:bg-white/5'
        : 'text-slate-500 hover:text-blue-600 hover:bg-blue-50/80',
  ].join(' ');

  const authItems = [
    { to: '/ListRooms',       label: 'Rooms',        Icon: DoorOpen },
    { to: '/ListUser',        label: 'Users',        Icon: Users },
    { to: '/ListReservation', label: 'Reservations', Icon: BookOpen },
    { to: '/AddReservation',  label: 'New Booking',  Icon: PlusSquare },
  ];
  const adminItems = [
    { to: '/AddRoom', label: 'Add Room', Icon: DoorOpen },
    { to: '/AddUser', label: 'Add User', Icon: UserPlus },
  ];

  return (
    <Navbar
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      maxWidth="full"
      height="64px"
      className={[
        'border-b backdrop-blur-xl transition-all',
        isDark
          ? 'bg-slate-900/75 border-white/8 shadow-[0_1px_0_0_rgba(255,255,255,0.05),0_4px_24px_rgba(0,0,0,0.4)]'
          : 'bg-white/85 border-slate-200 shadow-[0_1px_0_0_rgba(0,0,0,0.04),0_4px_24px_rgba(59,130,246,0.06)]',
      ].join(' ')}
    >
      {/* ── LEFT: Logo + Home + Nav links ── */}
      <NavbarContent justify="start" className="gap-1">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? 'Close' : 'Open'}
          className="sm:hidden text-slate-400"
        />

        {/* Brand */}
        <NavbarBrand className="mr-3">
          <NavLink to="/" style={{ textDecoration: 'none' }} className="flex items-center gap-2.5">
            <div className={[
              'w-9 h-9 rounded-xl flex items-center justify-center',
              'bg-gradient-to-br from-blue-500 to-cyan-500',
              'shadow-lg shadow-blue-500/30',
            ].join(' ')}>
              <CalendarDays size={19} className="text-white" />
            </div>
            <span className="font-black text-[15px] tracking-tight bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent hidden sm:block">
              Meeting Planner
            </span>
          </NavLink>
        </NavbarBrand>

        {/* Divider */}
        <div className={"hidden sm:block w-px h-5 mx-1 " + (isDark ? 'bg-white/10' : 'bg-slate-200')} />

        {/* Home — always visible on desktop */}
        <NavbarItem className="hidden sm:flex">
          <NavLink to="/" className={navCls}>
            <Home size={14} /> Home
          </NavLink>
        </NavbarItem>

        {/* Authenticated nav items */}
        {isAuth && authItems.map(({ to, label, Icon }) => (
          <NavbarItem key={to} className="hidden sm:flex">
            <NavLink to={to} className={navCls}>
              <Icon size={14} /> {label}
            </NavLink>
          </NavbarItem>
        ))}
        {isAuth && isAdmin && adminItems.map(({ to, label, Icon }) => (
          <NavbarItem key={to} className="hidden sm:flex">
            <NavLink to={to} className={navCls}>
              <Icon size={14} /> {label}
            </NavLink>
          </NavbarItem>
        ))}
        {isAuth && (
          <NavbarItem className="hidden sm:flex">
            <NavLink to="/Scheduler" className={navCls}>
              <CalendarDays size={14} /> Calendar
            </NavLink>
          </NavbarItem>
        )}
      </NavbarContent>

      {/* ── RIGHT: Theme toggle + Auth buttons ── */}
      <NavbarContent justify="end" className="gap-2">

        {/* Theme toggle */}
        <NavbarItem>
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className={[
              'w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200',
              isDark
                ? 'text-slate-400 hover:text-yellow-400 hover:bg-white/8 border border-white/8 hover:border-yellow-500/30'
                : 'text-slate-500 hover:text-blue-600 hover:bg-blue-50 border border-slate-200 hover:border-blue-300',
            ].join(' ')}
          >
            {isDark ? <Sun size={17} /> : <Moon size={17} />}
          </button>
        </NavbarItem>

        {!isAuth && (
          <>
            {/* Register — ghost with gradient border */}
            <NavbarItem className="hidden sm:flex">
              <NavLink to="/register" style={{ textDecoration: 'none' }}>
                <button className={[
                  'relative flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-sm font-semibold',
                  'border transition-all duration-200',
                  isDark
                    ? 'border-white/15 text-slate-300 hover:border-blue-500/50 hover:text-blue-400 hover:bg-blue-500/5'
                    : 'border-slate-200 text-slate-600 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50',
                ].join(' ')}>
                  <UserPlus size={14} /> Register
                </button>
              </NavLink>
            </NavbarItem>

            {/* Login — shimmer gradient */}
            <NavbarItem>
              <NavLink to="/login" style={{ textDecoration: 'none' }}>
                <button className={[
                  'relative flex items-center gap-1.5 px-5 py-1.5 rounded-xl text-sm font-bold text-white',
                  'btn-shimmer overflow-hidden',
                  'shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50',
                  'transition-all duration-200 hover:scale-[1.03] active:scale-[0.98]',
                ].join(' ')}
                  style={{ background: 'linear-gradient(135deg, #2563eb 0%, #0891b2 100%)' }}>
                  <LogIn size={14} />
                  <span className="relative z-10">Login</span>
                </button>
              </NavLink>
            </NavbarItem>
          </>
        )}

        {isAuth && (
          <NavbarItem>
            <button
              onClick={handleLogout}
              className={[
                'flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-sm font-semibold border transition-all duration-200',
                isDark
                  ? 'border-red-500/20 text-red-400 hover:bg-red-500/10 hover:border-red-500/40'
                  : 'border-red-200 text-red-500 hover:bg-red-50 hover:border-red-300',
              ].join(' ')}
            >
              <LogOut size={14} /> Logout
            </button>
          </NavbarItem>
        )}
      </NavbarContent>

      {/* ── Mobile Menu ── */}
      <NavbarMenu className={[
        'pt-4 pb-6',
        isDark ? 'bg-slate-900/98 backdrop-blur-xl' : 'bg-white/98 backdrop-blur-xl',
      ].join(' ')}>
        {/* Home */}
        <NavbarMenuItem>
          <NavLink to="/" onClick={() => setIsMenuOpen(false)}
            className={"flex items-center gap-2.5 py-2.5 px-2 rounded-lg text-base font-medium transition-colors "
              + (isDark ? 'text-slate-300 hover:text-blue-400' : 'text-slate-700 hover:text-blue-600')}>
            <Home size={18} /> Home
          </NavLink>
        </NavbarMenuItem>

        {/* Divider */}
        {isAuth && <div className={"my-1 border-t " + (isDark ? 'border-white/8' : 'border-slate-100')} />}

        {isAuth && [...authItems, ...(isAdmin ? adminItems : [])].map(({ to, label, Icon }) => (
          <NavbarMenuItem key={to}>
            <NavLink to={to} onClick={() => setIsMenuOpen(false)}
              className={"flex items-center gap-2.5 py-2.5 px-2 rounded-lg text-base font-medium transition-colors "
                + (isDark ? 'text-slate-300 hover:text-blue-400' : 'text-slate-700 hover:text-blue-600')}>
              <Icon size={18} /> {label}
            </NavLink>
          </NavbarMenuItem>
        ))}

        {isAuth && (
          <NavbarMenuItem>
            <NavLink to="/Scheduler" onClick={() => setIsMenuOpen(false)}
              className={"flex items-center gap-2.5 py-2.5 px-2 rounded-lg text-base font-medium transition-colors "
                + (isDark ? 'text-slate-300 hover:text-blue-400' : 'text-slate-700 hover:text-blue-600')}>
              <CalendarDays size={18} /> Calendar
            </NavLink>
          </NavbarMenuItem>
        )}

        {!isAuth && (
          <>
            <div className={"my-1 border-t " + (isDark ? 'border-white/8' : 'border-slate-100')} />
            <NavbarMenuItem>
              <NavLink to="/register" onClick={() => setIsMenuOpen(false)}
                className={"flex items-center gap-2.5 py-2.5 px-2 rounded-lg text-base font-medium transition-colors "
                  + (isDark ? 'text-slate-300 hover:text-blue-400' : 'text-slate-700 hover:text-blue-600')}>
                <UserPlus size={18} /> Register
              </NavLink>
            </NavbarMenuItem>
            <NavbarMenuItem>
              <NavLink to="/login" onClick={() => setIsMenuOpen(false)}
                className={"flex items-center gap-2.5 py-2.5 px-2 rounded-lg text-base font-semibold text-blue-500"}>
                <LogIn size={18} /> Login
              </NavLink>
            </NavbarMenuItem>
          </>
        )}

        {isAuth && (
          <>
            <div className={"my-1 border-t " + (isDark ? 'border-white/8' : 'border-slate-100')} />
            <NavbarMenuItem>
              <button onClick={handleLogout}
                className="flex items-center gap-2.5 py-2.5 px-2 rounded-lg text-base font-medium text-red-500 w-full">
                <LogOut size={18} /> Logout
              </button>
            </NavbarMenuItem>
          </>
        )}
      </NavbarMenu>

      {/* Bottom gradient accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/40 to-transparent pointer-events-none" />
    </Navbar>
  );
};

export default HeaderComponent;
