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
                <Card className="min-w-[140px] p-4 flex flex-col items-center gap-2 border-slate-50">
                  <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center text-pink-500">
                    <Activity size={20} />
                  </div>
                  <p className="text-[11px] font-black text-slate-800 uppercase tracking-wider">{s}</p>
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
                <Card className="p-6 flex gap-5 items-center">
                  <div className="text-3xl">{item.icon}</div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="font-black text-slate-800">{item.title}</h4>
                      <Badge variant="info">{item.category}</Badge>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">{item.content}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </Section>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Section title={t.bodySupport}>
          <Card className="p-6 bg-brand-blue/5 border-brand-blue/10">
            <h4 className="font-black text-brand-blue-dark mb-2">Understanding Pain</h4>
            <p className="text-sm text-slate-600 leading-relaxed">
              Mild pain is normal during pregnancy as your body changes. Take rest and stay hydrated. If pain is sharp or persistent, consult your doctor.
            </p>
          </Card>
        </Section>
      </motion.div>
    </motion.div>
  );
}
