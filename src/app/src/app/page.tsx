'use client';

import { useState } from 'react';
import { BookOpen, Table, Mail, Layers, Sparkles, Loader2, Copy, Check } from 'lucide-react';

type ToolType = 'lesson' | 'rubric' | 'parent_email' | 'differentiation';

const TOOLS = [
  { id: 'lesson', name: 'Lesson Planner', icon: BookOpen, desc: 'Generate structured lesson plans' },
  { id: 'rubric', name: 'Rubric Generator', icon: Table, desc: 'Build clear grading rubrics' },
  { id: 'parent_email', name: 'Parent Communication', icon: Mail, desc: 'Draft professional emails' },
  { id: 'differentiation', name: 'Tiered Differentiation', icon: Layers, desc: 'Adapt lessons for skill levels' },
];

export default function Home() {
  const [activeTool, setActiveTool] = useState<ToolType>('lesson');
  const [topic, setTopic] = useState('');
  const [grade, setGrade] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic || !grade) return;

    setLoading(true);
    setResult('');

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tool: activeTool, topic, grade }),
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data.result);
    } catch (err: any) {
      setResult(`**Error:** ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800 p-4 md:p-12">
      <div className="max-w-5xl mx-auto space-y-6">
        <header className="border-b pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 text-white rounded-lg">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">EduPulse AI</h1>
              <p className="text-xs text-slate-500">AI Assistant for Educators</p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {TOOLS.map((t) => {
            const Icon = t.icon;
            const isSelected = activeTool === t.id;
            return (
              <button
                key={t.id}
                onClick={() => { setActiveTool(t.id as ToolType); setResult(''); }}
                className={`p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/50 shadow-sm'
                    : 'border-slate-200 bg-white'
                }`}
              >
                <Icon className={`w-5 h-5 mb-1 ${isSelected ? 'text-indigo-600' : 'text-slate-500'}`} />
                <h2 className="font-semibold text-slate-900 text-xs">{t.name}</h2>
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <form onSubmit={handleSubmit} className="bg-white p-4 rounded-xl border border-slate-200 space-y-3 shadow-sm">
            <h3 className="font-semibold text-slate-900 text-sm border-b pb-2">Input Details</h3>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Grade / Level</label>
              <input
                type="text"
                placeholder="e.g., Grade 7, SS1, Elementary"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                required
                className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Topic / Subject</label>
              <textarea
                rows={3}
                placeholder="e.g., Photosynthesis, Quadratic Equations"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                required
                className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {loading ? 'Generating...' : 'Generate'}
            </button>
          </form>

          <div className="lg:col-span-2 bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col min-h-[300px]">
            <div className="flex justify-between items-center border-b pb-2 mb-3">
              <h3 className="font-semibold text-slate-900 text-sm">Generated Resource</h3>
              {result && (
                <button
                  onClick={copyToClipboard}
                  className="flex items-center gap-1 text-xs font-medium text-slate-600 border px-2 py-1 rounded-md"
                >
                  {copied ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              )}
            </div>

            <div className="flex-1 overflow-y-auto font-mono text-xs whitespace-pre-wrap text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100">
              {result ? result : <span className="text-slate-400 font-sans italic">Output will appear here...</span>}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
    }
    
