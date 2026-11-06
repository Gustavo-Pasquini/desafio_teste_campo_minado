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

test('TC-CM-06 célula aberta não muda com novos cliques', async () => {
  const user = await abrirJogo({ minas: MINAS_COLUNAS });
  await user.click(celula(5, 8)); // número 3: abre só ela
  expect(celula(5, 8)).toHaveAttribute('data-estado', 'aberta');
  await user.click(celula(5, 8));
  await cliqueDireito(user, celula(5, 8));
  expect(celula(5, 8)).toHaveAttribute('data-estado', 'aberta');
  expect(screen.getByTestId('contador-minas')).toHaveTextContent(/^40$/);
});

test('TC-CM-07 cronômetro começa no primeiro clique', async () => {
  vi.useFakeTimers(); // relógio falso: "esperar" sem esperar de verdade
  const user = await abrirJogo({ minas: MINAS_COLUNAS }, { advanceTimers: vi.advanceTimersByTime });
  const segundos = () => Number(screen.getByTestId('cronometro').textContent);

  vi.advanceTimersByTime(2000);
  expect(screen.getByTestId('cronometro')).toHaveTextContent(/^0$/); // sem clique, não conta

  await user.click(celula(5, 0));
  vi.advanceTimersByTime(2000);
  const depois = segundos();
  expect(depois).toBeGreaterThanOrEqual(1);
  vi.advanceTimersByTime(1000);
  expect(segundos()).toBeGreaterThan(depois);
});
