# Como Executar — Ainda Estou Aqui (Episódio 1: Ranger 7)

Este projecto foi desenvolvido com a stack oficial recomendada: **TypeScript + Vite + Three.js + HTML/CSS**.

## 1. Pré-requisitos

- **Node.js:** v20+ (testado e verificado em v26.13.1, registado em `.node-version`)
- **npm:** 10+ (verificado em 11.20.0)
- Navegador moderno com suporte a WebGL (Chrome, Safari, Firefox, Edge, ou mobile Safari/Chrome)

---

## 2. Instalação e Verificação

A partir da raiz de `prototipo/`:

```bash
# 1. Instalar dependências da aplicação web
npm --prefix apps/web install

# 2. Executar verificação estática de tipos TypeScript
npm --prefix apps/web run typecheck

# 3. Executar testes unitários (Vitest)
npm --prefix apps/web run test

# 4. Compilar pacote de produção (build)
npm --prefix apps/web run build
```

---

## 3. Servidor de Desenvolvimento e Pré-visualização

### Modo Desenvolvimento (Vite Dev Server):
```bash
npm --prefix apps/web run dev
```
Abre no navegador: `http://127.0.0.1:5173/`

### Modo Pré-visualização de Produção (Vite Preview):
```bash
npm --prefix apps/web run preview -- --host 127.0.0.1 --port 4173
```
Abre no navegador: `http://127.0.0.1:4173/`

---

## 4. Testes E2E (Playwright)

```bash
npm --prefix apps/web run test:e2e
```

---

## 5. Controlo no Telemóvel / Mobile

O projecto foi desenhado com prioridade para dispositivos móveis:
- **Ecrã táctil total:** Toque no ecrã para iniciar a reprodução e activar o áudio.
- **Botões tácteis generosos:** Todos os botões respeitam a norma de acessibilidade com alvo mínimo de 48px.
- **Barra inferior rápida:** Iniciar / Pausa, Rever cena actual, Saltar com resumo.
- **Área segura (Safe Area):** Respeita o recorte (notch) e barra de início no iOS e Android (`viewport-fit=cover`).
- **Interacções tácteis simplificadas:**
  - *Vestígios A e B:* Botão grande «Analisar Vestígio».
  - *Vestígio C:* Botões tácteis ▲ e ▼ para ordenar os fotogramas com uma só mão.
  - *Veredicto:* Cartões grandes de toque com leitura directa e imediata.
