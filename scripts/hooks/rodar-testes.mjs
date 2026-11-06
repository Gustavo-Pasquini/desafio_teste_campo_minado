#!/usr/bin/env node
// Hook PostToolUse (Claude Code e Codex): depois de uma edição em js/ ou tests/,
// roda a suíte do Vitest e devolve o resultado ao agente como contexto extra.
// Nunca bloqueia: na fase RED é normal ter 1 teste falhando.
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

let entrada = {};
try { entrada = JSON.parse(readFileSync(0, 'utf8') || '{}'); } catch { /* sem entrada: segue */ }

const raiz = process.env.CLAUDE_PROJECT_DIR || entrada.cwd || process.cwd();
const vitest = join(raiz, 'node_modules', '.bin', process.platform === 'win32' ? 'vitest.cmd' : 'vitest');
if (!existsSync(vitest)) process.exit(0); // projeto ainda sem setup (antes da G1) ou sem npm install

// Claude Code manda o arquivo em tool_input.file_path; Codex manda o patch em tool_input.command.
const alvo = String(entrada.tool_input?.file_path ?? entrada.tool_input?.command ?? '');
const relevante = alvo === '' || /(^|[\/\s])(js|tests)\//.test(alvo) || /index\.html/.test(alvo);
if (!relevante) process.exit(0);

const r = spawnSync(vitest, ['run', '--reporter=dot'], { cwd: raiz, encoding: 'utf8', timeout: 110_000 });
const saida = `${r.stdout ?? ''}${r.stderr ?? ''}`.replace(/\x1b\[[0-9;]*m/g, '').trim().split('\n').slice(-40).join('\n');
const status = r.status === 0 ? 'TODOS OS TESTES PASSANDO' : 'HÁ TESTES FALHANDO';

const contexto = [
  `[hook tdd] npm test depois da edição: ${status}.`,
  'Fase RED: o esperado é só o TC atual falhando, pelo motivo certo. Fase GREEN/REFACTOR: tudo precisa estar verde.',
  'Não edite o resultado esperado de um teste para ele passar.',
  '', saida,
].join('\n');

process.stdout.write(JSON.stringify({
  hookSpecificOutput: { hookEventName: 'PostToolUse', additionalContext: contexto },
}));
