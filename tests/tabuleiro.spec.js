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

test('TC-CM-02 estado inicial: contador 40 e cronômetro 0', async () => {
  await abrirJogo();
  expect(screen.getByTestId('contador-minas')).toHaveTextContent(/^40$/);
  expect(screen.getByTestId('cronometro')).toHaveTextContent(/^0$/);
});

// Limitação conhecida: um jogo que sorteia as minas ANTES do 1º clique ainda passa
// em ~3% das execuções ((212/252)^20 ≈ 0,031). Mais repetições reduzem esse risco.
test('TC-CM-03 primeiro clique nunca é mina (20 partidas aleatórias)', async () => {
  for (let i = 0; i < 20; i++) {
    const user = await abrirJogo(); // sem parâmetros: minas sorteadas depois do 1º clique
    await user.click(celula(0, 0));
    expect(celula(0, 0)).toHaveAttribute('data-estado', 'aberta');
  }
});
