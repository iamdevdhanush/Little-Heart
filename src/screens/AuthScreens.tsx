import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Heart, Loader2 } from 'lucide-react';
import { Button, Section, Input } from '../components/UI';
import { UserProfile } from '../data/mockData';
import { cn } from '../lib/utils';
import confetti from 'canvas-confetti';
import { signInWithGoogle, saveUserProfile, signUpWithEmail, signInWithEmail } from '../services/firebaseService';
import { auth } from '../lib/firebase';

export function AuthScreen({ onComplete }: { onComplete: () => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleEmailAuth = async () => {
    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password');
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      if (isSignUp) {
        await signUpWithEmail(email, password);
      } else {
        await signInWithEmail(email, password);
      }
      onComplete();
    } catch (err: any) {
      console.error("Auth failed", err);
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async () => {
    setIsLoading(true);
    try {
      await signInWithGoogle();
      // The onAuthStateChanged listener in App.tsx will handle the redirect
      // But we call onComplete just in case we are in mock mode
      onComplete();
    } catch (error) {
      console.error("Sign in failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0, scale: 0.95 }}
      className="flex flex-col items-center justify-center h-full px-10 text-center overflow-y-auto py-10"
    >
      <motion.div 
        animate={{ 
          scale: [1, 1.05, 1],
          rotate: [0, 5, -5, 0]
        }}
        transition={{ duration: 4, repeat: Infinity }}
        className="w-28 h-28 bg-rose-50 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-rose-500/20 border-4 border-white shrink-0"
      >
        <Heart size={48} className="text-rose-400 fill-rose-400" />
      </motion.div>
      <h1 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">Little Heartbeat</h1>
      <p className="text-slate-600 mb-8 text-sm font-bold leading-relaxed max-w-[280px]">Your AI companion for a healthy, happy pregnancy journey.</p>
      
      <div className="w-full space-y-4 max-w-sm mx-auto">
        {error && <p className="text-rose-500 text-sm font-bold">{error}</p>}

        <div className="space-y-3 text-left">
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1 px-1">Email</label>
            <Input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e: any) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1 px-1">Password</label>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e: any) => setPassword(e.target.value)}
            />
          </div>
        </div>

        <Button 
          className="w-full py-4 text-base font-bold flex items-center justify-center gap-2" 
          onClick={handleEmailAuth}
          disabled={isLoading}
        >
          {isLoading ? <Loader2 className="animate-spin" size={20} /> : (isSignUp ? 'Create Account' : 'Sign In')}
        </Button>

        <div className="flex items-center gap-2 my-4">
          <div className="h-px bg-rose-100 flex-1" />
          <span className="text-xs text-slate-400 font-bold uppercase">OR</span>
          <div className="h-px bg-rose-100 flex-1" />
        </div>

        <Button 
          variant="outline"
          className="w-full py-4 text-base font-bold flex items-center justify-center gap-2 text-slate-700 border-rose-200 hover:bg-rose-50" 
          onClick={handleSignIn}
          disabled={isLoading}
        >
          Continue with Google
        </Button>

        <p className="text-slate-600 text-sm font-bold pt-2">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button onClick={() => setIsSignUp(!isSignUp)} className="text-rose-500 font-extrabold hover:underline">
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </p>

        <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest pt-4">Safe • Secure • Private</p>
      </div>
    </motion.div>
  );
}

export function OnboardingScreen({ onComplete }: { onComplete: (data: UserProfile) => void }) {
  const [step, setStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<UserProfile>({
    id: '', // Will be populated by Firebase Auth
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

  const next = async () => {
    if (!validate()) return;
    if (step < 4) {
      setStep(step + 1);
    } else {
      setIsSaving(true);
      try {
        // Use the UID from auth.currentUser if available
        const userId = auth?.currentUser?.uid || formData.id || 'mock-user-' + Date.now();
        const finalData = { ...formData, id: userId };
        
        await saveUserProfile(userId, finalData);
        
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#0F172A', '#E11D48', '#38BDF8']
        });
        
        onComplete(finalData);
      } catch (error) {
        console.error("Failed to save profile", error);
      } finally {
        setIsSaving(false);
      }
    }
  };


  return (
    <motion.div 
      initial={{ x: 50, opacity: 0 }} 
      animate={{ x: 0, opacity: 1 }}
      className="flex flex-col h-full px-8 pt-20"
    >
      <div className="mb-12">
        <div className="flex gap-2 mb-8">
          {[1, 2, 3, 4].map(s => (
            <div key={s} className={cn('h-1.5 flex-1 rounded-full transition-all duration-500', s <= step ? 'bg-rose-500' : 'bg-rose-100')} />
          ))}
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Tell us about you</h2>
        <p className="text-slate-600 font-bold mt-2">We use this to personalize your care.</p>
      </div>

      <div className="flex-1 space-y-8">
        {step === 1 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <Section title="Basic Info">
              <div className="space-y-6">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">Your Name</label>
                  <Input 
                    placeholder="e.g. Sarah" 
                    value={formData.name} 
                    error={errors.name}
                    onChange={(e: any) => setFormData({ ...formData, name: e.target.value })} 
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">Your Age</label>
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
              <div className="grid grid-cols-3 gap-3">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(m => (
                  <button 
                    key={m}
                    onClick={() => setFormData({ ...formData, pregnancyMonth: m })}
                    className={cn(
                      'h-14 rounded-[1.5rem] border-2 font-bold transition-all duration-300', 
                      formData.pregnancyMonth === m 
                        ? 'border-rose-500 bg-rose-500 text-white shadow-md shadow-rose-500/20' 
                        : 'border-rose-100 text-slate-400 hover:border-rose-200 hover:text-slate-600 bg-white/50'
                    )}
                  >
                    {m}
                  </button>
                ))}
              </div>
              <p className="text-center text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-6">Select your current month</p>
            </Section>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <Section title="Your Location">
              <div className="space-y-3">
                {['North India', 'South India', 'East India', 'West India'].map(r => (
                  <button 
                    key={r}
                    onClick={() => setFormData({ ...formData, region: r })}
                    className={cn(
                      'w-full py-4 px-5 rounded-[1.5rem] border-2 text-left flex justify-between items-center transition-all duration-300 font-bold', 
                      formData.region === r 
                        ? 'border-rose-500 bg-rose-500 text-white shadow-md shadow-rose-500/20' 
                        : 'border-rose-100 text-slate-500 hover:border-rose-200 hover:text-slate-700 bg-white/50'
                    )}
                  >
                    {r}
                    {formData.region === r && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                        <Heart size={20} className="fill-current text-white" />
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
              <div className="space-y-5">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">Estimated Due Date</label>
                  <Input 
                    type="date" 
                    value={formData.dueDate || ''} 
                    onChange={(e: any) => setFormData({ ...formData, dueDate: e.target.value })} 
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">Medical Conditions (comma separated)</label>
                  <Input 
                    placeholder="e.g. Thyroid, Diabetes" 
                    value={formData.medicalConditions?.join(', ') || ''} 
                    onChange={(e: any) => setFormData({ ...formData, medicalConditions: e.target.value.split(',').map((s: string) => s.trim()).filter(Boolean) })} 
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">Allergies (comma separated)</label>
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

      <div className="pb-12 pt-6">
        <Button className="w-full py-4 text-base font-bold flex items-center justify-center gap-2" onClick={next} disabled={isSaving}>
          {isSaving ? <Loader2 className="animate-spin" size={20} /> : (step === 4 ? 'Complete Profile' : 'Continue')}
        </Button>
      </div>
    </motion.div>
  );
}
