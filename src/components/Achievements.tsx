import React, { useState } from 'react';
import { 
  Award, 
  CheckCircle, 
  Flame, 
  Star, 
  Trophy, 
  Users, 
  ShieldAlert, 
  Sparkles, 
  User, 
  Calendar, 
  FileText, 
  ArrowRight, 
  Eye, 
  X, 
  Printer, 
  ClipboardCheck 
} from 'lucide-react';
import { UserProgress, Certificate, Difficulty } from '../types';
import { LESSONS_DATA } from '../data/lessons';
import { playSound } from '../utils/audio';

const TRAILS_CONFIG = [
  {
    id: 'cert-iniciante',
    title: 'Certificado de Programador Iniciante',
    difficulty: 'Iniciante' as Difficulty,
    modulesCount: 4,
    minGrade: 7.0,
    desc: 'Demonstra domínio robusto de conceitos básicos de lógica: variáveis, tipos de dados primários, operadores lógicos e condicionais dinâmicas.',
    seal: '🌱',
    themeColor: 'from-emerald-400 to-teal-500',
    borderColor: 'border-emerald-200'
  },
  {
    id: 'cert-medio',
    title: 'Certificado de Programador Intermediário',
    difficulty: 'Médio' as Difficulty,
    modulesCount: 4,
    minGrade: 7.0,
    desc: 'Demonstra domínio avançado de controle e estruturas: manipulação de vetores (Arrays), laços de repetição complexos, funções estruturadas e modelagem de Objetos.',
    seal: '⚡',
    themeColor: 'from-blue-500 to-indigo-600',
    borderColor: 'border-blue-200'
  },
  {
    id: 'cert-profissional',
    title: 'Certificado de Desenvolvedor Profissional',
    difficulty: 'Profissional' as Difficulty,
    modulesCount: 3,
    minGrade: 7.0,
    desc: 'Demonstra aptidão para ambientes críticos modernos: programação assíncrona baseada em Promises, técnicas de desestruturação e métodos funcionais de array.',
    seal: '👑',
    themeColor: 'from-purple-500 to-violet-650',
    borderColor: 'border-purple-200'
  }
];

interface AchievementsProps {
  progress: UserProgress;
  onUpdateProgress?: (newProgress: UserProgress) => void;
}

