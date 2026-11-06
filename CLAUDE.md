@AGENTS.md

## Só no Claude Code

- Skill: `/tdd G2` (arquivo `.claude/skills/tdd/SKILL.md`).
- Sub-agentes em `.claude/agents/`, chamados pela skill:
  - `escritor-de-testes`: um TC por vez, sem tocar em `js/`;
  - `revisor-tdd`: fim da tarefa, só leitura.
- O hook de testes está em `.claude/settings.json`.
