import { Module } from '../types';

export const LESSONS_DATA: Module[] = [
  // --- INICIANTE ---
  {
    id: 'ini-variables',
    title: 'Variáveis & Saída',
    description: 'Aprenda a guardar informações em caixas (variáveis) e mostrar mensagens na tela.',
    difficulty: 'Iniciante',
    icon: 'CornerDownRight',
    color: 'emerald',
    questions: [
      {
        id: 'ini-q1',
        type: 'multiple-choice',
        instruction: 'Em JavaScript, qual palavra-chave declaramos uma variável cujo valor PODE ser alterado posteriormente?',
        options: [
          'const',
          'let',
          'var_mudar',
          'fixed'
        ],
        correctAnswer: 'let',
        explanation: 'A palavra-chave "let" permite criar variáveis reatribuíveis. "const" é usado para constantes que não podem ser alteradas.',
        xpReward: 15
      },
      {
        id: 'ini-q2',
        type: 'fill-blank',
        instruction: 'Complete o código para mostrar a mensagem "Sucesso!" no console do navegador.',
        codeContext: '_______.log("Sucesso!");',
        correctAnswer: 'console',
        blankTextBefore: '',
        blankTextAfter: '.log("Sucesso!");',
        explanation: 'Usamos o objeto "console" com a função ".log()" para escrever mensagens de depuração ou teste no console do sistema.',
        xpReward: 15
      },
      {
        id: 'ini-q3',
        type: 'block-order',
        instruction: 'Ordene as linhas de código para criar uma variável "nome" com valor "Alice" e mostrá-la no console.',
        blocks: [
          'console.log(nome);',
          'let nome = "Alice";'
        ],
        correctBlocks: [
          'let nome = "Alice";',
          'console.log(nome);'
        ],
        explanation: 'Primeiro criamos a variável usando "let nome = ..." para depois passar para o log.',
        xpReward: 20
      },
      {
        id: 'ini-q4',
        type: 'bug-hunt',
        instruction: 'Encontre a linha de código com erro de sintaxe. (Dica: as aspas estão corretas?)',
        buggyCode: [
          'let saudacao = "Olá, Dev";',
          'let idade = 25;',
          'console.log(saudacao + idade;',
          'let ativo = true;'
        ],
        correctLineIndex: 2,
        explanation: 'Falta o parêntese de fechamento no comando: "console.log(saudacao + idade;". O correto seria "console.log(saudacao + idade);".',
        xpReward: 25
      }
    ]
  },
  {
    id: 'ini-operations',
    title: 'Operações e Texto',
    description: 'Descubra como somar números e juntar textos (concatenação) no seu código.',
    difficulty: 'Iniciante',
    icon: 'Plus',
    color: 'sky',
    questions: [
      {
        id: 'ini-op-q1',
        type: 'multiple-choice',
        instruction: 'Se ligarmos um texto "2" com outro texto "3" usando o operador de adição (+) no JS, qual será o resultado?',
        options: [
          '5 (Número)',
          '"23" (Texto concateado)',
          'Erro de Sistema',
          'NaN (Not a Number)'
        ],
        correctAnswer: '"23" (Texto concateado)',
        explanation: 'Quando um dos operands do sinal de "+" é um texto (string), o JavaScript junta os dois textos em vez de somar matematicamente.',
        xpReward: 15
      },
      {
        id: 'ini-op-q2',
        type: 'fill-blank',
        instruction: 'Qual operador aritmético é usado para calcular o RESTO de uma divisão em quase todas linguagens (ex: 5 % 2)?',
        codeContext: 'let resto = 5 ___ 2; // Espera-se 1',
        correctAnswer: '%',
        blankTextBefore: 'let resto = 5 ',
        blankTextAfter: ' 2; // Espera-se 1',
        explanation: 'O operador módulo "%" retorna o resto inteiro de uma divisão de um número pelo outro.',
        xpReward: 15
      },
      {
        id: 'ini-op-q3',
        type: 'block-order',
        instruction: 'Monte o código correto para calcular o preço final somando um produto de R$ 50 com uma taxa de R$ 7.',
        blocks: [
          'let precoProduto = 50;',
          'console.log(precoFinal);',
          'let precoFinal = precoProduto + taxa;',
          'let taxa = 7;'
        ],
        correctBlocks: [
          'let precoProduto = 50;',
          'let taxa = 7;',
          'let precoFinal = precoProduto + taxa;',
          'console.log(precoFinal);'
        ],
        explanation: 'Declaramos o preço e a taxa primeiro, somamos na variável precoFinal, e por fim mostramos no console.',
        xpReward: 20
      }
    ]
  },
  {
    id: 'ini-conditions',
    title: 'Decisões no Código (if/else)',
    description: 'Faça seu programa tomar decisões inteligentes baseando-se em condições verdadeiras ou falsas.',
    difficulty: 'Iniciante',
    icon: 'GitFork',
    color: 'violet',
    questions: [
      {
        id: 'ini-cond-q1',
        type: 'multiple-choice',
        instruction: 'Qual estrutura é usada para executar um bloco de código APENAS se certas condições forem atendidas?',
        options: [
          'while',
          'for',
          'if',
          'repeat'
        ],
        correctAnswer: 'if',
        explanation: '"if" (se) verifica se uma condição é verdadeira antes de executar seu bloco interno de chaves.',
        xpReward: 15
      },
      {
        id: 'ini-cond-q2',
        type: 'fill-blank',
        instruction: 'Complete a lógica para ativar o bloco quando a idade for maior de dezoito.',
        codeContext: 'if (idade ___ 18) { liberarAcesso(); }',
        correctAnswer: '>',
        blankTextBefore: 'if (idade ',
        blankTextAfter: ' 18) { liberarAcesso(); }',
        explanation: 'O operador de maior que ">" selecionará pessoas com mais de 18 anos.',
        xpReward: 20
      },
      {
        id: 'ini-cond-q3',
        type: 'bug-hunt',
        instruction: 'Nesse verificador de número par, clique na linha que causa erro ou verificação errada.',
        buggyCode: [
          'let num = 10;',
          'if (num % 2 = 0) {',
          '  console.log("É par!");',
          '}'
        ],
        correctLineIndex: 1,
        explanation: 'Para comparação de igualdade, usamos "==" ou "===", o operador simples "=" atribui valores e não funciona na verificação do "if".',
        xpReward: 25
      }
    ]
  },

  // --- MÉDIO ---
  {
    id: 'med-arrays',
    title: 'Listas e Coleções (Arrays)',
    description: 'Aprenda a agrupar múltiplos elementos ordenados em uma única estrutura no JavaScript.',
    difficulty: 'Médio',
    icon: 'List',
    color: 'amber',
    questions: [
      {
        id: 'med-arr-q1',
        type: 'multiple-choice',
        instruction: 'Em javascript, qual é o índice do PRIMEIRO elemento de uma lista?',
        options: [
          '1',
          '0',
          '-1',
          'Primeiro'
        ],
        correctAnswer: '0',
        explanation: 'Vetores/Arrays em javascript são indexados a partir de zero.',
        xpReward: 20
      },
      {
        id: 'med-arr-q2',
        type: 'fill-blank',
        instruction: 'Como encontrar o tamanho (quantidade total) de elementos dentro de uma lista chamada "numeros"?',
        codeContext: 'let total = numeros._______;',
        correctAnswer: 'length',
        blankTextBefore: 'let total = numeros.',
        blankTextAfter: ';',
        explanation: 'A propriedade ".length" fornece a extensão ou quantidade de termos ativos em um array.',
        xpReward: 20
      },
      {
        id: 'med-arr-q3',
        type: 'block-order',
        instruction: 'Ordene o código para criar uma lista de linguagens, e em seguida adicionar "Python" no final dela.',
        blocks: [
          'linguagens.push("Python");',
          'let linguagens = ["JavaScript", "HTML"];',
          'console.log(linguagens);'
        ],
        correctBlocks: [
          'let linguagens = ["JavaScript", "HTML"];',
          'linguagens.push("Python");',
          'console.log(linguagens);'
        ],
        explanation: 'Primeiro inicializamos o Array, depois usamos o método ".push()" para inserir itens, e finalmente imprimimos os resultados.',
        xpReward: 25
      }
    ]
  },
  {
    id: 'med-loops',
    title: 'Loops de Repetição',
    description: 'Automatize tarefas repetitivas criando contadores e loops com as diretivas for e while.',
    difficulty: 'Médio',
    icon: 'RotateCcw',
    color: 'pink',
    questions: [
      {
        id: 'med-loo-q1',
        type: 'multiple-choice',
        instruction: 'O que acontece em um loop se a condição de parada NUNCA se tornar falsa?',
        options: [
          'O interpretador pula o loop automaticamente',
          'Desenvolve-se um loop infinito, congelando o programa',
          'O programa dorme por 5 segundos e desliga',
          'O loop executa exatamente 100 vezes'
        ],
        correctAnswer: 'Desenvolve-se um loop infinito, congelando o programa',
        explanation: 'Um loop infinito ocorre quando a condição do loop nunca é atualizada para ser falsa, consumindo toda a memória do navegador/servidor.',
        xpReward: 20
      },
      {
        id: 'med-loo-q2',
        type: 'fill-blank',
        instruction: 'Complete a declaração tradicional do loop para contar de 0 até 9 (incremental de em 1).',
        codeContext: 'for (let i = 0; i < 10; i___) { }',
        correctAnswer: '++',
        blankTextBefore: 'for (let i = 0; i < 10; i',
        blankTextAfter: ') { }',
        explanation: 'O operador "++" incrementa o número da variável em 1 em cada passo do laço de repetição.',
        xpReward: 20
      },
      {
        id: 'med-loo-q3',
        type: 'bug-hunt',
        instruction: 'Clique na linha que causa erro crítico. Dica: você pode modificar uma variável declarada com "const"?',
        buggyCode: [
          'const contador = 0;',
          'while (contador < 5) {',
          '  console.log(contador);',
          '  contador += 1;',
          '}'
        ],
        correctLineIndex: 3,
        explanation: 'Se a variável "contador" foi declarada como "const" na linha 0, ela não pode ser reatribuída com o operador "+=". Mude para "let".',
        xpReward: 25
      }
    ]
  },
  {
    id: 'med-functions',
    title: 'Mestre das Funções',
    description: 'Escreva trechos de códigos reutilizáveis, receba parâmetros e retorne valores personalizados.',
    difficulty: 'Médio',
    icon: 'Cpu',
    color: 'orange',
    questions: [
      {
        id: 'med-fun-q1',
        type: 'multiple-choice',
        instruction: 'Qual palavra-chave é utilizada para enviar uma resposta/valor final para fora de uma função executada?',
        options: [
          'send',
          'return',
          'export',
          'give'
        ],
        correctAnswer: 'return',
        explanation: '"return" encerra a execução da função e envia o resultado especificado de volta para quem a chamou.',
        xpReward: 20
      },
      {
        id: 'med-fun-q2',
        type: 'fill-blank',
        instruction: 'Complete o equivalente de uma Arrow Function moderna que apenas retorna o quadrado de um número.',
        codeContext: 'const dobro = (x) ___ x * 2;',
        correctAnswer: '=>',
        blankTextBefore: 'const dobro = (x) ',
        blankTextAfter: ' x * 2;',
        explanation: 'O operador seta "=>" declara funções compactas (Arrow Functions) em JavaScript ES6.',
        xpReward: 25
      },
      {
        id: 'med-fun-q3',
        type: 'block-order',
        instruction: 'Crie uma função para saudar usuários e execute ela passando o argumento "Carlos".',
        blocks: [
          '  return `Olá, ${nome}!`;',
          'function saudar(nome) {',
          '}',
          'let msg = saudar("Carlos");'
        ],
        correctBlocks: [
          'function saudar(nome) {',
          '  return `Olá, ${nome}!`;',
          '}',
          'let msg = saudar("Carlos");'
        ],
        explanation: 'Primeiro declaramos a função de saudação com parâmetros, especificamos seu retorno, fechamos as chaves e então realizamos a chamada passando "Carlos".',
        xpReward: 25
      }
    ]
  },

  // --- PROFISSIONAL ---
  {
    id: 'pro-async',
    title: 'Assincronismo & Promises',
    description: 'Entenda como o javascript gerencia requisições de servidores e respostas com async/await.',
    difficulty: 'Profissional',
    icon: 'Zap',
    color: 'rose',
    questions: [
      {
        id: 'pro-async-q1',
        type: 'multiple-choice',
        instruction: 'O que representa uma "Promise" no ecossistema JavaScript?',
        options: [
          'Um contrato que cancela a aba do navegador se travar',
          'Um objeto que representa o sucesso ou falha eventual de uma operação assíncrona',
          'Uma função que converte fotos em código hexadecimal automaticamente',
          'Um framework rápido alternativo ao Express.js'
        ],
        correctAnswer: 'Um objeto que representa o sucesso ou falha eventual de uma operação assíncrona',
        explanation: 'A Promise é o principal mecanismo para lidar com fluxos assíncronos (como comunicação via rede) sem travar a interface.',
        xpReward: 25
      },
      {
        id: 'pro-async-q2',
        type: 'fill-blank',
        instruction: 'Para podermos utilizar o operador "await" na espera de dados de uma API, a função externa deve ser marcada de qual forma?',
        codeContext: '_______ function buscarDados() { let res = await fetch(url); }',
        correctAnswer: 'async',
        blankTextBefore: '',
        blankTextAfter: ' function buscarDados() { let res = await fetch(url); }',
        explanation: 'Toda função contendo comandos "await" precisa ser explicitamente declarada com o prefixo "async".',
        xpReward: 25
      },
      {
        id: 'pro-async-q3',
        type: 'block-order',
        instruction: 'Monte a sequência para resolver as etapas de buscar dados JSON de uma URL de forma assíncrona.',
        blocks: [
          '  let dados = await resposta.json();',
          'async function pegarDados(url) {',
          '  let resposta = await fetch(url);',
          '  return dados;',
          '}'
        ],
        correctBlocks: [
          'async function pegarDados(url) {',
          '  let resposta = await fetch(url);',
          '  let dados = await resposta.json();',
          '  return dados;',
          '}'
        ],
        explanation: 'A função assíncrona executa o "fetch", aguarda o stream da resposta HTTP e, em seguida, aguarda a conversão JSON antes de retornar os dados estruturados.',
        xpReward: 30
      }
    ]
  },
  {
    id: 'pro-methods',
    title: 'Métodos Avançados de Array',
    description: 'Substitua loops extensos por transformações funcionais limpas: map, filter e reduce.',
    difficulty: 'Profissional',
    icon: 'Workflow',
    color: 'indigo',
    questions: [
      {
        id: 'pro-met-q1',
        type: 'multiple-choice',
        instruction: 'Qual método de Array cria uma NOVA lista contendo APENAS os itens da lista original que passarem por um teste lógico?',
        options: [
          'map',
          'filter',
          'reduce',
          'forEach'
        ],
        correctAnswer: 'filter',
        explanation: '".filter()" avalia cada elemento com uma função de teste; os elementos que retornarem "true" são incluídos no novo array.',
        xpReward: 25
      },
      {
        id: 'pro-met-q2',
        type: 'fill-blank',
        instruction: 'Complete o código para multiplicar por 2 cada elemento da lista original.',
        codeContext: 'let dobros = numeros._______(x => x * 2);',
        correctAnswer: 'map',
        blankTextBefore: 'let dobros = numeros.',
        blankTextAfter: '(x => x * 2);',
        explanation: '".map()" transforma individualmente todos os itens de uma lista, gerando um novo array do mesmo tamanho.',
        xpReward: 25
      },
      {
        id: 'pro-met-q3',
        type: 'bug-hunt',
        instruction: 'Clique na linha que impede o código de somar todos os saldos corretamente por faltar um valor inicial.',
        buggyCode: [
          'let saldos = [100, 250, 40];',
          'let total = saldos.reduce((acumulado, atual) => {',
          '  return acumulado + atual;',
          '}); // falta valor inicial para seguranca de arrays vazios'
        ],
        correctLineIndex: 3,
        explanation: 'O método "reduce" funciona melhor e com segurança contra Arrays vazios se passarmos um acumulador inicial (como o número 0) após fechar a função de callback.',
        xpReward: 30
      }
    ]
  },
  {
    id: 'ini-datatypes',
    title: 'Tipos de Dados Dinâmicos',
    description: 'Explore como o JavaScript armazena diferentes formatos: números, strings, booleanos, null e undefined.',
    difficulty: 'Iniciante',
    icon: 'CornerDownRight',
    color: 'emerald',
    questions: [
      {
        id: 'ini-data-q1',
        type: 'multiple-choice',
        instruction: 'Qual tipo de dado é atribuído a variáveis que foram declaradas mas ainda não receberam nenhum valor?',
        options: [
          'null',
          'undefined',
          'boolean',
          'NaN'
        ],
        correctAnswer: 'undefined',
        explanation: 'Se você apenas cria uma variável com "let x;", seu valor inicial reservado é "undefined" (indefinido). "null" é usado de propósito para expressar ausência intencional de valor.',
        xpReward: 15
      },
      {
        id: 'ini-data-q2',
        type: 'fill-blank',
        instruction: 'Complete o código para verificar qual o tipo estrito da variável utilizando o operador correspondente do JS.',
        codeContext: 'let tipo = _______ "Olá Mundo"; // Retorna "string"',
        correctAnswer: 'typeof',
        blankTextBefore: 'let tipo = ',
        blankTextAfter: ' "Olá Mundo"; // Retorna "string"',
        explanation: 'O operador "typeof" retorna uma string indicando o tipo do operando fornecido.',
        xpReward: 20
      },
      {
        id: 'ini-data-q3',
        type: 'bug-hunt',
        instruction: 'Encontre a atribuição de booleano incorreta. (Dica: booleanos não usam aspas!)',
        buggyCode: [
          'let estaChovendo = false;',
          'let usuarioLogado = "true";',
          'let temChave = true;',
          'let cadastrado = false;'
        ],
        correctLineIndex: 1,
        explanation: 'Na linha 1, usuarioLogado está recebendo `"true"` como texto (string) devido às aspas. O booleano correto seria apenas `true`.',
        xpReward: 25
      }
    ]
  },
  {
    id: 'med-objects',
    title: 'Objetos e Chaves (Dicionários)',
    description: 'Armazene conjuntos estruturados de chaves e valores para catalogar entidades complexas na memória.',
    difficulty: 'Médio',
    icon: 'Cpu',
    color: 'amber',
    questions: [
      {
        id: 'med-obj-q1',
        type: 'multiple-choice',
        instruction: 'Como acessamos a propriedade "nome" de dentro do objeto `usuario = { nome: "Ana" }`?',
        options: [
          'usuario["nome"] ou usuario.nome',
          'usuario->nome',
          'usuario.get(nome)',
          'nome(usuario)'
        ],
        correctAnswer: 'usuario["nome"] ou usuario.nome',
        explanation: 'Podemos usar tanto a notação de ponto (usuario.nome) quanto a de colchetes com string (usuario["nome"]) para chaves dinâmicas.',
        xpReward: 20
      },
      {
        id: 'med-obj-q2',
        type: 'fill-blank',
        instruction: 'Complete o código para descobrir todas as chaves do objeto "carro".',
        codeContext: 'let chaves = Object._______(carro);',
        correctAnswer: 'keys',
        blankTextBefore: 'let chaves = Object.',
        blankTextAfter: '(carro);',
        explanation: 'O método estático "Object.keys()" extrai e monta uma lista contendo todos os nomes de propriedades existentes no alvo.',
        xpReward: 25
      },
      {
        id: 'med-obj-q3',
        type: 'block-order',
        instruction: 'Ordene as linhas de código abaixo para declarar um objeto "pet", alterar sua idade para 4 e mostrá-lo no terminal.',
        blocks: [
          'let pet = { nome: "Pipoca", idade: 3 };',
          'pet.idade = 4;',
          'console.log(pet.idade);'
        ],
        correctBlocks: [
          'let pet = { nome: "Pipoca", idade: 3 };',
          'pet.idade = 4;',
          'console.log(pet.idade);'
        ],
        explanation: 'Instanciamos o objeto pet, modificamos a idade reatribuindo através de notação de ponto e finalmente inspecionamos no console.',
        xpReward: 25
      }
    ]
  },
  {
    id: 'pro-destructuring',
    title: 'Desestruturação & Spread',
    description: 'Escreva códigos limpos desmontando arrays ou estendendo dados dinâmicos com o operador de espalhamento (...).',
    difficulty: 'Profissional',
    icon: 'Workflow',
    color: 'rose',
    questions: [
      {
        id: 'pro-dest-q1',
        type: 'multiple-choice',
        instruction: 'O que o operador spread (...) faz quando aplicado a um Array como `[...lista, 4]`?',
        options: [
          'Multiplica todos os itens da lista por 4',
          'Apaga a lista anterior se tiver o valor 4',
          'Cria uma cópia rasa da lista original estendendo o número 4 ao final',
          'Inverte a ordem de exibição dos elementos estruturais'
        ],
        correctAnswer: 'Cria uma cópia rasa da lista original estendendo o número 4 ao final',
        explanation: 'O operador Spread (...) estende/espalha sequências arrumando elas dentro de novos escopos, gerando cópias rasas limpas.',
        xpReward: 25
      },
      {
        id: 'pro-dest-q2',
        type: 'fill-blank',
        instruction: 'Complete a desestruturação do objeto para salvar o atributo "modelo" diretamente na constante.',
        codeContext: 'const { _______ } = { marca: "Tesla", modelo: "Model S" };',
        correctAnswer: 'modelo',
        blankTextBefore: 'const { ',
        blankTextAfter: ' } = { marca: "Tesla", modelo: "Model S" };',
        explanation: 'Com a desestruturação escolhemos propriedades idênticas às chaves do objeto para virarem variáveis locais imediatas.',
        xpReward: 25
      },
      {
        id: 'pro-dest-q3',
        type: 'bug-hunt',
        instruction: 'Clique na linha que possui a sintaxe inválida de desestruturação múltipla para Array.',
        buggyCode: [
          'const cores = ["vermelho", "azul"];',
          'const [corA, corB] = cores;',
          'const {corPrimeira} = cores; // Array nao usa chaves para ordem de indices',
          'console.log(corA);'
        ],
        correctLineIndex: 2,
        explanation: 'Para arrays ordenados usamos colchetes `[corPrimeira]` no lugar de chaves `{...}` na desestruturação, pois arrays não possuem chaves nomeadas personalizadas.',
        xpReward: 30
      }
    ]
  }
];
