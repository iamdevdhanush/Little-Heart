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
import { auth } from './lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { getUserProfile } from './services/firebaseService';

// Screens
import { AuthScreen, OnboardingScreen } from './screens/AuthScreens';
import { Dashboard } from './screens/Dashboard';
import { InsightsScreen } from './screens/InsightsScreen';
import { CommunityScreen } from './screens/CommunityScreen';
import { Chatbot } from './screens/Chatbot';
import { ProfileSettingsScreen } from './screens/ProfileSettingsScreen';
import { EmergencyScreen } from './screens/EmergencyScreen';
import { MedicalReportScreen } from './screens/MedicalReportScreen';
import { PWAInstallPrompt } from './components/PWAInstallPrompt';
import { PWAProvider } from './contexts/PWAContext';

export default function App() {
  const [screen, setScreen] = useState<'auth' | 'profile' | 'main'>('auth');
  const [activeTab, setActiveTab] = useState<'home' | 'insights' | 'community' | 'chat' | 'profile'>('home');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [showEmergency, setShowEmergency] = useState(false);
  const [showMedicalReport, setShowMedicalReport] = useState(false);

  // Persistence (Firebase Auth Listener)
  useEffect(() => {
    if (auth) {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          const profile = await getUserProfile(firebaseUser.uid);
          if (profile) {
            setUser(profile);
            setScreen('main');
          } else {
            setScreen('profile');
          }
        } else {
          // Fallback to local storage if not logged in via Firebase
          const saved = localStorage.getItem('heartbeat_user');
          if (saved) {
            setUser(JSON.parse(saved));
            setScreen('main');
          } else {
            setScreen('auth');
          }
        }
      });
      return () => unsubscribe();
    } else {
      // Fallback if Firebase is not configured
      const saved = localStorage.getItem('heartbeat_user');
      if (saved) {
        setUser(JSON.parse(saved));
        setScreen('main');
      }
    }
  }, []);

  const handleAuth = () => setScreen('profile');
  
  const handleProfileComplete = (data: UserProfile) => {
    setUser(data);
    setScreen('main');
  };

  const t = TRANSLATIONS[user?.language || 'en'];

  return (
    <PWAProvider>
      <div className="flex flex-col h-full gradient-bg selection:bg-brand-pink/20">
        <PWAInstallPrompt />
      <AnimatePresence mode="wait">
        {screen === 'auth' && <AuthScreen key="auth" onComplete={handleAuth} />}
        {screen === 'profile' && <OnboardingScreen key="onboarding" onComplete={handleProfileComplete} />}
        {screen === 'main' && (
          <div className="flex flex-col h-full overflow-hidden">
            <header className="px-6 pt-12 pb-6 flex justify-between items-center bg-rose-50/80 backdrop-blur-xl border-b border-rose-100/50 sticky top-0 z-50">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white rounded-[1.5rem] flex items-center justify-center shadow-sm border border-rose-100/50">
                  <Activity className="text-rose-500" size={24} />
                </div>
                <div>
                  <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Little Heartbeat</h1>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">AI Doctor Active</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    const newLang: 'en' | 'hi' = user?.language === 'en' ? 'hi' : 'en';
                    const newUser: UserProfile = { ...user!, language: newLang };
                    setUser(newUser);
                    localStorage.setItem('heartbeat_user', JSON.stringify(newUser));
                  }}
                  className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-rose-500 border border-rose-100/50 transition-all hover:bg-rose-50 shadow-sm"
                >
                  <Globe size={20} />
                </motion.button>
              </div>
            </header>

            <main className="flex-1 overflow-y-auto px-6 pb-36 pt-4 no-scrollbar">
              <AnimatePresence mode="wait">
                {activeTab === 'chat' && <Chatbot key="chat" user={user!} t={t} onEmergency={() => setShowEmergency(true)} onNavigate={setActiveTab} />}
                {activeTab === 'home' && <Dashboard key="home" user={user!} t={t} onEmergency={() => setShowEmergency(true)} onChat={() => setActiveTab('chat')} onUploadReport={() => setShowMedicalReport(true)} />}
                {activeTab === 'insights' && <InsightsScreen key="insights" t={t} />}
                {activeTab === 'community' && <CommunityScreen key="community" t={t} />}
                {activeTab === 'profile' && <ProfileSettingsScreen key="profile" user={user!} setUser={setUser} setScreen={setScreen} t={t} />}
              </AnimatePresence>
            </main>

            <AnimatePresence>
              {showEmergency && <EmergencyScreen key="emergency" t={t} onClose={() => setShowEmergency(false)} />}
              {showMedicalReport && <MedicalReportScreen key="medical-report" user={user!} t={t} onClose={() => setShowMedicalReport(false)} />}
            </AnimatePresence>

            <nav className="absolute bottom-8 left-6 right-6 bg-white/90 backdrop-blur-2xl border border-rose-100/50 px-6 py-4 flex justify-between items-center z-50 rounded-[2rem] shadow-lg shadow-rose-500/10">
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
    </PWAProvider>
  );
}

function NavButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        'flex flex-col items-center gap-1.5 transition-all duration-500 relative py-2 px-3 z-10',
        active ? 'text-rose-500' : 'text-slate-400 hover:text-rose-400'
      )}
    >
      {active && (
        <motion.div 
          layoutId="nav-pill"
          className="absolute inset-0 bg-rose-50 rounded-[1.5rem] -z-10 border border-rose-100/50"
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      )}
      <div className={cn('transition-transform duration-500', active && 'scale-110')}>
        {icon}
      </div>
      <span className="text-[10px] font-bold tracking-wide">{label}</span>
    </button>
  );
}
