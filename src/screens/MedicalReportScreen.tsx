import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Upload, FileText, CheckCircle2, AlertCircle, X, Loader2 } from 'lucide-react';
import { Card, Badge, Section, Button } from '../components/UI';
import { analyzeMedicalReport } from '../services/aiService';
import { saveMedicalReport } from '../services/firebaseService';

export function MedicalReportScreen({ user, t, onClose }: { user: any, t: any, onClose: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResult(null);
      setError(null);
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setIsAnalyzing(true);
    setError(null);

    try {
      // In a real app, we would upload the file to Firebase Storage and get a URL.
      // For this hackathon demo, we will simulate reading the file and passing it to Gemini.
      // We will use a mock text extraction for the demo.
      const mockExtractedText = "Patient shows slightly elevated blood pressure (135/85). Hemoglobin levels are normal. Fetal heart rate is 145 bpm. No abnormalities detected in ultrasound.";
      
      const analysis = await analyzeMedicalReport(mockExtractedText, user.language);
      
      const reportData = {
        fileName: file.name,
        analysis,
        date: new Date().toISOString()
      };

      await saveMedicalReport(user.id || 'mock-user-123', reportData);
      setResult(analysis);
    } catch (err) {
      console.error(err);
      setError("Failed to analyze the report. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: '100%' }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed inset-0 z-[100] bg-rose-50/30 flex flex-col"
    >
      <header className="px-6 pt-12 pb-6 flex justify-between items-center bg-white/90 backdrop-blur-xl border-b border-rose-100/50">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Medical AI Analysis</h2>
          <p className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-wider">Upload reports for instant insights</p>
        </div>
        <button onClick={onClose} className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-rose-100 hover:text-rose-600 transition-colors">
          <X size={20} />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {!result && (
          <Card className="p-8 border-2 border-dashed border-rose-200 bg-white/50 flex flex-col items-center justify-center text-center shadow-none">
            <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center text-rose-500 mb-4 shadow-sm">
              <Upload size={28} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Upload Report</h3>
            <p className="text-sm font-medium text-slate-500 mb-6 max-w-[200px] leading-relaxed">
              Upload your ultrasound, blood test, or prescription (PDF, JPG, PNG).
            </p>
            
            <input 
              type="file" 
              id="report-upload" 
              className="hidden" 
              accept=".pdf,image/*"
              onChange={handleFileChange}
            />
            <label 
              htmlFor="report-upload"
              className="px-8 py-3.5 bg-rose-500 text-white rounded-full font-bold text-sm cursor-pointer hover:bg-rose-600 transition-colors shadow-md shadow-rose-500/20"
            >
              Select File
            </label>

            {file && (
              <div className="mt-6 p-4 bg-white rounded-[1.5rem] border border-rose-100 flex items-center gap-3 w-full text-left shadow-sm">
                <FileText className="text-rose-500 shrink-0" size={24} />
                <div className="flex-1 overflow-hidden">
                  <p className="text-sm font-bold text-slate-900 truncate">{file.name}</p>
                  <p className="text-xs font-medium text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                <CheckCircle2 className="text-emerald-500 shrink-0" size={20} />
              </div>
            )}
          </Card>
        )}

        {error && (
          <div className="p-4 bg-red-50 text-red-600 rounded-[1.5rem] text-sm font-bold flex items-start gap-3 border border-red-100">
            <AlertCircle size={20} className="shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        {file && !result && (
          <Button 
            onClick={handleAnalyze} 
            disabled={isAnalyzing}
            className="w-full py-4 bg-rose-500 hover:bg-rose-600 text-white rounded-[2rem] font-bold text-lg shadow-lg shadow-rose-500/20 flex items-center justify-center gap-2"
          >
            {isAnalyzing ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Analyzing with AI...
              </>
            ) : (
              'Analyze Report'
            )}
          </Button>
        )}

        {result && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <Card className="p-6 bg-gradient-to-br from-purple-400 to-pink-400 text-white border-0 shadow-lg shadow-purple-500/20">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-extrabold tracking-tight">Analysis Complete</h3>
                <Badge variant="default" className="bg-white/20 text-white border-0 shadow-sm backdrop-blur-md">AI Generated</Badge>
              </div>
              <p className="text-sm font-bold text-white/95 leading-relaxed">
                {result.summary}
              </p>
            </Card>

            <Section title="Key Findings">
              <Card className="p-5 bg-white/90 backdrop-blur-xl border-rose-100/50 shadow-sm space-y-4">
                {result.findings.map((finding: string, idx: number) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-rose-50 flex items-center justify-center shrink-0 mt-0.5 border border-rose-100/50 shadow-sm">
                      <span className="text-rose-500 text-xs font-bold">{idx + 1}</span>
                    </div>
                    <p className="text-sm font-bold text-slate-700 leading-relaxed">{finding}</p>
                  </div>
                ))}
              </Card>
            </Section>

            <Section title="Recommendations">
              <Card className="p-5 bg-white/90 backdrop-blur-xl border-rose-100/50 shadow-sm space-y-3">
                {result.recommendations.map((rec: string, idx: number) => (
                  <div key={idx} className="flex items-center gap-3 p-3.5 bg-rose-50/50 rounded-[1.5rem] border border-rose-100/50">
                    <CheckCircle2 className="text-emerald-500 shrink-0" size={22} />
                    <p className="text-sm font-bold text-slate-700">{rec}</p>
                  </div>
                ))}
              </Card>
            </Section>

            <Button 
              onClick={() => { setFile(null); setResult(null); }}
              variant="outline"
              className="w-full py-4 rounded-[2rem] font-bold text-rose-600 border-rose-200 hover:bg-rose-50"
            >
              Upload Another Report
            </Button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
