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

// Um jogo que sorteasse as minas ANTES do 1º clique passaria só em ~0,02% das execuções ((212/252)^50).
test('TC-CM-03 primeiro clique nunca é mina (50 partidas aleatórias)', async () => {
  for (let i = 0; i < 50; i++) {
    const user = await abrirJogo(); // sem parâmetros: minas sorteadas depois do 1º clique
    await user.click(celula(0, 0));
    expect(celula(0, 0)).toHaveAttribute('data-estado', 'aberta');
  }
});

test('TC-CM-04 números mostram quantas minas há em volta', async () => {
  const user = await abrirJogo({ minas: MINAS_COLUNAS });
  // 0-8: minas em 0-9 e 1-9 · 5-8: 4-9, 5-9, 6-9 · 12-15: 11-16 · 12-16: 11-16, 11-17, 12-17, 13-17
  const esperado = { '0-8': '2', '5-8': '3', '12-15': '1', '12-16': '4' };
  for (const [posicao, valor] of Object.entries(esperado)) {
    const [l, c] = posicao.split('-').map(Number);
    await user.click(celula(l, c));
    expect(celula(l, c)).toHaveAttribute('data-estado', 'aberta'); // busca de novo: a tela pode ter sido redesenhada
    expect(celula(l, c)).toHaveAttribute('data-valor', valor);
  }
});
