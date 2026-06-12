import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Glossary from './components/Glossary';
import Shop from './components/Shop';
import Achievements from './components/Achievements';
import LessonScreen from './components/LessonScreen';
import { Module, Difficulty, UserProgress } from './types';
import { playSound } from './utils/audio';
import { AlertCircle, Terminal, HelpCircle, Heart, Star } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'bytequest_game_progress_v3';

const getInitialProgress = (): UserProgress => ({
  xp: 0,
  hearts: 5,
  streak: 0, // Começa com 0 de ofensiva
  streakShields: 0,
  completedModules: [],
  unlockedDifficulties: ['Iniciante'],
  gems: 0, // Começa com 0 gemas
  activeTheme: 'default',
  purchasedThemes: ['default'],
  moduleProgress: {},
  moduleGrades: {},
  certificates: [],
  lastHeartsUpdateTime: undefined
});

export default function App() {
  const [progress, setProgress] = useState<UserProgress>(getInitialProgress());
  const [activeTab, setActiveTab] = useState<string>('trilhas');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('Iniciante');
  const [activeLessonModule, setActiveLessonModule] = useState<Module | null>(null);
  const [unlockedAchievement, setUnlockedAchievement] = useState<{
    id: string;
    title: string;
    badge: string;
    desc: string;
  } | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showResetFinished, setShowResetFinished] = useState(false);

  // Load progress from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        setProgress(JSON.parse(stored));
      }
    } catch (e) {
      console.warn("Could not load local storage data:", e);
    }
  }, []);

  // Save progress on change
  const saveProgress = (newProgress: UserProgress) => {
    const updatedWithTimer = { ...newProgress };
    if (updatedWithTimer.hearts < 5) {
      if (!updatedWithTimer.lastHeartsUpdateTime) {
        updatedWithTimer.lastHeartsUpdateTime = Date.now();
      }
    } else {
      updatedWithTimer.lastHeartsUpdateTime = undefined;
    }

    try {
      const getUnlocked = (p: UserProgress) => ({
        'first-step': p.completedModules.length >= 1,
        'gem-hoarder': p.gems >= 50,
        'streak-master': p.streak > 0,
        'professional-dev': p.completedModules.some(id => id.startsWith('pro-')),
        'completionist': p.completedModules.length >= 3,
      });

      const oldStatus = getUnlocked(progress);
      const newStatus = getUnlocked(updatedWithTimer);

      const newlyUnlocked = (Object.keys(newStatus) as Array<keyof typeof newStatus>).filter(
        key => newStatus[key] && !oldStatus[key]
      );

      if (newlyUnlocked.length > 0) {
        const key = newlyUnlocked[0];
        const ACHIEVEMENT_DETAILS: Record<string, { title: string; badge: string; desc: string }> = {
          'first-step': { title: 'Iniciando Motores', badge: '🚀', desc: 'Terminou seu primeiro desafio lógico de programação!' },
          'gem-hoarder': { title: 'Burguês do Código', badge: '💎', desc: 'Acumulou 50 ou mais gemas programando no sistema!' },
          'streak-master': { title: 'Desenvolvedor Disciplinado', badge: '🔥', desc: 'Manteve sua ofensiva ativa diariamente!' },
          'professional-dev': { title: 'Hacker Supremo', badge: '👑', desc: 'Concluiu pelo menos 1 módulo da trilha Avançada/Profissional!' },
          'completionist': { title: 'Mestre Poliglota', badge: '🏆', desc: 'Completou 3 ou mais módulos teóricos no ByteQuest!' },
        };

        const detail = ACHIEVEMENT_DETAILS[key];
        if (detail) {
          playSound('powerup');
          setUnlockedAchievement({
            id: key,
            title: detail.title,
            badge: detail.badge,
            desc: detail.desc
          });
        }
      }
    } catch (e) {
      console.warn("Could not check achievements on the fly:", e);
    }

    setProgress(updatedWithTimer);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedWithTimer));
    } catch (e) {
      console.warn("Could not save to local storage:", e);
    }
  };

  // Continuous background heart recovery logic: recover 1 heart every 1 hour (3,600,000 ms)
  useEffect(() => {
    if (progress.hearts >= 5) return;

    const checkAndRegenerateHearts = () => {
      const now = Date.now();
      const lastUpdate = progress.lastHeartsUpdateTime || now;
      const elapsed = now - lastUpdate;
      const hourMs = 3600000; // 1 hour = 3,600,000 ms

      if (elapsed >= hourMs) {
        const heartsToRecover = Math.floor(elapsed / hourMs);
        
        setProgress(current => {
          const newHeartsCount = Math.min(5, current.hearts + heartsToRecover);
          const newUpdateTime = newHeartsCount === 5 
            ? undefined 
            : lastUpdate + (heartsToRecover * hourMs);

          const updated = {
            ...current,
            hearts: newHeartsCount,
            lastHeartsUpdateTime: newUpdateTime
          };

          try {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
          } catch (e) {
            console.warn(e);
          }
          return updated;
        });
      } else if (!progress.lastHeartsUpdateTime) {
        setProgress(current => {
          const updated = {
            ...current,
            lastHeartsUpdateTime: now
          };
          try {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
          } catch (e) {
            console.warn(e);
          }
          return updated;
        });
      }
    };

    checkAndRegenerateHearts();
    const interval = setInterval(checkAndRegenerateHearts, 5000); // Check every 5 seconds to remain fully in sync
    return () => clearInterval(interval);
  }, [progress.hearts, progress.lastHeartsUpdateTime]);

  // Heart refill callback
  const handleRefillHearts = () => {
    if (progress.hearts >= 5) return;
    
    // Decrement cost if bought with gems
    const cost = 20;
    const canAfford = progress.gems >= cost;
    
    const updated = {
      ...progress,
      hearts: 5,
      gems: canAfford ? progress.gems - cost : progress.gems
    };
    saveProgress(updated);
  };

  // Buy a new dashboard theme from shop
  const handleBuyTheme = (themeId: string, cost: number) => {
    if (progress.gems < cost) return;
    const updated = {
      ...progress,
      gems: progress.gems - cost,
      purchasedThemes: [...progress.purchasedThemes, themeId],
      activeTheme: themeId
    };
    saveProgress(updated);
  };

  // Switch between already unlocked themes
  const handleSelectTheme = (themeId: string) => {
    playSound('click');
    const updated = {
      ...progress,
      activeTheme: themeId
    };
    saveProgress(updated);
  };

  // Spend gems (e.g. to revive middle-game)
  const handleSpendGems = (amount: number): boolean => {
    if (progress.gems < amount) return false;
    const updated = {
      ...progress,
      gems: progress.gems - amount
    };
    saveProgress(updated);
    return true;
  };

  // Buy a streak shield
  const handleBuyShield = (cost: number) => {
    if (progress.gems < cost) return;
    const updated = {
      ...progress,
      gems: progress.gems - cost,
      streakShields: (progress.streakShields || 0) + 1
    };
    saveProgress(updated);
    playSound('powerup');
  };

  // Handle lesson completion or failure callback
  const handleCloseLesson = (
    completed: boolean, 
    rewardXp: number, 
    earnedGems: number, 
    remainingHearts: number = 5, 
    solvedCount: number = 0,
    mistakesCount: number = 0
  ) => {
    setActiveLessonModule(null);
    playSound('click');

    if (activeLessonModule) {
      const qCount = activeLessonModule.questions.length;
      const progressPercent = qCount > 0 ? Math.round((solvedCount / qCount) * 100) : 0;
      
      // Calculate grade out of 10.0
      const currentHighestGrade = progress.moduleGrades?.[activeLessonModule.id] || 0;
      const calculatedGrade = completed 
        ? Math.max(0, parseFloat((10 - (mistakesCount * (10 / qCount))).toFixed(1))) 
        : 0;
      const newModuleGrades = {
        ...(progress.moduleGrades || {}),
        [activeLessonModule.id]: Math.max(currentHighestGrade, calculatedGrade)
      };

      const percentToSave = completed ? Math.round(calculatedGrade * 10) : progressPercent;
      const currentHighest = progress.moduleProgress?.[activeLessonModule.id] || 0;
      const newModuleProgress = {
        ...(progress.moduleProgress || {}),
        [activeLessonModule.id]: Math.max(currentHighest, percentToSave)
      };

      if (completed) {
        // Mark module completed if not already
        const isNew = !progress.completedModules.includes(activeLessonModule.id);
        const newCompleted = isNew 
          ? [...progress.completedModules, activeLessonModule.id] 
          : progress.completedModules;
        
        const updated = {
          ...progress,
          xp: progress.xp + rewardXp,
          gems: progress.gems + earnedGems,
          completedModules: newCompleted,
          moduleProgress: newModuleProgress,
          moduleGrades: newModuleGrades,
          // Keep exactly the hearts left at the end of the lesson. No free healing! You must buy refills in the Shop.
          hearts: remainingHearts,
          // Successful completion increases the learning streak!
          streak: progress.streak + 1
        };
        saveProgress(updated);
      } else {
        // User aborted or failed
        if (remainingHearts <= 0) {
          // Run out of hearts! Critical failure!
          const hasShield = (progress.streakShields || 0) > 0;
          const currentStreak = progress.streak;
          
          let newStreak = currentStreak;
          let newShieldCount = progress.streakShields || 0;
          
          if (hasShield) {
            newShieldCount -= 1;
            alert(`🛡️ Equipe Salva! Seu Amuleto de Ofensiva foi consumido. Sua sequência de ${currentStreak} dia(s) foi preservada com sucesso!`);
          } else {
            newStreak = 0;
            if (currentStreak > 0) {
              alert(`💔 Game Over! Suas vidas acabaram e você não tinha nenhum Amuleto ativo na loja. Sua sequência de ${currentStreak} dia(s) voltou para 0!`);
            } else {
              alert(`💔 Game Over! Suas vidas acabaram. Recarregue suas energias na Loja ou complete outros desafios para tentar novamente!`);
            }
          }
          
          const updated = {
            ...progress,
            hearts: 0,
            streak: newStreak,
            streakShields: newShieldCount,
            moduleProgress: newModuleProgress,
            moduleGrades: progress.moduleGrades || {}
          };
          saveProgress(updated);
        } else {
          // User voluntarily exited/aborted mid-lesson before running out of hearts
          const updated = {
            ...progress,
            hearts: Math.max(0, progress.hearts - 1),
            moduleProgress: newModuleProgress,
            moduleGrades: progress.moduleGrades || {}
          };
          saveProgress(updated);
          alert(`Você abandonou o desafio no meio e perdeu ❤️ 1 vida. Seu progresso parcial (${progressPercent}%) neste módulo foi guardado!`);
        }
      }
    }
  };

  // Dynamic Styles map corresponding to custom Point Shop Themes
  const getThemeStyles = () => {
    switch (progress.activeTheme) {
      case 'dracula':
        return {
          container: 'bg-[#282a36] text-[#f8f8f2] min-h-screen font-sans transition-all duration-300',
          header: 'bg-[#1e1f29] border-[#44475a] border-b text-[#ff79c6]',
          card: 'bg-[#44475a] border-[#6272a4] text-white',
          title: 'text-[#ff79c6] font-extrabold',
          sidebar: 'bg-[#1e1f29] text-white border-r border-[#44475a]'
        };
      case 'matrix':
        return {
          container: 'bg-black text-[#00ff41] min-h-screen font-mono transition-all duration-300',
          header: 'bg-[#0f0f0f] border-[#00ff41]/50 border-b text-[#00ff41]',
          card: 'bg-black border-[#00ff41] text-[#00ff41]',
          title: 'text-[#00ff41]/90 font-mono font-black uppercase tracking-wider',
          sidebar: 'bg-black text-[#00ff41] border-r border-[#00ff41]/40'
        };
      case 'vscode':
        return {
          container: 'bg-[#1e1e1e] text-[#d4d4d4] min-h-screen font-sans transition-all duration-300',
          header: 'bg-[#252526] border-[#3c3c3c] border-b text-[#569cd6]',
          card: 'bg-[#2d2d2d] border-[#3e3e3e] text-white',
          title: 'text-[#4fc1ff] font-bold',
          sidebar: 'bg-[#252526] text-slate-300 border-r border-[#3c3c3c]'
        };
      default: // 'default'
        return {
          container: 'bg-slate-50 text-slate-800 min-h-screen font-sans transition-all duration-300',
          header: 'bg-white border-slate-200 border-b text-slate-800',
          card: 'bg-white border-slate-200 text-slate-800',
          title: 'text-slate-850 font-black',
          sidebar: 'bg-white text-slate-800 border-r border-slate-200'
        };
    }
  };

  const theme = getThemeStyles();

  return (
    <div className={theme.container}>
      
      {/* If a lesson is currently active, render full-bleed screen overlay */}
      {activeLessonModule ? (
        <LessonScreen
          module={activeLessonModule}
          onClose={handleCloseLesson}
          userGems={progress.gems}
          onSpendGems={handleSpendGems}
          streakShields={progress.streakShields || 0}
          userStreak={progress.streak}
          userHearts={progress.hearts}
        />
      ) : (
        <div className="flex flex-col md:flex-row min-h-screen">
          
          {/* Unified Sidebar Navigation */}
          <Sidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            stats={{
              xp: progress.xp,
              hearts: progress.hearts,
              streak: progress.streak,
              gems: progress.gems,
              lastHeartsUpdateTime: progress.lastHeartsUpdateTime
            }}
            onRefillHearts={handleRefillHearts}
          />

          {/* Main workspace arena */}
          <main className="flex-1 flex flex-col min-h-screen">
            
            {/* Top Bar helper for Mobile, showing active theme settings and stats */}
            <header className={`${theme.header} px-6 py-4 flex items-center justify-between`}>
              <div className="flex items-center gap-2">
                <Terminal className="w-5 h-5 text-emerald-500" />
                <h2 className="text-sm font-bold tracking-tight">
                  Status: <span className="uppercase text-xs tracking-wider">{progress.activeTheme} Theme</span>
                </h2>
              </div>

              {/* Reset capability to permit easy debugging and replay! */}
              <button
                id="btn-reset-progresso"
                onClick={() => {
                  playSound('click');
                  setShowResetConfirm(true);
                }}
                className="text-[10px] uppercase font-black tracking-wider text-red-500 hover:text-red-700 bg-red-50 px-2.5 py-1.5 rounded-lg border border-red-200 transition duration-150 active:scale-[0.98]"
              >
                Resetar Progresso
              </button>
            </header>

            {/* Render selected active tab pane */}
            <div className="flex-1">
              {activeTab === 'trilhas' && (
                <Dashboard
                  progress={progress}
                  onStartLesson={(mod) => setActiveLessonModule(mod)}
                  selectedDifficulty={selectedDifficulty}
                  setSelectedDifficulty={setSelectedDifficulty}
                />
              )}

              {activeTab === 'dicionario' && (
                <Glossary />
              )}

              {activeTab === 'loja' && (
                <Shop
                  gems={progress.gems}
                  hearts={progress.hearts}
                  streakShields={progress.streakShields || 0}
                  activeTheme={progress.activeTheme}
                  purchasedThemes={progress.purchasedThemes}
                  lastHeartsUpdateTime={progress.lastHeartsUpdateTime}
                  onRefillHearts={handleRefillHearts}
                  onBuyTheme={handleBuyTheme}
                  onSelectTheme={handleSelectTheme}
                  onBuyShield={handleBuyShield}
                />
              )}

              {activeTab === 'conquistas' && (
                <Achievements 
                  progress={progress} 
                  onUpdateProgress={saveProgress}
                />
              )}
            </div>
          </main>
        </div>
      )}

      {unlockedAchievement && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-[9999] animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-white text-slate-800 rounded-3xl p-8 max-w-sm w-full text-center border-4 border-amber-400 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500"></div>
            
            <div className="text-6xl mb-4 animate-[bounce_1.5s_infinite] leading-none">
              {unlockedAchievement.badge}
            </div>
            
            <span className="text-[10px] font-black uppercase bg-amber-100 text-amber-800 px-3 py-1 rounded-full tracking-wider mb-2 inline-block">
              🏅 Nova Conquista Ativada!
            </span>
            
            <h3 className="text-xl font-black text-slate-800 mb-1 leading-tight">
              {unlockedAchievement.title}
            </h3>
            
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              {unlockedAchievement.desc}
            </p>
            
            <button
              onClick={() => {
                playSound('click');
                setUnlockedAchievement(null);
              }}
              className="w-full py-3 bg-amber-500 hover:bg-amber-600 active:scale-[0.98] text-white font-extrabold text-sm rounded-xl transition duration-150 shadow-md shadow-amber-500/20"
            >
              Sensacional! Coletar Insígnia
            </button>
          </div>
        </div>
      )}

      {showResetConfirm && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4 z-[99999] animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-white text-slate-800 rounded-3xl p-6 max-w-md w-full border border-slate-200 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-red-500 via-orange-400 to-red-600" />
            
            <div className="text-5xl mb-4 text-center leading-none">
              🚨
            </div>
            
            <h3 className="text-xl font-black text-center text-slate-800 mb-2 leading-tight">
              Resetar Todo o Progresso?
            </h3>
            
            <p className="text-xs text-center text-slate-500 mb-5 leading-relaxed">
              Você está prestes a apagar completamente sua evolução no ByteQuest e reiniciar do zero absoluto!
            </p>

            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 mb-6 text-xs text-slate-600 space-y-2.5">
              <div className="flex items-center gap-2">
                <span className="text-red-500 font-bold font-mono">❤️</span>
                <span>Suas vidas e regeneração serão restauradas para 5</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-orange-500 font-bold font-mono">🔥</span>
                <span>Sua sequência de ofensiva diária voltará para 0</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-500 font-bold font-mono">📊</span>
                <span>Todas as lições voltarão para 0% concluídas</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-amber-500 font-bold font-mono">⭐</span>
                <span>Seus Pontos de Experiência (XP) voltarão para 0</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-blue-500 font-bold font-mono">💎</span>
                <span>Todo o saldo de gemas e layouts da loja serão reiniciados</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-purple-500 font-bold font-mono">📜</span>
                <span>Todas as notas de progresso e certificados do inventário serão excluídos</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={() => {
                  playSound('click');
                  setShowResetConfirm(false);
                }}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 active:scale-[0.98] text-slate-700 font-extrabold text-sm rounded-xl transition duration-150 border border-slate-200 text-center"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  playSound('incorrect');
                  const fresh = getInitialProgress();
                  // Store initial progress to local storage
                  try {
                    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(fresh));
                  } catch (e) {
                    console.warn("Could not save reset state to local storage:", e);
                  }
                  setProgress(fresh);
                  setActiveTab('trilhas');
                  setSelectedDifficulty('Iniciante');
                  setActiveLessonModule(null);
                  setUnlockedAchievement(null);
                  setShowResetConfirm(false);
                  setShowResetFinished(true);
                }}
                className="flex-1 py-3 bg-red-500 hover:bg-red-600 active:scale-[0.98] text-white font-extrabold text-sm rounded-xl transition duration-150 shadow-md shadow-red-500/20 text-center animate-pulse"
              >
                Sim, Resetar Tudo
              </button>
            </div>
          </div>
        </div>
      )}

      {showResetFinished && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-[99999] animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-white text-slate-800 rounded-3xl p-6 max-w-sm w-full text-center border-4 border-emerald-400 shadow-2xl relative overflow-hidden animate-[bounceIn_0.3s_ease-out]">
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-400 to-teal-500" />
            
            <div className="text-5xl mb-4 animate-[bounce_1.5s_infinite] leading-none">
              🚀
            </div>
            
            <h3 className="text-xl font-black text-slate-800 mb-1 leading-tight">
              Progresso Zerado!
            </h3>
            
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              O seu progresso foi reiniciado com sucesso. Comece sua nova jornada de estudos do zero! Boa sorte!
            </p>
            
            <button
              onClick={() => {
                playSound('click');
                setShowResetFinished(false);
              }}
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 active:scale-[0.98] text-white font-extrabold text-sm rounded-xl transition duration-150 shadow-md shadow-emerald-500/20"
            >
              Iniciar Nova Jornada!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
