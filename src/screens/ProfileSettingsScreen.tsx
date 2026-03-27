import React from 'react';
import { motion } from 'motion/react';
import { User, Globe, Settings, ChevronRight, LogOut, Download, Loader2 } from 'lucide-react';
import { Card, Button, Section } from '../components/UI';
import { UserProfile } from '../data/mockData';
import { logoutUser, saveUserProfile } from '../services/firebaseService';
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

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिंदी' },
    { code: 'kn', name: 'ಕನ್ನಡ' },
    { code: 'bn', name: 'বাংলা' },
    { code: 'te', name: 'తెలుగు' },
    { code: 'mr', name: 'मराठी' },
    { code: 'ta', name: 'தமிழ்' },
    { code: 'gu', name: 'ગુજરાતી' },
    { code: 'ml', name: 'മലയാളം' },
    { code: 'or', name: 'ଓଡ଼ିଆ' },
    { code: 'pa', name: 'ਪੰਜਾਬੀ' },
    { code: 'as', name: 'অসমীয়া' },
  ];

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value as UserProfile['language'];
    const newUser = { ...user, language: newLang };
    setUser(newUser);
    localStorage.setItem('heartbeat_user', JSON.stringify(newUser));
  };

  const [isEditing, setIsEditing] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [editData, setEditData] = React.useState<UserProfile>(user);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const userId = user.id || 'mock-user-123';
      const updatedData = { ...editData, id: userId };
      
      // Save to Firebase
      await saveUserProfile(userId, updatedData);
      
      // Update local state
      setUser(updatedData);
      localStorage.setItem('heartbeat_user', JSON.stringify(updatedData));
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to save profile:", error);
      alert("Failed to save profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
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
        <Section 
          title="Medical Profile" 
          action={
            <button 
              onClick={() => isEditing ? handleSave() : setIsEditing(true)} 
              disabled={isSaving}
              className="text-xs font-bold text-rose-500 bg-rose-50 px-4 py-1.5 rounded-full border border-rose-100 flex items-center gap-2"
            >
              {isSaving ? <Loader2 size={12} className="animate-spin" /> : (isEditing ? 'Save' : 'Edit')}
            </button>
          }
        >
          <Card className="p-5 space-y-4 bg-white/90 backdrop-blur-xl border-rose-100/50 shadow-sm">
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Due Date</label>
                  <input 
                    type="date" 
                    value={editData.dueDate || ''} 
                    onChange={(e) => setEditData({ ...editData, dueDate: e.target.value })}
                    className="w-full p-2 rounded-lg border border-rose-100 text-sm font-bold text-slate-900"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">BP</label>
                    <input 
                      type="text" 
                      value={editData.bp || ''} 
                      onChange={(e) => setEditData({ ...editData, bp: e.target.value })}
                      className="w-full p-2 rounded-lg border border-rose-100 text-sm font-bold text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Sugar</label>
                    <input 
                      type="text" 
                      value={editData.sugar || ''} 
                      onChange={(e) => setEditData({ ...editData, sugar: e.target.value })}
                      className="w-full p-2 rounded-lg border border-rose-100 text-sm font-bold text-slate-900"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Conditions</label>
                  <input 
                    type="text" 
                    value={editData.medicalConditions?.join(', ') || ''} 
                    onChange={(e) => setEditData({ ...editData, medicalConditions: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                    className="w-full p-2 rounded-lg border border-rose-100 text-sm font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Allergies</label>
                  <input 
                    type="text" 
                    value={editData.allergies?.join(', ') || ''} 
                    onChange={(e) => setEditData({ ...editData, allergies: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                    className="w-full p-2 rounded-lg border border-rose-100 text-sm font-bold text-slate-900"
                  />
                </div>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center border-b border-rose-100/50 pb-4">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Due Date</span>
                  <span className="text-sm font-bold text-slate-900">{user.dueDate || 'Not set'}</span>
                </div>
                <div className="grid grid-cols-2 gap-4 border-b border-rose-100/50 pb-4">
                  <div>
                    <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">BP</span>
                    <span className="text-sm font-bold text-slate-900">{user.bp || '120/80'}</span>
                  </div>
                  <div>
                    <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Sugar</span>
                    <span className="text-sm font-bold text-slate-900">{user.sugar || '90 mg/dL'}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center border-b border-rose-100/50 pb-4">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Conditions</span>
                  <span className="text-sm font-bold text-slate-900 text-right">{user.medicalConditions?.join(', ') || 'None'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Allergies</span>
                  <span className="text-sm font-bold text-slate-900 text-right">{user.allergies?.join(', ') || 'None'}</span>
                </div>
              </>
            )}
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
              <div className="relative">
                <select
                  value={user.language}
                  onChange={handleLanguageChange}
                  className="appearance-none px-5 py-2.5 rounded-full bg-rose-50 text-rose-600 text-xs font-bold transition-colors hover:bg-rose-100 border border-rose-100 shadow-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-rose-200"
                >
                  {languages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.name}
                    </option>
                  ))}
                </select>
              </div>
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
