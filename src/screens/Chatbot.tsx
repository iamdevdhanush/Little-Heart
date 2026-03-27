import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, Send, Plus, Activity, ArrowLeft } from 'lucide-react';
import { cn } from '../lib/utils';
import { Card, Badge, Input, ConfidenceIndicator, ChatInput } from '../components/UI';
import { UserProfile } from '../data/mockData';
import { getChatResponse } from '../services/aiService';
import { RiskAnalysis } from './RiskAnalysis';

export function Chatbot({ user, t, onEmergency, onNavigate }: { user: UserProfile, t: any, onEmergency: () => void, onNavigate: (screen: any) => void }) {
  const [messages, setMessages] = useState<any[]>([
    { 
      id: 1, 
      text: "Hi! I'm your Little Heartbeat AI Assistant. I'm here to monitor your health and baby's safety. How are you feeling today?", 
      sender: 'ai' 
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showRiskForm, setShowRiskForm] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || isTyping) return;
    
    const userMsg = { id: Date.now(), text: input, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Prepare history for AI (last 10 messages)
    const history = messages.slice(-10).map(m => ({
      role: m.sender as 'user' | 'ai',
      text: m.text
    }));

    const aiResponse = await getChatResponse(input, user, history);
    
    const aiMsg = { 
      id: Date.now() + 1, 
      text: aiResponse.text, 
      sender: 'ai',
      risk: aiResponse.risk,
      reason: aiResponse.reason,
      priority_action: aiResponse.priority_action,
      steps: aiResponse.steps,
      confidence: aiResponse.confidence,
      internal_link: aiResponse.internal_link
    };

    setMessages(prev => [...prev, aiMsg]);
    setIsTyping(false);

    if (aiResponse.risk === 'High') {
      onEmergency();
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col h-full"
    >
      <div className="flex-1 space-y-6 pb-6">
        {messages.map(msg => (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            key={msg.id} 
            className={cn('flex', msg.sender === 'user' ? 'justify-end' : 'justify-start')}
          >
            <div className={cn(
              'max-w-[85%] p-5 rounded-[2rem] shadow-premium transition-all duration-500',
              msg.sender === 'user' 
                ? 'pink-gradient text-white rounded-tr-none' 
                : 'bg-white text-slate-700 rounded-tl-none border border-slate-50'
            )}>
              <p className="text-[13px] font-medium leading-relaxed tracking-tight">{msg.text}</p>
              
              {msg.internal_link && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onNavigate(msg.internal_link.screen)}
                  className="mt-5 w-full py-3 px-4 rounded-2xl bg-brand-pink/5 text-brand-pink text-[10px] font-black uppercase tracking-widest border border-brand-pink/10 flex items-center justify-center gap-2"
                >
                  <Plus size={12} /> {msg.internal_link.label}
                </motion.button>
              )}

              {msg.risk && (
                <div className={cn(
                  "mt-6 p-5 rounded-3xl border border-white/40 shadow-inner-soft",
                  msg.risk === 'High' ? 'bg-red-50/50' : 
                  msg.risk === 'Medium' ? 'bg-yellow-50/50' : 'bg-green-50/50'
                )}>
                  <div className="flex justify-between items-center mb-4">
                    <Badge variant={msg.risk === 'High' ? 'danger' : msg.risk === 'Medium' ? 'warning' : 'success'}>
                      {msg.risk} Risk
                    </Badge>
                  </div>
                  
                  <ConfidenceIndicator level={msg.confidence} className="mb-5" />
                  
                  <p className="text-xs font-bold text-slate-800 mb-4 leading-snug">{msg.reason}</p>
                  
                  <div className="bg-white/80 p-4 rounded-2xl border border-white/60 mb-4 shadow-soft">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Priority Action:</p>
                    <p className="text-[11px] font-black text-brand-pink leading-tight">{msg.priority_action}</p>
                  </div>

                  {msg.steps && msg.steps.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Next Steps:</p>
                      {msg.steps.map((s: string, i: number) => (
                        <p key={i} className="text-[11px] font-medium text-slate-500 flex items-start gap-2 leading-relaxed">
                          <span className="w-1 h-1 rounded-full bg-slate-300 mt-1.5 shrink-0" /> {s}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white px-6 py-4 rounded-[1.5rem] rounded-tl-none border border-slate-50 shadow-soft">
              <div className="flex gap-2">
                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-brand-pink/40 rounded-full" />
                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-brand-pink/40 rounded-full" />
                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-brand-pink/40 rounded-full" />
              </div>
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showRiskForm && (
          <motion.div 
            initial={{ y: '100%' }} 
            animate={{ y: 0 }} 
            exit={{ y: '100%' }}
            className="fixed inset-0 z-[60] bg-white p-6 overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-3xl font-black text-slate-800 tracking-tight">Health Check</h3>
              <button onClick={() => setShowRiskForm(false)} className="p-3 bg-slate-50 rounded-2xl text-slate-400 transition-transform active:scale-90"><ArrowLeft size={20} /></button>
            </div>
            <RiskAnalysis user={user} t={t} onEmergency={onEmergency} />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="sticky bottom-0 bg-white/60 backdrop-blur-2xl pt-4 pb-6 space-y-4">
        <motion.button 
          whileHover={{ scale: 1.01, y: -2 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => setShowRiskForm(true)}
          className="w-full py-4 rounded-2xl bg-brand-blue/10 text-brand-blue-dark font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 border border-brand-blue/20"
        >
          <Activity size={14} /> Analyze My Health Risk
        </motion.button>
        
        <ChatInput 
          value={input}
          onChange={(e: any) => setInput(e.target.value)}
          onSend={sendMessage}
          placeholder="How are you feeling?"
          isTyping={isTyping}
        />
      </div>
    </motion.div>
  );
}
