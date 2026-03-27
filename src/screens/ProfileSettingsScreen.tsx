import React from 'react';
import { motion } from 'motion/react';
import { User, Globe, Settings, ChevronRight, LogOut, Download } from 'lucide-react';
import { Card, Button, Section } from '../components/UI';
import { UserProfile } from '../data/mockData';
import { logoutUser } from '../services/firebaseService';
import { usePWA } from '../contexts/PWAContext';

export function ProfileSettingsScreen({ user, setUser, setScreen, t }: { user: UserProfile, setUser: any, setScreen: any, t: any }) {
  const { showInstallButton, installApp } = usePWA();
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const handleLanguageChange = () => {
    let newLang: 'en' | 'hi' | 'kn' = 'en';
    if (user.language === 'en') newLang = 'hi';
    else if (user.language === 'hi') newLang = 'kn';
    else newLang = 'en';

    const newUser = { ...user, language: newLang };
    setUser(newUser);
    localStorage.setItem('heartbeat_user', JSON.stringify(newUser));
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6 pb-10"
    >
      <motion.div variants={itemVariants} className="flex flex-col items-center py-8">
        <motion.div 
          whileHover={{ scale: 1.05, rotate: 5 }}
          className="w-28 h-28 rounded-full bg-rose-50 flex items-center justify-center mb-5 shadow-lg shadow-rose-500/20 border-4 border-white"
        >
          <User size={48} className="text-rose-400" />
        </motion.div>
        <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">{user.name}</h3>
        <p className="text-sm text-slate-500 font-bold mt-1">Month {user.pregnancyMonth} • {user.region}</p>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Section title="Medical Profile">
          <Card className="p-5 space-y-4 bg-white/90 backdrop-blur-xl border-rose-100/50 shadow-sm">
            <div className="flex justify-between items-center border-b border-rose-100/50 pb-4">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Due Date</span>
              <span className="text-sm font-bold text-slate-900">{user.dueDate || 'Not set'}</span>
            </div>
            <div className="flex justify-between items-center border-b border-rose-100/50 pb-4">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Conditions</span>
              <span className="text-sm font-bold text-slate-900 text-right">{user.medicalConditions?.join(', ') || 'None'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Allergies</span>
              <span className="text-sm font-bold text-slate-900 text-right">{user.allergies?.join(', ') || 'None'}</span>
            </div>
          </Card>
        </Section>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Section title="Settings">
          <div className="space-y-3">
            <Card className="p-4 flex justify-between items-center bg-white/90 backdrop-blur-xl border-rose-100/50 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 border border-rose-100 shadow-sm">
                  <Globe size={20} />
                </div>
                <span className="font-bold text-sm text-slate-900">{t.language}</span>
              </div>
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleLanguageChange}
                className="px-5 py-2.5 rounded-full bg-rose-50 text-rose-600 text-xs font-bold transition-colors hover:bg-rose-100 border border-rose-100 shadow-sm"
              >
                {user.language === 'en' ? 'English' : user.language === 'hi' ? 'हिंदी' : 'ಕನ್ನಡ'}
              </motion.button>
            </Card>

            <Card className="p-4 flex justify-between items-center cursor-pointer hover:bg-rose-50/50 transition-colors bg-white/90 backdrop-blur-xl border-rose-100/50 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 border border-rose-100 shadow-sm">
                  <Settings size={20} />
                </div>
                <span className="font-bold text-sm text-slate-900">Account Details</span>
              </div>
              <ChevronRight size={20} className="text-slate-400" />
            </Card>

            {showInstallButton && (
              <Card 
                onClick={installApp}
                className="p-4 flex justify-between items-center cursor-pointer hover:bg-rose-50/50 transition-colors bg-rose-50/30 border-rose-200 shadow-sm border-dashed"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-rose-500 flex items-center justify-center text-white shadow-md shadow-rose-500/20">
                    <Download size={20} />
                  </div>
                  <div>
                    <span className="font-bold text-sm text-slate-900">Install App</span>
                    <p className="text-[10px] text-slate-500 font-bold">Use as a native app</p>
                  </div>
                </div>
                <ChevronRight size={20} className="text-slate-400" />
              </Card>
            )}
          </div>
        </Section>
      </motion.div>

      <motion.div variants={itemVariants} className="pt-4">
        <Button 
          variant="ghost" 
          className="w-full py-4 text-rose-500 font-semibold text-sm flex items-center justify-center gap-2 hover:bg-rose-50 hover:text-rose-600 rounded-2xl"
          onClick={async () => {
            await logoutUser();
            localStorage.removeItem('heartbeat_user');
            setScreen('auth');
          }}
        >
          <LogOut size={18} /> Logout
        </Button>
      </motion.div>
    </motion.div>
  );
}
