import React from 'react';
import { 
  Code, 
  Terminal, 
  BookOpen, 
  ShoppingBag, 
  Award, 
  Flame, 
  Heart,
  Sparkles
} from 'lucide-react';
import { playSound } from '../utils/audio';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  stats: {
    xp: number;
    hearts: number;
    streak: number;
    gems: number;
    lastHeartsUpdateTime?: number;
  };
  onRefillHearts: () => void;
}

export default function Sidebar({ activeTab, setActiveTab, stats, onRefillHearts }: SidebarProps) {
  const handleTabChange = (tab: string) => {
    playSound('click');
    setActiveTab(tab);
  };

  const [timeLeftStr, setTimeLeftStr] = React.useState<string>("");

  React.useEffect(() => {
    if (stats.hearts >= 5 || !stats.lastHeartsUpdateTime) {
      setTimeLeftStr("");
      return;
    }

    const updateCountdown = () => {
      const now = Date.now();
      const nextHeartAt = stats.lastHeartsUpdateTime! + 3600000;
      const diff = nextHeartAt - now;

      if (diff <= 0) {
        setTimeLeftStr("Recarregando...");
      } else {
        const minutes = Math.floor(diff / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        setTimeLeftStr(`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [stats.hearts, stats.lastHeartsUpdateTime]);

  return (
    <aside className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-slate-200 flex flex-col justify-between p-4 md:h-screen sticky top-0 z-40">
      {/* Brand Label */}
      <div>
        <div className="flex items-center gap-3 px-2 py-3 mb-6">
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-emerald-500/20">
            💻
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-800 tracking-tight flex items-center gap-1">
              ByteQuest
            </h1>
            <span className="text-[10px] font-bold text-emerald-600 tracking-widest uppercase bg-emerald-50 px-2 py-0.5 rounded-full">
              APRENDA GRÁTIS
            </span>
          </div>
        </div>

        {/* User Stats Panel (Mobile responsive / Desktop header) */}
        <div className="bg-slate-50 rounded-2xl p-3 mb-6 border border-slate-100 flex flex-wrap gap-4 items-center justify-around md:grid md:grid-cols-2 md:gap-3">
          <div className="flex items-center gap-2" title="Pontos de Experiência">
            <span className="text-lg">⭐</span>
            <div>
              <p className="text-xs text-slate-500 font-bold">XP</p>
              <p className="text-sm font-bold text-slate-800">{stats.xp}</p>
            </div>
          </div>

          <div className="flex items-center gap-2" title="Ofensiva diária">
            <Flame className="w-5 h-5 text-orange-500 animate-pulse" />
            <div>
              <p className="text-xs text-slate-500 font-bold">Ofensiva</p>
              <p className="text-sm font-bold text-slate-800">{stats.streak} dias</p>
            </div>
          </div>

          <div className="flex items-center gap-2" title="Vidas">
            <div className="relative group cursor-pointer" onClick={() => {
              handleTabChange('loja');
            }}>
              <Heart className={`w-5 h-5 ${stats.hearts > 0 ? 'text-red-500 fill-red-500' : 'text-slate-300'}`} />
              {stats.hearts < 5 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-white font-bold text-[8px] rounded-full w-4 h-4 flex items-center justify-center animate-bounce">
                  +
                </span>
              )}
            </div>
            <div>
              <p className="text-xs text-slate-500 font-bold">Vidas</p>
              <p className="text-sm font-bold text-slate-800 flex items-center gap-1">
                {stats.hearts}/5
              </p>
              {timeLeftStr && (
                <p className="text-[9px] text-amber-600 font-bold leading-tight animate-pulse whitespace-nowrap">
                  ⏱️ {timeLeftStr}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2" title="Gemas do Programador">
            <span className="text-lg">💎</span>
            <div>
              <p className="text-xs text-slate-500 font-bold">Gemas</p>
              <p className="text-sm font-bold text-slate-800">{stats.gems}</p>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1.5">
          <button
            onClick={() => handleTabChange('trilhas')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
              activeTab === 'trilhas'
                ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/10'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Terminal className="w-5 h-5" />
            Trilhas de Aprendizado
          </button>

          <button
            onClick={() => handleTabChange('dicionario')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
              activeTab === 'dicionario'
                ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/10'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-5 h-5" />
            Dicionário Dev
          </button>

          <button
            onClick={() => handleTabChange('loja')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
              activeTab === 'loja'
                ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/10'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <ShoppingBag className="w-5 h-5" />
            Loja de Gemas
          </button>

          <button
            onClick={() => handleTabChange('conquistas')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
              activeTab === 'conquistas'
                ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/10'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Award className="w-5 h-5" />
            Conquistas
          </button>
        </nav>
      </div>

      {/* Mini tip section */}
      <div className="hidden md:block bg-gradient-to-br from-slate-50 to-emerald-50 border border-emerald-100 rounded-2xl p-4 mt-auto">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
            Conselho do Dia
          </h4>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed font-sans">
          "Para programar bem, não tente memorizar tudo. Entenda a lógica e saiba onde buscar ajuda!"
        </p>
      </div>
    </aside>
  );
}
