# Ainda Estou Aqui — Como Executar o Protótipo Localmente

Instruções para os programadores do projeto (**Gerzyge e Frânio**) executarem e testarem o protótipo localmente a partir de qualquer terminal.

---

## 1. Pré-Requisitos

* **Node.js:** Versão 20+ (testado e garantido na versão 26 / LTS com npm 10+).
* **Git:** Para gestão local das branches (`feat/piloto-opportunity`).
* **Navegador Moderno:** Chrome, Chromium, Firefox ou Safari (com suporte a WebGL e áudio HTML5).

---

## 2. Instalação e Configuração

No terminal, navegue até à pasta da aplicação web dentro do repositório:

```bash
cd prototipo/apps/web
npm install
```

Para garantir que os navegadores headless para testes ponta a ponta (E2E) estão instalados:

```bash
npx playwright install chromium
```

---

## 3. Comandos Disponíveis

Todos os comandos devem ser executados dentro de `prototipo/apps/web`:

### 3.1 Servidor de Desenvolvimento
Inicia o Vite em modo de desenvolvimento com Hot Module Replacement (HMR):
```bash
npm run dev
```
O terminal indicará o endereço local (geralmente `http://localhost:5173`).

### 3.2 Verificação de Tipos (TypeScript)
Verifica que não existem erros de tipagem estática no código:
```bash
npm run typecheck
```

### 3.3 Testes Unitários (Vitest)
Executa a suite de testes unitários para a máquina de estados, regras de progresso, validação do enigma e contratos científicos:
```bash
npm run test
```

### 3.4 Build de Produção
Compila o TypeScript e empacota os assets otimizados para produção na pasta `dist/`:
```bash
npm run build
```

### 3.5 Testes Ponta a Ponta (Playwright E2E)
Executa os testes automatizados de fluxo de navegação, exploração, feedback de erros no enigma, vídeo e resiliência de áudio/media:
```bash
npm run test:e2e
```

### 3.6 Pré-Visualização da Build de Produção
Serve localmente o pacote estático final compilado:
```bash
npm run preview -- --host 127.0.0.1
```

---

## 4. Estrutura do Código e Arquitetura

* `src/game/state.ts` & `progress.ts`: Máquina de estados desacoplada (`menu`, `exploration`, `dialogue`, `cinematic`, `puzzle`, `complete`).
* `src/game/scenes/`: Cenas Phaser (Boot, Preload, OpportunityScene, CinematicScene).
* `src/game/systems/`: Sistemas de movimentação ortogonal, interações por proximidade, gestão de áudio e feedback.
* `src/content/opportunity.ts`: Dados científicos, diálogos e configuração do enigma do Opportunity.
* `src/ui/`: Controladores de interface HTML/CSS acessíveis (diálogo, enigma com pistas visuais, legendas e ficha técnica).
