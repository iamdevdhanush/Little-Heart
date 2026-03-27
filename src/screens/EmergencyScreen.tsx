import React from 'react';
import { motion } from 'motion/react';
import { AlertCircle, Phone } from 'lucide-react';
import { Button } from '../components/UI';

export function EmergencyScreen({ t, onClose }: { t: any, onClose: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-rose-600 flex flex-col items-center justify-center text-center p-8"
    >
      <motion.div 
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center mb-10 backdrop-blur-sm border-4 border-white/30"
      >
        <AlertCircle size={64} className="text-white" />
      </motion.div>
      
      <div className="space-y-4 mb-12">
        <h2 className="text-4xl font-bold text-white tracking-tight">{t.emergencyWarning}</h2>
        <p className="text-white/90 text-lg font-medium leading-relaxed max-w-[280px] mx-auto">{t.emergencyAction}</p>
      </div>

      <div className="w-full space-y-6">
        <Button className="w-full py-5 text-xl bg-white text-rose-600 font-bold shadow-xl flex items-center justify-center gap-3 rounded-2xl hover:bg-rose-50 transition-colors">
          <Phone size={24} /> {t.callHospital}
        </Button>
        <button 
          onClick={onClose}
          className="text-white/80 font-semibold uppercase tracking-widest text-xs hover:text-white transition-colors"
        >
          I am safe now
        </button>
      </div>

      <div className="absolute bottom-8 left-8 right-8">
        <p className="text-white/60 text-[11px] font-semibold uppercase tracking-widest leading-relaxed">
          Emergency services will be notified of your location automatically.
        </p>
      </div>
    </motion.div>
  );
}
