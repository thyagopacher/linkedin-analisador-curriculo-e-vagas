
import React, { useState, useEffect } from 'react';
import { analyzeCareerData } from './services/geminiService';
import { LinkedInAnalysis } from './types';
import { 
  Briefcase, 
  Search, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp, 
  Edit3, 
  Loader2,
  ChevronRight,
  ExternalLink,
  Linkedin,
  Sparkles,
  Building2,
  UserCheck,
  Target
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const App: React.FC = () => {
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [result, setResult] = useState<LinkedInAnalysis | null>(null);
  const [error, setError] = useState('');

  const loadingMessages = [
    "Lendo seu perfil público...",
    "Identificando sua senioridade e stack...",
    "Pesquisando vagas no mercado...",
    "Cruzando dados e gerando feedback...",
    "Finalizando sua análise personalizada..."
  ];

  useEffect(() => {
    let interval: any;
    if (isAnalyzing) {
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev < loadingMessages.length - 1 ? prev + 1 : prev));
      }, 3500);
    } else {
      setLoadingStep(0);
    }
    return () => clearInterval(interval);
  }, [isAnalyzing]);

  const handleAnalyze = async () => {
    if (!linkedinUrl || !linkedinUrl.includes('linkedin.com/')) {
      setError('Por favor, insira uma URL válida do LinkedIn.');
      return;
    }

    setIsAnalyzing(true);
    setError('');
    setResult(null);
    try {
      const analysis = await analyzeCareerData({ linkedinUrl });
      setResult(analysis);
      setTimeout(() => {
        document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro ao buscar os dados.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const COLORS = ['#2563eb', '#f1f5f9'];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 selection:bg-blue-100">
      <header className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Linkedin className="text-blue-600 w-5 h-5 fill-current" />
            <span className="font-bold text-slate-800">LinkUp Analyzer</span>
          </div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Advanced Pro Analysis</div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 pt-16 pb-24">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold mb-6 border border-blue-100">
            <Sparkles className="w-3 h-3" />
            MODO ESPECIALISTA ATIVADO
          </div>
          <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">
            Análise de Carreira para <span className="text-blue-600">Sêniores</span>.
          </h1>
          <p className="text-slate-500 text-lg">
            Extraímos sua senioridade e empresa atual automaticamente para encontrar as melhores oportunidades e otimizar sua escrita profissional.
          </p>
        </div>

        <div className="max-w-3xl mx-auto mb-20">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
              <Linkedin className="h-6 w-6 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
            </div>
            <input 
              type="url" 
              placeholder="Cole seu link do LinkedIn (ex: linkedin.com/in/perfil)"
              className="block w-full pl-16 pr-48 py-6 bg-white border-2 border-slate-100 rounded-2xl text-lg focus:ring-4 focus:ring-blue-100 focus:border-blue-500 focus:outline-none transition-all shadow-sm group-hover:border-slate-200"
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
            />
            <div className="absolute inset-y-2 right-2">
              <button 
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className={`
                  h-full px-8 rounded-xl font-bold text-white transition-all flex items-center gap-2
                  ${isAnalyzing ? 'bg-slate-400' : 'bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200'}
                `}
              >
                {isAnalyzing ? <Loader2 className="animate-spin w-5 h-5" /> : <Search className="w-5 h-5" />}
                {isAnalyzing ? 'Processando...' : 'Analisar'}
              </button>
            </div>
          </div>
          {isAnalyzing && (
            <div className="mt-4 flex flex-col items-center gap-2 animate-pulse">
              <p className="text-blue-600 font-medium text-sm">{loadingMessages[loadingStep]}</p>
              <div className="w-48 h-1 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-600 transition-all duration-500" 
                  style={{ width: `${((loadingStep + 1) / loadingMessages.length) * 100}%` }}
                ></div>
              </div>
            </div>
          )}
          {error && <p className="mt-3 text-red-500 text-sm font-medium flex items-center gap-1 justify-center"><AlertCircle className="w-4 h-4" /> {error}</p>}
        </div>

        {result && (
          <div id="results" className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
            
            {/* O QUE DETECTAMOS (CONFIANÇA) */}
            <section className="bg-slate-900 rounded-3xl p-8 text-white flex flex-col md:flex-row gap-8 items-center border border-slate-800">
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-widest">
                  <UserCheck className="w-4 h-4" />
                  Perfil Identificado
                </div>
                <h2 className="text-2xl font-bold">{result.profileSummary}</h2>
                <div className="flex flex-wrap gap-4 pt-2">
                  <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl">
                    <Briefcase className="w-4 h-4 text-slate-400" />
                    <span className="text-sm">{result.detectedRole || 'Sênior'}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl">
                    <Building2 className="w-4 h-4 text-slate-400" />
                    <span className="text-sm">{result.detectedCompany || 'Empresa Atual'}</span>
                  </div>
                </div>
              </div>
              <div className="w-32 h-32 relative flex-shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Match', value: result.matchScore },
                        { name: 'Gap', value: 100 - result.matchScore }
                      ]}
                      innerRadius={45}
                      outerRadius={60}
                      paddingAngle={5}
                      dataKey="value"
                      startAngle={90}
                      endAngle={450}
                    >
                      <Cell key={`cell-0`} fill="#3b82f6" />
                      <Cell key={`cell-1`} fill="#1e293b" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center font-black text-xl">
                  {result.matchScore}%
                </div>
              </div>
            </section>

            {/* VAGAS FILTRADAS POR SENIORIDADE */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Target className="text-blue-600 w-6 h-6" />
                  Oportunidades de Nível Sênior/Lead
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="md:col-span-2 lg:col-span-2 bg-white border border-blue-100 rounded-3xl p-8 shadow-xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
                    <TrendingUp className="w-32 h-32" />
                  </div>
                  <div className="relative z-10">
                    <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest mb-4 inline-block">
                      RECOMENDAÇÃO PRINCIPAL
                    </span>
                    <h3 className="text-3xl font-bold mb-2 text-slate-900">{result.bestJobMatch.title}</h3>
                    <p className="text-slate-500 text-lg mb-6">{result.bestJobMatch.company} • {result.bestJobMatch.location}</p>
                    <a 
                      href={result.bestJobMatch.url} 
                      target="_blank" 
                      className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors"
                    >
                      Candidatar-se Agora <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                <div className="space-y-4">
                  {result.otherJobsFound.map((job, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
                      <h4 className="font-bold text-slate-800 line-clamp-1">{job.title}</h4>
                      <p className="text-xs text-slate-500 mb-4">{job.company}</p>
                      <a href={job.url} target="_blank" className="text-blue-600 text-xs font-bold flex items-center gap-1 hover:underline">
                        Ver no LinkedIn <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* ANÁLISE TÉCNICA */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <CheckCircle className="text-emerald-500 w-5 h-5" />
                    Domínio Técnico & Liderança
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {result.strengths.map((s, i) => (
                      <div key={i} className="flex gap-3 p-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-emerald-800 text-sm">
                        <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                        {s}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <AlertCircle className="text-amber-500 w-5 h-5" />
                    Potencial de Evolução
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {result.gaps.map((g, i) => (
                      <div key={i} className="flex gap-3 p-4 bg-amber-50 rounded-2xl border border-amber-100 text-amber-800 text-sm">
                        <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
                        {g}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                 <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                    <h4 className="font-bold mb-4 flex items-center gap-2">
                      <Sparkles className="text-blue-500 w-4 h-4" />
                      Stack Recomendada
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {result.suggestedSkills.map((skill, i) => (
                        <span key={i} className="px-3 py-1 bg-slate-50 text-slate-600 rounded-lg text-xs font-semibold border border-slate-100">
                          {skill}
                        </span>
                      ))}
                    </div>
                    <div className="mt-6 pt-6 border-t border-slate-50 italic text-sm text-slate-400">
                      "{result.overallVerdict}"
                    </div>
                 </div>
              </div>
            </div>

            {/* MELHORIAS DE ESCRITA SÊNIOR */}
            <section className="bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden">
               <div className="bg-blue-600 px-8 py-6 text-white">
                  <h3 className="text-2xl font-bold flex items-center gap-2">
                    <Edit3 className="w-6 h-6" />
                    Otimização de Narrativa Profissional
                  </h3>
                  <p className="text-blue-100 text-sm">Ajustes focados em vender impacto técnico e resultados de negócio.</p>
               </div>
               <div className="p-8 space-y-12">
                  {result.profileImprovements.map((imp, i) => (
                    <div key={i} className="group">
                      <div className="flex items-center gap-2 mb-4">
                        <span className="bg-blue-100 text-blue-700 text-[10px] font-black px-2 py-0.5 rounded uppercase">{imp.section}</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                          <h5 className="text-xs font-bold text-slate-400 uppercase">Status Atual:</h5>
                          <div className="p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-500 text-sm italic">
                            {imp.currentIssue}
                          </div>
                        </div>
                        <div className="space-y-3">
                          <h5 className="text-xs font-bold text-emerald-500 uppercase">Upgrade Sugerido:</h5>
                          <div className="p-5 bg-emerald-50/50 rounded-2xl border border-emerald-100 shadow-sm">
                            <p className="text-slate-700 text-sm font-semibold mb-3">{imp.suggestion}</p>
                            <div className="pl-4 border-l-2 border-emerald-300">
                              <p className="text-xs text-emerald-600 font-bold mb-1">EXEMPLO DE ALTO IMPACTO:</p>
                              <p className="text-slate-800 text-sm leading-relaxed font-medium">"{imp.example}"</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
               </div>
            </section>

          </div>
        )}
      </main>

      <footer className="py-12 border-t border-slate-100 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Linkedin className="w-4 h-4 text-slate-300" />
          <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">LinkUp Analyzer Pro 2024</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
