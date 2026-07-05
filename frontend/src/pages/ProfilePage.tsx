import React from 'react';
import { User, Bell, Shield, CreditCard, Heart, ShoppingBag, Settings, LogOut, Sun, ChevronRight } from 'lucide-react';
import { useThemeStore } from '../store/useThemeStore';
import { useStore } from '../store/useStore';
import { Button } from '../components/ui/Button';

const ProfilePage: React.FC = () => {
  const { isDark, toggleTheme } = useThemeStore();
  const user = useStore((state) => state.user);

  const menuItems = [
    { icon: <Heart className="text-pink-500" />, label: 'Wishlist', desc: '12 items saved', path: '/wishlist' },
    { icon: <ShoppingBag className="text-blue-500" />, label: 'Order History', desc: 'View past purchases', path: '/history' },
    { icon: <Bell className="text-yellow-500" />, label: 'Notifications', desc: 'Deals and alerts', path: '/notifications' },
    { icon: <Shield className="text-green-500" />, label: 'Security', desc: 'Password and 2FA', path: '/security' },
    { icon: <CreditCard className="text-purple-500" />, label: 'Payment Methods', desc: 'Managed cards', path: '/payment' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row items-center gap-8 mb-12 bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-xl">
        <div className="relative">
          <div className="w-32 h-32 rounded-[2.5rem] bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white shadow-2xl">
            <User size={64} />
          </div>
          <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center border border-slate-100 dark:border-slate-700 shadow-lg">
            <Settings size={18} className="text-slate-400" />
          </button>
        </div>
        
        <div className="text-center md:text-left flex-1">
          <h1 className="text-3xl font-black">{user?.name || 'Alex Rivers'}</h1>
          <p className="text-slate-500">{user?.email || 'Member since February 2024'}</p>
          <div className="flex flex-wrap gap-2 mt-4 justify-center md:justify-start">
             <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold ring-1 ring-primary/20">ELITE MEMBER</span>
             <span className="bg-slate-100 dark:bg-slate-800 text-slate-500 px-3 py-1 rounded-full text-xs font-bold">PRO ACCOUNT</span>
          </div>
        </div>
        
        <Button size="lg" className="rounded-2xl gap-2 font-bold bg-slate-900 hover:bg-black dark:bg-primary dark:hover:bg-primary-dark">
          Upgrade View
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 space-y-6">
           <h3 className="text-xl font-bold flex items-center gap-2">
              <Sun size={20} className="text-primary" />
              Appearance
           </h3>
           <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
              <span className="font-medium">{isDark ? 'Dark Mode' : 'Light Mode'}</span>
              <button 
                onClick={toggleTheme}
                className={`w-14 h-8 rounded-full transition-colors relative flex items-center px-1 ${
                  isDark ? 'bg-primary' : 'bg-slate-300'
                }`}
              >
                <div className={`w-6 h-6 bg-white rounded-full transition-transform shadow-md ${
                  isDark ? 'translate-x-6' : 'translate-x-0'
                }`} />
              </button>
           </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 space-y-6">
           <h3 className="text-xl font-bold flex items-center gap-2">
              <LogOut size={20} className="text-red-500" />
              Account Actions
           </h3>
           <Button variant="outline" className="w-full text-red-500 border-red-100 dark:border-red-900/30 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-2xl h-14">
              Sign Out
           </Button>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-2xl font-bold px-4">Dashboard</h3>
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 overflow-hidden shadow-lg">
           {menuItems.map((item, i) => (
             <div 
               key={i} 
               className="flex items-center gap-4 p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors border-b last:border-b-0 border-slate-50 dark:border-slate-800 group"
             >
                <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center shadow-sm ring-1 ring-slate-100 dark:ring-slate-700">
                   {item.icon}
                </div>
                <div className="flex-1">
                   <h4 className="font-bold">{item.label}</h4>
                   <p className="text-sm text-slate-400">{item.desc}</p>
                </div>
                <ChevronRight size={20} className="text-slate-300 group-hover:text-primary transition-colors translate-x-0 group-hover:translate-x-1 duration-300" />
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
