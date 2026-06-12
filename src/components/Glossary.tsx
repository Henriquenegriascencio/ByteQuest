import React, { useState } from 'react';
import { BookOpen, Search, Sparkles, Terminal, Sliders, Play, Code } from 'lucide-react';
import { playSound } from '../utils/audio';

interface GlossaryTerm {
  term: string;
  category: 'Iniciante' | 'Médio' | 'Profissional';
  translation: string;
  explanation: string;
  codeExample: string;
}

const SHOWN_TERMS: GlossaryTerm[] = [
  {
    term: 'const / let',
    category: 'Iniciante',
    translation: 'Definição de Variáveis',
    explanation: 'Palavras-chave em JavaScript para guardar dados. Use "let" se os dados forem mudar depois (por exemplo, pontos em um jogo) e "const" para valores fixos e estáveis.',
    codeExample: 'let pontos = 100;\nconst pi = 3.1415;'
  },
  {
    term: 'console.log()',
    category: 'Iniciante',
    translation: 'Imprimir na Tela',
    explanation: 'Função builtin para colocar textos e depurar informações na aba secreta do desenvolvedor (o console do navegador).',
    codeExample: 'console.log("Olá mundo da informática!");'
  },
  {
    term: 'if / else',
    category: 'Iniciante',
    translation: 'Estrutura Condicional',
    explanation: 'Se a resposta no teste do parêntese for verdadeira, faz o código dentro do primeiro par de chaves. Senão, pula direto para o bloco do else.',
    codeExample: 'if (vidas > 0) {\n  console.log("Continue");\n} else {\n  console.log("Game Over");\n}'
  },
  {
    term: 'Arrays / Vetores',
    category: 'Médio',
    translation: 'Listas Ordenadas',
    explanation: 'Uma caixa gigante com divisões numeradas para guardar múltiplos itens juntos. Em JavaScript, o primeiro termo sempre mora na gaveta número `0`.',
    codeExample: 'let herois = ["Batman", "Arqueiro", "Miranha"];\nconsole.log(herois[0]); // Batman'
  },
  {
    term: 'Array.length',
    category: 'Médio',
    translation: 'Tamanho da Lista',
    explanation: 'Uma propriedade mágica que lê em tempo de execução a quantidade total de termos presentes dentro de um array.',
    codeExample: 'let numeros = [4, 8, 15, 16];\nlet tamanho = numeros.length; // 4'
  },
  {
    term: 'for (Loop)',
    category: 'Médio',
    translation: 'Laço de Repetição For',
    explanation: 'Uma instrução em carrossel que repete um mesmo conjunto de tarefas n vezes de forma sequencial com contagem automática.',
    codeExample: 'for (let i = 0; i < 5; i++) {\n  console.log("Contagem: " + i);\n}'
  },
  {
    term: 'Funções (Functions)',
    category: 'Médio',
    translation: 'Bloco Reutilizável',
    explanation: 'Trecho de lógica batizada com um nome. Você pode chamá-la de qualquer lugar do programa enviando argumentos e recebendo uma resposta final via "return".',
    codeExample: 'function somar(a, b) {\n  return a + b;\n}'
  },
  {
    term: 'Promises',
    category: 'Profissional',
    translation: 'Promessas Assíncronas',
    explanation: 'Um objeto javascript especial que representa uma resposta que ainda vai chegar posteriormente do servidor (ex: dados bancários ou listagem de filmes).',
    codeExample: 'fetch("http://api.com").then(res => res.json());'
  },
  {
    term: 'async / await',
    category: 'Profissional',
    translation: 'Esperar Assíncrono',
    explanation: 'Palavras-chaves modernas que fazem o JavaScript aguardar de forma organizada que o servidor responda, sem travar o restante da página.',
    codeExample: 'async function carregar() {\n  let dados = await fetch(url);\n}'
  },
  {
    term: 'map()',
    category: 'Profissional',
    translation: 'Ação Mapeada em Listas',
    explanation: 'Um método do Array que passa por cada elemento transformando ou aplicando regras sequenciais neles e gerando uma nova lista com o resultado fresco.',
    codeExample: 'let dobros = [1, 2, 3].map(x => x * 2); // [2, 4, 6]'
  },
  {
    term: 'filter()',
    category: 'Profissional',
    translation: 'Filtragem de Listas',
    explanation: 'Um método que cria uma nova lista contendo apenas os elementos da lista original que atendem à condição fornecida por uma função de teste.',
    codeExample: 'let idades = [12, 22, 15, 30];\nlet maiores = idades.filter(i => i >= 18); // [22, 30]'
  },
  {
    term: 'reduce()',
    category: 'Profissional',
    translation: 'Redutor de Lista',
    explanation: 'Executa uma função redutora sobre cada elemento do array, resultando em um único valor de retorno acumulado (útil para somar todos os itens).',
    codeExample: 'let precos = [10, 20, 30];\nlet total = precos.reduce((soma, p) => soma + p, 0); // 60'
  },
  {
    term: 'TypeScript',
    category: 'Profissional',
    translation: 'Superconjunto com Tipos',
    explanation: 'Um superconjunto de JavaScript que adiciona tipagem estática opcional ao código, evitando que você cometa erros bobos antes de rodar o programa.',
    codeExample: 'let usuario: string = "Bob";\nlet idade: number = 32;\n// usuario = 10; -> Erro no editor!'
  },
  {
    term: 'API',
    category: 'Médio',
    translation: 'Interface de Programação',
    explanation: 'Um conjunto de regras e padrões que permite que duas aplicações de softwares conversem entre si. Ex: receber dados do clima ou enviar mensagens.',
    codeExample: '// Fazendo request para uma API externa de clima\nconst clima = await fetch("https://api.clima.com/v1/sao-paulo");'
  },
  {
    term: 'JSON',
    category: 'Médio',
    translation: 'Formato de Dados',
    explanation: 'Formato leve de troca de informações lido facilmente por humanos e computadores. É estruturado em chaves e valores.',
    codeExample: 'const dados = {\n  "nome": "Hacker",\n  "patente": "Mestre",\n  "nivel": 42\n};'
  },
  {
    term: 'DOM',
    category: 'Médio',
    translation: 'Modelo de Objeto do HTML',
    explanation: 'A representação em árvore que o navegador cria para a sua página HTML. Usando JavaScript, podemos acessar e alterar elementos ou estilos em tempo real.',
    codeExample: 'const titulo = document.getElementById("meu-titulo");\ntitulo.innerText = "Novo texto no ByteQuest!";'
  },
  {
    term: 'Bug',
    category: 'Iniciante',
    translation: 'Erro no Código',
    explanation: 'Qualquer comportamento inesperado, travamento ou falha lógica dentro do seu programa. É o arqui-inimigo jurado dos desenvolvedores.',
    codeExample: 'let total = 10 / 0; // Infinity!\nlet saudacao = "Ola; // Falta fechar aspas - Erro de compilador!'
  }
];

