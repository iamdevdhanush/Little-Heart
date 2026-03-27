import React from 'react';
import { motion } from 'motion/react';
import { Heart, Activity, AlertCircle, MessageCircle } from 'lucide-react';
import { Card, Badge, Section } from '../components/UI';
import { BABY_GROWTH, DIET_DATA, UserProfile } from '../data/mockData';

export function Dashboard({ user, t, onEmergency, onChat }: { user: UserProfile, t: any, onEmergency: () => void, onChat: () => void }) {
  const growth = BABY_GROWTH[user.pregnancyMonth - 1];
  const diet = DIET_DATA.find(d => d.region === user.region) || DIET_DATA[0];

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
      className="space-y-10"
    >
      {/* Baby Growth Card */}
      <motion.div variants={itemVariants}>
        <Card noHover className="pink-gradient text-white border-0 overflow-hidden relative p-10">
          <div className="relative z-10">
            <Badge variant="default" className="bg-white/20 text-white mb-6 backdrop-blur-md border border-white/20">Month {user.pregnancyMonth}</Badge>
            <h3 className="text-3xl font-black mb-8 leading-[1.1] tracking-tight">
              {t.babySize} <br/> 
              <span className="text-5xl block mt-2 drop-shadow-lg">{growth.sizeComparison} {growth.emoji}</span>
            </h3>
            <div className="bg-white/15 backdrop-blur-xl rounded-[1.5rem] p-6 border border-white/20 shadow-inner-soft">
              <p className="text-[13px] font-semibold leading-relaxed opacity-95 tracking-tight">{growth.insight}</p>
            </div>
          </div>
          <motion.div 
            animate={{ scale: [1, 1.15, 1], opacity: [0.1, 0.25, 0.1], rotate: [0, 5, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -right-16 -bottom-16"
          >
            <Heart size={280} className="fill-white" />
          </motion.div>
        </Card>
      </motion.div>

      {/* Risk Summary Card */}
      <motion.div variants={itemVariants}>
        <Section title="AI Health Status">
          <Card className="p-8 border-l-8 border-l-green-400 bg-white/90">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h4 className="text-xl font-black text-slate-800 tracking-tight">AI Risk Assessment</h4>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-2">Powered by Little Heartbeat AI</p>
              </div>
              <Badge variant="success" className="px-4 py-1.5 text-[11px]">Low Risk</Badge>
            </div>
            <p className="text-[13px] text-slate-600 leading-relaxed font-medium tracking-tight">Your profile indicates a healthy pregnancy. Keep monitoring your symptoms daily with our AI assistant.</p>
            <motion.button 
              whileHover={{ x: 8 }}
              className="mt-6 text-brand-pink font-black text-xs flex items-center gap-2 uppercase tracking-[0.15em]"
            >
              View Full Report <span className="text-lg">→</span>
            </motion.button>
          </Card>
        </Section>
      </motion.div>

      {/* AI Chat CTA */}
      <motion.div variants={itemVariants}>
        <Card className="p-8 bg-brand-pink/5 border-brand-pink/10 flex items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-[1.5rem] pink-gradient flex items-center justify-center text-white shadow-xl shadow-brand-pink/20">
              <MessageCircle size={32} />
            </div>
            <div>
              <h4 className="font-black text-slate-800 text-base tracking-tight">Have a question?</h4>
              <p className="text-xs text-slate-500 font-bold mt-1">Ask our AI doctor assistant</p>
            </div>
          </div>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onChat}
            className="px-6 py-3 rounded-2xl bg-white text-brand-pink font-black text-[11px] uppercase tracking-widest shadow-premium border border-brand-pink/5"
          >
            Chat Now
          </motion.button>
        </Card>
      </motion.div>

      {/* Emergency Button */}
      <motion.div variants={itemVariants}>
        <motion.button 
          whileHover={{ scale: 1.02, y: -4 }}
          whileTap={{ scale: 0.98 }}
          onClick={onEmergency}
          className="w-full py-8 rounded-[2.5rem] bg-red-500 text-white font-black text-2xl shadow-2xl shadow-red-200 flex items-center justify-center gap-4 active:scale-95 transition-all duration-300"
        >
          <AlertCircle size={32} /> {t.emergencyHelp}
        </motion.button>
      </motion.div>

      {/* Insight Card */}
      <motion.div variants={itemVariants}>
        <Section title={t.insight}>
          <Card className="blue-gradient text-white border-0 p-8 overflow-hidden relative">
            <div className="flex items-center gap-6 relative z-10">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-[1.5rem] flex items-center justify-center shrink-0 border border-white/20 shadow-inner-soft">
                <Heart size={32} className="fill-white" />
              </div>
              <div>
                <p className="text-[15px] font-bold leading-relaxed tracking-tight">{growth.bodyChanges}</p>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl" />
          </Card>
        </Section>
      </motion.div>

      {/* Diet Card */}
      <motion.div variants={itemVariants}>
        <Section title={t.diet}>
          <Card className="p-10">
            <div className="flex justify-between items-center mb-8">
              <h4 className="font-black text-slate-800 text-2xl tracking-tight">{user.region}</h4>
              <Badge variant="success" className="px-4 py-1.5">Recommended</Badge>
            </div>
            <div className="grid grid-cols-2 gap-10">
              <div className="space-y-6">
                <p className="text-[10px] font-black text-green-600 uppercase tracking-[0.2em]">{t.eat}</p>
                <ul className="space-y-4">
                  {diet.eat.map((item, idx) => (
                    <motion.li 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + idx * 0.1 }}
                      key={item} 
                      className="text-[13px] font-bold text-slate-500 flex items-start gap-3 leading-tight"
                    >
                      <div className="w-2.5 h-2.5 rounded-full bg-green-400 mt-0.5 shrink-0 shadow-sm shadow-green-200" /> {item}
                    </motion.li>
                  ))}
                </ul>
              </div>
              <div className="space-y-6">
                <p className="text-[10px] font-black text-red-400 uppercase tracking-[0.2em]">{t.avoid}</p>
                <ul className="space-y-4">
                  {diet.avoid.map((item, idx) => (
                    <motion.li 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + idx * 0.1 }}
                      key={item} 
                      className="text-[13px] font-bold text-slate-500 flex items-start gap-3 leading-tight"
                    >
                      <div className="w-2.5 h-2.5 rounded-full bg-red-300 mt-0.5 shrink-0 shadow-sm shadow-red-100" /> {item}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        </Section>
      </motion.div>

      {/* Exercise & Care */}
      <motion.div variants={itemVariants}>
        <Section title={t.care}>
          <div className="grid grid-cols-2 gap-6">
            <Card className="p-8 flex flex-col items-center text-center gap-4 border-slate-50/50 bg-white/60">
              <div className="w-16 h-16 rounded-[1.5rem] bg-blue-50/50 flex items-center justify-center text-blue-500 shadow-inner-soft border border-blue-100/50">
                <Activity size={28} />
              </div>
              <p className="text-xs font-black text-slate-800 uppercase tracking-[0.15em]">Daily Walk</p>
              <p className="text-[11px] font-bold text-slate-400 leading-relaxed">15-20 mins light walk</p>
            </Card>
            <Card className="p-8 flex flex-col items-center text-center gap-4 border-slate-50/50 bg-white/60">
              <div className="w-16 h-16 rounded-[1.5rem] bg-pink-50/50 flex items-center justify-center text-pink-500 shadow-inner-soft border border-pink-100/50">
                <Heart size={28} />
              </div>
              <p className="text-xs font-black text-slate-800 uppercase tracking-[0.15em]">Rest Well</p>
              <p className="text-[11px] font-bold text-slate-400 leading-relaxed">8 hours of sleep</p>
            </Card>
          </div>
        </Section>
      </motion.div>
    </motion.div>
  );
}
