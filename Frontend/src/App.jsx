import { createContext, useContext, useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { isUserLoggedIn } from './services/AuthService';

import HeaderComponent from './components/Page/HeaderComponent';
import FooterComponent from './components/Page/FooterComponent';
import HomePage from './components/Page/HomePage';
import Login from './components/Login';
import Register from './components/Register';
import ListRooms from './components/room/ListRoom';
import AddRoom from './components/room/AddRoom';
import ListUser from './components/User/ListUser';
import AddUser from './components/User/AddUser';
import ListReservation from './components/reservation/ListReservation';
import AddReservation from './components/reservation/AddReservation';
import Scheduler from './components/Page/Scheduler ';

export const ThemeContext = createContext({ theme: 'dark', toggleTheme: () => {} });
export const useTheme = () => useContext(ThemeContext);

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  in:      { opacity: 1, y: 0  },
  out:     { opacity: 0, y: -16 },
};
const pageTransition = { type: 'tween', ease: 'easeInOut', duration: 0.3 };

function PageWrapper({ children }) {
  return (
    <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
      {children}
    </motion.div>
  );
}

function AuthenticatedRoute({ children }) {
  const isAuth = isUserLoggedIn();
  if (isAuth) return children;
  return <Navigate to="/login" />;
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/"                element={<PageWrapper><HomePage /></PageWrapper>} />
        <Route path="/login"           element={<PageWrapper><Login /></PageWrapper>} />
        <Route path="/Login"           element={<Navigate to="/login" />} />
        <Route path="/register"        element={<PageWrapper><Register /></PageWrapper>} />
        <Route path="/Register"        element={<Navigate to="/register" />} />
        <Route path="/ListRooms"       element={<AuthenticatedRoute><PageWrapper><ListRooms /></PageWrapper></AuthenticatedRoute>} />
        <Route path="/AddRoom"         element={<AuthenticatedRoute><PageWrapper><AddRoom /></PageWrapper></AuthenticatedRoute>} />
        <Route path="/ListUser"        element={<AuthenticatedRoute><PageWrapper><ListUser /></PageWrapper></AuthenticatedRoute>} />
        <Route path="/AddUser"         element={<AuthenticatedRoute><PageWrapper><AddUser /></PageWrapper></AuthenticatedRoute>} />
        <Route path="/ListReservation" element={<AuthenticatedRoute><PageWrapper><ListReservation /></PageWrapper></AuthenticatedRoute>} />
        <Route path="/AddReservation"  element={<AuthenticatedRoute><PageWrapper><AddReservation /></PageWrapper></AuthenticatedRoute>} />
        <Route path="/Scheduler"       element={<AuthenticatedRoute><PageWrapper><Scheduler /></PageWrapper></AuthenticatedRoute>} />
      </Routes>
    </AnimatePresence>
  );
}

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => {
      const next = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme', next);
      return next;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

function AppContent() {
  const { theme } = useTheme();
  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${
      theme === 'dark'
        ? 'bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-slate-100'
        : 'bg-gradient-to-br from-slate-100 via-blue-50 to-cyan-50 text-slate-900'
    }`}>
      <HeaderComponent />
      <main className="flex-1">
        <AnimatedRoutes />
      </main>
      <FooterComponent />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
