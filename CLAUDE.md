@AGENTS.md

## Só no Claude Code

- Skill: `/tdd G2` (arquivo `.claude/skills/tdd/SKILL.md`).
- Sub-agentes em `.claude/agents/`, chamados pela skill:
  - `escritor-de-testes`: fase RED, um TC por vez, sem ler `js/`;
  - `implementador`: fase GREEN, sem editar `tests/`;
  - `revisor-tdd`: fim da tarefa, só leitura, inclui o teste de mutação.
- O hook de testes está em `.claude/settings.json`.
