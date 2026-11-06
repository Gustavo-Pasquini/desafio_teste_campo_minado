#!/usr/bin/env node
// Hook PostToolUse (Claude Code e Codex): depois de uma edição em tests/ (ou index.html/js/),
// roda o verificador (scripts/verificar-testes.mjs) e devolve o resultado ao agente como contexto.
// Nunca bloqueia a edição.
import { readFileSync } from 'node:fs';
import { verificar, MODO } from '../verificar-testes.mjs';

let entrada = {};
try { entrada = JSON.parse(readFileSync(0, 'utf8') || '{}'); } catch { /* sem entrada: segue */ }

const raiz = process.env.CLAUDE_PROJECT_DIR || entrada.cwd || process.cwd();
// Claude Code manda o arquivo em tool_input.file_path; Codex manda o patch em tool_input.command.
const alvo = String(entrada.tool_input?.file_path ?? entrada.tool_input?.command ?? '');
if (alvo && !/(^|[\/\s])(js|tests)\/|index\.html/.test(alvo)) process.exit(0);

const res = verificar(raiz);
if (res.semSetup) process.exit(0); // antes da G1 / sem npm install

const lembrete = MODO === 'somente-testes'
  ? 'Modo somente testes (fase GREEN desativada): todo teste deve FALHAR pelo motivo certo. Não crie código do jogo em js/ para fazê-lo passar.'
  : 'Fase RED: só o TC atual deve falhar. Fase GREEN/REFACTOR: tudo verde.';

process.stdout.write(JSON.stringify({
  hookSpecificOutput: {
    hookEventName: 'PostToolUse',
    additionalContext: `[hook tdd] ${lembrete}\nNão altere o resultado esperado de um teste.\n\n${res.texto}`,
  },
}));
