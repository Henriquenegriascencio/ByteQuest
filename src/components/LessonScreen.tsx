import React, { useState, useEffect } from 'react';
import { 
  X, 
  Heart, 
  Check, 
  AlertTriangle, 
  ChevronRight, 
  Play, 
  HelpCircle, 
  Sparkles, 
  Info,
  Flame,
  CornerDownRight,
  Lightbulb
} from 'lucide-react';
import { Module, Question } from '../types';
import { playSound } from '../utils/audio';

interface LessonScreenProps {
  module: Module;
  onClose: (
    completed: boolean, 
    rewardXp: number, 
    earnedGems: number, 
    remainingHearts?: number, 
    solvedCount?: number,
    mistakesCount?: number
  ) => void;
  userGems: number;
  onSpendGems: (amount: number) => boolean; // returns true if success
  streakShields: number;
  userStreak: number;
  userHearts: number;
}

export default function LessonScreen({ 
  module, 
  onClose, 
  userGems, 
  onSpendGems, 
  streakShields, 
  userStreak,
  userHearts
}: LessonScreenProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [hearts, setHearts] = useState(userHearts);
  const [mistakesCount, setMistakesCount] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [lessonCompleted, setLessonCompleted] = useState(false);

  // States for interactive answers
  // Multiple choice
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  // Fill in the blanks
  const [typedBlank, setTypedBlank] = useState('');
  // Block ordering
  const [availableBlocks, setAvailableBlocks] = useState<string[]>([]);
  const [orderedBlocks, setOrderedBlocks] = useState<string[]>([]);
  // Bug hunting
  const [selectedBugLine, setSelectedBugLine] = useState<number | null>(null);

  // Status of the current question check
  const [isChecked, setIsChecked] = useState(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);

  const question = module.questions[currentIdx];

  // Initialize block-order variables when question changes
  useEffect(() => {
    if (question) {
      setIsChecked(false);
      setIsAnswerCorrect(false);
      setSelectedOption(null);
      setTypedBlank('');
      setSelectedBugLine(null);
      
      if (question.type === 'block-order' && question.blocks) {
        // Shuffle the blocks array for interactive gameplay
        const shuffled = [...question.blocks].sort(() => Math.random() - 0.5);
        setAvailableBlocks(shuffled);
        setOrderedBlocks([]);
      }
    }
  }, [currentIdx, question]);

  // Click handler for blocks
  const handleBlockClick = (block: string, isAvailable: boolean) => {
    if (isChecked) return;
    playSound('click');
    if (isAvailable) {
      // Move from available to ordered
      setAvailableBlocks(prev => prev.filter(b => b !== block));
      setOrderedBlocks(prev => [...prev, block]);
    } else {
      // Move from ordered to available
      setOrderedBlocks(prev => prev.filter(b => b !== block));
      setAvailableBlocks(prev => [...prev, block]);
    }
  };

  const checkAnswer = () => {
    if (isChecked || !question) return;

    let correct = false;

    if (question.type === 'multiple-choice') {
      correct = selectedOption === question.correctAnswer;
    } else if (question.type === 'fill-blank') {
      // Normalized match - ignoring spaces and casing for beginner ease!
      const userAns = typedBlank.trim().toLowerCase();
      const correctAns = question.correctAnswer?.trim().toLowerCase();
      correct = userAns === correctAns;
    } else if (question.type === 'block-order') {
      // Check length and matching sequence
      const correctSeq = question.correctBlocks || [];
      correct = orderedBlocks.length === correctSeq.length && 
                orderedBlocks.every((val, index) => val === correctSeq[index]);
    } else if (question.type === 'bug-hunt') {
      correct = selectedBugLine === question.correctLineIndex;
    }

    setIsChecked(true);
    setIsAnswerCorrect(correct);

    if (correct) {
      playSound('correct');
      setXpEarned(prev => prev + question.xpReward);
    } else {
      playSound('incorrect');
      setMistakesCount(prev => prev + 1);
      setHearts(prev => {
        const newHearts = prev - 1;
        if (newHearts <= 0) {
          setGameOver(true);
        }
        return newHearts;
      });
    }
  };

  const handleNext = () => {
    if (currentIdx + 1 < module.questions.length) {
      setCurrentIdx(prev => prev + 1);
    } else {
      // Finished all questions!
      playSound('victory');
      setLessonCompleted(true);
    }
  };

  const handleSaveWithGems = () => {
    // Revive costs 30 gems, gives full 5 hearts
    const success = onSpendGems(30);
    if (success) {
      playSound('powerup');
      setHearts(5);
      setGameOver(false);
    }
  };

  // Skip or cancel active game
  const handleExit = () => {
    playSound('click');
    const solved = isChecked && isAnswerCorrect ? currentIdx + 1 : currentIdx;
    onClose(false, 0, 0, hearts, solved);
  };

  // Finish active game
  const handleFinish = () => {
    playSound('powerup');
    const earnedGems = Math.round(xpEarned / 4); // 4 XP = 1 Gem bonus
    onClose(true, xpEarned, earnedGems, hearts, module.questions.length, mistakesCount);
  };

  // Helper function to check if input is valid to enable checking
  const isAnswerProvided = () => {
    if (question?.type === 'multiple-choice') {
      return selectedOption !== null;
    }
    if (question?.type === 'fill-blank') {
      return typedBlank.trim().length > 0;
    }
    if (question?.type === 'block-order') {
      return orderedBlocks.length > 0;
    }
    if (question?.type === 'bug-hunt') {
      return selectedBugLine !== null;
    }
    return false;
  };

  if (gameOver) {
    return (
      <div className="fixed inset-0 bg-slate-900/90 flex items-center justify-center p-4 z-50 animate-[fadeIn_0.2s_ease-out]">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center border-4 border-red-500 shadow-2xl relative overflow-hidden">
          {/* Decorative background stripes */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-red-500"></div>

          <div className="text-6xl mb-4">😿</div>
          <h2 className="text-2xl font-black text-slate-800 mb-2">Suas vidas acabaram!</h2>
          <p className="text-slate-600 text-sm mb-6 leading-relaxed">
            Mas não desanime, errar faz parte do aprendizado! Você quer usar suas gemas para reviver e continuar de onde parou?
          </p>

          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 mb-4 flex justify-around items-center">
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase">Suas Gemas</p>
              <p className="text-lg font-black text-slate-700">💎 {userGems}</p>
            </div>
            <div className="h-8 w-px bg-slate-200"></div>
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase">Custo de Reviver</p>
              <p className="text-lg font-black text-slate-700">💎 30</p>
            </div>
          </div>

          {/* Streak indicator warning/info */}
          {streakShields > 0 ? (
            <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-2xl p-3 text-xs mb-5 font-medium flex items-center gap-2 text-left">
              <span className="text-lg">🛡️</span>
              <span><strong>Amuleto de Ofensiva Ativo!</strong> Seu backup de 1 Amuleto protegerá sua ofensiva de <strong>{userStreak} dia(s)</strong> no caso de você desistir agora. Ele será consumido.</span>
            </div>
          ) : userStreak > 0 ? (
            <div className="bg-amber-50 text-amber-800 border border-amber-200 rounded-2xl p-3 text-xs mb-5 font-medium flex items-center gap-2 text-left">
              <span className="text-lg">⚠️</span>
              <span><strong>Cuidado com a sua Ofensiva!</strong> Você não tem Amuleto de Ofensiva ativo. Se voltar ao início sem reviver, sua ofensiva de <strong>{userStreak} dia(s)</strong> será zerada!</span>
            </div>
          ) : null}

          <div className="space-y-3">
            <button
              onClick={handleSaveWithGems}
              disabled={userGems < 30}
              className={`w-full py-4 rounded-xl font-extrabold text-white shadow-lg transition duration-200 ${
                userGems >= 30
                  ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/20 active:scale-95'
                  : 'bg-slate-300 shadow-none cursor-not-allowed'
              }`}
            >
              Compartilhar Vida (💎 30)
            </button>
            <button
              onClick={handleExit}
              className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition duration-200"
            >
              Voltar ao Início
            </button>
          </div>
          {userGems < 30 && (
            <p className="text-xs text-red-500 font-bold mt-3">
              Você não tem gemas suficientes. Jogue mais para acumular moedas!
            </p>
          )}
        </div>
      </div>
    );
  }

  if (lessonCompleted) {
    const gemBonus = Math.round(xpEarned / 4);

    const getGrade = () => {
      if (mistakesCount === 0) {
        return { letter: 'A+', label: 'Gênio do Código! 🌟', desc: 'Zero erros! Sintaxe perfeita estilo Sênior.', color: 'border-emerald-200 bg-emerald-50 text-emerald-800' };
      }
      if (mistakesCount === 1) {
        return { letter: 'A', label: 'Excelente! 👏', desc: 'Apenas 1 erro bobo. Quase tudo perfeito!', color: 'border-green-200 bg-green-50 text-green-800' };
      }
      if (mistakesCount === 2) {
        return { letter: 'B', label: 'Muito Bom! 👍', desc: 'Cometeu apenas 2 erros. Ótimo raciocínio lógico.', color: 'border-blue-200 bg-blue-50 text-blue-800' };
      }
      if (mistakesCount === 3) {
        return { letter: 'C', label: 'Bom esforço! 💪', desc: 'Cometeu 3 erros, mas persistiu e concluiu o desafio.', color: 'border-amber-200 bg-amber-50 text-amber-800' };
      }
      return { letter: 'D', label: 'Aprovado no Limite! 🛠️', desc: 'Cometeu 4 ou mais deslizes. Bom treinar os termos no dicionário!', color: 'border-orange-200 bg-orange-50 text-orange-900' };
    };

    const grade = getGrade();

    return (
      <div className="fixed inset-0 bg-white flex flex-col justify-between p-6 z-50 overflow-y-auto animate-[fadeIn_0.3s_ease-out]">
        <div className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto text-center py-6">
          <div className="text-8xl mb-6 transform hover:scale-110 transition duration-300">🎉</div>
          
          <span className="text-xs font-black bg-emerald-100 text-emerald-800 px-4 py-1.5 rounded-full uppercase tracking-widest mb-1.5 animate-bounce">
            Desafio Completo!
          </span>
          
          <h2 className="text-3xl font-black text-slate-800 mb-2 leading-tight">
            Parabéns, Programador!
          </h2>
          
          <p className="text-slate-500 text-sm mb-6 leading-relaxed max-w-sm">
            Você concluiu o módulo <strong className="text-slate-800">"{module.title}"</strong> com sucesso. Suas habilidades aumentaram!
          </p>

          {/* Grade Card */}
          <div className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 mb-6 ${grade.color} text-left`}>
            <div className="w-14 h-14 bg-white rounded-xl border border-current font-black text-2xl flex items-center justify-center shrink-0 shadow-sm animate-pulse">
              {grade.letter}
            </div>
            <div>
              <p className="text-[10px] opacity-75 font-black uppercase tracking-wider">Desempenho Escolar</p>
              <h4 className="font-extrabold text-base leading-tight">{grade.label}</h4>
              <p className="text-[11px] opacity-90 mt-0.5 leading-snug">{grade.desc}</p>
            </div>
          </div>

          {/* Cards of Rewards */}
          <div className="grid grid-cols-2 gap-4 w-full mb-6">
            <div className="bg-gradient-to-br from-amber-50 to-orange-100 border border-orange-200 p-4 rounded-2xl shadow-sm text-center transform hover:translate-y-[-2px] transition duration-200">
              <span className="text-2xl block mb-1">⭐</span>
              <p className="text-[10px] text-orange-800/60 font-black uppercase tracking-wider">XP RECOMPENSA</p>
              <p className="text-2xl font-black text-orange-950 mt-1">+{xpEarned}</p>
            </div>

            <div className="bg-gradient-to-br from-cyan-50 to-emerald-100 border border-emerald-200 p-4 rounded-2xl shadow-sm text-center transform hover:translate-y-[-2px] transition duration-200">
              <span className="text-2xl block mb-1">💎</span>
              <p className="text-[10px] text-emerald-800/60 font-black uppercase tracking-wider">BÔNUS GEMAS</p>
              <p className="text-2xl font-black text-emerald-950 mt-1">+{gemBonus}</p>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl max-w-sm text-xs text-slate-500 leading-relaxed text-left flex gap-3">
            <Info className="w-5 h-5 text-slate-400 shrink-0" />
            <span>
              As gemas podem ser usadas na Lojinha para recarregar vidas perdidas ou destravar novos temas visuais para o seu editor de código!
            </span>
          </div>
        </div>

        {/* Large green action button */}
        <div className="max-w-md w-full mx-auto pb-4">
          <button
            onClick={handleFinish}
            className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-extrabold text-lg rounded-2xl shadow-xl shadow-emerald-500/10 transition duration-200"
          >
            Coletar Recompensa & Sair
          </button>
        </div>
      </div>
    );
  }

  // Calculate percentage of question track
  const progressPercent = Math.round((currentIdx / module.questions.length) * 100);

  return (
    <div className="fixed inset-0 bg-white flex flex-col justify-between z-50 select-none overflow-y-auto">
      {/* Top Header progress row */}
      <div className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between max-w-4xl w-full mx-auto sticky top-0 z-10">
        <button 
          onClick={handleExit}
          className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-800 transition"
          title="Encerrar lição"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Progress bar container */}
        <div className="flex-1 mx-6 bg-slate-100 h-4 rounded-full overflow-hidden relative">
          <div 
            className="h-full bg-emerald-500 rounded-full transition-all duration-300" 
            style={{ width: `${progressPercent}%` }}
          />
          {/* Subtle percentage overlay */}
          <span className="absolute inset-0 flex items-center justify-center text-[9px] font-black text-slate-500">
            Exercício {currentIdx + 1} de {module.questions.length}
          </span>
        </div>

        {/* Hearts and Streak indicators */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5" title="Vidas Restantes">
            <Heart className={`w-5 h-5 ${hearts > 0 ? 'text-red-500 fill-red-500 animate-pulse' : 'text-slate-300'}`} />
            <span className="font-extrabold text-sm text-slate-700">{hearts}</span>
          </div>
        </div>
      </div>

      {/* Main interactive screen workspace */}
      <div className="flex-1 w-full max-w-3xl mx-auto px-6 py-8 flex flex-col justify-center">
        {/* Helper Mascot Banner (Speech Bubble style) */}
        <div className="flex items-start gap-4 mb-6">
          <div className="w-16 h-16 bg-emerald-100 rounded-2xl border-2 border-emerald-500/20 flex items-center justify-center text-4xl shrink-0 animate-bounce">
            🤖
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 relative flex-1">
            <div className="absolute left-[-8px] top-6 w-4 h-4 bg-slate-50 border-l border-b border-slate-200 transform rotate-45"></div>
            <p className="text-xs font-black text-emerald-600 uppercase tracking-widest mb-1">
              {question.type === 'multiple-choice' && 'MÚLTIPLA ESCOLHA'}
              {question.type === 'fill-blank' && 'PREENCHA A LACUNA'}
              {question.type === 'block-order' && 'ORDENAÇÃO DE BLOCOS LÓGICOS'}
              {question.type === 'bug-hunt' && 'CAÇADOR DE BUGS (CLIQUE NO ERRO)'}
            </p>
            <h3 className="text-sm md:text-base font-bold text-slate-800 leading-tight">
              {question.instruction}
            </h3>
          </div>
        </div>

        {/* Dynamic rendering according to Question Type */}
        <div className="flex-1 flex flex-col justify-center min-h-[220px]">
          {/* Multiple choice type */}
          {question.type === 'multiple-choice' && question.options && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {question.options.map((opt, idx) => {
                const isSelected = selectedOption === opt;
                return (
                  <button
                    key={idx}
                    onClick={() => !isChecked && setSelectedOption(opt)}
                    disabled={isChecked}
                    className={`p-4 md:p-5 text-left rounded-3xl border-2 transition-all duration-150 relative ${
                      isSelected 
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-950 font-bold ring-4 ring-emerald-500/10' 
                        : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                    }`}
                  >
                    <span className="absolute top-4 right-4 text-xs font-bold bg-slate-100 text-slate-500 rounded-full w-5 h-5 flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <p className="pr-8 text-sm md:text-base font-extrabold font-sans">
                      {opt}
                    </p>
                  </button>
                );
              })}
            </div>
          )}

          {/* Fill-in-the-blank type */}
          {question.type === 'fill-blank' && (
            <div className="bg-slate-900 rounded-2xl p-6 border-b-4 border-slate-950 shadow-inner">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800 text-xs font-mono text-slate-500">
                <span>💻 Terminal de Programação</span>
                <span className="text-emerald-500">javascript-es6</span>
              </div>
              
              <div className="font-mono text-sm md:text-base text-white leading-relaxed">
                <span className="text-amber-400">{question.blankTextBefore}</span>
                <input
                  type="text"
                  value={typedBlank}
                  onChange={(e) => !isChecked && setTypedBlank(e.target.value)}
                  disabled={isChecked}
                  placeholder="_Escreva aqui_"
                  className="mx-2 bg-slate-800 border-b-2 border-dashed border-emerald-400 px-3 py-1 text-emerald-400 font-extrabold focus:outline-none rounded focus:bg-slate-700 transition"
                  style={{ width: `${Math.max(120, typedBlank.length * 12)}px` }}
                />
                <span className="text-amber-400">{question.blankTextAfter}</span>
              </div>
            </div>
          )}

          {/* Block-order type */}
          {question.type === 'block-order' && (
            <div className="space-y-6">
              {/* Output area containing current selection */}
              <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-6 min-h-[100px] flex flex-wrap gap-2 items-center">
                {orderedBlocks.length === 0 ? (
                  <span className="text-xs text-slate-400 font-bold font-sans">
                    Clique nos blocos abaixo para montar a sequência correta...
                  </span>
                ) : (
                  orderedBlocks.map((blk, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleBlockClick(blk, false)}
                      disabled={isChecked}
                      className="bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-mono text-xs md:text-sm px-4 py-2.5 rounded-xl shadow-md cursor-pointer border-b-2 border-emerald-700 transition"
                    >
                      {blk}
                    </button>
                  ))
                )}
              </div>

              {/* Pool of values */}
              <div>
                <p className="text-[10px] uppercase text-slate-400 font-black tracking-widest mb-3 text-center">Blocos de Sintaxe Disponíveis</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {availableBlocks.map((blk, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleBlockClick(blk, true)}
                      disabled={isChecked}
                      className="bg-white border-2 border-slate-200 hover:border-slate-300 text-slate-800 font-mono text-xs md:text-sm px-4 py-2.5 rounded-xl cursor-default transition active:scale-95"
                    >
                      {blk}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Bug hunt type */}
          {question.type === 'bug-hunt' && question.buggyCode && (
            <div className="space-y-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                Clique na linha com sintaxe errônea ou bug lógico:
              </span>
              
              <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800 font-mono text-xs md:text-sm overflow-hidden select-none">
                {question.buggyCode.map((line, idx) => {
                  const isSelected = selectedBugLine === idx;
                  return (
                    <div
                      key={idx}
                      onClick={() => !isChecked && setSelectedBugLine(idx)}
                      className={`group flex items-center gap-4 px-4 py-2.5 cursor-pointer rounded-lg transition-all ${
                        isSelected 
                        ? 'bg-red-500/20 text-red-100 border-l-4 border-red-500' 
                        : 'text-slate-300 hover:bg-slate-800/50'
                      }`}
                    >
                      <span className="text-slate-600 text-xs w-6 text-right font-mono font-bold">{idx + 1}</span>
                      <span className="flex-1 font-mono whitespace-pre">{line}</span>
                      <span className="text-[10px] uppercase font-bold text-slate-500 opacity-0 group-hover:opacity-100 transition">
                        Selecionar
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Checkbar Footer Drawer (Locks to screen bottom) */}
      <div className={`border-t border-slate-100 select-none py-6 transition-colors duration-200 ${
        isChecked 
          ? isAnswerCorrect 
            ? 'bg-emerald-50 border-emerald-100' 
            : 'bg-red-50 border-red-100'
          : 'bg-white'
      }`}>
        <div className="max-w-3xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Diagnostic messages/Explanations when checked */}
          <div className="flex-1 flex items-start gap-3 w-full">
            {isChecked ? (
              isAnswerCorrect ? (
                <>
                  <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white shrink-0 shadow-lg shadow-emerald-500/10">
                    <Check className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-emerald-950 text-base">Excelente trabalho! (+{question.xpReward} XP)</h4>
                    <p className="text-emerald-800 text-xs mt-1 font-serif leading-relaxed">
                      {question.explanation}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white shrink-0 shadow-lg shadow-red-500/10 animate-bounce">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-red-950 text-base">Ops, resposta incorreta! (-1 Vida)</h4>
                    <p className="text-red-800 text-xs mt-1 font-serif leading-relaxed">
                      {question.explanation}
                    </p>
                  </div>
                </>
              )
            ) : (
              <div className="flex items-center gap-2 text-slate-400">
                <Info className="w-5 h-5" />
                <span className="text-xs font-bold">Responda o desafio lúdico acima para liberar o verificador.</span>
              </div>
            )}
          </div>

          {/* Call to action button */}
          <div className="w-full md:w-auto shrink-0 self-end">
            {!isChecked ? (
              <button
                onClick={checkAnswer}
                disabled={!isAnswerProvided()}
                className={`w-full md:w-56 py-3.5 px-6 rounded-2xl font-black text-sm tracking-wide uppercase transition duration-150 shadow-md ${
                  isAnswerProvided()
                    ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20 active:scale-95 cursor-pointer'
                    : 'bg-slate-100 text-slate-400 border border-slate-200 shadow-none cursor-not-allowed'
                }`}
              >
                Verificar Resposta
              </button>
            ) : (
              <button
                onClick={handleNext}
                className={`w-full md:w-56 py-3.5 px-6 rounded-2xl font-black text-sm tracking-wide uppercase transition duration-150 text-white flex items-center justify-center gap-2 ${
                  isAnswerCorrect 
                  ? 'bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-500/20' 
                  : 'bg-red-500 hover:bg-red-650 shadow-lg shadow-red-500/20'
                }`}
              >
                <span>Continuar</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
