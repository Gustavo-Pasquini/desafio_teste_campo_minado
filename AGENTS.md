# AGENTS.md — desafio_teste_campo_minado

**Campo minado** em HTML, CSS e JavaScript puro, com testes de interface em Jest + Testing Library (jsdom). Trabalho em dupla: Gustavo (tarefas G1–G5) e Breno (tarefas B1–B5). Este arquivo vale para qualquer agente (Codex, Claude Code…).

> ✅ **Fase GREEN liberada (10/11/2026).** Os casos de teste já existem (RED). Agora o jogo é implementado para fazê-los passar, um TC por vez, com o mínimo de código em `js/` e **sem alterar `tests/`**. Detalhes: [docs/FASE-GREEN.md](docs/FASE-GREEN.md).

**Antes de qualquer coisa, leia o [PLANEJAMENTO.md](PLANEJAMENTO.md)**: regras do jogo (seção 1), dono de cada arquivo (2), `data-testid` e parâmetros de URL (3), tarefas (4) e casos de teste (5).

## Regra principal: TDD

Todo código do jogo é feito com a skill **`tdd`**: um `TC` vermelho → código mínimo → verde → próximo `TC` → refatorar e revisar no fim. Nunca escreva código sem um teste falhando antes, e nunca mude um teste para ele passar.

| Agente | Onde está a skill | Como chamar |
|---|---|---|
| Codex | `.agents/skills/tdd/SKILL.md` | `$tdd G2` (ou `/skills`) |
| Claude Code | `.claude/skills/tdd/SKILL.md` | `/tdd G2` |

As duas cópias da skill são idênticas: ao mudar uma, mude a outra. Depois do planejamento, "próximo" ou "go" = fazer o próximo TC da lista.

## Comandos

```bash
npm install
npm test                                              # todos os testes (precisam ficar verdes)
npx jest tests/<arquivo>.spec.js -t "TC-XX-NN"  # um caso
npm run verificar                                     # falha pelo motivo errado, teste sem ID, etc.
npm run mutacao                                       # teste de mutação (Stryker), no fim da tarefa
npm start                                             # jogar em http://localhost:8080
```

## Convenções

- Testes só pela interface: `abrirJogo(params)` de `tests/helpers.js`, `screen.getByTestId`, `user-event`. Sem importar `js/*.js` e sem `jest.mock` do jogo.
- No RED, escreva o teste sem abrir `js/`. No GREEN, **não edite `tests/`**: se um teste parecer errado, pare e avise.
- `js/main.js` lê `location.search` e inicia o jogo ao ser importado (sem `DOMContentLoaded`). Lógica em módulos que recebem dados e devolvem resultado; `ui*.js` só desenha e escuta cliques.
- Elementos escondidos usam o atributo `hidden`; bloqueados, o atributo `disabled` (o jsdom não lê CSS).
- Altere só os arquivos do dono da tarefa (seção 2 do PLANEJAMENTO.md).
- Uma branch por tarefa (`gustavo/...` ou `breno/...`), Conventional Commits em português (`test:`, `feat:`, `refactor:`, `fix:`, `docs:`). Nunca commitar na `main`, nunca dar push nem abrir PR sem a pessoa pedir, nunca mudar `git config user.*`.
- Ao terminar uma tarefa, atualize a tabela "ID → arquivo → o que verifica" do README.

## Hook de testes

Depois de cada edição em `js/` ou `tests/`, `scripts/hooks/rodar-testes.mjs` roda o verificador e devolve o resultado como contexto. Ele não bloqueia nada. No Codex ele está em `.codex/hooks.json` e precisa ser aprovado uma vez com `/hooks`; no Claude Code, em `.claude/settings.json`.
