import type { EpisodeContent } from '../game/contracts';
import { OPPORTUNITY_SOURCES } from './sources';

export const OPPORTUNITY_EPISODE: EpisodeContent = {
  id: 'opportunity',
  title: 'Opportunity: O Silêncio e o Legado',
  targetEquipment: 'Opportunity (MER-B)',
  destination: 'Marte — Perseverance Valley / Meridiani Planum',
  acts: [
    {
      id: 'prologue',
      index: 0,
      title: 'Prólogo: O Foguetão Debaixo da Cama',
      subtitle: 'Nayla, Bip e o Arquivo de Memórias Espaciais',
      type: 'cinematic_story',
      imageSrc: '/assets/cinematics/scene_prologue.png',
      isInteractive: false,
      narrationLines: [
        {
          id: 'prol_1',
          speaker: 'nayla',
          text: 'Todas as noites abro a janela para as estrelas e pergunto: será que alguém já foi lá visitar?'
        },
        {
          id: 'prol_2',
          speaker: 'bip',
          text: 'Pessoas já chegaram à Lua. E enviámos máquinas exploradoras a muitos mundos! Algumas continuam ativas; outras concluíram a sua missão.'
        },
        {
          id: 'prol_3',
          speaker: 'nayla',
          text: 'E o que acontece às máquinas que ficam lá para sempre?'
        },
        {
          id: 'prol_4',
          speaker: 'bip',
          text: 'Podem deixar de nos enviar sinais... mas o conhecimento que descobriram continua connosco!'
        },
        {
          id: 'prol_5',
          speaker: 'narrador',
          text: 'Uma luz laranja acendeu debaixo da cama: era o foguetão do Arquivo de Memórias Espaciais! Destino: Marte.'
        }
      ]
    },
    {
      id: 'act_1_mars_arrival',
      index: 1,
      title: 'Ato I: O Silêncio de Marte',
      subtitle: 'Chegada a Perseverance Valley e primeiros passos',
      type: 'interactive_exploration',
      isInteractive: true,
      interactiveGoal: 'Guia Nayla com o teclado ou comandos no ecrã para explorar o terreno até à rocha de hematite.',
      narrationLines: [
        {
          id: 'act1_1',
          speaker: 'nayla',
          text: 'Chegámos a Marte! O solo é avermelhado e silencioso como um deserto que guarda segredos antigos.'
        },
        {
          id: 'act1_2',
          speaker: 'bip',
          text: 'Estamos no Perseverance Valley. Acedemos agora aos registos do Opportunity (MER-B).'
        },
        {
          id: 'act1_3',
          speaker: 'nayla',
          text: 'Vejo o rover Opportunity ao fundo! Mas olha para aquela rocha antes dele... tem pequenas esferas presas na areia.'
        }
      ]
    },
    {
      id: 'act_2_blueberries_scanner',
      index: 2,
      title: 'Ato II: A Pista Oculta na Rocha',
      subtitle: 'Análise espectroscópica das esférulas de hematite',
      type: 'interactive_scanner',
      imageSrc: '/assets/cinematics/scene_macro_blueberries.png',
      isInteractive: true,
      interactiveGoal: 'Clica em [Ativar Scanner de Bip] para recolher os dados mineralógicos das esférulas.',
      narrationLines: [
        {
          id: 'act2_1',
          speaker: 'nayla',
          text: 'Olha em detalhe! São dezenas de bolinhas azuis-acinzentadas presas na rocha avermelhada!'
        },
        {
          id: 'act2_2',
          speaker: 'bip',
          text: 'Os cientistas chamaram-lhes "mirtilos marcianos". Vamos usar o scanner espectroscópico para ler a sua assinatura mineral.'
        }
      ]
    },
    {
      id: 'act_3_golden_memory',
      index: 3,
      title: 'Ato III: 5.111 Sóis de Descoberta',
      subtitle: 'A voz do rover e o registo histórico da NASA',
      type: 'cinematic_video',
      isInteractive: false,
      narrationLines: [
        {
          id: 'act3_1',
          speaker: 'opportunity',
          text: 'Pousei em Marte em Janeiro de 2004. Esperavam que funcionasse durante 90 sóis... mas continuei a explorar por mais de 14 anos terrestres!',
          isMemory: true
        },
        {
          id: 'act3_2',
          speaker: 'opportunity',
          text: 'Desci até às profundezas da Cratera Endurance para examinar cada camada de rocha que o passado preservou.',
          isMemory: true
        }
      ]
    },
    {
      id: 'act_4_darkening_storm',
      index: 4,
      title: 'Ato IV: A Noite Sem Fim (A Tempestade de 2018)',
      subtitle: 'A tempestade planetária e a dedução no Caderno de Nayla',
      type: 'interactive_journal',
      imageSrc: '/assets/cinematics/scene_dust_storm.png',
      isInteractive: true,
      interactiveGoal: 'Arquiva no Caderno de Nayla qual das afirmações é uma Evidência Científica comprovada.',
      narrationLines: [
        {
          id: 'act4_1',
          speaker: 'opportunity',
          text: 'Em Junho de 2018, uma tempestade de poeira à escala do planeta inteiro obscureceu o Sol sobre o Perseverance Valley.',
          isMemory: true
        },
        {
          id: 'act4_2',
          speaker: 'opportunity',
          text: 'Sem luz nos meus painéis solares, a minha bateria descarregou. A frase de que tinha medo do escuro foi uma metáfora poética que os humanos criaram na Terra.',
          isMemory: true
        },
        {
          id: 'act4_3',
          speaker: 'opportunity',
          text: 'A minha verdadeira despedida foram 217.000 fotografias científicas e o conhecimento geológico legado à humanidade.',
          isMemory: true
        }
      ]
    },
    {
      id: 'epilogue',
      index: 5,
      title: 'Epílogo: Uma Carta para o Futuro',
      subtitle: 'O caderno de Nayla e o legado imortal do Opportunity',
      type: 'cinematic_epilogue',
      isInteractive: false,
      narrationLines: [
        {
          id: 'epi_1',
          speaker: 'nayla',
          text: 'No meu caderno escrevi a minha resposta: "Obrigada por continuares a procurar. As tuas descobertas chegaram até nós."'
        },
        {
          id: 'epi_2',
          speaker: 'bip',
          text: 'O Opportunity permanece em repouso no Perseverance Valley, mas a exploração continua com os rovers e cientistas de hoje!'
        }
      ]
    }
  ],
  introLines: [
    {
      id: 'intro_1',
      speaker: 'nayla',
      text: 'Bip, onde é que estamos? A luz laranja do arquivo acendeu!'
    },
    {
      id: 'intro_2',
      speaker: 'bip',
      text: 'Estamos no Arquivo de Memórias Espaciais. Este registo recria a paisagem do Opportunity em Marte.'
    },
    {
      id: 'intro_3',
      speaker: 'bip',
      text: 'Atenção, Nayla: o que vemos aqui é uma reconstrução do passado. O equipamento real concluiu a sua missão em 2018.'
    },
    {
      id: 'intro_4',
      speaker: 'nayla',
      text: 'Compreendido! Vamos explorar a área para encontrar pistas da sua viagem e ouvir a sua memória.'
    }
  ],
  clueItem: {
    id: 'clue_blueberries',
    title: 'Esférulas de Hematite ("Mirtilos Marcianos")',
    description:
      'Pequenas formações esféricas ricas em hematite. Os cientistas concluíram que foram modeladas por água líquida subterrânea há milhares de milhões de anos.',
    x: 260,
    y: 380,
    discovered: false
  },
  roverDialogue: [
    {
      id: 'rov_1',
      speaker: 'opportunity',
      text: 'Olá, exploradores. Sou a voz de arquivo do Opportunity (MER-B). Pousei em Marte em Janeiro de 2004.',
      isMemory: true
    },
    {
      id: 'rov_2',
      speaker: 'nayla',
      text: 'Os cientistas esperavam que ficasses apenas noventa dias, certo?'
    },
    {
      id: 'rov_3',
      speaker: 'opportunity',
      text: 'Exato! Esperavam 90 sóis, mas continuei a rolar durante mais de 14 anos terrestres e percorri 45,16 quilómetros.',
      isMemory: true
    },
    {
      id: 'rov_4',
      speaker: 'nayla',
      text: 'E encontraste água em Marte?'
    },
    {
      id: 'rov_5',
      speaker: 'opportunity',
      text: 'Encontrei hematite e minerais que provam que houve água líquida e estável no passado antigo. Mas atenção: água não prova que existiram peixes ou vida complexa!',
      isMemory: true
    },
    {
      id: 'rov_6',
      speaker: 'bip',
      text: 'E como terminou a tua transmissão em 2018?'
    },
    {
      id: 'rov_7',
      speaker: 'opportunity',
      text: 'Em Junho de 2018, uma enorme tempestade de poeira cobriu o céu no Perseverance Valley. Sem sol nos meus painéis, enviei a última telemetria com imagens escuras.',
      isMemory: true
    },
    {
      id: 'rov_8',
      speaker: 'opportunity',
      text: 'A frase poética que as pessoas contam ("a minha bateria está fraca e está a ficar escuro") foi uma tradução humana dos meus dados, não palavras que escrevi. O meu verdadeiro legado são as 217.000 imagens e o conhecimento que deixei.',
      isMemory: true
    }
  ],
  puzzle: {
    id: 'puzzle_water_evidence',
    title: 'Missão de Análise: Evidência Científica vs Imaginação',
    prompt:
      'Nayla e Bip precisam de arquivar a descoberta principal do Opportunity no caderno de bordo. Qual destas afirmações representa uma EVIDÊNCIA CIENTÍFICA comprovada pela missão?',
    clueHint:
      'Lembra-te das pequenas esférulas de hematite que examinaste na areia e do diálogo com o Opportunity.',
    options: [
      {
        id: 'opt_evidence',
        label:
          'Esférulas de hematite ("mirtilos") e camadas de rocha demonstram que existiu água líquida no passado antigo de Marte.',
        isEvidence: true,
        category: 'evidencia',
        explanation:
          'Correto! O Opportunity identificou hematite e rochas sedimentares na cratera Eagle e no Endurance, comprovando água líquida antiga sem afirmar existência de vida biológica.',
        hint: 'Esta é a conclusão rigorosa fundamentada pelos instrumentos de espectrometria e micro-imagem do rover.'
      },
      {
        id: 'opt_life_fish',
        label:
          'Fósseis de peixes e algas comprovam que os lagos de Marte tinham animais aquáticos.',
        isEvidence: false,
        category: 'imaginacao',
        explanation:
          'Incorreto. Ter existido água líquida não comprova que existiram peixes ou outra vida. Até hoje nenhuma missão encontrou fósseis ou evidência de vida biológica em Marte.',
        hint: 'A presença de água é uma condição de habitabilidade passada, não uma confirmação de seres vivos.'
      },
      {
        id: 'opt_letter_poetic',
        label:
          'O rover escreveu uma carta de despedida aos cientistas dizendo que tinha medo de adormecer no escuro.',
        isEvidence: false,
        category: 'imaginacao',
        explanation:
          'Incorreto. O Opportunity enviou apenas dados de telemetria e imagens sob pouca luz. A frase poética foi uma metáfora criada na Terra para explicar os dados.',
        hint: 'As máquinas transmitem dados técnicos (volts, opacidade atmosférica), não textos de despedida humana.'
      }
    ],
    correctOptionId: 'opt_evidence'
  },
  cinematic: {
    videoSrc: '/assets/cinematics/opportunity_memory.mp4',
    captionSrc: '/assets/captions/opportunity_memory.vtt',
    durationSeconds: 15,
    fallbackSummary: [
      'Cena 1: Ano de 2004 — Pouso suave do Opportunity em Meridiani Planum, abrindo os seus painéis solares.',
      'Cena 2: Anos de Exploração — O rover analisa as esférulas de hematite na rocha, descobrindo o passado aquático de Marte.',
      'Cena 3: Junho de 2018 — No Perseverance Valley, céus escurecem com poeira; o rover transmite a sua última telemetria científica.',
      'Legado: Mais de 14 anos de missão ativa, 45,16 km percorridos e 217.000 fotografias arquivadas.'
    ]
  },
  missionSheet: {
    title: 'Ficha Científica Oficial — Opportunity (MER-B)',
    launchDate: '7 de Julho de 2003 (Cabo Canaveral, Flórida)',
    landingDate: '25 de Janeiro de 2004 (Meridiani Planum, Marte)',
    lastContactDate: '10 de Junho de 2018 (Anúncio formal: 13 de Fevereiro de 2019)',
    missionStatus: 'Missão concluída com sucesso histórico (Equipamento inativo no Perseverance Valley)',
    distanceTraveled: '45,16 km (Recorde extraterrestre mantido até 11 de Outubro de 2026)',
    imagesReturned: 'Mais de 217.000 imagens científicas e de navegação',
    facts: [
      {
        label: 'Duração Prevista vs Real',
        value: 'Planeado para 90 sóis (dias marcianos); operou por 5.111 sóis (mais de 14 anos terrestres).',
        sourceNote: 'NASA / JPL Mission Overview'
      },
      {
        label: 'Evidência Principal de Água',
        value: 'Esférulas de hematite ("mirtilos marcianos") e sulfatos de jarosite formados em meio aquoso ácido.',
        sourceNote: 'NASA Science Results'
      },
      {
        label: 'Causa do Fim da Missão',
        value: 'Tempestade global de poeira marciana em 2018 que cobriu os painéis solares, impedindo a recarga das baterias.',
        sourceNote: 'NASA JPL Release 2019'
      },
      {
        label: 'Localização do Repouso',
        value: 'Perseverance Valley (borda da Cratera Endeavour). Não confundir com o rover Perseverance (missão Mars 2020 na cratera Jezero).',
        sourceNote: 'NASA MER Coordinates'
      }
    ],
    sources: OPPORTUNITY_SOURCES
  }
};
