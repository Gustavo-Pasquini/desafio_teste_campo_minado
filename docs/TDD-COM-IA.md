# TDD com agentes de IA — o que usamos e por quê

Este repositório pode ser desenvolvido com **Claude Code** ou **Codex**. Os dois seguem a mesma skill `tdd`. Este documento resume as técnicas de TDD com IA que pesquisamos, o que cada uma resolve e onde ela foi aplicada aqui.

## O problema

Agentes de IA sabem fazer TDD quando alguém pede, mas não fazem sozinhos. Sem regras, o agente tende a:

- escrever o código primeiro e os testes depois, que só confirmam o que o código já faz;
- escrever todos os testes de uma vez, testando comportamento imaginado;
- usar *mock* do próprio código, ou alterar o teste até ele passar;
- "decorar" o cenário do teste (um `if` que só funciona para aqueles dados).

Cobertura alta não prova nada: é a métrica mais fácil de o agente "otimizar", porque basta passar pela linha, sem conferir o efeito dela.

## Técnicas aplicadas

| # | Técnica | Ideia | Onde está neste repositório |
|---|---|---|---|
| 1 | **Fatias verticais** (AI Hero) | Um teste → código mínimo → repetir. Nunca todos os testes antes de todo o código | Skill `tdd`, seções 2 e 4 |
| 2 | **Vermelho pelo motivo certo** | O teste precisa falhar porque o comportamento não existe, não por erro de digitação | Skill, RED passo 4 |
| 3 | **Testar só pela interface** (AI Hero) | Testes usam o que o jogador vê e clica; sem mock interno, sem estado interno | Skill, seção 3; contrato de `data-testid` no PLANEJAMENTO.md |
| 4 | **Planejar antes do código** (AI Hero) | Combinar interface, ordem dos testes, módulos profundos e funções testáveis antes de codar | Skill, seção 1 |
| 5 | **Lista de testes + "go"** (Kent Beck, *augmented coding*) | O agente mantém uma lista; "go" = pegar o próximo teste da lista e fazer só ele | Skill, seção 1 (a lista vem do `git log`, sem arquivo extra) |
| 6 | **Commit do teste vermelho antes do código** | Deixa no histórico a prova de que o teste veio primeiro | Commits `test:` → `feat:`; conferido pelo `revisor-tdd` |
| 7 | **Separar quem testa de quem implementa** (sub-agentes; artigos de alexop.dev e Codex) | Com contextos separados, a análise de quem escreve o teste não "vaza" para quem implementa, e vice-versa | `.claude/agents/escritor-de-testes.md` e `implementador.md`; no Codex, as fases com regras de leitura/escrita |
| 8 | **Anti-trapaça e triangulação** | Conferir se o código não decorou o teste; usar mais exemplos (`test.each`, próximo TC) para forçar a regra geral | Skill, GREEN passo 3 |
| 9 | **Hooks em vez de só instruções** (TDD Guard; documentação de hooks do Codex) | Instrução em Markdown é só conselho; um hook roda sempre | `scripts/hooks/rodar-testes.mjs`, ligado em `.claude/settings.json` e `.codex/hooks.json` |
| 10 | **Revisão independente** | Uma segunda passada, em contexto limpo, procura teste fraco e código que decorou o teste | Sub-agente `revisor-tdd` (Claude) ou sessão nova (Codex) |
| 11 | **Teste de mutação** (Stryker; tese da Univ. de Twente) | Altera o código de propósito; se nenhum teste falhar, falta caso de teste. Mede a qualidade dos testes melhor que a cobertura | `npm run mutacao`, skill seção 6; o revisor sugere novos TCs para os mutantes sobreviventes |
| 12 | **CI como portão final** | O merge só acontece com tudo verde no GitHub Actions | Tarefa B1 |

## O que ficou de fora (e por quê)

- **TDD Guard / Probity** (hook que *bloqueia* edição de código sem teste falhando): é a forma mais rígida e funciona com Vitest, Claude Code e Codex. Ficou como opção porque exige instalação global e roda com todas as permissões do usuário. Nosso hook é mais simples: ele avisa e não bloqueia. Se a dupla quiser a versão rígida, leia o código do projeto antes de instalar.
- **Bloquear o fim do turno com testes vermelhos** (hook `Stop`): atrapalharia a fase RED, em que um teste falhando é o esperado.

## Como usar no dia a dia

1. `git checkout -b gustavo/g2-distribuicao` (ou a branch da sua tarefa).
2. Abrir o agente na pasta do repositório:
   - **Claude Code:** `/tdd G2`. O `CLAUDE.md` já carrega o `AGENTS.md`.
   - **Codex:** `$tdd G2`. O Codex lê o `AGENTS.md` sozinho. Na primeira vez, aprove o hook com `/hooks`.
3. Revisar o plano que o agente mostrar (lista de TCs e interface) e confirmar.
4. Dizer **"go"** a cada TC, ou deixar o agente seguir a lista. Conferir cada falha no RED.
5. No fim: revisão (`revisor-tdd` ou sessão nova), `npm run mutacao`, e PR para o outro integrante revisar.

## Fontes

- AI Hero — [Test-Driven Development skill for Claude Code](https://www.aihero.dev/skill-test-driven-development-claude-code)
- Kent Beck — [Augmented Coding: Beyond the Vibes](https://tidyfirst.substack.com/p/augmented-coding-beyond-the-vibes) (resumo em [aktagon.com](https://signals.aktagon.com/articles/2025/09/augmented-coding-beyond-the-vibes/))
- Alex Op — [Custom TDD workflow with Claude Code (sub-agentes)](https://alexop.dev/posts/custom-tdd-workflow-claude-code-vue/)
- Daniel Vaughan — [TDD with Codex CLI: red-green-refactor](https://codex.danielvaughan.com/2026/04/26/codex-cli-tdd-red-green-refactor-agent-driven-test-first-development/)
- nizos — [TDD Guard](https://github.com/nizos/tdd-guard)
- Everard de Vree (Univ. de Twente) — [StrykerJS em pipeline de testes gerados por LLM](https://essay.utwente.nl/fileshare/file/111098/Final%20Project%20Everard%20de%20Vree.pdf)
- Senko Rašić — [Improving AI-generated tests using mutation testing](https://blog.senko.net/improving-ai-generated-tests-using-mutation-testing)
- Stryker — [Vitest runner](https://stryker-mutator.io/docs/stryker-js/vitest-runner/)
- OpenAI Codex — [Skills](https://learn.chatgpt.com/docs/build-skills), [AGENTS.md](https://learn.chatgpt.com/docs/agent-configuration/agents-md), [Hooks](https://learn.chatgpt.com/docs/hooks)
- Anthropic — [Claude Code hooks](https://docs.claude.com/en/docs/claude-code/hooks)
