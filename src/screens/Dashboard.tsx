import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Activity, AlertCircle, MessageCircle, CheckCircle2, Circle, Upload, FileText, ChevronRight, Download } from 'lucide-react';
import { Card, Badge, Section } from '../components/UI';
import { BABY_GROWTH, DIET_DATA, UserProfile } from '../data/mockData';
import { getDailyChecklist, saveDailyChecklist } from '../services/firebaseService';
import { usePWA } from '../contexts/PWAContext';

export function Dashboard({ user, t, onEmergency, onChat, onUploadReport }: { user: UserProfile, t: any, onEmergency: () => void, onChat: () => void, onUploadReport: () => void }) {
  const { showInstallButton, installApp } = usePWA();
  const growth = BABY_GROWTH[user.pregnancyMonth - 1] || BABY_GROWTH[0];
  const diet = DIET_DATA.find(d => d.region === user.region) || DIET_DATA[0];
  
  const [checklist, setChecklist] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
      variants={containerVariants}
      initial="hidden"
      animate="show"
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6 pb-24"
    >
      {/* 1. Baby Growth Hero Section */}
      <motion.div variants={itemVariants}>
        <Card noHover className="bg-gradient-to-br from-rose-400 to-rose-500 text-white border-0 overflow-hidden relative p-8 shadow-lg shadow-rose-500/20">
          <div className="relative z-10">
            <div className="flex justify-between items-center mb-6">
              <Badge variant="default" className="bg-white/20 text-white backdrop-blur-md border border-white/20 shadow-sm">
                Week {user.pregnancyMonth * 4}
              </Badge>
              <span className="text-xs font-bold text-white/80 uppercase tracking-wider">{280 - (user.pregnancyMonth * 28)} days to go</span>
            </div>
            
            <div className="flex items-center gap-6 mb-6">
              <motion.div 
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md border border-white/30 shadow-inner"
              >
                <span className="text-5xl drop-shadow-lg">{growth.emoji}</span>
              </motion.div>
              <div>
                <h3 className="text-2xl font-extrabold leading-tight tracking-tight mb-1">
                  {t.babySize}
                </h3>
                <p className="text-white/90 font-bold text-sm">Size of a {growth.sizeComparison}</p>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20 shadow-sm">
              <p className="text-sm font-bold leading-relaxed opacity-95 tracking-wide">{growth.insight}</p>
            </div>
          </div>
          
          {/* Background decorative elements */}
          <div className="absolute -right-12 -top-12 w-64 h-64 bg-white/10 rounded-full blur-3xl mix-blend-overlay" />
          <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-orange-300/20 rounded-full blur-3xl mix-blend-overlay" />
        </Card>
      </motion.div>

      {showInstallButton && (
        <motion.div variants={itemVariants}>
          <Card 
            onClick={installApp}
            className="p-4 bg-rose-50/50 border-2 border-rose-200 border-dashed rounded-[2rem] flex items-center justify-between cursor-pointer hover:bg-rose-100/50 transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-rose-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-rose-500/20 group-hover:scale-110 transition-transform">
                <Download size={24} />
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-slate-800 tracking-tight">Install Little Heartbeat</h4>
                <p className="text-[11px] text-slate-500 font-bold">Access your pregnancy companion faster</p>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-rose-500 shadow-sm">
              <ChevronRight size={18} />
            </div>
          </Card>
        </motion.div>
      )}

      {/* 2. Today's Care Checklist */}
      <motion.div variants={itemVariants}>
        <Section title="Today's Care Plan">
          <Card className="p-5 bg-white/90 backdrop-blur-xl shadow-sm border-rose-100/50">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                {completedTasks} of {checklist.length} completed
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
                <motion.div 
                  key={task.id}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
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
                </motion.div>
              ))}
            </div>
          </Card>
        </Section>
      </motion.div>

      {/* 3. AI Insights & Medical Report Card */}
      <motion.div variants={itemVariants}>
        <Section title="Medical AI Analysis">
          <Card 
            className="p-0 overflow-hidden border-0 shadow-lg shadow-purple-500/20 bg-gradient-to-br from-purple-400 to-pink-400 cursor-pointer"
            onClick={onUploadReport}
          >
            <motion.div whileHover={{ scale: 1.02 }} className="p-6 text-white relative z-10">
              <div className="flex justify-between items-start mb-4">
                <div className="w-14 h-14 bg-white/20 rounded-[1.5rem] flex items-center justify-center backdrop-blur-md border border-white/30 shadow-inner">
                  <FileText size={26} className="text-white drop-shadow-md" />
                </div>
                <Badge variant="default" className="bg-white/20 text-white border-0 shadow-sm backdrop-blur-md">New</Badge>
              </div>
              <h4 className="text-lg font-bold tracking-tight mb-2">Analyze Medical Report</h4>
              <p className="text-sm text-white/80 font-medium leading-relaxed mb-4">
                Upload your latest ultrasound or blood test for instant AI insights and risk assessment.
              </p>
              <div className="flex items-center text-sm font-bold text-white gap-1">
                Upload now <ChevronRight size={16} />
              </div>
            </motion.div>
            <div className="absolute right-0 bottom-0 w-32 h-32 bg-white/10 rounded-tl-full blur-2xl" />
          </Card>
        </Section>
      </motion.div>

      {/* 4. Quick Actions Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
        <Card 
          className="p-5 flex flex-col items-center text-center gap-3 bg-white/90 backdrop-blur-xl border-rose-100/50 shadow-sm cursor-pointer hover:bg-rose-50/50"
          onClick={onChat}
        >
          <div className="w-14 h-14 rounded-[1.5rem] bg-rose-50 flex items-center justify-center text-rose-500 border border-rose-100/50 shadow-sm">
            <MessageCircle size={26} />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-sm tracking-tight">Ask AI Doctor</h4>
            <p className="text-[10px] text-slate-500 font-bold mt-0.5 uppercase tracking-wider">24/7 Support</p>
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
            <h4 className="font-bold text-red-900 text-sm tracking-tight">Emergency</h4>
            <p className="text-[10px] text-red-500 font-bold mt-0.5 uppercase tracking-wider">Get help now</p>
          </div>
        </Card>
      </motion.div>

      {/* 5. Diet & Nutrition (Lazy loaded feel) */}
      <motion.div variants={itemVariants}>
        <Section title={t.diet}>
          <Card className="p-6 bg-white/90 backdrop-blur-xl shadow-sm border-rose-100/50">
            <div className="flex justify-between items-center mb-6">
              <h4 className="font-bold text-slate-900 text-sm tracking-tight">{user.region} Diet</h4>
              <Badge variant="success" className="px-3 py-1 text-[10px] shadow-sm">Recommended</Badge>
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
      </motion.div>
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

