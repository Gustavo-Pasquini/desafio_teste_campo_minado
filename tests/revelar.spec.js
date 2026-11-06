// Testes de abrir células, cascata e cronômetro (Gustavo — G4). Casos da seção 5 do PLANEJAMENTO.md.
// Modo somente testes: o jogo ainda não existe, então estes testes FALHAM de propósito.
import { test, expect, vi, afterEach } from 'vitest';
import { abrirJogo, screen, celula, celulasNoEstado, cliqueDireito, MINAS_COLUNAS } from './helpers.js';

afterEach(() => {
  vi.useRealTimers();
});

test('TC-CM-05 cascata: clicar 5-0 abre as colunas 0 a 8', async () => {
  const user = await abrirJogo({ minas: MINAS_COLUNAS });
  await user.click(celula(5, 0)); // 5-0 não tem mina em volta
  const abertas = celulasNoEstado('aberta');
  expect(abertas).toHaveLength(126); // 14 linhas × 9 colunas
  for (const c of abertas) {
    const coluna = Number(c.getAttribute('data-testid').split('-')[2]);
    expect(coluna).toBeLessThanOrEqual(8);
  }
  expect(celula(5, 10)).toHaveAttribute('data-estado', 'fechada');
});
