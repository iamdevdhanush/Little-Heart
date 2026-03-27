import React from 'react';
import { motion } from 'motion/react';
import { User, Globe, Settings, ChevronRight } from 'lucide-react';
import { Card, Button, Section } from '../components/UI';
import { UserProfile } from '../data/mockData';

export function ProfileSettingsScreen({ user, setUser, setScreen, t }: { user: UserProfile, setUser: any, setScreen: any, t: any }) {
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

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8 pb-10"
    >
      <motion.div variants={itemVariants} className="flex flex-col items-center py-6">
        <motion.div 
          whileHover={{ scale: 1.05, rotate: 5 }}
          className="w-24 h-24 rounded-[2rem] pink-gradient flex items-center justify-center mb-4 shadow-xl shadow-brand-pink/20"
        >
          <User size={48} className="text-white" />
        </motion.div>
        <h3 className="text-2xl font-black text-slate-800">{user.name}</h3>
        <p className="text-slate-400 font-medium">Month {user.pregnancyMonth} • {user.region}</p>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Section title="Medical Profile">
          <Card className="p-6 space-y-5">
            <div className="flex justify-between items-center border-b border-slate-50 pb-3">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Due Date</span>
              <span className="text-sm font-bold text-slate-700">{user.dueDate || 'Not set'}</span>
            </div>
            <div className="flex justify-between items-center border-b border-slate-50 pb-3">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Conditions</span>
              <span className="text-sm font-bold text-slate-700">{user.medicalConditions?.join(', ') || 'None'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Allergies</span>
              <span className="text-sm font-bold text-slate-700">{user.allergies?.join(', ') || 'None'}</span>
            </div>
          </Card>
        </Section>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Section title="Settings">
          <div className="space-y-3">
            <Card className="p-5 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500">
                  <Globe size={20} />
                </div>
                <span className="font-bold text-slate-700">{t.language}</span>
              </div>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  const newLang: 'en' | 'hi' = user.language === 'en' ? 'hi' : 'en';
                  const newUser = { ...user, language: newLang };
                  setUser(newUser);
                  localStorage.setItem('heartbeat_user', JSON.stringify(newUser));
                }}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 text-xs font-black uppercase tracking-widest"
              >
                {user.language === 'en' ? 'English' : 'हिंदी'}
              </motion.button>
            </Card>

            <Card className="p-5 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center text-pink-500">
                  <Settings size={20} />
                </div>
                <span className="font-bold text-slate-700">Account Details</span>
              </div>
              <ChevronRight size={20} className="text-slate-300" />
            </Card>
          </div>
        </Section>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Button 
          variant="ghost" 
          className="w-full py-5 text-red-400 font-black uppercase tracking-widest text-xs"
          onClick={() => {
            localStorage.removeItem('heartbeat_user');
            setScreen('auth');
          }}
        >
          Logout
        </Button>
      </motion.div>
    </motion.div>
  );
}
