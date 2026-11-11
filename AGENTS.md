# AGENTS.md — desafio_teste_campo_minado

Casos de teste de interface (Jest + Testing Library, jsdom) para **Campo minado** em JavaScript. Trabalho em dupla: Gustavo (tarefas G1–G5) e Breno (tarefas B1–B5). Este arquivo vale para qualquer agente (Codex, Claude Code…).

> ⚠️ **Modo atual: somente testes.** A fase GREEN (implementar o jogo) está **desativada até segunda ordem**. Não escreva código do jogo em `js/`. Cada teste deve **falhar pelo motivo certo** (asserção ou elemento não encontrado), nunca passar e nunca falhar por erro do próprio teste. Para quando a implementação for liberada: [docs/FASE-GREEN.md](docs/FASE-GREEN.md).

**Antes de qualquer coisa, leia o [PLANEJAMENTO.md](PLANEJAMENTO.md)**: regras do jogo (seção 1), estrutura (2), `data-testid` e parâmetros de URL (3), tarefas e arquivos de cada um (4) e casos de teste (5).

## Regra principal: um teste por vez

Todo caso de teste é escrito com a skill **`tdd`**: um `TC` por vez, a partir da especificação → rodar → conferir que falha pelo motivo certo → `npm run verificar` → commit `test:`. Nunca escreva vários testes sem rodar cada um.

| Agente | Onde está a skill | Como chamar |
|---|---|---|
| Codex | `.agents/skills/tdd/SKILL.md` | `$tdd G2` (ou `/skills`) |
| Claude Code | `.claude/skills/tdd/SKILL.md` | `/tdd G2` |

As duas cópias da skill são idênticas: ao mudar uma, mude a outra. Depois do planejamento, "próximo" ou "go" = escrever o próximo TC da lista.

## Comandos

```bash
npm install
npm test                                              # todos os testes (por enquanto todos falham, de propósito)
npx jest tests/<arquivo>.spec.js -t "TC-XX-NN"  # um caso
npm run verificar                                     # cada teste falha pelo motivo certo? tem ID do plano?
npm run verificar:completo                            # idem + TCs do plano ainda sem teste (entrega)
```

## Convenções

- Testes só pela interface: `abrirJogo(params)` de `tests/helpers.js`, `screen.getByTestId`, `user-event`. Sem importar `js/*.js` e sem `jest.mock`.
- `index.html` é só o esqueleto: elementos fixos da seção 3 **vazios**, sem texto nem atributos de estado. `js/main.js` fica vazio.
- Altere só os arquivos de teste do dono da tarefa (seção 4 do PLANEJAMENTO.md).
- Uma branch por tarefa (`gustavo/...` ou `breno/...`), Conventional Commits em português (`test:`, `docs:`, `chore:`, `ci:`). Nunca commitar na `main`, nunca dar push nem abrir PR sem a pessoa pedir, nunca mudar `git config user.*`.
- Ao terminar uma tarefa, atualize a tabela "ID → arquivo → o que verifica" do README.

## Hook de testes

Depois de cada edição em `tests/`, `scripts/hooks/rodar-testes.mjs` roda o verificador e devolve o resultado como contexto. Ele não bloqueia nada. No Codex ele está em `.codex/hooks.json` e precisa ser aprovado uma vez com `/hooks`; no Claude Code, em `.claude/settings.json`.
