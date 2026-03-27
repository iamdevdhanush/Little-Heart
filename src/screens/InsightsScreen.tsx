import React from 'react';
import { motion } from 'motion/react';
import { Activity } from 'lucide-react';
import { Card, Badge, Section } from '../components/UI';
import { INSIGHTS_CONTENT } from '../data/mockData';

export function InsightsScreen({ t }: { t: any }) {
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
      <motion.div variants={itemVariants}>
        <Section title={t.symptoms}>
          <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
            {["Nausea", "Fatigue", "Back Pain", "Swelling"].map((s, idx) => (
              <motion.div
                key={s}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + idx * 0.1 }}
              >
                <Card className="min-w-[120px] p-4 flex flex-col items-center gap-3 border-rose-100/50 bg-white/90 backdrop-blur-xl shadow-sm hover:bg-rose-50/50 cursor-pointer">
                  <div className="w-14 h-14 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 border border-rose-100 shadow-sm">
                    <Activity size={24} />
                  </div>
                  <p className="text-xs font-bold text-slate-700">{s}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </Section>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Section title={t.education}>
          <div className="space-y-4">
            {INSIGHTS_CONTENT.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
              >
                <Card className="p-5 flex gap-4 items-start bg-white/90 backdrop-blur-xl border-rose-100/50 shadow-sm">
                  <div className="text-3xl bg-rose-50 w-14 h-14 rounded-[1.5rem] flex items-center justify-center shrink-0 border border-rose-100/50 shadow-sm">{item.icon}</div>
                  <div className="flex-1 pt-1">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-slate-900 text-sm leading-tight pr-2">{item.title}</h4>
                      <Badge variant="info" className="shrink-0 shadow-sm">{item.category}</Badge>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed font-bold">{item.content}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </Section>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Section title={t.bodySupport}>
          <Card className="p-5 bg-blue-50/80 backdrop-blur-xl border-blue-100 shadow-sm">
            <h4 className="font-bold text-blue-900 mb-2 text-sm">Understanding Pain</h4>
            <p className="text-xs text-blue-800/90 leading-relaxed font-bold">
              Mild pain is normal during pregnancy as your body changes. Take rest and stay hydrated. If pain is sharp or persistent, consult your doctor.
            </p>
          </Card>
        </Section>
      </motion.div>
    </motion.div>
  );
}
