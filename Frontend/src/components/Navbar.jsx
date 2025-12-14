import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, LogOut, Menu, X, UserPlus, LogIn, Home } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // We need to check token state. In a real app, use Context. 
  // For now, we rely on localStorage as per existing code, 
  // but we might need a way to trigger re-render on login/logout.
  const token = localStorage.getItem("token");

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const navLinks = !token ? [
    { to: "/", label: "Login", icon: LogIn },
    { to: "/signup", label: "Get Started", icon: UserPlus, primary: true },
  ] : [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  ];

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? "bg-white/80 backdrop-blur-md shadow-md py-3" : "bg-transparent py-5"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className={`p-2 rounded-xl transition-colors ${scrolled ? "bg-indigo-600 text-white" : "bg-white text-indigo-600 shadow-lg"}`}>
              <LayoutDashboard size={20} />
            </div>
            <span className={`text-xl font-bold tracking-tight transition-colors ${scrolled ? "text-gray-900" : "text-gray-800"}`}>
              TaskDiary
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-2 text-sm font-medium transition-all ${link.primary
                    ? "px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-lg shadow-indigo-200 hover:-translate-y-0.5"
                    : "text-gray-600 hover:text-indigo-600"
                  }`}
              >
                <link.icon size={18} />
                {link.label}
              </Link>
            ))}

            {token && (
              <button
                onClick={logout}
                className="flex items-center gap-2 text-sm font-medium text-red-500 hover:text-red-700 transition-colors ml-2"
              >
                <LogOut size={18} />
                Logout
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-indigo-600 transition-colors"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
          >
            <div className="px-4 py-6 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-3 p-3 rounded-xl ${link.primary
                      ? "bg-indigo-600 text-white justify-center shadow-lg shadow-indigo-200"
                      : "bg-gray-50 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                    }`}
                >
                  <link.icon size={20} />
                  <span className="font-medium">{link.label}</span>
                </Link>
              ))}

              {token && (
                <button
                  onClick={logout}
                  className="w-full flex items-center justify-center gap-3 p-3 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                >
                  <LogOut size={20} />
                  <span className="font-medium">Logout</span>
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
