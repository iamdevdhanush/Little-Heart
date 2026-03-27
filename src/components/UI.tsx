import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export const Button = ({ className, variant = 'primary', ...props }: any) => {
  const variants = {
    primary: 'bg-rose-500 text-white shadow-md shadow-rose-500/20 hover:bg-rose-600 hover:shadow-lg hover:shadow-rose-500/30',
    secondary: 'bg-white text-rose-900 border border-rose-100 shadow-sm hover:bg-rose-50',
    outline: 'border-2 border-rose-200 text-rose-700 active:bg-rose-50 hover:border-rose-300',
    ghost: 'text-slate-500 hover:bg-rose-50 hover:text-rose-600',
    danger: 'bg-red-500 text-white shadow-md hover:bg-red-600'
  };
  return (
    <motion.button 
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.96 }}
      className={cn('rounded-[2rem] px-6 py-4 font-bold transition-all active:scale-95 disabled:opacity-50 tracking-wide text-sm', variants[variant as keyof typeof variants], className)} 
      {...props} 
    />
  );
};

export const Card = ({ children, className, noHover = false }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={noHover ? {} : { y: -4, boxShadow: "0 20px 40px -12px rgba(244, 63, 94, 0.08)" }}
    transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
    className={cn('bg-white/90 backdrop-blur-xl rounded-[32px] p-6 shadow-sm border border-rose-100/50', className)}
  >
    {children}
  </motion.div>
);

export const Badge = ({ children, variant = 'default', className }: any) => {
  const variants = {
    default: 'bg-rose-50 text-rose-700 border border-rose-100',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
    warning: 'bg-amber-50 text-amber-700 border border-amber-100',
    danger: 'bg-red-50 text-red-700 border border-red-100',
    info: 'bg-blue-50 text-blue-700 border border-blue-100',
  };
  return (
    <motion.span 
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={cn('px-4 py-1.5 rounded-full text-[11px] font-bold tracking-wider uppercase inline-block', variants[variant as keyof typeof variants], className)}
    >
      {children}
    </motion.span>
  );
};

export const Section = ({ title, children, className }: any) => (
  <div className={cn('space-y-4', className)}>
    {title && (
      <motion.h4 
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-xs font-bold text-rose-400/80 uppercase tracking-widest px-2"
      >
        {title}
      </motion.h4>
    )}
    {children}
  </div>
);

export const Input = ({ className, error, ...props }: any) => (
  <div className="space-y-1.5">
    <motion.div
      whileFocus={{ scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="relative"
    >
      <input 
        className={cn(
          'w-full px-5 py-4 rounded-[2rem] bg-rose-50/30 border-2 transition-all duration-300 focus:outline-none focus:ring-4 font-medium text-slate-800 placeholder:text-slate-400 text-sm',
          error ? 'border-red-200 focus:border-red-400 focus:ring-red-500/10' : 'border-rose-100 focus:border-rose-300 focus:ring-rose-500/10 hover:border-rose-200',
          className
        )} 
        {...props} 
      />
    </motion.div>
    {error && (
      <motion.p 
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-[11px] text-red-500 font-bold px-3"
      >
        {error}
      </motion.p>
    )}
  </div>
);

export const ChatInput = ({ value, onChange, onSend, placeholder, isTyping, onVoiceClick, isListening }: any) => (
  <div className="relative flex items-center gap-2 bg-white/95 backdrop-blur-2xl p-2.5 rounded-[2.5rem] border-2 border-rose-100 shadow-lg shadow-rose-500/5">
    <div className="flex-1 relative">
      <input 
        type="text"
        value={value}
        onChange={onChange}
        onKeyPress={(e) => e.key === 'Enter' && onSend()}
        placeholder={isListening ? "Listening..." : placeholder}
        className="w-full bg-transparent px-4 py-2 focus:outline-none font-medium text-slate-800 placeholder:text-slate-400 text-sm"
      />
    </div>
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onVoiceClick}
      className={cn(
        "w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300",
        isListening ? "bg-rose-100 text-rose-600 animate-pulse" : "bg-rose-50 text-rose-400 hover:text-rose-600 hover:bg-rose-100"
      )}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
        <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
        <line x1="12" x2="12" y1="19" y2="22"/>
      </svg>
    </motion.button>
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onSend}
      disabled={!value.trim() || isTyping}
      className={cn(
        "w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300",
        value.trim() ? "bg-rose-500 text-white shadow-md shadow-rose-500/30" : "bg-slate-100 text-slate-400"
      )}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="m5 12 7-7 7 7"/>
        <path d="M12 19V5"/>
      </svg>
    </motion.button>
  </div>
);

export const ConfidenceIndicator = ({ level, className }: { level: 'Low' | 'Medium' | 'High', className?: string }) => {
  const configs = {
    High: { width: '95%', color: 'bg-emerald-400', text: 'High Confidence' },
    Medium: { width: '75%', color: 'bg-amber-400', text: 'Medium Confidence' },
    Low: { width: '45%', color: 'bg-rose-400', text: 'Low Confidence' }
  };
  const config = configs[level] || configs.Medium;

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-slate-500">
        <span>AI Confidence</span>
        <span>{config.text}</span>
      </div>
      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: config.width }}
          transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
          className={cn('h-full rounded-full', config.color)}
        />
      </div>
    </div>
  );
};
