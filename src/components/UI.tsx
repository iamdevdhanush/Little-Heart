import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export const Button = ({ className, variant = 'primary', ...props }: any) => {
  const variants = {
    primary: 'pink-gradient text-white shadow-soft',
    secondary: 'blue-gradient text-white shadow-soft',
    outline: 'border-2 border-brand-pink text-brand-pink active:bg-brand-pink/10',
    ghost: 'text-slate-500 hover:bg-slate-100',
    danger: 'bg-red-500 text-white shadow-lg'
  };
  return (
    <motion.button 
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.96 }}
      className={cn('pill-button', variants[variant as keyof typeof variants], className)} 
      {...props} 
    />
  );
};

export const Card = ({ children, className, noHover = false }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={noHover ? {} : { y: -4, boxShadow: "var(--shadow-premium)" }}
    transition={{ duration: 0.3, ease: "easeOut" }}
    className={cn('bg-white/80 backdrop-blur-xl rounded-[2rem] p-6 shadow-premium border border-white/40', className)}
  >
    {children}
  </motion.div>
);

export const Badge = ({ children, variant = 'default', className }: any) => {
  const variants = {
    default: 'bg-slate-100 text-slate-600',
    success: 'bg-green-100 text-green-600',
    warning: 'bg-yellow-100 text-yellow-600',
    danger: 'bg-red-100 text-red-600',
    info: 'bg-blue-100 text-blue-600',
  };
  return (
    <motion.span 
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={cn('px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider inline-block', variants[variant as keyof typeof variants], className)}
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
        className="text-sm font-bold text-slate-400 uppercase tracking-widest px-1"
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
      whileFocus={{ scale: 1.005 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="relative"
    >
      <input 
        className={cn(
          'w-full px-6 py-4 rounded-2xl bg-slate-50/50 border transition-all duration-300 focus:outline-none focus:ring-8 focus:ring-brand-pink/5 font-medium text-slate-700 placeholder:text-slate-300',
          error ? 'border-red-200 focus:border-red-300' : 'border-slate-100 focus:border-brand-pink/20',
          className
        )} 
        {...props} 
      />
    </motion.div>
    {error && (
      <motion.p 
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-[10px] text-red-500 font-bold uppercase tracking-wider px-3"
      >
        {error}
      </motion.p>
    )}
  </div>
);

export const ChatInput = ({ value, onChange, onSend, placeholder, isTyping }: any) => (
  <div className="relative flex items-center gap-2 bg-white/80 backdrop-blur-2xl p-2 rounded-[2rem] border border-white/40 shadow-premium">
    <div className="flex-1 relative">
      <input 
        type="text"
        value={value}
        onChange={onChange}
        onKeyPress={(e) => e.key === 'Enter' && onSend()}
        placeholder={placeholder}
        className="w-full bg-transparent px-6 py-3.5 focus:outline-none font-medium text-slate-700 placeholder:text-slate-300"
      />
    </div>
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onSend}
      disabled={!value.trim() || isTyping}
      className={cn(
        "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300",
        value.trim() ? "pink-gradient text-white shadow-lg shadow-brand-pink/20" : "bg-slate-100 text-slate-300"
      )}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="m5 12 7-7 7 7"/>
        <path d="M12 19V5"/>
      </svg>
    </motion.button>
  </div>
);

export const ConfidenceIndicator = ({ level, className }: { level: 'Low' | 'Medium' | 'High', className?: string }) => {
  const configs = {
    High: { width: '95%', color: 'bg-green-500', text: 'High Confidence' },
    Medium: { width: '75%', color: 'bg-yellow-500', text: 'Medium Confidence' },
    Low: { width: '45%', color: 'bg-orange-500', text: 'Low Confidence' }
  };
  const config = configs[level] || configs.Medium;

  return (
    <div className={cn('space-y-1.5', className)}>
      <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-tighter text-slate-400">
        <span>AI Confidence</span>
        <span>{config.text}</span>
      </div>
      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: config.width }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={cn('h-full rounded-full', config.color)}
        />
      </div>
    </div>
  );
};
