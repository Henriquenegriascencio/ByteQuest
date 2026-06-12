import React, { useState, useEffect } from 'react';
import { 
  Code, 
  CheckCircle, 
  Lock, 
  HelpCircle, 
  Sparkles, 
  ChevronRight, 
  Zap, 
  CornerDownRight, 
  Plus, 
  GitFork, 
  List, 
  RotateCcw, 
  Cpu, 
  Workflow, 
  BookOpen
} from 'lucide-react';
import { LESSONS_DATA } from '../data/lessons';
import { Module, Difficulty, UserProgress } from '../types';
import { playSound } from '../utils/audio';

// Custom Map for dynamically rendering icons of Modules
const iconMap: { [key: string]: any } = {
  CornerDownRight: CornerDownRight,
  Plus: Plus,
  GitFork: GitFork,
  List: List,
  RotateCcw: RotateCcw,
  Cpu: Cpu,
  Zap: Zap,
  Workflow: Workflow,
};

// Curated static list of Useful Daily Tips for Beginners / Gold Tips
const GOLDEN_TIPS = [
  {
    title: "Por que as listas começam em 0?",
    category: "História",
    content: "Antigamente, em linguagens de baixo nível como C, o índice de um Array representava o 'deslocamento' de memória a partir da primeira posição. Na primeira posição física, o deslocamento é exatamente zero!",
    icon: "📜"
  },
  {
    title: "Estrito (===) vs Solto (==)",
    category: "Sintaxe",
    content: "No JavaScript, prefira sempre o comparador estrito (===). Ele compara o valor E o tipo do dado de forma segura, enquanto o comparador comum (==) tenta converter os tipos de forma implicitamente bizarra, gerando bugs ocultos.",
    icon: "🔍"
  },
  {
    title: "O Padrão DRY ('Don't Repeat Yourself')",
    category: "Boas Práticas",
    content: "Evite repetir o mesmo padrão de raciocínio várias vezes pelo projeto. Se você se pegar copiando e colando lógica em mais de dois módulos, separe essa rotina em uma função pura e reutilizável!",
    icon: "⚡"
  },
  {
    title: "De onde surgiu a palavra 'Bug'?",
    category: "Curiosidade",
    content: "O termo ganhou força na história quando a pioneira Grace Hopper encontrou uma mariposa real travando os contatos de um computador gigante de válvulas em 1947. Ela removeu o inseto e chamou o evento de 'debugging'!",
    icon: "🦋"
  },
  {
    title: "A Importância do console.log()",
    category: "Depuração",
    content: "Não tenha vergonha de encher seu código local de logs para entender a ordem das execuções! Inspecionar os valores que passam pelas variáveis no terminal é a técnica mais eficiente e rápida do mundo.",
    icon: "💻"
  },
  {
    title: "Como criar Comentários de Qualidade",
    category: "Clean Code",
    content: "Bons comentários explicam a decisão arquitetural (o 'porquê') em vez de simplesmente repetir o código (o 'o quê'). Deixe o seu código limpo e o óbvio falar por si mesmo, use anotações em partes intrincadas.",
    icon: "✍️"
  },
  {
    title: "CamelCase vs snake_case",
    category: "Padrão",
    content: "No EcmaScript (JS/TS), a convenção preferida é o camelCase para variáveis e funções (ex: calcularMediaNotas) e PascalCase para classes e tipos. Deixe o snake_case (calcular_media) para chaves de banco ou Python!",
    icon: "🐪"
  },
  {
    title: "Proteja seus Valores com Const",
    category: "Sintaxe",
    content: "Por padrão, declare todas as suas variáveis usando 'const'. Só use 'let' se souber conscientemente que o valor sofrerá reatribuições diretas ao longo do ciclo de vida da função. Isso evita mutações acidentais.",
    icon: "🔒"
  },
  {
    title: "O que é Garbage Collector?",
    category: "Curiosidade",
    content: "No JavaScript você não gerencia a remoção de variáveis da memória manualmente. O mecanismo do motor Javascript (como o V8) detecta automaticamente quando dados não podem mais ser acessados e limpa a memória por você!",
    icon: "♻️"
  },
  {
    title: "Evite o Callback Hell",
    category: "Boas Práticas",
    content: "Funções dentro de funções para lidar com fluxo assíncrono criavam pirâmides de código ilegíveis antigamente. Hoje, use Async/Await para estruturar requisições de forma limpa e linear, facilitando a leitura.",
    icon: "⏳"
  }
];

