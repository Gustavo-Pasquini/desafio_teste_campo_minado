// Testes do tabuleiro e dos números (Gustavo — G2, G3). Casos da seção 5 do PLANEJAMENTO.md.
// Modo somente testes: o jogo ainda não existe, então estes testes FALHAM de propósito.
import { test, expect } from 'vitest';
import { abrirJogo, screen, celula, todasAsCelulas, LINHAS, COLUNAS, MINAS_COLUNAS } from './helpers.js';

test('TC-CM-01 tabuleiro 18 × 14: 252 células fechadas', async () => {
  await abrirJogo();
  expect(todasAsCelulas()).toHaveLength(LINHAS * COLUNAS); // 14 × 18 = 252
  for (let l = 0; l < LINHAS; l++) {
    for (let c = 0; c < COLUNAS; c++) {
      expect(celula(l, c)).toHaveAttribute('data-estado', 'fechada');
    }
  }
  expect(screen.queryByTestId('celula-14-0')).toBeNull();
  expect(screen.queryByTestId('celula-0-18')).toBeNull();
});
