import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import {
  FaHome, FaFolderOpen, FaRobot, FaBook,
  FaSignInAlt, FaBars, FaTimes, FaUserAstronaut
} from 'react-icons/fa';
import { MdDashboard } from 'react-icons/md';
import { PiStudentFill } from 'react-icons/pi';
import clsx from 'clsx';
import { useAuth } from '../context/authContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef();

  const menus = [
    { to: '/', icon: <FaHome />, label: 'Home' },
    { to: '/dashboard', icon: <MdDashboard />, label: 'Dashboard' },
    { to: '/folders', icon: <FaFolderOpen />, label: 'Folders' },
    { to: '/ask-ai', icon: <FaRobot />, label: 'Ask AI' },
    { to: '/saved', icon: <FaBook />, label: 'Saved' },
  ];

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setMenuOpen(false);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-gradient-to-br from-[#2e026d]/80 via-[#15162c]/60 to-[#2e026d]/80 text-white px-4 py-3 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">

        {/* Left: Logo */}
        <div className="flex items-center gap-2">
          <PiStudentFill className="text-2xl" />
          <span className="text-lg font-semibold">StudyAI</span>
        </div>

        {/* Desktop Menu */}
        {!isMobile && (
          <ul className="flex items-center gap-6">
            {menus.map(({ to, icon, label }) => (
              <li key={to}>
                <Link
                  to={to}
                  className={clsx(
                    "flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-all",
                    location.pathname === to ? "bg-white/10 font-semibold" : ""
                  )}
                >
                  {icon}
                  <span>{label}</span>
                </Link>
              </li>
            ))}

            {/* User Area */}
            {!user ? (
              <li>
                <button
                  onClick={() => navigate('/login')}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-500 hover:brightness-110 transition-all"
                >
                  Login
                </button>
              </li>
            ) : (
              <li className="relative" ref={dropdownRef}>
                <FaUserAstronaut
                  className="w-6 h-6 rounded-full cursor-pointer"
                  onClick={() => setShowDropdown(!showDropdown)}
                />
                {showDropdown && (
                  <div className="absolute right-0 mt-2 bg-white text-black rounded shadow-md z-50">
                    <button
                      onClick={() => {
                        logout();
                        setShowDropdown(false);
                        navigate("/login");
                      }}
                      className="block px-4 py-2 text-sm hover:bg-gray-100 w-full text-left rounded"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </li>
            )}
          </ul>
        )}

        {/* Mobile Hamburger */}
        {isMobile && (
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-2xl text-white focus:outline-none"
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        )}
      </div>

      {/* Mobile Dropdown Menu */}
      {isMobile && menuOpen && (
        <div className="mt-4 bg-[#1a1234]/90 rounded-xl px-4 py-4 space-y-3">
          {menus.map(({ to, icon, label }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMenuOpen(false)}
              className={clsx(
                "flex items-center gap-3 py-2 px-2 rounded-lg transition-all",
                location.pathname === to ? "bg-white/10 font-semibold" : "hover:bg-white/10"
              )}
            >
              {icon}
              <span>{label}</span>
            </Link>
          ))}

          {!user ? (
            <button
              onClick={() => {
                setMenuOpen(false);
                navigate('/login');
              }}
              className="flex items-center gap-2 px-3 py-2 w-full rounded-lg bg-gradient-to-r from-purple-600 to-indigo-500 hover:brightness-110 transition-all"
            >
              <FaSignInAlt />
              <span>Login</span>
            </button>
          ) : (
            <div className="flex items-center justify-between">
              <span className="text-sm px-2">Welcome, User</span>
              <button
                onClick={() => {
                  logout();
                  setMenuOpen(false);
                  navigate("/login");
                }}
                className="text-sm px-3 py-1 rounded bg-white text-black hover:bg-gray-200"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
