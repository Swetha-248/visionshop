import React from 'react';
import { Sparkles, Globe, Mail, Share2 } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-12 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
              <Sparkles size={18} />
            </div>
            <span className="text-lg font-bold">VisionShop AI</span>
          </div>
          <p className="text-slate-500 text-sm">
            Revolutionizing the way you shop using multimodal AI technology.
          </p>
          <div className="flex gap-4">
            <Globe size={20} className="text-slate-400 hover:text-primary cursor-pointer transition-colors" />
            <Mail size={20} className="text-slate-400 hover:text-primary cursor-pointer transition-colors" />
            <Share2 size={20} className="text-slate-400 hover:text-primary cursor-pointer transition-colors" />
          </div>
        </div>
        
        <div>
          <h4 className="font-bold mb-4">Platform</h4>
          <ul className="space-y-2 text-slate-500 text-sm">
            <li className="hover:text-primary cursor-pointer transition-colors">Visual Search</li>
            <li className="hover:text-primary cursor-pointer transition-colors">AI Assistant</li>
            <li className="hover:text-primary cursor-pointer transition-colors">Recommendations</li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-bold mb-4">Company</h4>
          <ul className="space-y-2 text-slate-500 text-sm">
            <li className="hover:text-primary cursor-pointer transition-colors">About Us</li>
            <li className="hover:text-primary cursor-pointer transition-colors">Contact</li>
            <li className="hover:text-primary cursor-pointer transition-colors">Privacy Policy</li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-bold mb-4">Newsletter</h4>
          <p className="text-slate-500 text-sm mb-4">Get the latest AI shopping trends.</p>
          <div className="flex gap-2">
            <input 
              type="email" 
              placeholder="Email" 
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <button className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-primary-dark transition-all">
              Join
            </button>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 text-center text-slate-500 text-xs">
        © 2026 VisionShop AI. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
