import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Heart } from 'lucide-react';
import { Button, Section, Input } from '../components/UI';
import { UserProfile } from '../data/mockData';
import { cn } from '../lib/utils';
import confetti from 'canvas-confetti';

export function AuthScreen({ onComplete }: { onComplete: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0, scale: 0.95 }}
      className="flex flex-col items-center justify-center h-full px-10 text-center"
    >
      <motion.div 
        animate={{ 
          scale: [1, 1.05, 1],
          rotate: [0, 5, -5, 0]
        }}
        transition={{ duration: 4, repeat: Infinity }}
        className="w-32 h-32 pink-gradient rounded-[2.5rem] flex items-center justify-center mb-10 shadow-2xl shadow-brand-pink/30"
      >
        <Heart size={64} className="text-white fill-white" />
      </motion.div>
      <h1 className="text-4xl font-black text-slate-800 mb-4 tracking-tighter">Little Heartbeat</h1>
      <p className="text-slate-400 mb-14 text-lg font-medium leading-relaxed">Your AI companion for a healthy, happy pregnancy journey.</p>
      
      <div className="w-full space-y-4">
        <Button className="w-full py-5 text-lg" onClick={onComplete}>Get Started</Button>
        <p className="text-slate-300 text-[10px] font-bold uppercase tracking-widest">Safe • Secure • Private</p>
      </div>
    </motion.div>
  );
}

export function OnboardingScreen({ onComplete }: { onComplete: (data: UserProfile) => void }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<UserProfile>({
    name: '',
    age: 25,
    pregnancyMonth: 1,
    region: 'North India',
    language: 'en'
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (step === 1) {
      if (!formData.name.trim()) newErrors.name = "Please enter your name";
      if (formData.age < 18 || formData.age > 50) newErrors.age = "Age must be between 18 and 50";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const next = () => {
    if (!validate()) return;
    if (step < 4) setStep(step + 1);
    else {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FCE7F3', '#DBEAFE', '#FF69B4']
      });
      onComplete(formData);
    }
  };

  return (
    <motion.div 
      initial={{ x: 50, opacity: 0 }} 
      animate={{ x: 0, opacity: 1 }}
      className="flex flex-col h-full px-8 pt-20"
    >
      <div className="mb-14">
        <div className="flex gap-3 mb-6">
          {[1, 2, 3, 4].map(s => (
            <div key={s} className={cn('h-2 flex-1 rounded-full transition-all duration-500', s <= step ? 'pink-gradient' : 'bg-slate-100')} />
          ))}
        </div>
        <h2 className="text-4xl font-black text-slate-800 tracking-tight">Tell us about you</h2>
        <p className="text-slate-400 font-medium mt-2">We use this to personalize your care.</p>
      </div>

      <div className="flex-1 space-y-10">
        {step === 1 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <Section title="Basic Info">
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Your Name</label>
                  <Input 
                    placeholder="e.g. Sarah" 
                    value={formData.name} 
                    error={errors.name}
                    onChange={(e: any) => setFormData({ ...formData, name: e.target.value })} 
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Your Age</label>
                  <Input 
                    type="number" 
                    value={formData.age} 
                    error={errors.age}
                    onChange={(e: any) => setFormData({ ...formData, age: parseInt(e.target.value) || 0 })} 
                  />
                </div>
              </div>
            </Section>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <Section title="Pregnancy Stage">
              <div className="grid grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(m => (
                  <button 
                    key={m}
                    onClick={() => setFormData({ ...formData, pregnancyMonth: m })}
                    className={cn(
                      'h-16 rounded-2xl border-2 font-bold transition-all duration-300', 
                      formData.pregnancyMonth === m 
                        ? 'border-brand-pink bg-brand-pink/5 text-brand-pink-dark scale-105 shadow-lg shadow-brand-pink/10' 
                        : 'border-slate-50 text-slate-300 hover:border-slate-100'
                    )}
                  >
                    {m}
                  </button>
                ))}
              </div>
              <p className="text-center text-[10px] text-slate-300 font-bold uppercase tracking-widest mt-4">Select your current month</p>
            </Section>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <Section title="Your Location">
              <div className="space-y-4">
                {['North India', 'South India', 'East India', 'West India'].map(r => (
                  <button 
                    key={r}
                    onClick={() => setFormData({ ...formData, region: r })}
                    className={cn(
                      'w-full py-5 px-6 rounded-[1.5rem] border-2 text-left flex justify-between items-center transition-all duration-300 font-bold', 
                      formData.region === r 
                        ? 'border-brand-blue bg-brand-blue/5 text-brand-blue-dark scale-[1.02] shadow-xl shadow-brand-blue/10' 
                        : 'border-slate-50 text-slate-400 hover:border-slate-100'
                    )}
                  >
                    {r}
                    {formData.region === r && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                        <Heart size={20} className="fill-current" />
                      </motion.div>
                    )}
                  </button>
                ))}
              </div>
            </Section>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <Section title="Medical Details">
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Estimated Due Date</label>
                  <Input 
                    type="date" 
                    value={formData.dueDate || ''} 
                    onChange={(e: any) => setFormData({ ...formData, dueDate: e.target.value })} 
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Medical Conditions (comma separated)</label>
                  <Input 
                    placeholder="e.g. Thyroid, Diabetes" 
                    value={formData.medicalConditions?.join(', ') || ''} 
                    onChange={(e: any) => setFormData({ ...formData, medicalConditions: e.target.value.split(',').map((s: string) => s.trim()).filter(Boolean) })} 
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Allergies (comma separated)</label>
                  <Input 
                    placeholder="e.g. Peanuts, Penicillin" 
                    value={formData.allergies?.join(', ') || ''} 
                    onChange={(e: any) => setFormData({ ...formData, allergies: e.target.value.split(',').map((s: string) => s.trim()).filter(Boolean) })} 
                  />
                </div>
              </div>
            </Section>
          </motion.div>
        )}
      </div>

      <div className="pb-16">
        <Button className="w-full py-5 text-lg" onClick={next}>
          {step === 4 ? 'Complete Profile' : 'Continue'}
        </Button>
      </div>
    </motion.div>
  );
}
