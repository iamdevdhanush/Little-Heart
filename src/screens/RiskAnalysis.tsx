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
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-2xl font-bold text-slate-900 mb-6 tracking-tight">Health Checkup</h3>
        <div className="space-y-6">
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-widest mb-2 px-1">Blood Pressure</label>
            <Input 
              placeholder="120/80" 
              value={data.bp} 
              error={errors.bp}
              onChange={(e: any) => setData({ ...data, bp: e.target.value })} 
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-widest mb-2 px-1">Sugar Level (mg/dL)</label>
            <Input 
              placeholder="95" 
              value={data.sugar} 
              error={errors.sugar}
              onChange={(e: any) => setData({ ...data, sugar: e.target.value })} 
            />
          </div>
          <Section title="Symptoms">
            <div className="flex flex-wrap gap-2">
              {symptomsList.map(s => (
                <button 
                  key={s}
                  onClick={() => {
                    const next = data.symptoms.includes(s) ? data.symptoms.filter(x => x !== s) : [...data.symptoms, s];
                    setData({ ...data, symptoms: next });
                  }}
                  className={cn(
                    'px-4 py-2 rounded-full text-xs font-semibold border transition-all duration-300',
                    data.symptoms.includes(s) 
                      ? 'bg-slate-900 text-white border-slate-900 shadow-md' 
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </Section>
          <Button className="w-full py-4 mt-4 text-base font-semibold" onClick={handleAnalyze} disabled={loading}>
            {loading ? 'Analyzing...' : 'Run Risk Analysis'}
          </Button>
        </div>
      </Card>

      {result && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <Card className={cn(
            'border-2 p-6',
            result.risk === 'High' ? 'border-rose-100 bg-rose-50/30' : 
            result.risk === 'Medium' ? 'border-amber-100 bg-amber-50/30' : 'border-emerald-100 bg-emerald-50/30'
          )}>
            <div className="flex items-center gap-4 mb-5">
              <div className={cn(
                'w-12 h-12 rounded-full flex items-center justify-center shadow-sm',
                result.risk === 'High' ? 'bg-rose-500 text-white' : 
                result.risk === 'Medium' ? 'bg-amber-500 text-white' : 'bg-emerald-500 text-white'
              )}>
                <Activity size={24} />
              </div>
              <div>
                <Badge variant={result.risk === 'High' ? 'danger' : result.risk === 'Medium' ? 'warning' : 'success'}>
                  {result.risk} Risk Detected
                </Badge>
              </div>
            </div>
            <p className="text-sm font-medium text-slate-700 mb-5 leading-relaxed">{result.reason}</p>
            <div className="space-y-4 mb-6">
              <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                <p className="text-[11px] font-semibold text-rose-500 uppercase tracking-widest mb-1">Priority Action:</p>
                <p className="text-sm font-bold text-slate-900">{result.priority_action}</p>
              </div>

              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">Recommended Actions:</p>
              {result.steps.map((s: string, i: number) => (
                <div key={i} className="flex items-start gap-3 text-sm font-medium text-slate-600">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-2 shrink-0" />
                  {s}
                </div>
              ))}
            </div>
            <div className="border-t border-slate-100 pt-4 space-y-3">
              <ConfidenceIndicator level={result.confidence} />
              <p className="text-[10px] text-slate-400 font-medium italic">This is not a medical diagnosis.</p>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