// Interactive sub-component to render the text with a typewriter effect
function TypingText({ text, speed = 15 }: { text: string; speed?: number }) {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    setDisplayedText("");
    let index = 0;
    const interval = setInterval(() => {
      setDisplayedText(() => {
        const next = text.slice(0, index + 1);
        index++;
        if (index >= text.length) {
          clearInterval(interval);
        }
        return next;
      });
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return (
    <span className="relative font-medium text-slate-600 dark:text-slate-300">
      {displayedText}
      {displayedText.length < text.length && (
        <span className="inline-block w-1.5 h-3.5 ml-0.5 bg-amber-500 animate-[pulse_1s_infinite] align-middle" />
      )}
    </span>
  );
}

interface DashboardProps {
  progress: UserProgress;
  onStartLesson: (module: Module) => void;
  selectedDifficulty: Difficulty;
  setSelectedDifficulty: (diff: Difficulty) => void;
}

export default function Dashboard({ 
  progress, 
  onStartLesson, 
  selectedDifficulty, 
  setSelectedDifficulty 
}: DashboardProps) {
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);

  // Filter modules based on selected difficulty
  const modules = LESSONS_DATA.filter(m => m.difficulty === selectedDifficulty);

  const handleDifficultyClick = (diff: Difficulty) => {
    playSound('click');
    setSelectedDifficulty(diff);
    setSelectedModule(null);
  };

  const handleModuleClick = (module: Module) => {
    playSound('click');
    // Check if difficulty is unlocked or if they completed the previous difficulty or first one
    // In our simplified gamified world, all levels are unlocked by default to let them play, but we can style locked ones for extra UX!
    const isUnlocked = true; // Let them explore everything or restrict
    if (isUnlocked) {
      setSelectedModule(module);
    }
  };

  const handleStartLessonBtn = (module: Module) => {
    playSound('powerup');
    onStartLesson(module);
  };

  // Helper to render lucide icon component dynamically
  const renderModuleIcon = (iconName: string, className: string) => {
    const IconComponent = iconMap[iconName] || Code;
    return <IconComponent className={className} />;
  };

  // Calculate difficulty-specific stats
  const totalInDifficulty = LESSONS_DATA.filter(m => m.difficulty === selectedDifficulty).length;
  const completedInDifficulty = LESSONS_DATA.filter(
    m => m.difficulty === selectedDifficulty && progress.completedModules.includes(m.id)
  ).length;
  const percentage = totalInDifficulty > 0 ? Math.round((completedInDifficulty / totalInDifficulty) * 100) : 0;

  // Retrieve deterministic daily tip based on today's calendar date
  const getDailyTip = () => {
    const today = new Date();
    // Deterministic seed using day + month * 31 + (year offset)
    const daySeed = today.getDate() + today.getMonth() * 31 + (today.getFullYear() - 2026);
    const tipIndex = Math.abs(daySeed) % GOLDEN_TIPS.length;
    return GOLDEN_TIPS[tipIndex];
  };
  const dailyTip = getDailyTip();

  return (
    <div className="flex-1 p-6 max-w-4xl mx-auto">
      {/* Upper Difficulty Filter Toggle */}
      <div className="bg-slate-100 p-1.5 rounded-2xl flex gap-1 mb-8">
        {(['Iniciante', 'Médio', 'Profissional'] as Difficulty[]).map(diff => (
          <button
            key={diff}
            onClick={() => handleDifficultyClick(diff)}
            className={`flex-1 py-3 text-sm font-extrabold rounded-xl transition duration-200 ${
              selectedDifficulty === diff
                ? 'bg-white text-slate-800 shadow-md shadow-slate-200/50 scale-[1.01]'
                : 'text-slate-500 hover:text-slate-800 hover:bg-white/50'
            }`}
          >
            {diff === 'Iniciante' && '🟢 '}
            {diff === 'Médio' && '🟡 '}
            {diff === 'Profissional' && '🔥 '}
            {diff}
          </button>
        ))}
      </div>

      {/* Progress Card of Selected Level */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl p-6 text-white mb-10 shadow-lg shadow-emerald-500/10 relative overflow-hidden">
        <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-4 translate-y-4">
          <Code className="w-56 h-56" />
        </div>

        <div className="relative z-10">
          <div className="flex justify-between items-start mb-2">
            <div>
              <span className="text-xs font-black uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full text-white">
                Trilha {selectedDifficulty}
              </span>
              <h2 className="text-2xl font-black mt-2 leading-tight">
                {selectedDifficulty === 'Iniciante' && 'Fundamentos Iniciais do Algoritmo'}
                {selectedDifficulty === 'Médio' && 'Estrutura Completa de Dados & Funções'}
                {selectedDifficulty === 'Profissional' && 'Operações Assíncronas & Programação Funcional'}
              </h2>
            </div>
            <div className="bg-white/10 p-2.5 rounded-2xl">
              <span className="text-2xl font-bold">🎯</span>
            </div>
          </div>
          
          <p className="text-emerald-50 text-sm mb-6 max-w-lg leading-relaxed">
            {selectedDifficulty === 'Iniciante' && 'Dê os seus primeiros passos na programação. Defina variáveis, some dados e monte condições lógicas para controlar sistemas.'}
            {selectedDifficulty === 'Médio' && 'Organize sequências em listas dinâmicas, crie laços automáticos de repetições eficientes e estruture reaproveitamento de código.'}
            {selectedDifficulty === 'Profissional' && 'Escreva códigos de alto rendimento. Trabalhe com respostas de servidores, manipulações avançadas e resoluções de bugs complexos.'}
          </p>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold text-emerald-100">
              <span>Módulos Concluídos: {completedInDifficulty} de {totalInDifficulty}</span>
              <span>{percentage}%</span>
            </div>
            <div className="w-full bg-emerald-700/50 h-3 rounded-full overflow-hidden">
              <div 
                className="bg-white h-full transition-all duration-500" 
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Card Dica de Ouro */}
      <div 
        id="card-dica-de-ouro"
        className="bg-gradient-to-br from-amber-500/5 to-yellow-500/5 border border-amber-500/20 rounded-3xl p-5 mb-10 shadow-xs relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center gap-4 hover:border-amber-500/40 transition-colors duration-200 animate-[fadeIn_0.3s_ease-out]"
      >
        <div className="absolute top-0 right-0 p-6 opacity-5 text-7xl pointer-events-none select-none font-sans uppercase">
          {dailyTip.icon}
        </div>
        <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-yellow-100 border border-amber-200 rounded-2xl flex items-center justify-center text-2xl shrink-0 shadow-xs animate-[pulse_2s_infinite]">
          {dailyTip.icon}
        </div>
        <div className="flex-1">
          <div className="flex items-center flex-wrap gap-2 mb-1.5">
            <span className="text-[10px] uppercase font-black tracking-widest text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 shadow-xs border border-amber-200/50">
              <Sparkles className="w-3 h-3 text-amber-600 animate-spin" />
              Dica de Ouro
            </span>
            <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200/40 px-2 py-0.5 rounded-full">
              {dailyTip.category}
            </span>
          </div>
          <h3 className="font-extrabold text-slate-800 text-sm md:text-base leading-snug mb-1">
            {dailyTip.title}
          </h3>
          <p className="text-slate-600 text-xs md:text-sm leading-relaxed max-w-3xl min-h-[40px]">
            <TypingText text={dailyTip.content} />
          </p>
        </div>
      </div>

      {/* Path Roadmap Line/Nodes */}
      <div className="grid md:grid-cols-2 gap-6 mb-12">
        {/* Left Column: List of Mapped Modules */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">
            Lista de Desafios ({selectedDifficulty})
          </h3>
          
          {modules.map((mod, index) => {
            const isCompleted = progress.completedModules.includes(mod.id);
            const isSelected = selectedModule?.id === mod.id;
            const currentPercent = progress.moduleProgress?.[mod.id] || (isCompleted ? (progress.moduleGrades?.[mod.id] !== undefined ? Math.round(progress.moduleGrades[mod.id] * 10) : 100) : 0);
            
            // Generate visual styles based on module color
            const colorClasses: { [key: string]: { border: string; bg: string; text: string; lightBg: string } } = {
              emerald: { border: 'border-emerald-200', bg: 'bg-emerald-500', text: 'text-emerald-600', lightBg: 'bg-emerald-50 hover:bg-emerald-100/50' },
              sky: { border: 'border-sky-200', bg: 'bg-sky-500', text: 'text-sky-600', lightBg: 'bg-sky-50 hover:bg-sky-100/50' },
              violet: { border: 'border-violet-200', bg: 'bg-violet-500', text: 'text-violet-600', lightBg: 'bg-violet-50 hover:bg-violet-100/50' },
              amber: { border: 'border-amber-200', bg: 'bg-amber-500', text: 'text-amber-600', lightBg: 'bg-amber-50 hover:bg-amber-100/50' },
              pink: { border: 'border-pink-200', bg: 'bg-pink-500', text: 'text-pink-600', lightBg: 'bg-pink-50 hover:bg-pink-100/50' },
              orange: { border: 'border-orange-200', bg: 'bg-orange-500', text: 'text-orange-600', lightBg: 'bg-orange-50 hover:bg-orange-100/50' },
              rose: { border: 'border-rose-200', bg: 'bg-rose-500', text: 'text-rose-600', lightBg: 'bg-rose-50 hover:bg-rose-100/50' },
              indigo: { border: 'border-indigo-200', bg: 'bg-indigo-500', text: 'text-indigo-600', lightBg: 'bg-indigo-50 hover:bg-indigo-100/50' },
            };

            const colors = colorClasses[mod.color] || colorClasses.emerald;

            return (
              <div
                key={mod.id}
                onClick={() => handleModuleClick(mod)}
                className={`flex flex-col p-4 rounded-2xl border cursor-pointer transition-all duration-200 ${
                  isSelected 
                    ? 'border-slate-800 ring-2 ring-slate-800/20 bg-slate-50' 
                    : isCompleted 
                      ? 'border-emerald-100 bg-white' 
                      : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {/* Circle number or Check */}
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white shadow-sm ${
                      isCompleted ? 'bg-emerald-500' : colors.bg
                    }`}>
                      {isCompleted ? (
                        <CheckCircle className="w-6 h-6 text-white" />
                      ) : (
                        renderModuleIcon(mod.icon, "w-6 h-6 text-white")
                      )}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-800 text-sm md:text-base leading-tight">{mod.title}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{mod.questions.length} exercícios práticos</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {isCompleted ? (
                      <div className="flex items-center gap-1.5">
                        {progress.moduleGrades?.[mod.id] !== undefined && (
                          <span className="text-[10px] font-black text-blue-700 bg-blue-50 border border-blue-200 px-2 py-1 rounded-full">
                            Nota: {progress.moduleGrades[mod.id].toFixed(1)}
                          </span>
                        )}
                        <span className="text-[10px] uppercase font-black text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                          ✓ Feito
                        </span>
                      </div>
                    ) : currentPercent > 0 ? (
                      <span className="text-[10px] uppercase font-black text-amber-600 bg-amber-100 px-2.5 py-1 rounded-full">
                        {currentPercent}% salvo
                      </span>
                    ) : null}
                    <ChevronRight className="w-5 h-5 text-slate-400" />
                  </div>
                </div>

                {/* Individual Mini Progress Bar for visual reinforcement */}
                {currentPercent > 0 && (
                  <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${isCompleted ? 'bg-emerald-500' : 'bg-amber-500'}`}
                      style={{ width: `${currentPercent}%` }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right Column: Interactive Detail Panel (Preview Card of Selected Module) */}
        <div className="relative">
          {selectedModule ? (
            <div className="sticky top-6 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm overflow-hidden animate-[fadeIn_0.2s_ease-out]">
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full uppercase tracking-wider">
                  MÓDULO {selectedModule.id.split('-')[1]?.toUpperCase()}
                </span>
                {progress.completedModules.includes(selectedModule.id) ? (
                  <div className="flex flex-col items-end gap-0.5">
                    <span className="flex items-center gap-1 text-xs font-bold text-emerald-600">
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                      Concluído ({progress.moduleProgress?.[selectedModule.id] || (progress.moduleGrades?.[selectedModule.id] !== undefined ? Math.round(progress.moduleGrades[selectedModule.id] * 10) : 100)}%)
                    </span>
                    {progress.moduleGrades?.[selectedModule.id] !== undefined && (
                      <span className="text-[10px] font-extrabold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-lg">
                        Média: {progress.moduleGrades[selectedModule.id].toFixed(1)} / 10.0
                      </span>
                    )}
                  </div>
                ) : (progress.moduleProgress?.[selectedModule.id] || 0) > 0 ? (
                  <span className="text-xs font-extrabold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-lg">
                    Progresso: {progress.moduleProgress?.[selectedModule.id]}%
                  </span>
                ) : null}
              </div>

              <h2 className="text-xl font-extrabold text-slate-800 mb-2 leading-tight">
                {selectedModule.title}
              </h2>

              {/* Individual Details Progress Bar */}
              {(progress.moduleProgress?.[selectedModule.id] || 0) > 0 && (
                <div className="mb-4">
                  <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase mb-1">
                    <span>SEU PROGRESSO ATUAL</span>
                    <span>{progress.moduleProgress?.[selectedModule.id]}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-300 ${progress.completedModules.includes(selectedModule.id) ? 'bg-emerald-500' : 'bg-amber-500'}`}
                      style={{ width: `${progress.moduleProgress?.[selectedModule.id]}%` }}
                    />
                  </div>
                </div>
              )}

              <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                {selectedModule.description}
              </p>

              {/* Box of learning outcomes */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 mb-6 space-y-3">
                <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-yellow-500" />
                  O que você vai dominar:
                </h4>
                <ul className="text-xs text-slate-600 space-y-2">
                  {selectedModule.id === 'ini-variables' && (
                    <>
                      <li className="flex gap-2">🟢 <span>Sintaxe básica Javascript e declaração de dados</span></li>
                      <li className="flex gap-2">🟢 <span>Exibição formatada no console</span></li>
                    </>
                  )}
                  {selectedModule.id === 'ini-operations' && (
                    <>
                      <li className="flex gap-2">🟢 <span>Cálculos de resto da divisão e aritmética</span></li>
                      <li className="flex gap-2">🟢 <span>Concatenações de strings sem vazamento de memória</span></li>
                    </>
                  )}
                  {selectedModule.id === 'ini-conditions' && (
                    <>
                      <li className="flex gap-2">🟢 <span>Lógica de desvio condicional real (If, else)</span></li>
                      <li className="flex gap-2">🟢 <span>Operadores relacionais de igualdade estrita</span></li>
                    </>
                  )}
                  {selectedModule.id === 'med-arrays' && (
                    <>
                      <li className="flex gap-2">🟡 <span>Métodos básicos para gerenciar arrays (`.push`)</span></li>
                      <li className="flex gap-2">🟡 <span>Leitura de tamanho dinâmico (`.length`)</span></li>
                    </>
                  )}
                  {selectedModule.id === 'med-loops' && (
                    <>
                      <li className="flex gap-2">🟡 <span>Contadores e repetições controladas (`for`, `while`)</span></li>
                      <li className="flex gap-2">🟡 <span>Prevenção de loops infinitos fatais</span></li>
                    </>
                  )}
                  {selectedModule.id === 'med-functions' && (
                    <>
                      <li className="flex gap-2">🟡 <span>Escrita de funções reutilizáveis estruturadas</span></li>
                      <li className="flex gap-2">🟡 <span>Retornos limpos e arrow functions modernas</span></li>
                    </>
                  )}
                  {selectedModule.id === 'pro-async' && (
                    <>
                      <li className="flex gap-2">🔥 <span>Operações assíncronas utilizando Promises nativas</span></li>
                      <li className="flex gap-2">🔥 <span>Sintaxe profissional moderna com `async/await`</span></li>
                    </>
                  )}
                  {selectedModule.id === 'pro-methods' && (
                    <>
                      <li className="flex gap-2">🔥 <span>Iterações inteligentes de listas (`map` e `filter`)</span></li>
                      <li className="flex gap-2">🔥 <span>Redução de acumulação via acumuladores (`reduce`)</span></li>
                    </>
                  )}
                </ul>
              </div>

              {/* Botão de Começar */}
              <button
                onClick={() => handleStartLessonBtn(selectedModule)}
                disabled={progress.hearts <= 0}
                className={`w-full py-4 rounded-2xl font-extrabold text-white shadow-xl flex items-center justify-center gap-2 transition duration-200 ${
                  progress.hearts <= 0 
                  ? 'bg-slate-300 shadow-none cursor-not-allowed' 
                  : 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20 active:scale-95'
                }`}
              >
                {progress.hearts <= 0 ? (
                  <>Você precisa carregar suas Vidas (Lojinha ou Refill)</>
                ) : (
                  <>
                    Começar Desafio (+{selectedModule.questions.length * 10} XP)
                  </>
                )}
              </button>
              {progress.hearts <= 0 && (
                <p className="text-xs text-center text-red-500 font-bold mt-2 font-sans">
                  Suas vidas zeraram! Visite a Loja de Gemas ou clique no coração do menu principal para comprar uma recarga por 💎 20 gemas.
                </p>
              )}
            </div>
          ) : (
            <div className="bg-slate-50 border border-dashed border-slate-300 rounded-3xl p-8 flex flex-col items-center justify-center text-center h-80 sticky top-6">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-3xl mb-4 shadow-inner">
                🤖
              </div>
              <h4 className="font-extrabold text-slate-700 mb-1">Selecione um Módulo</h4>
              <p className="text-xs text-slate-500 max-w-[240px] leading-relaxed">
                Clique nos desafios lógicos ao lado para ver detalhes e iniciar o treino interativo.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
