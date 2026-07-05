import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, MessageSquare, User, Menu, X, Sun, Moon, Sparkles } from 'lucide-react';
import { useThemeStore } from '../store/useThemeStore';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { isDark, toggleTheme } = useThemeStore();

  const navLinks = [
    { name: 'Shop', path: '/search', icon: <ShoppingBag size={20} /> },
    { name: 'AI Assistant', path: '/assistant', icon: <MessageSquare size={20} /> },
    { name: 'Compare', path: '/compare', icon: <Sparkles size={20} /> },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="glass sticky top-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-primary/20 shadow-lg group-hover:scale-110 transition-transform">
            <Sparkles size={24} />
          </div>
          <span className="text-xl font-bold tracking-tight">VisionShop <span className="text-primary italic">AI</span></span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-2 font-medium transition-colors ${
                isActive(link.path) ? 'text-primary' : 'text-slate-500 hover:text-primary'
              }`}
            >
              {link.icon}
              {link.name}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-4">
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <Link to="/profile" className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-full font-medium hover:bg-primary hover:text-white transition-all">
            <User size={20} />
            Profile
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 p-6 flex flex-col gap-4 animate-slide-up">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 text-lg font-medium"
            >
              {link.icon}
              {link.name}
            </Link>
          ))}
          <div className="h-px bg-slate-100 dark:bg-slate-800 my-2" />
          <button onClick={toggleTheme} className="flex items-center gap-3 text-lg font-medium">
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
            {isDark ? 'Light Mode' : 'Dark Mode'}
          </button>
          <Link to="/profile" onClick={() => setIsOpen(false)} className="flex items-center gap-3 text-lg font-medium">
            <User size={20} />
            Profile
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
