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
      className="fixed inset-0 z-[100] bg-red-600 flex flex-col items-center justify-center text-center p-10"
    >
      <motion.div 
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="w-40 h-40 bg-white/20 rounded-full flex items-center justify-center mb-12"
      >
        <AlertCircle size={80} className="text-white" />
      </motion.div>
      
      <div className="space-y-6 mb-16">
        <h2 className="text-5xl font-black text-white tracking-tighter">{t.emergencyWarning}</h2>
        <p className="text-white/80 text-xl font-bold leading-relaxed">{t.emergencyAction}</p>
      </div>

      <div className="w-full space-y-6">
        <Button className="w-full py-6 text-2xl bg-white text-red-600 font-black shadow-2xl flex items-center justify-center gap-4 rounded-[2rem]">
          <Phone size={32} /> {t.callHospital}
        </Button>
        <button 
          onClick={onClose}
          className="text-white/60 font-bold uppercase tracking-widest text-xs"
        >
          I am safe now
        </button>
      </div>

      <div className="absolute bottom-10 left-10 right-10">
        <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest leading-relaxed">
          Emergency services will be notified of your location automatically.
        </p>
      </div>
    </motion.div>
  );
}
