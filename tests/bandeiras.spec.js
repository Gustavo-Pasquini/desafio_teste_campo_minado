// Testes de bandeiras e abertura rápida (Breno — B2 e B5).
import { test, expect } from 'vitest';
import { abrirJogo, screen, celula, celulasNoEstado, cliqueDireito, MINAS_COLUNAS } from './helpers.js';

test('TC-CM-08 clique direito coloca bandeira', async () => {
  const user = await abrirJogo();
  await cliqueDireito(user, celula(3, 3));
  expect(celula(3, 3)).toHaveAttribute('data-estado', 'bandeira');
  expect(screen.getByTestId('contador-minas')).toHaveTextContent(/^39$/);
});

test('TC-CM-09 segundo clique direito tira bandeira', async () => {
  const user = await abrirJogo();
  await cliqueDireito(user, celula(3, 3));
  await cliqueDireito(user, celula(3, 3));
  expect(celula(3, 3)).toHaveAttribute('data-estado', 'fechada');
  expect(screen.getByTestId('contador-minas')).toHaveTextContent(/^40$/);
});
