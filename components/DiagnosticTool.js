
import React, { useState } from 'react';
import { getLegacyDiagnostic } from '../services/geminiService.js';
import { useLanguage } from '../context/LanguageContext.js';

const DiagnosticTool = () => {
  const [input, setInput] = useState('');
  const [status, setStatus] = useState('IDLE');
  const [result, setResult] = useState(null);
  const { language, t } = useLanguage();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || status === 'LOADING') return;
    setStatus('LOADING');
    try {
      const data = await getLegacyDiagnostic(input, language);
      setResult(data);
      setStatus('SUCCESS');
    } catch (error) {
      console.error(error);
      setStatus('ERROR');
    }
  };

  return React.createElement("section", { id: "diagnostico", className: "py-32 px-6 bg-editorial-base relative overflow-hidden" },
    React.createElement("div", { className: "max-w-4xl mx-auto relative z-10" },
      React.createElement("div", { className: "text-center mb-20" },
        React.createElement("p", { className: "text-editorial-action text-[11px] font-bold tracking-[0.4em] uppercase" }, t('diagnostic.tag')),
        React.createElement("h2", { className: "font-serif text-5xl text-editorial-primary mb-8" }, t('diagnostic.title'))
      ),
      React.createElement("div", { className: "bg-white p-10 md:p-16 rounded-[4rem] shadow-2xl" },
        status === 'IDLE' && React.createElement("form", { onSubmit: handleSubmit, className: "space-y-8" },
          React.createElement("textarea", {
            value: input,
            onChange: (e) => setInput(e.target.value),
            placeholder: t('diagnostic.placeholder'),
            className: "w-full h-48 p-10 bg-editorial-base/30 rounded-[2.5rem] border border-editorial-primary/10",
            required: true
          }),
          React.createElement("button", { type: "submit", className: "w-full bg-editorial-primary text-white py-7 rounded-full font-bold uppercase" }, 
            t('diagnostic.btn')
          )
        ),
        status === 'LOADING' && React.createElement("div", { className: "py-24 text-center" },
          React.createElement("h3", { className: "font-serif text-3xl text-editorial-primary italic" }, t('diagnostic.loading'))
        ),
        status === 'SUCCESS' && result && React.createElement("div", { className: "space-y-12" },
          React.createElement("h3", { className: "font-serif text-4xl text-editorial-primary italic" }, result.archetype),
          React.createElement("p", { className: "text-lg text-editorial-text/80 italic" }, result.description),
          React.createElement("button", { onClick: () => setStatus('IDLE'), className: "text-xs font-bold uppercase text-editorial-primary" }, t('diagnostic.retry'))
        )
      )
    )
  );
};

export default DiagnosticTool;
