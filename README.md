# desafio_teste_campo_minado

**Campo minado** — Campo minado com tabuleiro 18 × 14 e 40 bombas: casos de teste de interface em JavaScript (Vitest + Testing Library). O jogo em si não é implementado por enquanto: os testes ficam falhando pelo motivo certo.

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
npm test              # roda os testes de interface (por enquanto todos falham, de propósito)
npm run verificar     # confere se cada teste falha pelo motivo certo e tem um ID do plano
```

## Funcionamento dos casos de teste

> ⚠️ **Entrega atual: somente os casos de teste.** O jogo não é implementado até segunda ordem, então **todos os testes falham de propósito**. O que importa é que cada um falhe **pelo motivo certo**, porque o comportamento descrito ainda não existe, e não por erro no próprio teste. O `npm run verificar` confere isso.

- **Tipo:** testes de interface, em JavaScript, com [Vitest](https://vitest.dev) + [Testing Library](https://testing-library.com). Cada teste carrega o `index.html` (esqueleto da tela) num navegador simulado (jsdom), clica nos elementos como um jogador (`user-event`) e confere o que deveria aparecer na tela.
- **Metodologia (TDD, fase RED):** cada caso é escrito a partir da especificação, **um por vez**: escrever → rodar → ver falhar pelo motivo certo → commit `test:`. O passo a passo está em [`.claude/skills/tdd/SKILL.md`](.claude/skills/tdd/SKILL.md).
- **Onde ficam:** pasta `tests/`, um arquivo `*.spec.js` por grupo de regras. `tests/helpers.js` tem a função `abrirJogo(params)`, que monta a tela.
- **Como os elementos são encontrados:** pelo atributo `data-testid` de cada elemento da tela (contrato na seção 3 do PLANEJAMENTO.md).
- **Sem sorte nos testes:** a partida pode ser montada pela URL (por exemplo, a ordem das cartas/peças/minas), então cada teste sempre começa do mesmo cenário.
- **Rastreabilidade:** cada teste tem no título o ID do caso (`TC-..-NN`), igual à tabela do PLANEJAMENTO.md.
- **Como rodar:** `npm test` (todos), `npx vitest run tests/<arquivo>.spec.js` (um arquivo), `npm run test:ui` (interface visual), `npm run verificar` (motivo da falha) e `npm run verificar:completo` (idem + TCs que faltam).

## Desenvolvimento com agentes de IA

O projeto está preparado para **Claude Code** e **Codex**. Os dois escrevem os testes um por vez e conferem o motivo de cada falha. Cada um tem a skill `tdd` e um hook que roda o verificador a cada edição. O Claude Code também tem sub-agentes separados para escrever e para revisar.

- Claude Code: `/tdd G2` · Codex: `$tdd G2` · depois, "go" escreve o próximo caso de teste.
- Detalhes, técnicas e fontes: [docs/TDD-COM-IA.md](docs/TDD-COM-IA.md).

> Status: em planejamento. A tabela "ID → arquivo → o que verifica" será preenchida aqui conforme os testes forem escritos (tarefa B1).