export default function Achievements({ progress, onUpdateProgress }: AchievementsProps) {
  const [activeTab, setActiveTab] = useState<'badges' | 'certificates'>('badges');
  
  // Claim states
  const [claimingTrailId, setClaimingTrailId] = useState<string | null>(null);
  const [recipientName, setRecipientName] = useState('');
  
  // View states
  const [viewingCertificate, setViewingCertificate] = useState<Certificate | null>(null);

  // Built-in achievements criteria
  const achievements = [
    {
      id: 'first-step',
      title: 'Iniciando Motores',
      description: 'Termine seu primeiro desafio lógico de programação.',
      criteria: 'Concluir 1 módulo',
      isUnlocked: progress.completedModules.length >= 1,
      badge: '🚀'
    },
    {
      id: 'gem-hoarder',
      title: 'Burguês do Código',
      description: 'Acumule 50 ou mais gemas programando no sistema.',
      criteria: 'Ter 50 gemas',
      isUnlocked: progress.gems >= 50,
      badge: '💎'
    },
    {
      id: 'streak-master',
      title: 'Desenvolvedor Disciplinado',
      description: 'Mantenha sua ofensiva ativa diariamente para se consolidar.',
      criteria: 'Ofensiva ativa',
      isUnlocked: progress.streak > 0,
      badge: '🔥'
    },
    {
      id: 'professional-dev',
      title: 'Hacker Supremo',
      description: 'Conclua pelo menos 1 módulo da trilha Avançada/Profissional.',
      criteria: 'Fazer o módulo Profissional',
      isUnlocked: progress.completedModules.some(id => id.startsWith('pro-')),
      badge: '👑'
    },
    {
      id: 'completionist',
      title: 'Mestre Poliglota',
      description: 'Complete 3 ou mais módulos teóricos no ByteQuest.',
      criteria: 'Completar 3 módulos',
      isUnlocked: progress.completedModules.length >= 3,
      badge: '🏆'
    }
  ];

  const totalUnlocked = achievements.filter(a => a.isUnlocked).length;

  // Compute stats for certificates
  const computedTrails = TRAILS_CONFIG.map(trail => {
    const totalModulesInTrail = LESSONS_DATA.filter(m => m.difficulty === trail.difficulty);
    const completedInTrail = totalModulesInTrail.filter(m => progress.completedModules.includes(m.id));
    
    // Percentage completed
    const pct = totalModulesInTrail.length > 0 
      ? Math.round((completedInTrail.length / totalModulesInTrail.length) * 100) 
      : 0;
    
    // Average Grade
    const grades = totalModulesInTrail.map(m => progress.moduleGrades?.[m.id] || 0);
    const sumGrades = grades.reduce((acc, current) => acc + current, 0);
    const avgGrade = totalModulesInTrail.length > 0 
      ? parseFloat((sumGrades / totalModulesInTrail.length).toFixed(1)) 
      : 0.0;

    const isEligible = pct === 100 && avgGrade >= trail.minGrade;
    const isClaimed = (progress.certificates || []).some(c => c.id === trail.id);
    const claimedData = (progress.certificates || []).find(c => c.id === trail.id);

    return {
      ...trail,
      percentage: pct,
      averageGrade: avgGrade,
      isEligible,
      isClaimed,
      claimedData,
      completedCount: completedInTrail.length,
      totalCount: totalModulesInTrail.length
    };
  });

  const handleClaimCertificate = (trailId: string, avgGrade: number, pct: number) => {
    if (!recipientName.trim()) {
      alert("Por favor, digite seu nome completo para a emissão oficial.");
      return;
    }

    playSound('powerup');
    const trail = TRAILS_CONFIG.find(t => t.id === trailId);
    if (!trail) return;

    const newCert: Certificate = {
      id: trail.id,
      title: trail.title,
      difficulty: trail.difficulty,
      recipientName: recipientName.trim(),
      issueDate: new Date().toLocaleDateString('pt-BR'),
      averageGrade: avgGrade,
      percentageCompleted: pct
    };

    const updatedCertificates = [...(progress.certificates || []), newCert];
    
    if (onUpdateProgress) {
      onUpdateProgress({
        ...progress,
        certificates: updatedCertificates
      });
    }

    setClaimingTrailId(null);
    setRecipientName('');
    setViewingCertificate(newCert); // open right away to celebrate!
  };

  const handlePrint = () => {
    playSound('click');
    window.print();
  };

  return (
    <div className="flex-1 p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-100 text-emerald-600 rounded-2xl">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-800">Conquistas & Inventário</h2>
            <p className="text-slate-500 text-sm">Seu progresso escolar documentado com medalhas de prestígio e diplomas oficiais.</p>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="bg-slate-100 border border-slate-200 rounded-xl p-1 shrink-0 flex gap-1">
          <button
            onClick={() => { playSound('click'); setActiveTab('badges'); }}
            className={`px-4 py-2 font-black text-xs uppercase tracking-wider rounded-lg transition-all ${
              activeTab === 'badges'
                ? 'bg-white text-emerald-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            🥇 Distintivos
          </button>
          <button
            onClick={() => { playSound('click'); setActiveTab('certificates'); }}
            className={`px-4 py-2 font-black text-xs uppercase tracking-wider rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'certificates'
                ? 'bg-white text-emerald-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            📜 Certificados
            {(computedTrails.some(t => t.isEligible && !t.isClaimed)) && (
              <span className="w-2.5 h-2.5 bg-amber-500 rounded-full animate-ping" />
            )}
          </button>
        </div>
      </div>

      {activeTab === 'badges' ? (
        <>
          {/* Stats Quick-Overview Banner */}
          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 mb-8 flex flex-wrap gap-6 items-center justify-around">
            <div className="text-center p-2">
              <p className="text-xs text-slate-400 font-black uppercase tracking-wider mb-1">XP Total Ganhos</p>
              <div className="flex justify-center items-center gap-1.5">
                <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                <span className="text-2xl font-black text-slate-800 font-mono">{progress.xp}</span>
              </div>
            </div>

            <div className="h-10 w-px bg-slate-200 hidden md:block"></div>

            <div className="text-center p-2">
              <p className="text-xs text-slate-400 font-black uppercase tracking-wider mb-1">Ofensiva de Estudos</p>
              <div className="flex justify-center items-center gap-1.5">
                <Flame className="w-5 h-5 text-orange-500 fill-orange-500" />
                <span className="text-2xl font-black text-slate-800 font-mono">{progress.streak} dias</span>
              </div>
            </div>

            <div className="h-10 w-px bg-slate-200 hidden md:block"></div>

            <div className="text-center p-2">
              <p className="text-xs text-slate-400 font-black uppercase tracking-wider mb-1">Módulos Feitos</p>
              <div className="flex justify-center items-center gap-1.5">
                <Trophy className="w-5 h-5 text-yellow-500" />
                <span className="text-2xl font-black text-slate-800 font-mono">{progress.completedModules.length}</span>
              </div>
            </div>

            <div className="h-10 w-px bg-slate-200 hidden md:block"></div>

            <div className="text-center p-2">
              <p className="text-xs text-slate-400 font-black uppercase tracking-wider mb-1">Selos Desbloqueados</p>
              <span className="text-2xl font-black text-emerald-600 font-mono">{totalUnlocked} / {achievements.length}</span>
            </div>
          </div>

          {/* Grid of Achievement Badges */}
          <div className="space-y-4 animate-[fadeIn_0.2s_ease-out]">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest pl-1">Seu Quadro de Medalhas</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {achievements.map((item) => {
                return (
                  <div
                    key={item.id}
                    className={`border rounded-2xl p-5 flex gap-4 transition-all ${
                      item.isUnlocked
                        ? 'bg-slate-50 border-slate-200 shadow-sm'
                        : 'bg-white border-slate-100 opacity-65'
                    }`}
                  >
                    {/* Visual Badge design */}
                    <div className={`w-16 h-16 rounded-2xl shrink-0 flex items-center justify-center text-3xl shadow-md border ${
                      item.isUnlocked 
                        ? 'bg-gradient-to-br from-amber-400 to-yellow-500 border-yellow-300' 
                        : 'bg-slate-100 border-slate-200 grayscale'
                    }`}>
                      {item.badge}
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-extrabold text-slate-800 text-sm leading-tight">{item.title}</h4>
                        <p className="text-slate-500 text-xs mt-1 leading-snug">{item.description}</p>
                      </div>

                      <div className="flex justify-between items-center mt-3 pt-2 border-t border-slate-100 text-[10px] font-bold">
                        <span className="text-slate-400">Requisito: {item.criteria}</span>
                        {item.isUnlocked ? (
                          <span className="text-emerald-600 uppercase tracking-wider font-extrabold flex items-center gap-1">
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> Desbloqueado!
                          </span>
                        ) : (
                          <span className="text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">Pendente</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      ) : (
        /* CERTIFICATE INVENTORY SECTION */
        <div className="space-y-6 animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-5 flex items-center gap-4">
            <div className="text-3xl leading-none">📜</div>
            <div>
              <h3 className="font-extrabold text-slate-800 text-sm leading-snug">Como emitir seus Diplomas Oficiais?</h3>
              <p className="text-xs text-slate-500 leading-relaxed mt-0.5">
                Complete 100% dos módulos de uma determinada trilha com uma <strong>Média de Notas superior ou igual a 7.0</strong> (obetidas ao concluir as lições com poucos erros!). Diplomas emitidos ficam guardados no seu inventário para sempre.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {computedTrails.map((trail) => {
              return (
                <div 
                  key={trail.id}
                  className={`bg-white border rounded-3xl p-5 flex flex-col md:flex-row items-stretch gap-6 transition-all shadow-sm ${
                    trail.isClaimed 
                      ? 'border-emerald-200 bg-gradient-to-br from-white to-emerald-50/10' 
                      : trail.isEligible 
                      ? 'border-amber-300 ring-2 ring-amber-400/20 shadow-md' 
                      : 'border-slate-200'
                  }`}
                >
                  {/* Left Icon with color accent */}
                  <div className={`md:w-32 shrink-0 rounded-2xl bg-gradient-to-br ${trail.themeColor} text-white flex flex-col items-center justify-center p-4 relative overflow-hidden`}>
                    <div className="absolute top-2 left-2 text-white/20 text-4xl rotate-12">📜</div>
                    <div className="text-4xl filter drop-shadow mb-1 relative z-10">{trail.seal}</div>
                    <span className="text-[10px] font-black uppercase tracking-wider bg-black/20 px-2 py-0.5 rounded-full relative z-10 whitespace-nowrap">
                      {trail.difficulty}
                    </span>
                  </div>

                  {/* Mid Content */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h4 className="font-black text-slate-800 text-base leading-tight">
                          {trail.title}
                        </h4>
                        {trail.isClaimed ? (
                          <span className="text-[10px] font-bold bg-emerald-50 border border-emerald-250 text-emerald-600 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                            <ClipboardCheck className="w-3 h-3" /> Emitido no Inventário
                          </span>
                        ) : trail.isEligible ? (
                          <span className="text-[10px] font-bold bg-amber-50 border border-amber-250 text-amber-600 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 animate-pulse">
                            🎁 Elegível para Resgate!
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full inline-block">
                            Em Progresso
                          </span>
                        )}
                      </div>

                      <p className="text-slate-500 text-xs leading-relaxed mb-4">
                        {trail.desc}
                      </p>

                      {/* Stat tracker grids */}
                      <div className="grid grid-cols-2 gap-4 bg-slate-50/70 border border-slate-100 rounded-2xl p-3.5 text-xs">
                        <div>
                          <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider mb-0.5">Progresso da Trilha</p>
                          <div className="flex items-center gap-3">
                            <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full transition-all duration-300 ${trail.isClaimed || trail.isEligible ? 'bg-emerald-500' : 'bg-slate-400'}`}
                                style={{ width: `${trail.percentage}%` }}
                              />
                            </div>
                            <span className="font-extrabold text-slate-700 whitespace-nowrap">
                              {trail.completedCount}/{trail.totalCount} ({trail.percentage}%)
                            </span>
                          </div>
                        </div>

                        <div>
                          <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider mb-0.5">Sua Média de Notas</p>
                          <div className="flex items-center gap-2">
                            <span className={`text-sm font-black ${trail.averageGrade >= 7.0 ? 'text-emerald-600' : 'text-amber-600'}`}>
                              {trail.averageGrade.toFixed(1)} / 10.0
                            </span>
                            <span className="text-[10px] text-slate-400">
                              (Min: {trail.minGrade.toFixed(1)})
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      {trail.isClaimed ? (
                        <div className="flex flex-wrap items-center gap-2 w-full justify-between">
                          <span className="text-xs text-slate-400 font-medium">
                            Emitido para <strong>{trail.claimedData?.recipientName}</strong> em {trail.claimedData?.issueDate}
                          </span>
                          <button
                            onClick={() => {
                              playSound('click');
                              setViewingCertificate(trail.claimedData || null);
                            }}
                            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 active:scale-[0.98] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition duration-150 inline-flex items-center gap-1.5 shadow-sm"
                          >
                            <Eye className="w-3.5 h-3.5" /> Visualizar Diploma
                          </button>
                        </div>
                      ) : trail.isEligible ? (
                        <div className="flex items-center justify-between w-full">
                          <span className="text-xs text-slate-500">
                            Parabéns! Requisitos atingidos! 🎉
                          </span>
                          <button
                            onClick={() => {
                              playSound('powerup');
                              setClaimingTrailId(trail.id);
                            }}
                            className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 active:scale-[0.98] text-white font-black text-xs uppercase tracking-widest rounded-xl transition duration-150 inline-flex items-center gap-1.5 shadow-md shadow-amber-500/10"
                          >
                            🎁 Resgatar Certificado <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                          <ShieldAlert className="w-4 h-4 text-slate-300" />
                          <span>Complete todas as lições desta trilha {trail.difficulty} com média ≥ 7.0 para desbloquear.</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ISSUING/CLAIMING INPUT DIALOG */}
      {claimingTrailId && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4 z-[99999] animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-white text-slate-800 rounded-3xl p-6 max-w-md w-full border border-slate-200 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-500 to-yellow-400" />
            
            <h3 className="text-xl font-black text-slate-800 mb-1 leading-tight flex items-center gap-2">
              📜 Personalize Seu Diploma
            </h3>
            <p className="text-xs text-slate-500 mb-5 leading-relaxed">
              Insira o seu nome completo exatamente como deseja que seja impresso no certificado oficial do ByteQuest:
            </p>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1 pl-1">
                  Nome Completo do Aluno
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3.5 w-4 h-4 text-slate-450" />
                  <input
                    type="text"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="Ex: Alan Turing de Oliveira"
                    maxLength={40}
                    className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white transition duration-150"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1 pl-1">
                  Máximo de 40 caracteres. Verifique a grafia antes de emitir!
                </p>
              </div>
            </div>

            <div className="flex gap-2.5">
              <button
                onClick={() => {
                  playSound('click');
                  setClaimingTrailId(null);
                  setRecipientName('');
                }}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 active:scale-[0.98] text-slate-700 font-extrabold text-xs uppercase tracking-wider rounded-xl transition duration-150 border border-slate-200 text-center"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  const trailData = computedTrails.find(t => t.id === claimingTrailId);
                  if (trailData) {
                    handleClaimCertificate(claimingTrailId, trailData.averageGrade, trailData.percentage);
                  }
                }}
                className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 active:scale-[0.98] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition duration-150 shadow-md shadow-emerald-500/20 text-center"
              >
                Gerar Certificado ✨
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DIPLOMA HIGH FIDELITY DISPLAY MODAL */}
      {viewingCertificate && (
        <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-4 z-[99999] overflow-y-auto animate-[fadeIn_0.2s_ease-out]">
          <div className="max-w-2xl w-full my-8 relative">
            
            {/* Modal Controls (Close and Print buttons) - Hidden during window printing natively */}
            <div className="absolute -top-12 left-0 right-0 flex justify-between items-center px-1 print:hidden">
              <button
                onClick={handlePrint}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 active:scale-[0.98] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition duration-150 shadow-lg flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" /> Imprimir / PDF
              </button>
              <button
                onClick={() => {
                  playSound('click');
                  setViewingCertificate(null);
                }}
                className="p-2 bg-white/20 hover:bg-white/30 text-white rounded-full transition duration-150 focus:outline-none"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* PRINT-CONTAINER: Certificate Artwork Grid */}
            <div id="print-certificate-area" className="bg-white border-[16px] border-[#D4AF37]/80 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden text-center text-slate-800 flex flex-col justify-between aspect-[1.414/1] min-h-[460px]">
              
              {/* Internal watermark stamp structure */}
              <div className="absolute -right-16 -bottom-16 w-64 h-64 border-8 border-slate-100 rounded-full flex items-center justify-center select-none pointer-events-none">
                <div className="text-slate-100 text-7xl font-sans font-black rotate-12">BYTEQUEST</div>
              </div>

              {/* Gold corners */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-[#D4AF37]" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-[#D4AF37]" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-[#D4AF37]" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-[#D4AF37]" />

              {/* Certificate content items */}
              <div>
                <div className="flex justify-center items-center gap-2.5 mb-2">
                  <span className="text-2xl">💻</span>
                  <p className="text-xs font-black uppercase tracking-widest text-[#B392ac]">
                    ByteQuest Academy of Software Engineering
                  </p>
                </div>
                
                <h1 className="text-3xl md:text-4xl font-serif tracking-wide text-slate-900 font-extrabold mb-1">
                  Certificado de Conclusão
                </h1>
                
                <div className="w-32 h-0.5 bg-[#D4AF37] mx-auto mt-2 mb-6" />
                
                <p className="text-xs italic text-slate-500 font-serif leading-relaxed">
                  Certificamos para os devidos fins legais e com alto teor de louvor que o desenvolvedor(a)
                </p>

                <h2 className="text-2xl md:text-3xl font-sans font-black text-slate-800 tracking-tight my-4 decoration-[#D4AF37] decoration-2 underline underline-offset-8">
                  {viewingCertificate.recipientName}
                </h2>

                <p className="text-xs text-slate-600 leading-relaxed max-w-lg mx-auto font-sans">
                  concluiu com êxito a trilha conceitual de nível <strong className="font-bold underline text-slate-800">{viewingCertificate.difficulty}</strong> de linguagens de programação, contemplando conhecimentos rigorosos estruturados, alcançando uma <strong>Média Final de {viewingCertificate.averageGrade.toFixed(1)} / 10.0</strong> no simulador computacional interativo.
                </p>
              </div>

              {/* Bottom Stamp and Signature Rows */}
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-6 relative z-15">
                
                {/* Visual Stamp Seal with golden outline */}
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-full border-4 border-double border-[#D4AF37] flex items-center justify-center bg-amber-50 text-3xl shrink-0 select-none">
                    ⭐
                  </div>
                  <div className="text-left text-[9px] font-mono leading-tight">
                    <p className="font-extrabold text-[#D4AF37]">SELO DE DESEMPENHO</p>
                    <p className="text-slate-500">Autenticidade Garantida</p>
                    <p className="text-slate-400 font-mono text-[8px] uppercase select-all">
                      Hash ID: BQ-{(viewingCertificate.recipientName.length * 17).toString(16)}-{viewingCertificate.issueDate.replace(/\//g, '')}
                    </p>
                  </div>
                </div>

                {/* Date */}
                <div className="text-center font-sans text-xs">
                  <p className="font-bold text-slate-400 uppercase tracking-widest text-[9px]">Data de Emissão</p>
                  <p className="font-black text-slate-700 mt-1">{viewingCertificate.issueDate}</p>
                </div>

                {/* Coordinator Signature mock */}
                <div className="text-center">
                  <div className="font-serif italic text-base font-medium text-slate-700 select-none pb-1 border-b border-slate-300 px-6 font-handwriting">
                    Grace Hopper
                  </div>
                  <p className="font-bold text-[9px] text-slate-400 uppercase tracking-widest mt-1">Diretora de Engenharia</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