export default function Glossary() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'Todos' | 'Iniciante' | 'Médio' | 'Profissional'>('Todos');

  const filteredTerms = SHOWN_TERMS.filter(item => {
    const matchesSearch = item.term.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.translation.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.explanation.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'Todos' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCategorySelect = (cat: typeof selectedCategory) => {
    playSound('click');
    setSelectedCategory(cat);
  };

  return (
    <div className="flex-1 p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 bg-emerald-100 text-emerald-600 rounded-2xl">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-800">Dicionário do Desenvolvedor</h2>
            <p className="text-slate-500 text-sm">Seu guia rápido de bolso para consultar termos de programação a qualquer momento.</p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-sm mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Pesquisar termo ou conceito..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 focus:bg-white transition"
          />
        </div>

        {/* Categories toggles */}
        <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
          {(['Todos', 'Iniciante', 'Médio', 'Profissional'] as const).map(cat => (
            <button
              key={cat}
              onClick={() => handleCategorySelect(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition ${
                selectedCategory === cat 
                  ? 'bg-slate-800 text-white' 
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Results */}
      {filteredTerms.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTerms.map((item, idx) => (
            <div 
              key={idx} 
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm transition hover:shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-3">
                  <span className={`text-[10px] uppercase font-black px-2.5 py-0.5 rounded-full ${
                    item.category === 'Iniciante' 
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                      : item.category === 'Médio'
                        ? 'bg-amber-50 text-amber-700 border border-amber-100'
                        : 'bg-rose-50 text-rose-700 border border-rose-100'
                  }`}>
                    {item.category}
                  </span>
                  <span className="text-xs text-slate-400 font-mono font-medium">{item.translation}</span>
                </div>

                <h3 className="text-lg font-extrabold text-slate-800 mb-2 font-mono">{item.term}</h3>
                <p className="text-slate-600 text-xs leading-relaxed mb-4">{item.explanation}</p>
              </div>

              {/* Code snippet example */}
              <div className="bg-slate-900 rounded-xl p-3 border-l-4 border-emerald-500 font-mono text-[11px] text-emerald-300 relative">
                <span className="absolute top-2 right-3 text-[9px] font-sans font-bold text-slate-600">exemplo</span>
                <pre className="overflow-x-auto whitespace-pre-wrap leading-relaxed">{item.codeExample}</pre>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-slate-50 border border-dashed border-slate-200 rounded-3xl p-12 text-center flex flex-col items-center justify-center">
          <p className="text-4xl mb-3">🕵️‍♂️</p>
          <h4 className="font-bold text-slate-700 mb-1">Nenhum conceito encontrado</h4>
          <p className="text-xs text-slate-500 max-w-sm">Tente reescrever o termo ou mudar a categoria do filtro acima.</p>
        </div>
      )}
    </div>
  );
}
