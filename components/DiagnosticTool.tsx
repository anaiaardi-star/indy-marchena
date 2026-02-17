
import React, { useState } from 'react';
import { getLegacyDiagnostic } from '../services/geminiService';
import { DiagnosticResult, DiagnosticStatus } from '../types';
import { Brain, Sparkles, Loader2, RefreshCw } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const DiagnosticTool: React.FC = () => {
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<DiagnosticStatus>(DiagnosticStatus.IDLE);
  const [result, setResult] = useState<DiagnosticResult | null>(null);
  const { language, t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || status === DiagnosticStatus.LOADING) return;

    setStatus(DiagnosticStatus.LOADING);
    try {
      const data = await getLegacyDiagnostic(input, language);
      setResult(data);
      setStatus(DiagnosticStatus.SUCCESS);
    } catch (error) {
      console.error(error);
      setStatus(DiagnosticStatus.ERROR);
    }
  };

  const reset = () => {
    setInput('');
    setResult(null);
    setStatus(DiagnosticStatus.IDLE);
  };

  return (
    <section id="diagnostico" className="py-32 px-6 bg-editorial-base relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-editorial-primary/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <p className="text-editorial-action text-[11px] font-bold tracking-[0.4em] uppercase mb-4">{t('diagnostic.tag')}</p>
          <h2 className="font-serif text-5xl md:text-6xl text-editorial-primary mb-8">{t('diagnostic.title')}</h2>
          <p className="text-editorial-text/70 font-normal text-lg max-w-2xl mx-auto leading-relaxed">
            {t('diagnostic.desc')}
          </p>
        </div>

        <div className="bg-white p-10 md:p-16 rounded-[4rem] shadow-2xl shadow-editorial-primary/10 border border-editorial-primary/5 relative">
          {status === DiagnosticStatus.IDLE && (
            <form onSubmit={handleSubmit} className="space-y-8 animate-fade-in-up">
              <div className="relative">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={t('diagnostic.placeholder')}
                  className="w-full h-48 p-10 bg-editorial-base/30 rounded-[2.5rem] border border-editorial-primary/10 text-editorial-text text-lg font-normal focus:ring-2 focus:ring-editorial-primary/20 focus:outline-none transition-all resize-none placeholder:text-editorial-text/30"
                  required
                />
                <div className="absolute bottom-6 right-10">
                   <Brain className="w-8 h-8 text-editorial-primary/10" />
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-editorial-primary text-white py-7 rounded-full text-[11px] font-bold tracking-[0.3em] flex items-center justify-center gap-4 hover:bg-editorial-purple transition-all shadow-xl group uppercase"
              >
                <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" /> 
                {t('diagnostic.btn')}
              </button>
            </form>
          )}

          {status === DiagnosticStatus.LOADING && (
            <div className="py-24 flex flex-col items-center justify-center text-center animate-fade-in-up">
              <div className="relative w-24 h-24 mb-10">
                <div className="absolute inset-0 bg-editorial-primary/10 rounded-full animate-ping"></div>
                <div className="absolute inset-0 bg-editorial-primary rounded-full flex items-center justify-center">
                  <Loader2 className="w-10 h-10 text-white animate-spin" />
                </div>
              </div>
              <h3 className="font-serif text-3xl text-editorial-primary italic mb-4">{t('diagnostic.loading')}</h3>
              <p className="text-[10px] tracking-widest text-editorial-mauve uppercase font-bold">{t('diagnostic.loadingSub')}</p>
            </div>
          )}

          {status === DiagnosticStatus.SUCCESS && result && (
            <div className="animate-fade-in-up space-y-12">
              <div className="flex flex-col md:flex-row gap-10 items-start">
                <div className="w-24 h-24 bg-editorial-purple rounded-[2rem] flex items-center justify-center shrink-0 shadow-xl rotate-3 group-hover:rotate-0 transition-transform">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
                <div>
                  <p className="text-editorial-mauve text-[10px] font-bold tracking-widest uppercase mb-3">{t('diagnostic.resultTag')}</p>
                  <h3 className="font-serif text-4xl md:text-5xl text-editorial-primary italic mb-6 leading-tight">{result.archetype}</h3>
                  <p className="text-editorial-text/80 leading-relaxed text-lg font-normal italic border-l-2 border-editorial-purple/20 pl-6">{result.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-8 bg-editorial-base/40 rounded-[2.5rem] border-l-4 border-editorial-action shadow-sm">
                  <h4 className="text-[10px] font-bold tracking-widest uppercase text-editorial-action mb-6">{t('diagnostic.strengths')}</h4>
                  <ul className="space-y-4">
                    {result.strengths.map((s, i) => (
                      <li key={i} className="text-sm text-editorial-text/80 flex items-center gap-3 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-editorial-action"></span> {s}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-8 bg-editorial-base/40 rounded-[2.5rem] border-l-4 border-editorial-mauve shadow-sm">
                  <h4 className="text-[10px] font-bold tracking-widest uppercase text-editorial-mauve mb-6">{t('diagnostic.weaknesses')}</h4>
                  <ul className="space-y-4">
                    {result.weaknesses.map((w, i) => (
                      <li key={i} className="text-sm text-editorial-text/80 flex items-center gap-3 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-editorial-mauve"></span> {w}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="bg-editorial-primary p-12 rounded-[3rem] text-white shadow-2xl">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-px bg-white/40"></div>
                  <h4 className="text-[10px] font-bold tracking-widest uppercase opacity-80">{t('diagnostic.roadmap')}</h4>
                </div>
                <p className="text-xl md:text-2xl font-normal leading-relaxed mb-10">{result.actionPlan}</p>
                <div className="flex flex-wrap gap-6">
                   <a href="#ecosistema" className="bg-white text-editorial-primary px-10 py-5 rounded-full text-[10px] font-bold tracking-widest hover:bg-editorial-action hover:text-white transition-all">
                    {t('diagnostic.cta')}
                  </a>
                  <button onClick={reset} className="flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase opacity-60 hover:opacity-100 transition-opacity">
                    <RefreshCw className="w-4 h-4" /> {t('diagnostic.retry')}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default DiagnosticTool;
