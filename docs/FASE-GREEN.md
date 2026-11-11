# Fase GREEN — liberada em 10/11/2026

Hoje a entrega é **somente os casos de teste**, todos falhando pelo motivo certo. Este arquivo guarda tudo o que é preciso para, quando a implementação do jogo for liberada, passar ao TDD completo (RED → GREEN → REFACTOR) sem refazer o planejamento.

> **Autorização:** liberada por Gustavo Mazeto Pasquini em 10/11/2026, no chat do Claude Code ("crie o programa com base nos testes, seguindo o fluxo seguinte do TDD").

## O que já está pronto e guardado

| Arquivo | O que é |
|---|---|
| `docs/fase-green/SKILL-tdd-completo.md` | Skill `tdd` com o ciclo completo: GREEN mínimo, anti-trapaça/triangulação, REFACTOR, teste de mutação |
| `docs/fase-green/implementador.md` | Sub-agente do Claude Code para a fase GREEN (escreve só em `js/`, nunca em `tests/`) |
| `docs/fase-green/revisor-tdd-completo.md` | Revisor que também confere o código e roda o teste de mutação |

A divisão dos arquivos de `js/` entre Gustavo e Breno já está na seção 2 do PLANEJAMENTO.md.

## Como reativar (checklist)

1. [x] Ter a autorização registrada (quem liberou e quando), por exemplo numa issue ou no PR.
2. [x] Skill: copiar `docs/fase-green/SKILL-tdd-completo.md` por cima de **`.claude/skills/tdd/SKILL.md` e `.agents/skills/tdd/SKILL.md`**. As duas devem continuar idênticas.
3. [x] Sub-agentes: copiar `docs/fase-green/implementador.md` para `.claude/agents/` e `docs/fase-green/revisor-tdd-completo.md` para `.claude/agents/revisor-tdd.md`.
4. [x] Verificador: em `scripts/verificar-testes.mjs`, trocar `MODO = 'somente-testes'` por `MODO = 'tdd-completo'`. A partir daí, testes passando são o esperado.
5. [x] `AGENTS.md`, PLANEJAMENTO.md (seções 2, 4 e 7) e README: tirar os avisos de "somente testes" e voltar a incluir:
   - "Jogo jogável do início ao fim com `npm start`" na Definição de pronto;
   - os commits `feat:` e `refactor:` no fluxo do Git;
   - a coluna "Arquivos" da seção 4 com os arquivos de `js/` de cada tarefa.
6. [x] `package.json`: adicionar as dependências e os scripts abaixo.
7. [x] CI: trocar `npm run verificar` por `npm test` (todos verdes).

### Dependências e scripts a adicionar

```bash
npm install -D http-server @stryker-mutator/core @stryker-mutator/jest-runner
```

```json
"scripts": {
  "start": "http-server . -p 8080 -c-1",
  "mutacao": "stryker run"
}
```

`stryker.config.json`:

```json
{
  "testRunner": "jest",
  "jest": { "projectType": "custom" },
  "mutate": ["js/**/*.js", "!js/main.js"],
  "reporters": ["clear-text", "progress", "html"]
}
```

### Como fica o ciclo depois de reativado

1. 🔴 Os testes já existem e falham. Pegue **um** TC por vez, na ordem da lista de testes.
2. 🟢 O `implementador` escreve o **mínimo** em `js/` para aquele TC passar, sem tocar em `tests/` e sem "decorar" o cenário. Commit `feat: ... (TC-XX-NN)`.
3. 🔵 Com tudo verde: refatorar → `refactor:`.
4. Fim da tarefa: `revisor-tdd` + `npm run mutacao`. Cada mutante sobrevivente vira **sugestão** de novo TC, que só entra no plano com aprovação.
