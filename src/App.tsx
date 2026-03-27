import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageCircle, 
  Activity, 
  User, 
  Home, 
  Heart,
  Globe,
  Settings
} from 'lucide-react';
import { cn } from './lib/utils';
import { TRANSLATIONS, UserProfile } from './data/mockData';

// Screens
import { AuthScreen, OnboardingScreen } from './screens/AuthScreens';
import { Dashboard } from './screens/Dashboard';
import { InsightsScreen } from './screens/InsightsScreen';
import { CommunityScreen } from './screens/CommunityScreen';
import { Chatbot } from './screens/Chatbot';
import { ProfileSettingsScreen } from './screens/ProfileSettingsScreen';
import { EmergencyScreen } from './screens/EmergencyScreen';

export default function App() {
  const [screen, setScreen] = useState<'auth' | 'profile' | 'main'>('auth');
  const [activeTab, setActiveTab] = useState<'home' | 'insights' | 'community' | 'chat' | 'profile'>('chat');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [showEmergency, setShowEmergency] = useState(false);

  // Persistence (mock)
  useEffect(() => {
    const saved = localStorage.getItem('heartbeat_user');
    if (saved) {
      setUser(JSON.parse(saved));
      setScreen('main');
    }
  }, []);

  const handleAuth = () => setScreen('profile');
  
  const handleProfileComplete = (data: UserProfile) => {
    setUser(data);
    localStorage.setItem('heartbeat_user', JSON.stringify(data));
    setScreen('main');
  };

  const t = TRANSLATIONS[user?.language || 'en'];

  return (
    <div className="flex flex-col h-screen gradient-bg selection:bg-brand-pink/20">
      <AnimatePresence mode="wait">
        {screen === 'auth' && <AuthScreen key="auth" onComplete={handleAuth} />}
        {screen === 'profile' && <OnboardingScreen key="onboarding" onComplete={handleProfileComplete} />}
        {screen === 'main' && (
          <div className="flex flex-col h-full overflow-hidden">
            <header className="px-6 pt-12 pb-6 flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-black text-slate-800 tracking-tighter leading-none">Little Heartbeat</h1>
                <div className="flex items-center gap-2 mt-2">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">AI Doctor Active</p>
                </div>
              </div>
              <div className="flex gap-3">
                <motion.button 
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    const newLang: 'en' | 'hi' = user?.language === 'en' ? 'hi' : 'en';
                    const newUser: UserProfile = { ...user!, language: newLang };
                    setUser(newUser);
                    localStorage.setItem('heartbeat_user', JSON.stringify(newUser));
                  }}
                  className="w-12 h-12 rounded-2xl bg-white shadow-premium flex items-center justify-center text-brand-pink border border-slate-50 transition-all"
                >
                  <Globe size={20} />
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab('profile')}
                  className="w-12 h-12 rounded-2xl bg-white shadow-premium flex items-center justify-center text-slate-300 border border-slate-50 transition-all"
                >
                  <Settings size={20} />
                </motion.button>
              </div>
            </header>

            <main className="flex-1 overflow-y-auto px-6 pb-36 pt-4 no-scrollbar">
              <AnimatePresence mode="wait">
                {activeTab === 'chat' && <Chatbot key="chat" user={user!} t={t} onEmergency={() => setShowEmergency(true)} onNavigate={setActiveTab} />}
                {activeTab === 'home' && <Dashboard key="home" user={user!} t={t} onEmergency={() => setShowEmergency(true)} onChat={() => setActiveTab('chat')} />}
                {activeTab === 'insights' && <InsightsScreen key="insights" t={t} />}
                {activeTab === 'community' && <CommunityScreen key="community" t={t} />}
                {activeTab === 'profile' && <ProfileSettingsScreen key="profile" user={user!} setUser={setUser} setScreen={setScreen} t={t} />}
              </AnimatePresence>
            </main>

            {showEmergency && <EmergencyScreen t={t} onClose={() => setShowEmergency(false)} />}

            <nav className="fixed bottom-8 left-6 right-6 bg-white/80 backdrop-blur-2xl border border-white/40 px-6 py-4 flex justify-between items-center z-50 rounded-[2.5rem] shadow-premium">
              <NavButton active={activeTab === 'chat'} onClick={() => setActiveTab('chat')} icon={<MessageCircle size={24} />} label={t.chat} />
              <NavButton active={activeTab === 'home'} onClick={() => setActiveTab('home')} icon={<Home size={24} />} label={t.dashboard} />
              <NavButton active={activeTab === 'insights'} onClick={() => setActiveTab('insights')} icon={<Activity size={24} />} label={t.insights} />
              <NavButton active={activeTab === 'community'} onClick={() => setActiveTab('community')} icon={<Heart size={24} />} label={t.community} />
              <NavButton active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} icon={<User size={24} />} label={t.profile} />
            </nav>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function NavButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        'flex flex-col items-center gap-1.5 transition-all duration-500 relative py-1 px-3',
        active ? 'text-brand-pink' : 'text-slate-300'
      )}
    >
      {active && (
        <motion.div 
          layoutId="nav-pill"
          className="absolute inset-0 bg-brand-pink/5 rounded-2xl -z-10"
        />
      )}
      <div className={cn('transition-transform duration-500', active && 'scale-110')}>
        {icon}
      </div>
      <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
    </button>
  );
}
