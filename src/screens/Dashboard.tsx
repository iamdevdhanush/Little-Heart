import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Activity, AlertCircle, MessageCircle, CheckCircle2, Circle, Upload, FileText, ChevronRight, Download, Droplets, Thermometer } from 'lucide-react';
import { Card, Badge, Section } from '../components/UI';
import { BABY_GROWTH, DIET_DATA, UserProfile } from '../data/mockData';
import { getDailyChecklist, saveDailyChecklist } from '../services/firebaseService';
import { usePWA } from '../contexts/PWAContext';

export function Dashboard({ user, t, onEmergency, onChat, onUploadReport }: { user: UserProfile, t: any, onEmergency: () => void, onChat: () => void, onUploadReport: () => void }) {
  const { showInstallButton, installApp } = usePWA();
  const growth = React.useMemo(() => BABY_GROWTH[user.pregnancyMonth - 1] || BABY_GROWTH[0], [user.pregnancyMonth]);
  const diet = React.useMemo(() => DIET_DATA.find(d => d.region === user.region) || DIET_DATA[0], [user.region]);
  
  const [checklist, setChecklist] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [waterIntake, setWaterIntake] = useState(0);

  const daysToGo = React.useMemo(() => {
    if (user.dueDate) {
      const due = new Date(user.dueDate);
      const today = new Date();
      const diffTime = due.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : 0;
    }
    return 280 - (user.pregnancyMonth * 28);
  }, [user.dueDate, user.pregnancyMonth]);

  useEffect(() => {
    const fetchChecklist = async () => {
      setIsLoading(true);
      const today = new Date().toISOString().split('T')[0];
      const tasks = await getDailyChecklist(user.id || 'mock-user-123', today);
      setChecklist(tasks);
      setIsLoading(false);
    };
    fetchChecklist();
  }, [user.id]);

  const toggleTask = async (taskId: string) => {
    const updated = checklist.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t);
    setChecklist(updated);
    const today = new Date().toISOString().split('T')[0];
    await saveDailyChecklist(user.id || 'mock-user-123', today, updated);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } }
  };

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  const completedTasks = checklist.filter(t => t.completed).length;
  const progress = checklist.length > 0 ? (completedTasks / checklist.length) * 100 : 0;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6 pb-24"
    >
      {/* 1. Baby Growth Hero Section */}
      <div className="transform-gpu">
        <Card noHover className="bg-gradient-to-br from-rose-400 to-rose-500 text-white border-0 overflow-hidden relative p-8 shadow-lg shadow-rose-500/20">
          <div className="relative z-10">
            <div className="flex justify-between items-center mb-6">
              <Badge variant="default" className="bg-white/20 text-white backdrop-blur-md border border-white/20 shadow-sm">
                {t.week} {user.pregnancyMonth * 4}
              </Badge>
              <span className="text-xs font-bold text-white/80 uppercase tracking-wider">{daysToGo} {t.daysToGo}</span>
            </div>
            
            <div className="flex items-center gap-6 mb-6">
              <motion.div 
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md border border-white/30 shadow-inner"
              >
                <span className="text-5xl drop-shadow-lg">{growth.emoji}</span>
              </motion.div>
              <div>
                <h3 className="text-2xl font-extrabold leading-tight tracking-tight mb-1">
                  {t.babySize}
                </h3>
                <p className="text-white/90 font-bold text-sm">{t.sizeOfA} {growth.sizeComparison}</p>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20 shadow-sm">
              <p className="text-sm font-bold leading-relaxed opacity-95 tracking-wide">{growth.insight}</p>
            </div>
          </div>
          
          {/* Background decorative elements - simplified for performance */}
          <div className="absolute -right-12 -top-12 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        </Card>
      </div>

      {/* Water & Vitals Section */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-5 bg-white/90 backdrop-blur-xl border-rose-100/50 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500 border border-blue-100 shadow-sm">
              <Droplets size={20} />
            </div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Water</span>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <span className="text-2xl font-extrabold text-slate-900">{waterIntake}</span>
              <span className="text-xs font-bold text-slate-400 ml-1">/ 3L</span>
            </div>
            <div className="flex gap-1">
              <button 
                onClick={() => setWaterIntake(Math.max(0, waterIntake - 0.25))}
                className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-colors border border-slate-100"
              >
                -
              </button>
              <button 
                onClick={() => setWaterIntake(Math.min(5, waterIntake + 0.25))}
                className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white hover:bg-blue-600 transition-colors shadow-sm"
              >
                +
              </button>
            </div>
          </div>
          <div className="mt-4 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${(waterIntake / 3) * 100}%` }}
              className="h-full bg-blue-400 rounded-full"
            />
          </div>
        </Card>

        <Card className="p-5 bg-white/90 backdrop-blur-xl border-rose-100/50 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-500 border border-rose-100 shadow-sm">
              <Activity size={20} />
            </div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Vitals</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-slate-400">BP</span>
              <span className="text-xs font-extrabold text-slate-900">{user.bp || '120/80'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-slate-400">Sugar</span>
              <span className="text-xs font-extrabold text-slate-900">{user.sugar || '90 mg/dL'}</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-rose-50 flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest">Normal Range</span>
          </div>
        </Card>
      </div>

      {/* 2. Today's Care Checklist */}
      <div>
        <Section title={t.todayCarePlan}>
          <Card className="p-5 bg-white/90 backdrop-blur-xl shadow-sm border-rose-100/50">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                {completedTasks} of {checklist.length} {t.completedOf}
              </p>
              <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="h-full bg-emerald-400 rounded-full"
                />
              </div>
            </div>
            
            <div className="space-y-3">
              {checklist.map((task) => (
                <div 
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className={`flex items-center gap-3 p-3.5 rounded-[1.5rem] cursor-pointer transition-colors ${task.completed ? 'bg-emerald-50/50 border border-emerald-100/50' : 'bg-slate-50 border border-slate-100/50 hover:bg-rose-50/50 hover:border-rose-100/50'}`}
                >
                  {task.completed ? (
                    <CheckCircle2 className="text-emerald-500 shrink-0" size={22} />
                  ) : (
                    <Circle className="text-slate-300 shrink-0" size={22} />
                  )}
                  <span className={`text-sm font-bold transition-all ${task.completed ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                    {task.title}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </Section>
      </div>

      {/* 3. AI Insights & Medical Report Card */}
      <div>
        <Section title={t.medicalAI}>
          <Card 
            className="p-0 overflow-hidden border-0 shadow-lg shadow-purple-500/20 bg-gradient-to-br from-purple-400 to-pink-400 cursor-pointer"
            onClick={onUploadReport}
          >
            <div className="p-6 text-white relative z-10">
              <div className="flex justify-between items-start mb-4">
                <div className="w-14 h-14 bg-white/20 rounded-[1.5rem] flex items-center justify-center backdrop-blur-md border border-white/30 shadow-inner">
                  <FileText size={26} className="text-white drop-shadow-md" />
                </div>
                <Badge variant="default" className="bg-white/20 text-white border-0 shadow-sm backdrop-blur-md">New</Badge>
              </div>
              <h4 className="text-lg font-bold tracking-tight mb-2">{t.analyzeReport}</h4>
              <p className="text-sm text-white/80 font-medium leading-relaxed mb-4">
                {t.uploadReportDesc}
              </p>
              <div className="flex items-center text-sm font-bold text-white gap-1">
                {t.uploadNow} <ChevronRight size={16} />
              </div>
            </div>
            <div className="absolute right-0 bottom-0 w-32 h-32 bg-white/10 rounded-tl-full blur-2xl" />
          </Card>
        </Section>
      </div>

      {/* 4. Quick Actions Grid */}
      <div className="grid grid-cols-2 gap-4">
        <Card 
          className="p-5 flex flex-col items-center text-center gap-3 bg-white/90 backdrop-blur-xl border-rose-100/50 shadow-sm cursor-pointer hover:bg-rose-50/50"
          onClick={onChat}
        >
          <div className="w-14 h-14 rounded-[1.5rem] bg-rose-50 flex items-center justify-center text-rose-500 border border-rose-100/50 shadow-sm">
            <MessageCircle size={26} />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-sm tracking-tight">{t.askAIDoctor}</h4>
            <p className="text-[10px] text-slate-500 font-bold mt-0.5 uppercase tracking-wider">{t.support247}</p>
          </div>
        </Card>

        <Card 
          className="p-5 flex flex-col items-center text-center gap-3 bg-red-50/80 backdrop-blur-xl border-red-100/50 shadow-sm cursor-pointer hover:bg-red-100/80"
          onClick={onEmergency}
        >
          <div className="w-14 h-14 rounded-[1.5rem] bg-red-100 flex items-center justify-center text-red-600 border border-red-200/50 shadow-sm">
            <AlertCircle size={26} />
          </div>
          <div>
            <h4 className="font-bold text-red-900 text-sm tracking-tight">{t.emergency}</h4>
            <p className="text-[10px] text-red-500 font-bold mt-0.5 uppercase tracking-wider">{t.getHelpNow}</p>
          </div>
        </Card>
      </div>

      {/* 5. Diet & Nutrition (Lazy loaded feel) */}
      <div>
        <Section title={t.diet}>
          <Card className="p-6 bg-white/90 backdrop-blur-xl shadow-sm border-rose-100/50">
            <div className="flex justify-between items-center mb-6">
              <h4 className="font-bold text-slate-900 text-sm tracking-tight">{user.region} Diet</h4>
              <Badge variant="success" className="px-3 py-1 text-[10px] shadow-sm">{t.recommended}</Badge>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">{t.eat}</p>
                <ul className="space-y-3">
                  {diet.eat.slice(0, 3).map((item, idx) => (
                    <li key={item} className="text-xs font-bold text-slate-600 flex items-start gap-2.5 leading-tight">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1 shrink-0 shadow-sm" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-4">
                <p className="text-[10px] font-bold text-rose-500 uppercase tracking-widest">{t.avoid}</p>
                <ul className="space-y-3">
                  {diet.avoid.slice(0, 3).map((item, idx) => (
                    <li key={item} className="text-xs font-bold text-slate-600 flex items-start gap-2.5 leading-tight">
                      <div className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1 shrink-0 shadow-sm" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        </Section>
      </div>
    </motion.div>
  );
}

// Skeleton Loader for Dashboard
function DashboardSkeleton() {
  return (
    <div className="space-y-6 pb-24 animate-pulse">
      <div className="h-64 bg-rose-100/50 rounded-[2rem] w-full" />
      <div className="space-y-4">
        <div className="h-6 bg-rose-100/50 rounded-full w-32" />
        <div className="h-48 bg-rose-100/50 rounded-[2rem] w-full" />
      </div>
      <div className="h-40 bg-rose-100/50 rounded-[2rem] w-full" />
      <div className="grid grid-cols-2 gap-4">
        <div className="h-32 bg-rose-100/50 rounded-[2rem] w-full" />
        <div className="h-32 bg-rose-100/50 rounded-[2rem] w-full" />
      </div>
    </div>
  );
}

