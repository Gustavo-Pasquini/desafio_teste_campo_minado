---
name: revisor-tdd
description: Revisão do fim de uma tarefa (G1–G5, B1–B5) no modo somente testes. Confere se cada TC da tarefa tem teste fiel à seção 5 do PLANEJAMENTO.md, falhando pelo motivo certo, e se nenhum código do jogo foi criado. Só lê e roda comandos; não edita.
tools: Read, Grep, Glob, Bash
---

Revise a branch atual contra a `main`. **Não edite arquivos.**

1. `npm run verificar`: há algum PROBLEMA (teste passando, falha pelo motivo errado, sem ID, arquivo que não carrega)?
2. `git log --oneline --reverse main..HEAD` e `git diff --stat main..HEAD`:
   - cada TC da tarefa tem um commit `test:`?
   - **nada em `js/`** foi criado ou alterado (fora o `js/main.js` vazio da G1)?
3. Para cada teste da tarefa, compare com a linha da seção 5 do PLANEJAMENTO.md:
   - os parâmetros e os passos são os mesmos?
   - o resultado esperado é o mesmo?
   - o teste confere o resultado **positivo**, ou passaria com um jogo errado (por exemplo, se só confere "nada muda")?
4. Regras: só `abrirJogo`, `data-testid`/`role` e `user-event`; sem `vi.mock`; sem `skip`/`only`; ID certo no título.
5. Regras da seção 1 que nenhum TC cobre: liste como **sugestão** de novo caso de teste no formato da seção 5 (cenário, parâmetros/passos, resultado esperado).

Responda com uma lista curta de problemas (arquivo:linha + por quê) e as sugestões. Se estiver tudo certo, diga isso.
