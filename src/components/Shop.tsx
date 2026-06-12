import React from 'react';
import { ShoppingBag, CheckCircle, Heart, Palette, Shield, Sparkles, HelpCircle } from 'lucide-react';
import { playSound } from '../utils/audio';

interface ShopProps {
  gems: number;
  hearts: number;
  streakShields: number;
  activeTheme: string;
  purchasedThemes: string[];
  lastHeartsUpdateTime?: number;
  onRefillHearts: () => void;
  onBuyTheme: (themeId: string, cost: number) => void;
  onSelectTheme: (themeId: string) => void;
  onBuyShield: (cost: number) => void;
}

interface ShopItem {
  id: string;
  type: 'hearts' | 'theme' | 'shield';
  title: string;
  description: string;
  price: number;
  icon: string;
  unlocked?: boolean;
}

export default function Shop({
  gems,
  hearts,
  streakShields,
  activeTheme,
  purchasedThemes,
  lastHeartsUpdateTime,
  onRefillHearts,
  onBuyTheme,
  onSelectTheme,
  onBuyShield
}: ShopProps) {

  const [timeLeftStr, setTimeLeftStr] = React.useState<string>("");

  React.useEffect(() => {
    if (hearts >= 5 || !lastHeartsUpdateTime) {
      setTimeLeftStr("");
      return;
    }

    const updateCountdown = () => {
      const now = Date.now();
      const nextHeartAt = lastHeartsUpdateTime + 3600000;
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
  }, [hearts, lastHeartsUpdateTime]);

  const handleRefillClick = () => {
    if (hearts >= 5) {
      alert("Suas vidas já estão cheias! (Máximo de 5)");
      return;
    }
    if (gems < 20) {
      alert("Você não possui gemas suficientes. Complete lições para juntar!");
      return;
    }
    playSound('powerup');
    onRefillHearts();
  };

  const handleThemePurchase = (themeId: string, price: number) => {
    if (purchasedThemes.includes(themeId)) {
      // Already owned, just select it
      playSound('click');
      onSelectTheme(themeId);
      return;
    }

    if (gems < price) {
      alert("Você não possui gemas suficientes para liberar este tema fantástico!");
      return;
    }

    // Spend gems and buy
    playSound('powerup');
    onBuyTheme(themeId, price);
  };

  return (
    <div className="flex-1 p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-100 text-emerald-600 rounded-2xl">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-800">Recursos & Loja de Gemas</h2>
            <p className="text-slate-500 text-sm">Use seu saldo para recarregar energias e equipar o melhor layout.</p>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-250 rounded-2xl px-4 py-2 flex items-center gap-2">
          <span className="text-xl">💎</span>
          <div>
            <p className="text-[10px] text-amber-800 font-black uppercase">Saldo Atual</p>
            <p className="text-base font-extrabold text-amber-950 font-mono">{gems}</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Left Card: Consumables (Hearts & Shields) */}
        <div className="space-y-4">
          <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest pl-1">Consumíveis</h3>
          
          {/* Heart refill item */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 hover:border-slate-300 transition flex justify-between items-center relative overflow-hidden">
            <div className="flex gap-4">
              <div className="w-14 h-14 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center text-2xl border border-red-100 shrink-0 shadow-sm">
                ❤️
              </div>
              <div>
                <p className="text-xs font-black text-red-500 uppercase mb-1">MÉDICO DO CÓDIGO</p>
                <h4 className="font-extrabold text-slate-800 text-base">Recarregar Corações</h4>
                <p className="text-xs text-slate-500 max-w-[220px] leading-tight">Preencha seus 5 corações instantaneamente para jogar sem parar.</p>
              </div>
            </div>

            <div className="text-right shrink-0">
              <button
                onClick={handleRefillClick}
                disabled={hearts >= 5}
                className={`py-2 px-4 rounded-xl font-extrabold text-xs flex items-center gap-1.5 transition ${
                  hearts >= 5 
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                    : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-md shadow-emerald-500/10'
                }`}
              >
                <span>COMPRAR</span>
                <span className="font-mono bg-white/20 px-1 py-0.5 rounded text-[10px]">💎 20</span>
              </button>
              <p className="text-[10px] text-slate-400 mt-1 font-sans mr-2">Atualmente {hearts}/5</p>
              {timeLeftStr && (
                <p className="text-[10px] text-amber-600 font-extrabold mt-1 animate-pulse">
                  ⏱️ +1 ❤️ em {timeLeftStr}
                </p>
              )}
            </div>
          </div>

          {/* Shield streak item */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 hover:border-slate-300 transition flex justify-between items-center">
            <div className="flex gap-4">
              <div className="w-14 h-14 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center text-2xl border border-amber-100 shrink-0 shadow-sm">
                🛡️
              </div>
              <div>
                <p className="text-xs font-black text-amber-600 uppercase mb-1">PROTETOR DIÁRIO</p>
                <h4 className="font-extrabold text-slate-800 text-base">Amuleto de Ofensiva</h4>
                <p className="text-xs text-slate-500 max-w-[220px] leading-tight">Impede que sua sequência histórica zere caso você perca todas as vidas numa lição.</p>
              </div>
            </div>

            <div className="text-right shrink-0">
              <button
                onClick={() => {
                  if (gems >= 30) {
                    onBuyShield(30);
                  } else {
                    alert("Gemas insuficientes! Complete mais desafios nas trilhas.");
                  }
                }}
                className="py-2 px-4 bg-emerald-500 hover:bg-emerald-600 text-white shadow-md shadow-emerald-500/10 rounded-xl font-extrabold text-xs flex items-center gap-1.5 transition"
              >
                <span>COMPRAR</span>
                <span className="font-mono bg-white/20 px-1 py-0.5 rounded text-[10px]">💎 30</span>
              </button>
              <p className="text-[10px] text-slate-400 mt-1 font-sans mr-2">Possui: {streakShields} ativo(s)</p>
            </div>
          </div>
        </div>

        {/* Right Card: Code Theme Unlocking */}
        <div className="space-y-4">
          <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest pl-1">Temas Code Editor</h3>

          <div className="space-y-3">
            {/* Standard Emerald Theme */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-500 flex items-center justify-center text-white">🎨</div>
                <div>
                  <h5 className="font-bold text-sm text-slate-800">Padrão ByteQuest</h5>
                  <p className="text-xs text-slate-500">Design verde clássico, minimalista e focado no aprendizado.</p>
                </div>
              </div>
              {activeTheme === 'default' ? (
                <span className="text-xs font-black bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-full">ATIVADO</span>
              ) : (
                <button
                  onClick={() => onSelectTheme('default')}
                  className="text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-full"
                >
                  USAR
                </button>
              )}
            </div>

            {/* VS Code Theme */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-sky-950 flex items-center justify-center text-sky-400 font-mono text-xs">VS</div>
                <div>
                  <h5 className="font-bold text-sm text-slate-800">Tema Studio Blue</h5>
                  <p className="text-xs text-slate-500">Aparência que remete ao VS Code com tons de azul e cinza.</p>
                </div>
              </div>
              {activeTheme === 'vscode' ? (
                <span className="text-xs font-black bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-full">ATIVADO</span>
              ) : purchasedThemes.includes('vscode') ? (
                <button
                  onClick={() => onSelectTheme('vscode')}
                  className="text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-full"
                >
                  USAR
                </button>
              ) : (
                <button
                  onClick={() => handleThemePurchase('vscode', 40)}
                  className="text-xs font-black text-emerald-600 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-full"
                >
                  LIBERAR 💎 40
                </button>
              )}
            </div>

            {/* Dracula theme */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-950 flex items-center justify-center text-purple-400 font-mono text-xs">DR</div>
                <div>
                  <h5 className="font-bold text-sm text-slate-800">Tema Dracula Vampiro</h5>
                  <p className="text-xs text-slate-500">Combinação favorita dos devs com violeta e rosa neon.</p>
                </div>
              </div>
              {activeTheme === 'dracula' ? (
                <span className="text-xs font-black bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-full">ATIVADO</span>
              ) : purchasedThemes.includes('dracula') ? (
                <button
                  onClick={() => onSelectTheme('dracula')}
                  className="text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-full"
                >
                  USAR
                </button>
              ) : (
                <button
                  onClick={() => handleThemePurchase('dracula', 50)}
                  className="text-xs font-black text-emerald-600 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-full"
                >
                  LIBERAR 💎 50
                </button>
              )}
            </div>

            {/* Matrix Theme */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-black flex items-center justify-center text-green-500 font-mono text-xs">&gt;_</div>
                <div>
                  <h5 className="font-bold text-sm text-slate-800">Matrix Terminal</h5>
                  <p className="text-xs text-slate-500">Mundo Hacker retrô de 1999 com fundo totalmente preto.</p>
                </div>
              </div>
              {activeTheme === 'matrix' ? (
                <span className="text-xs font-black bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-full">ATIVADO</span>
              ) : purchasedThemes.includes('matrix') ? (
                <button
                  onClick={() => onSelectTheme('matrix')}
                  className="text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-full"
                >
                  USAR
                </button>
              ) : (
                <button
                  onClick={() => handleThemePurchase('matrix', 70)}
                  className="text-xs font-black text-emerald-600 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-full"
                >
                  LIBERAR 💎 70
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
