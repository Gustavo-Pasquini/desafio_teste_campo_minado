// Helpers dos testes de interface (tarefa G1). Contrato: seção 3 do PLANEJAMENTO.md.
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { expect, vi } from 'vitest';
import { screen, within } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';

// Caminho a partir da raiz (no ambiente jsdom, `new URL(..., import.meta.url)` não funciona com o fs).
const html = readFileSync(resolve(process.cwd(), 'index.html'), 'utf8');
const corpo = html.match(/<body[^>]*>([\s\S]*)<\/body>/)[1];

/**
 * Abre o jogo como um jogador abriria a página.
 * @param {Record<string,string>} params parâmetros de URL da seção 3 (cenário fixo)
 * @param {object} opcoesUser repassado a userEvent.setup (ex.: { advanceTimers: vi.advanceTimersByTime })
 * @returns user do user-event, para clicar como o jogador
 */
export async function abrirJogo(params = {}, opcoesUser = {}) {
  window.history.replaceState({}, '', '/?' + new URLSearchParams(params));
  document.body.innerHTML = corpo;
  vi.resetModules();
  await import('../js/main.js');
  return userEvent.setup(opcoesUser);
}

/** Clique direito como o jogador faria. */
export async function cliqueDireito(user, elemento) {
  await user.pointer({ keys: '[MouseRight]', target: elemento });
}

export { screen, within };

export const LINHAS = 14;
export const COLUNAS = 18;

/**
 * MINAS_COLUNAS (40 minas): coluna 9 inteira + coluna 17 inteira + coluna 16 das linhas 0 a 11.
 * Clicar 5-0 abre as colunas 0–8 (126 células); clicar 5-12 abre o lado direito; os dois juntos = vitória.
 */
export const MINAS_COLUNAS = [
  ...Array.from({ length: 14 }, (_, l) => `${l}-9`),
  ...Array.from({ length: 14 }, (_, l) => `${l}-17`),
  ...Array.from({ length: 12 }, (_, l) => `${l}-16`),
].join(',');

export const celula = (l, c) => screen.getByTestId(`celula-${l}-${c}`);
export const todasAsCelulas = () => screen.getAllByTestId(/^celula-\d+-\d+$/);
export const celulasNoEstado = (estado) => todasAsCelulas().filter((c) => c.getAttribute('data-estado') === estado);
