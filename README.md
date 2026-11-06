# desafio_teste_campo_minado

**Campo minado** — Campo minado com tabuleiro 18 × 14 e 40 bombas, feito em HTML, CSS e JavaScript, com casos de teste de interface em JavaScript (Vitest + Testing Library).

> 📋 O que cada integrante vai fazer, as regras do jogo e todos os casos de teste estão em **[PLANEJAMENTO.md](PLANEJAMENTO.md)**.

## Colaboradores

| Nome | RA | GitHub |
|---|---|---|
| Breno Bertaglia Nosima | 24113673-2 | [BrenoNosima](https://github.com/BrenoNosima) |
| Gustavo Mazeto Pasquini | 24183078-2 | [Gustavo-Pasquini](https://github.com/Gustavo-Pasquini) |

A divisão do trabalho (quem faz cada tarefa e cada caso de teste) está em [PLANEJAMENTO.md](PLANEJAMENTO.md).

## Como rodar

Requisitos: Node.js 18+.

```bash
npm install
npm start      # jogo em http://localhost:8080
npm test       # testes de interface
```

## Funcionamento dos casos de teste

- **Tipo:** testes de interface, em JavaScript, com [Vitest](https://vitest.dev) + [Testing Library](https://testing-library.com). Cada teste carrega o `index.html` do jogo num navegador simulado (jsdom), clica nos elementos como um jogador (`user-event`) e confere o que aparece na tela.
- **Metodologia (TDD):** cada caso foi escrito antes do código, um por vez: o teste falha (commit `test:`), o mínimo de código o faz passar (commit `feat:`), e só depois se refatora. O passo a passo está em [`.claude/skills/tdd/SKILL.md`](.claude/skills/tdd/SKILL.md).
- **Onde ficam:** pasta `tests/`, um arquivo `*.spec.js` por grupo de regras. `tests/helpers.js` tem a função `abrirJogo(params)`, que monta a tela e inicia o jogo.
- **Como os elementos são encontrados:** pelo atributo `data-testid` de cada elemento da tela (contrato na seção 3 do PLANEJAMENTO.md).
- **Sem sorte nos testes:** a partida pode ser montada pela URL (por exemplo, a ordem das cartas/peças/minas), então cada teste sempre começa do mesmo cenário.
- **Rastreabilidade:** cada teste tem no título o ID do caso (`TC-..-NN`), igual à tabela do PLANEJAMENTO.md.
- **Como rodar:** `npm test` (todos), `npx vitest run tests/<arquivo>.spec.js` (um arquivo), `npm run test:watch` (roda a cada alteração) e `npm run test:ui` (interface visual).

## Desenvolvimento com agentes de IA

O projeto está preparado para **Claude Code** e **Codex**, os dois seguindo TDD em fatias verticais. Cada um tem a skill `tdd`, um hook que roda os testes a cada edição e, no Claude Code, sub-agentes separados para escrever testes, implementar e revisar.

- Claude Code: `/tdd G2` · Codex: `$tdd G2` · depois, "go" faz o próximo caso de teste.
- Detalhes, técnicas e fontes: [docs/TDD-COM-IA.md](docs/TDD-COM-IA.md).

> Status: em planejamento. A tabela "ID → arquivo → o que verifica" será preenchida aqui conforme os testes forem implementados (tarefa B1).
