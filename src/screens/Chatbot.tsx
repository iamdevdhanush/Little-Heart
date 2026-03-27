import React, { useState, useEffect, useRef } from 'react';
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
      text: user.language === 'hi' ? "नमस्ते! मैं आपकी लिटिल हार्टबीट एआई सहायक हूँ। मैं आपके स्वास्थ्य और बच्चे की सुरक्षा की निगरानी के लिए यहाँ हूँ। आज आप कैसा महसूस कर रही हैं?" : user.language === 'kn' ? "ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ ಲಿಟಲ್ ಹಾರ್ಟ್‌ಬೀಟ್ AI ಸಹಾಯಕ. ನಿಮ್ಮ ಆರೋಗ್ಯ ಮತ್ತು ಮಗುವಿನ ಸುರಕ್ಷತೆಯನ್ನು ನೋಡಿಕೊಳ್ಳಲು ನಾನಿದ್ದೇನೆ. ಇಂದು ನಿಮಗೆ ಹೇಗನಿಸುತ್ತಿದೆ?" : "Hi! I'm your Little Heartbeat AI Assistant. I'm here to monitor your health and baby's safety. How are you feeling today?", 
      sender: 'ai' 
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showRiskForm, setShowRiskForm] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Your browser doesn't support speech recognition.");
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = user.language === 'hi' ? 'hi-IN' : user.language === 'kn' ? 'kn-IN' : 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

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

    const aiResponse = await getChatResponse(input, user, history, user.language);
    
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
      className="flex flex-col h-full relative"
    >
      <div className="flex-1 space-y-6 pb-32 overflow-y-auto no-scrollbar">
        {messages.map(msg => (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            key={msg.id} 
            className={cn('flex', msg.sender === 'user' ? 'justify-end' : 'justify-start')}
          >
            <div className={cn(
              'max-w-[85%] p-5 rounded-[2rem] shadow-sm transition-all duration-500',
              msg.sender === 'user' 
                ? 'bg-rose-500 text-white rounded-tr-md shadow-rose-500/20' 
                : 'bg-white/90 backdrop-blur-md text-slate-700 rounded-tl-md border border-rose-100/50'
            )}>
              <p className="text-[14px] font-bold leading-relaxed tracking-wide">{msg.text}</p>
              
              {msg.internal_link && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onNavigate(msg.internal_link.screen)}
                  className="mt-4 w-full py-3 px-4 rounded-[1.5rem] bg-rose-50 text-rose-600 text-xs font-bold border border-rose-100/50 flex items-center justify-center gap-2 shadow-sm"
                >
                  <Plus size={16} /> {msg.internal_link.label}
                </motion.button>
              )}

              {msg.risk && (
                <div className={cn(
                  "mt-5 p-5 rounded-[1.5rem] border",
                  msg.risk === 'High' ? 'bg-red-50/80 border-red-100' : 
                  msg.risk === 'Medium' ? 'bg-amber-50/80 border-amber-100' : 'bg-emerald-50/80 border-emerald-100'
                )}>
                  <div className="flex justify-between items-center mb-4">
                    <Badge variant={msg.risk === 'High' ? 'danger' : msg.risk === 'Medium' ? 'warning' : 'success'}>
                      {msg.risk} Risk
                    </Badge>
                  </div>
                  
                  <ConfidenceIndicator level={msg.confidence} className="mb-5" />
                  
                  <p className="text-sm font-bold text-slate-800 mb-4 leading-snug">{msg.reason}</p>
                  
                  <div className="bg-white/90 p-4 rounded-[1.25rem] border border-slate-100/50 mb-4 shadow-sm">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Priority Action:</p>
                    <p className="text-xs font-bold text-red-500 leading-tight">{msg.priority_action}</p>
                  </div>

                  {msg.steps && msg.steps.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Next Steps:</p>
                      {msg.steps.map((s: string, i: number) => (
                        <p key={i} className="text-xs font-bold text-slate-600 flex items-start gap-2.5 leading-relaxed">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-1.5 shrink-0" /> {s}
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
            <div className="bg-white/90 backdrop-blur-md px-6 py-5 rounded-[2rem] rounded-tl-md border border-rose-100/50 shadow-sm">
              <div className="flex gap-2">
                <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1 }} className="w-2 h-2 bg-rose-300 rounded-full" />
                <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-2 h-2 bg-rose-300 rounded-full" />
                <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-2 h-2 bg-rose-300 rounded-full" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
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
              <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Health Check</h3>
              <button onClick={() => setShowRiskForm(false)} className="p-2.5 bg-slate-100 rounded-full text-slate-500 transition-transform active:scale-95"><ArrowLeft size={20} /></button>
            </div>
            <RiskAnalysis user={user} t={t} onEmergency={onEmergency} />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed bottom-24 left-6 right-6 z-40">
        <div className="bg-white/90 backdrop-blur-xl p-3 rounded-[2.5rem] shadow-float border border-slate-200/60 flex flex-col gap-2">
          <motion.button 
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => setShowRiskForm(true)}
            className="w-full py-2.5 rounded-full bg-blue-50 text-blue-600 font-semibold text-xs flex items-center justify-center gap-2 border border-blue-100 transition-colors hover:bg-blue-100"
          >
            <Activity size={14} /> Analyze My Health Risk
          </motion.button>
          
          <ChatInput 
            value={input}
            onChange={(e: any) => setInput(e.target.value)}
            onSend={sendMessage}
            placeholder={user.language === 'hi' ? "आप कैसा महसूस कर रही हैं?" : user.language === 'kn' ? "ನಿಮಗೆ ಹೇಗನಿಸುತ್ತಿದೆ?" : "How are you feeling?"}
            isTyping={isTyping}
            onVoiceClick={startListening}
            isListening={isListening}
          />
        </div>
      </div>
    </motion.div>
  );
}
