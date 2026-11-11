#!/usr/bin/env node
// Verificador dos casos de teste — `npm run verificar` (e CI).
//
// MODO 'somente-testes' (atual, a fase GREEN está desativada até segunda ordem):
//   todo teste precisa FALHAR, e pelo motivo certo (asserção ou elemento não encontrado),
//   porque o jogo ainda não existe. Também confere se cada teste tem um ID TC-XX-NN do PLANEJAMENTO.md.
// MODO 'tdd-completo' (quando a fase GREEN for liberada): testes passando são o esperado.
//
// Uso: node scripts/verificar-testes.mjs [--completo]
//   --completo  também acusa os TCs do PLANEJAMENTO.md que ainda não têm teste (use no fim).
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, mkdtempSync, rmSync } from 'node:fs';
import { join, relative } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';

export const MODO = 'tdd-completo'; // troque para 'tdd-completo' quando a fase GREEN for liberada

const MOTIVOS_CERTOS = [/^AssertionError/, /^TestingLibraryElementError/, /^Error: expect\(/, /^JestExtendError/];
const semCor = (s) => String(s ?? '').replace(/\x1b\[[0-9;]*m/g, '');
const primeiraLinha = (s) => semCor(s).trim().split('\n')[0].slice(0, 160);

export function verificar(raiz, { completo = false } = {}) {
  const bin = join(raiz, 'node_modules', '.bin', process.platform === 'win32' ? 'jest.cmd' : 'jest');
  if (!existsSync(bin)) return { ok: false, semSetup: true, texto: 'Jest não instalado: rode `npm install` (o setup vem da tarefa G1).' };

  const ids = new Set();
  const plano = join(raiz, 'PLANEJAMENTO.md');
  if (existsSync(plano)) for (const m of readFileSync(plano, 'utf8').matchAll(/^\| (TC-[A-Z]{2}-\d{2}) \|/gm)) ids.add(m[1]);

  const pasta = mkdtempSync(join(tmpdir(), 'verificar-'));
  const saida = join(pasta, 'r.json');
  spawnSync(bin, ['--json', `--outputFile=${saida}`], { cwd: raiz, encoding: 'utf8', timeout: 110_000 });
  if (!existsSync(saida)) { rmSync(pasta, { recursive: true, force: true }); return { ok: false, texto: 'O Jest não gerou resultado (veja `npm test`).' }; }
  const r = JSON.parse(readFileSync(saida, 'utf8'));
  rmSync(pasta, { recursive: true, force: true });

  const erros = [], certos = [], feitos = new Set();
  for (const arq of r.testResults ?? []) {
    const nome = relative(raiz, arq.name);
    if (!arq.assertionResults?.length) {
      if (arq.status === 'failed') erros.push(`${nome}: o arquivo não carrega — ${primeiraLinha(arq.message)}`);
      continue;
    }
    for (const t of arq.assertionResults) {
      const id = (t.title.match(/^(TC-[A-Z]{2}-\d{2})\b/) ?? [])[1];
      const rotulo = `${nome} › "${t.title}"`;
      if (!id) { erros.push(`${rotulo}: título sem ID TC-XX-NN`); continue; }
      if (ids.size && !ids.has(id)) erros.push(`${rotulo}: ${id} não existe na seção 5 do PLANEJAMENTO.md`);
      feitos.add(id);
      if (t.status === 'skipped' || t.status === 'pending' || t.status === 'todo') { erros.push(`${rotulo}: teste desativado (skip/todo) não é permitido`); continue; }
      if (t.status === 'passed') {
        if (MODO === 'somente-testes') erros.push(`${rotulo}: PASSOU sem o jogo existir — ele não testa o comportamento (confira o resultado esperado da seção 5)`);
        else certos.push(`${id} passando`);
        continue;
      }
      const motivo = primeiraLinha(t.failureMessages?.[0]);
      if (MOTIVOS_CERTOS.some((re) => re.test(motivo))) certos.push(`${id} falha pelo motivo certo — ${motivo}`);
      else erros.push(`${rotulo}: falha pelo motivo ERRADO (erro no próprio teste) — ${motivo}`);
    }
  }

  const faltando = [...ids].filter((id) => !feitos.has(id));
  if (completo && faltando.length) erros.push(`TCs do PLANEJAMENTO.md ainda sem teste: ${faltando.join(', ')}`);

  const texto = [
    `Modo: ${MODO}. Testes OK: ${certos.length}. Problemas: ${erros.length}. TCs sem teste ainda: ${faltando.length}/${ids.size}.`,
    ...(erros.length ? ['', 'PROBLEMAS:', ...erros.map((e) => `  ✗ ${e}`)] : []),
    ...(certos.length ? ['', 'OK:', ...certos.map((c) => `  ✓ ${c}`)] : []),
    ...(!completo && faltando.length ? ['', `Ainda sem teste: ${faltando.join(', ')}`] : []),
  ].join('\n');
  return { ok: erros.length === 0, texto };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const raiz = process.env.CLAUDE_PROJECT_DIR || process.cwd();
  const res = verificar(raiz, { completo: process.argv.includes('--completo') });
  console.log(res.texto);
  process.exit(res.ok ? 0 : 1);
}
