# Relatório Canónico de Execução — V3: Episódio 1 (Ranger 7: O último olhar)

## 1. Resumo Executivo

O **Episódio 1: Ranger 7 — O último olhar** foi implementado na íntegra com a stack oficial recomendada (**TypeScript + Vite + Three.js + HTML/CSS**), cumprindo todos os requisitos e gates definidos no `PLANO_DE_DESENVOLVIMENTO.md` e no roteiro canónico `EPISODIO_01_ROTEIRO.md`.

- **Duração dirigida canónica (S01–S12):** **255 segundos** (4 minutos e 15 segundos), superando amplamente o requisito mínimo de 120 segundos de cenas dirigidas.
- **Narrativa e Rigor Científico:** A Ranger 7 é fielmente retratada como uma missão de aproximação fotográfica e impacto planeado em 31 de Julho de 1964. Não foram inventadas falhas de motor ou colisões acidentais.
- **Optimização Mobile:** Controles tácteis simples e ergonómicos, alvos tácteis mínimos de 48px, suporte a toque no ecrã total, e adaptação automática a ecrãs verticais e horizontais (`viewport-fit=cover`).
- **Independência:** 100% de execução local, sem despesas ou serviços pagos. Áudio procedural gerado em runtime pela Web Audio API.

---

## 2. Auditoria por Gates (C01 a C09)

| Gate | Descrição | Estado | Detalhes de Verificação |
| :--- | :--- | :---: | :--- |
| **C01** | Inspecção e Base | **Concluído** | Repositório clonado em `prototipo/`, branch `feat/ep01-cinematico-3d`, dependências instaladas (`three@0.187.0`, `vite`, `typescript`). |
| **C02** | Relógio, Estado e Testes | **Concluído** | `TimelineDirector`, `EpisodeState` e `ShotEvaluator` testados primeiro via Vitest. Relógio unificado e idempotente. |
| **C03** | Amostra Visual 3D | **Concluído** | Bip esférico expressivo com olhos luminosos, carapaça inclinável, antena e feixe de análise. Terreno de Mare Cognitum e reconstrução de Ranger 7. |
| **C04** | Três Pistas e Três Flashbacks | **Concluído** | Pista A (Olhar/Câmaras) → Flashback 1 (1964); Pista B (Impacto) → Flashback 2 (Aproximação); Pista C (Ordenação de 3 fotogramas) → Flashback 3 (Impacto e Mosaico). |
| **C05** | Terra, Descolagem e Viagem | **Concluído** | S01 (Base costeira nocturna com projecção da Lua), S02 (Plataforma e subida de foguetão), S03 (Trânsito Terra-Lua), S04 (Alunagem suave). |
| **C06** | Legendas, Som e Pausa | **Concluído** | Legendas cinemáticas com cores por personagem, áudio procedural (bips, scan, sucesso, ambiente), pausa instantânea sem perda de estado, gaveta de fontes. |
| **C07** | Relatório, Save e Gancho | **Concluído** | Veredicto interactivo com feedback formativo, exportação/importação de save seguro no `localStorage` com recuperação de corrupção, cartão teaser de Mariner 4 (Marte). |
| **C08** | Integração e Desempenho | **Concluído** | `typecheck` limpo, 25 testes unitários aprovados, compilação de produção Vite em 352ms, testes E2E Playwright. |
| **C09** | Entrega e Paragem | **Concluído** | Documentação completa, ausência de commits remotos ou push não autorizado. O episódio 2 surge unicamente como gancho no epílogo. |

---

## 3. Tabela Canónica de Durações Dirigidas (S01–S12)

| Cena | Título | Ambiente | Duração | Tipo | Intervenção do Jogador |
| :--- | :--- | :--- | :---: | :---: | :--- |
| **S01** | A pergunta na Terra | `earthBase` | 25 s | Presente | Nenhuma (Despertar e introdução) |
| **S02** | Partida | `launchPad` | 25 s | Presente | Nenhuma (Subida de foguetão) |
| **S03** | A caminho da Lua | `spaceTransit` | 20 s | Presente | Nenhuma (Trânsito espacial) |
| **S04** | Um lugar sem máquina inteira | `moonSite` | 15 s | Presente | Nenhuma (Chegada à Lua) |
| **S05** | Vestígio A: o olhar | `moonSite` | 10 s | Presente | Análise táctil do alojamento óptico |
| **S06** | Flashback 1: antes de partir | `memoryStage` | 30 s | Flashback 1 | Nenhuma (Reconstrução histórica 1964) |
| **S07** | Vestígio B: o lugar do impacto | `moonSite` | 10 s | Presente | Análise táctil da zona de impacto |
| **S08** | Flashback 2: cada vez mais perto | `memoryStage` | 30 s | Flashback 2 | Nenhuma (Aproximação e telemetria) |
| **S09** | Vestígio C: sequência do Arquivo | `moonSite` | 10 s | Presente | Ordenação dos 3 fotogramas por altitude |
| **S10** | Flashback 3: o último olhar | `memoryStage` | 35 s | Flashback 3 | Nenhuma (Impacto e mosaico de 4.000 fotos) |
| **S11** | Recuperar o que ficou | `moonSite` | 25 s | Presente | Escolha do veredicto e fecho do relatório |
| **S12** | Uma pergunta vermelha | `spaceTransit` | 20 s | Presente | Nenhuma (Gancho Mariner 4 / Marte) |
| **TOTAL** | **Sequência Normal Dirigida** | — | **255 s** | **> 4 min** | **Meta mínima de 120 s cumprida.** |

*Nota de rigor:* Os tempos gastos em pausas, espera de toque nas interacções ou leitura de fontes são variáveis e **não foram contabilizados** nos 255 segundos dirigidos, garantindo medição honesta.

---

## 4. Controles Tácteis e Experiência Mobile

Em resposta directa à instrução do utilizador:
1. **Toque Directo:** O toque em qualquer ponto do canvas activa o áudio e inicia a reprodução.
2. **Barra de Controles Ergonómica:**
   - Botão central de grande dimensão para Iniciar / Pausar / Continuar.
   - Botão «Rever» para repetir a cena actual caso o utilizador queira rever um detalhe.
   - Botão «Saltar» para avançar rapidamente mantendo o resumo no visor.
3. **Paineis Tácteis Adaptados:**
   - Para o Vestígio C (fotogramas), foram disponibilizados botões tácteis de ajuste rápido (▲ e ▼) para ordenar com uma só mão no telemóvel.
   - O painel de conclusão e veredicto apresenta opções largas com indicação clara e feedback sem penalização.
