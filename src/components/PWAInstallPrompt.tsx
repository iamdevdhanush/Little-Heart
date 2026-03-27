import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Download, X } from 'lucide-react';
import { usePWA } from '../contexts/PWAContext';

export function PWAInstallPrompt() {
  const { showInstallButton, installApp } = usePWA();
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    if (showInstallButton) {
      setShowPrompt(true);
    }
  }, [showInstallButton]);

  const handleInstall = async () => {
    await installApp();
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 150, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 150, opacity: 0 }}
        className="fixed bottom-28 left-4 right-4 bg-white/95 backdrop-blur-xl p-4 rounded-[2rem] shadow-2xl shadow-rose-500/20 border border-rose-100 z-[100] flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 border border-rose-100/50">
            <Download size={24} />
          </div>
          <div>
            <h4 className="text-sm font-extrabold text-slate-800">Install App</h4>
            <p className="text-[11px] text-slate-500 font-bold">Add to home screen for quick access</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowPrompt(false)} 
            className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
            aria-label="Close install prompt"
          >
            <X size={20} />
          </button>
          <button 
            onClick={handleInstall} 
            className="bg-rose-500 text-white px-5 py-2.5 rounded-[1.5rem] text-xs font-bold shadow-md shadow-rose-500/20 hover:bg-rose-600 transition-colors active:scale-95"
          >
            Install
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
