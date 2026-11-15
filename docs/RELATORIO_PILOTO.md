# Relatório de Execução do Episódio Piloto: Opportunity (Edição Filme Interativo)

**Projeto:** Ainda Estou Aqui  
**Episódio:** Piloto 1 — Opportunity: O Silêncio e o Legado  
**Formato:** Filme Educativo Interativo 2D com Capítulos  
**Branch local de trabalho:** `feat/piloto-opportunity` (Repositório remoto intocado, sem push)  
**Data de Atualização:** 15 de Novembro de 2026  
**Autores do Projeto:** Gerzyge e Frânio (*Astro Iterators*)  
**História Base:** Enzo (*Tab_1.md* / *Tab_1_Atualizado.md*)  

---

## 1. Direção Criativa e Referências dos Vencedores de 2025

A pedido de Gerzyge e em alinhamento com os projetos premiados no **NASA Space Apps Challenge 2025**, a experiência foi refinada de um modelo de jogo tradicional para um **Filme Educativo Interativo com Capítulos Cinematográficos**, integrando os pontos fortes das três referências recomendadas:

1. **A Solar Tale (Global Winner — Best Storytelling):**
   * Estruturação da narrativa em **Atos Poéticos e Cinematográficos** com cortes dramáticos de câmara e ritmo de filme.
   * A máquina (Opportunity) ganha voz de memória de arquivo em primeira pessoa, com identificação clara de personificação dramática.
   * Barra de navegação em linha do tempo (timeline stepper) no topo, permitindo ao utilizador navegar entre os capítulos com fluidez.
2. **Henry’s Farm Adventures (Aventura 2D e Aprendizagem com Dados Reais):**
   * Identidade visual em *pixel art* com paleta marciana coerente (Nayla, Bip, Opportunity e formações geológicas).
   * Tradução de dados científicos e geológicos da NASA (hematite, sulfatos de jarosite, espectrometria APXS) em atividades de exploração integradas na história.
3. **PureFlow (Interação com Propósito e Consequência):**
   * O utilizador assume um papel ativo e claro: **Arquivista Científico da Missão**.
   * O jogador interage diretamente com o scanner macro e arquiva no Caderno de Bordo de Nayla a distinção crucial entre *Evidência Científica Comprovada* e *Imaginação / Metáforas Poéticas*, com feedback imediato e construtivo.

---

## 2. Estrutura dos 6 Capítulos Cinematográficos

| Capítulo | Título | Tipo de Experiência | Papel do Utilizador / Narrativa |
| :--- | :--- | :--- | :--- |
| **0** | **Prólogo: O Foguetão Debaixo da Cama** | Cena Cinematográfica | O quarto de Nayla à noite, a janela para as estrelas e a descoberta do foguetão do Arquivo de Memórias. |
| **1** | **Ato I: O Silêncio de Marte** | Exploração 2D Jogável | Chegada a Perseverance Valley; controlo da Nayla para dar os primeiros passos e descobrir a rocha de hematite. |
| **2** | **Ato II: A Pista Oculta na Rocha** | Scanner Macro Interativo | Plano aproximado da rocha; acionamento do scanner de Bip para leitura da assinatura mineral ($Fe_2O_3$ e Jarosite). |
| **3** | **Ato III: 5.111 Sóis de Descoberta** | Memória em Vídeo Real | Widescreen com vídeo histórico da NASA/JPL (`ksc_062904_mars`), descida a Endurance e legendas sincronizadas. |
| **4** | **Ato IV: A Noite Sem Fim (A Tempestade de 2018)** | Tempestade & Enigma no Caderno | Céu escurece, poeira cobre o rover; arquivação no caderno (distinção entre água antiga e prova de vida). |
| **5** | **Epílogo: Uma Carta para o Futuro** | Conclusão & Ficha Oficial | Carta de agradecimento de Nayla; consulta da Ficha Científica Oficial e fontes primárias da NASA. |

---

## 3. Verificação de Testes e Qualidade

* **Tipagem Estática:** `npm run typecheck` $\rightarrow$ **0 erros** (TypeScript rigoroso).
* **Testes Unitários:** `npm run test` $\rightarrow$ **22/22 testes passados** (Vitest em ~200ms).
* **Testes Ponta a Ponta (Playwright E2E):** `npm run test:e2e` $\rightarrow$ **8/8 testes passados** (Playwright em ~8.8s):
  1. Carregamento de canvas e HUD.
  2. Abertura do diálogo introdutório.
  3. Alternância de áudio (Mudo / Som).
  4. Consulta da ficha e fontes da NASA.
  5. Enigma com feedback de erro construtivo e sucesso.
  6. Resiliência de média e modo alternativo de Storyboard.
  7. Navegação entre capítulos e timeline cinematográfica.
  8. Captura de evidências visuais atualizadas.
* **Build de Produção:** `npm run build` $\rightarrow$ **Sucesso** (368 kB gzipped).

---

## 4. Evidências Visuais Atualizadas

As capturas de ecrã da versão cinematográfica foram arquivadas em `prototipo/docs/evidencias/`:

* `01_prologue_cinema.png`: Prólogo com quarto de Nayla, estrelas e navegação de capítulos.
* `02_exploration_act1.png`: Exploração guiada 2D em Perseverance Valley.
* `03_macro_scanner_act2.png`: Scanner espectroscópico de Bip revelando a composição das esférulas de hematite.
* `04_golden_memory_act3.png`: Apresentação widescreen da memória histórica da NASA com legendas.
* `05_dust_storm_act4.png`: Tempestade planetária de 2018 e diálogo da última telemetria.
* `06_puzzle_screen.png`: Enigma educativo diegético no Caderno de Nayla.
* `07_epilogue_sources.png`: Conclusão, estatísticas oficiais e fontes primárias da NASA/JPL.

---

## 5. Estado Git e Próximos Passos

* O repositório remoto **permanece intocado** (sem push, sem alterações na branch principal do colega Frânio).
* Todo o código está comitado/estabilizado na branch local `feat/piloto-opportunity` dentro de `prototipo/`.
* Servidor local de visualização ativo em: **`http://127.0.0.1:5173/`**.
