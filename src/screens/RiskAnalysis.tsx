import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Activity } from 'lucide-react';
import { cn } from '../lib/utils';
import { Card, Button, Input, Section, Badge, ConfidenceIndicator } from '../components/UI';
import { UserProfile } from '../data/mockData';
import { analyzeRisk } from '../services/aiService';

export function RiskAnalysis({ user, t, onEmergency }: { user: UserProfile, t: any, onEmergency: () => void }) {
  const [data, setData] = useState({ bp: '', sugar: '', symptoms: [] as string[] });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const symptomsList = ["Headache", "Swelling", "Blurry Vision", "Nausea", "Back Pain", "Fatigue"];

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!data.bp.trim()) newErrors.bp = "Blood pressure is required";
    else if (!/^\d{2,3}\/\d{2,3}$/.test(data.bp)) newErrors.bp = "Format: 120/80";
    
    if (!data.sugar.trim()) newErrors.sugar = "Sugar level is required";
    else if (isNaN(Number(data.sugar))) newErrors.sugar = "Must be a number";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAnalyze = async () => {
    if (!validate()) return;
    setLoading(true);
    const res = await analyzeRisk(data, user);
    setResult(res);
    setLoading(false);

    if (res.risk === 'High') {
      onEmergency();
    }
  };

  return (
    <div className="space-y-8">
      <Card className="p-8">
        <h3 className="text-2xl font-black text-slate-800 mb-8 tracking-tight">Health Checkup</h3>
        <div className="space-y-8">
          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Blood Pressure</label>
            <Input 
              placeholder="120/80" 
              value={data.bp} 
              error={errors.bp}
              onChange={(e: any) => setData({ ...data, bp: e.target.value })} 
            />
          </div>
          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Sugar Level (mg/dL)</label>
            <Input 
              placeholder="95" 
              value={data.sugar} 
              error={errors.sugar}
              onChange={(e: any) => setData({ ...data, sugar: e.target.value })} 
            />
          </div>
          <Section title="Symptoms">
            <div className="flex flex-wrap gap-3">
              {symptomsList.map(s => (
                <button 
                  key={s}
                  onClick={() => {
                    const next = data.symptoms.includes(s) ? data.symptoms.filter(x => x !== s) : [...data.symptoms, s];
                    setData({ ...data, symptoms: next });
                  }}
                  className={cn(
                    'px-5 py-2.5 rounded-full text-xs font-bold border transition-all duration-300',
                    data.symptoms.includes(s) 
                      ? 'bg-brand-pink text-white border-brand-pink shadow-lg shadow-brand-pink/20 scale-105' 
                      : 'bg-white text-slate-400 border-slate-100'
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </Section>
          <Button className="w-full py-5 mt-6 text-lg" onClick={handleAnalyze} disabled={loading}>
            {loading ? 'Analyzing...' : 'Run Risk Analysis'}
          </Button>
        </div>
      </Card>

      {result && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <Card className={cn(
            'border-2 p-8',
            result.risk === 'High' ? 'border-red-100 bg-red-50/30' : 
            result.risk === 'Medium' ? 'border-yellow-100 bg-yellow-50/30' : 'border-green-100 bg-green-50/30'
          )}>
            <div className="flex items-center gap-4 mb-6">
              <div className={cn(
                'w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg',
                result.risk === 'High' ? 'bg-red-500 shadow-red-200' : 
                result.risk === 'Medium' ? 'bg-yellow-500 shadow-yellow-200' : 'bg-green-500 shadow-green-200'
              )}>
                <Activity size={24} className="text-white" />
              </div>
              <div>
                <Badge variant={result.risk === 'High' ? 'danger' : result.risk === 'Medium' ? 'warning' : 'success'}>
                  {result.risk} Risk Detected
                </Badge>
              </div>
            </div>
            <p className="text-sm font-bold text-slate-700 mb-6 leading-relaxed">{result.reason}</p>
            <div className="space-y-4 mb-8">
              <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                <p className="text-[10px] font-black text-brand-pink uppercase tracking-widest mb-1">Priority Action:</p>
                <p className="text-sm font-black text-slate-800">{result.priority_action}</p>
              </div>

              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Recommended Actions:</p>
              {result.steps.map((s: string, i: number) => (
                <div key={i} className="flex items-start gap-3 text-sm font-bold text-slate-500">
                  <div className="w-2 h-2 rounded-full bg-slate-300 mt-1.5 shrink-0" />
                  {s}
                </div>
              ))}
            </div>
            <div className="border-t border-slate-100 pt-4 space-y-4">
              <ConfidenceIndicator level={result.confidence} />
              <p className="text-[10px] text-slate-300 font-bold italic">This is not a medical diagnosis.</p>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
