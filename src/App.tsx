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

import { ErrorBoundary } from './components/ErrorBoundary';

export default function App() {
  const [screen, setScreen] = useState<'auth' | 'profile' | 'main'>('auth');
  const [activeTab, setActiveTab] = useState<'home' | 'insights' | 'community' | 'chat' | 'profile'>('home');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [showEmergency, setShowEmergency] = useState(false);
  const [showMedicalReport, setShowMedicalReport] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Persistence (Firebase Auth Listener)
  useEffect(() => {
    if (auth) {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        setIsLoading(true);
        if (firebaseUser) {
          try {
            const profile = await getUserProfile(firebaseUser.uid);
            if (profile) {
              setUser(profile);
              setScreen('main');
            } else {
              // Only set to profile if we are sure no profile exists
              setScreen('profile');
            }
          } catch (error) {
            console.error("Error in auth listener:", error);
            // Fallback to local storage if profile fetch fails
            const saved = localStorage.getItem('heartbeat_user');
            if (saved) {
              setUser(JSON.parse(saved));
              setScreen('main');
            }
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
        setIsLoading(false);
      });
      return () => unsubscribe();
    } else {
      // Fallback if Firebase is not configured
      const saved = localStorage.getItem('heartbeat_user');
      if (saved) {
        setUser(JSON.parse(saved));
        setScreen('main');
      }
      setIsLoading(false);
    }
  }, []);

  const handleAuth = () => {
    // We let onAuthStateChanged handle the screen transition based on profile existence
    // This prevents the race condition where an existing user is sent to onboarding
    console.log("Auth completed, waiting for profile check...");
  };
  
  const handleProfileComplete = async (data: UserProfile) => {
    setUser(data);
    setScreen('main');
    // Ensure it's saved to local storage as well for immediate consistency
    localStorage.setItem('heartbeat_user', JSON.stringify(data));
  };

  const t = TRANSLATIONS[user?.language || 'en'];

  if (isLoading) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-rose-50">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-xl border-4 border-rose-100 mb-4"
        >
          <Activity className="text-rose-500" size={32} />
        </motion.div>
        <p className="text-rose-500 font-bold animate-pulse tracking-widest uppercase text-xs">Loading Heartbeat...</p>
      </div>
    );
  }

  return (
    <ErrorBoundary>
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
                    const languages: UserProfile['language'][] = ['en', 'hi', 'kn', 'bn', 'te', 'mr', 'ta', 'gu', 'ml', 'or', 'pa', 'as'];
                    const currentIndex = languages.indexOf(user?.language || 'en');
                    const nextIndex = (currentIndex + 1) % languages.length;
                    const newLang = languages[nextIndex];
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

            <main className="flex-1 overflow-y-auto px-6 pb-40 pt-4 no-scrollbar relative">
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

            <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-3rem)] max-w-md bg-white/95 backdrop-blur-2xl border border-rose-100/50 px-4 py-3 flex justify-between items-center z-[100] rounded-[2.5rem] shadow-2xl shadow-rose-500/20">
              <NavButton active={activeTab === 'chat'} onClick={() => setActiveTab('chat')} icon={<MessageCircle size={22} />} label={t.chat} />
              <NavButton active={activeTab === 'home'} onClick={() => setActiveTab('home')} icon={<Home size={22} />} label={t.dashboard} />
              <NavButton active={activeTab === 'insights'} onClick={() => setActiveTab('insights')} icon={<Activity size={22} />} label={t.insights} />
              <NavButton active={activeTab === 'community'} onClick={() => setActiveTab('community')} icon={<Heart size={22} />} label={t.community} />
              <NavButton active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} icon={<User size={22} />} label={t.profile} />
            </nav>
          </div>
        )}
      </AnimatePresence>
    </div>
      </PWAProvider>
    </ErrorBoundary>
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
