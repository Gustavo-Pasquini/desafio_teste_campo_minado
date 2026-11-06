# CLAUDE.md — desafio_teste_campo_minado

Campo minado em HTML, CSS e JavaScript puro, com testes de interface em Vitest + Testing Library (jsdom). Trabalho em dupla: Gustavo (tarefas G1–G5) e Breno (tarefas B1–B5).

**Antes de qualquer coisa, leia o [PLANEJAMENTO.md](PLANEJAMENTO.md)**: regras do jogo (seção 1), dono de cada arquivo (2), `data-testid` e parâmetros de URL (3), tarefas (4) e casos de teste (5).

## Regra principal: TDD

Todo caso de teste e todo código do jogo são feitos com a skill **`tdd`** ([.claude/skills/tdd/SKILL.md](.claude/skills/tdd/SKILL.md)): um `TC` falhando → código mínimo → verde → próximo `TC` → refatorar no fim. Nunca escreva vários testes de uma vez nem código sem teste falhando antes.

Como chamar: `/tdd G2`, ou "use a skill tdd na tarefa B3".

## Comandos

```bash
npm install
npm test                                              # todos os testes
npx vitest run tests/<arquivo>.spec.js -t "TC-XX-NN"  # um caso
npm start                                             # jogar em http://localhost:8080
```

## Convenções

- Testes só pela interface: `abrirJogo(params)` de `tests/helpers.js`, `screen.getByTestId`, `user-event`. Sem importar `js/*.js` e sem `vi.mock` do jogo.
- Elementos escondidos usam o atributo `hidden`; botões bloqueados usam `disabled` (o jsdom não lê CSS).
- Altere só os arquivos do dono da tarefa (seção 2 do PLANEJAMENTO.md).
- Uma branch por tarefa (`gustavo/...` ou `breno/...`), Conventional Commits em português (`test:`, `feat:`, `refactor:`, `docs:`). Nunca commitar na `main`, nunca dar push nem abrir PR sem a pessoa pedir, nunca mudar `git config user.*`.
- Ao terminar uma tarefa, atualize a tabela "ID → arquivo → o que verifica" do README.
