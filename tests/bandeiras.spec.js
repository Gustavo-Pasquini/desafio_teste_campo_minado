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

test('TC-CM-10 bandeira protege a célula do clique esquerdo', async () => {
  const user = await abrirJogo({ minas: MINAS_COLUNAS });
  await cliqueDireito(user, celula(0, 9));
  await user.click(celula(0, 9));
  expect(celula(0, 9)).toHaveAttribute('data-estado', 'bandeira');
  expect(screen.getByTestId('mensagem')).not.toHaveTextContent('Você perdeu!');
});

test('TC-CM-11 limita a quarenta bandeiras', async () => {
  const user = await abrirJogo();
  for (let i = 0; i < 40; i++) await cliqueDireito(user, celula(Math.floor(i / 18), i % 18));
  await cliqueDireito(user, celula(2, 4));
  expect(celula(2, 4)).toHaveAttribute('data-estado', 'fechada');
  expect(celulasNoEstado('bandeira')).toHaveLength(40);
  expect(screen.getByTestId('contador-minas')).toHaveTextContent(/^0$/);
});

test('TC-CM-19 cascata não abre célula com bandeira', async () => {
  const user = await abrirJogo({ minas: MINAS_COLUNAS });
  await cliqueDireito(user, celula(7, 3));
  await user.click(celula(5, 0));
  expect(celula(7, 3)).toHaveAttribute('data-estado', 'bandeira');
  expect(celulasNoEstado('aberta')).toHaveLength(125);
  expect(screen.getByTestId('contador-minas')).toHaveTextContent(/^39$/);
});

test('TC-CM-17 abertura rápida abre vizinhas sem bandeira', async () => {
  const user = await abrirJogo({ minas: MINAS_COLUNAS });
  await user.click(celula(0, 8));
  await cliqueDireito(user, celula(0, 9));
  await cliqueDireito(user, celula(1, 9));
  await user.dblClick(celula(0, 8));
  for (const [linha, coluna] of [[0, 7], [1, 7], [1, 8]]) {
    expect(celula(linha, coluna)).toHaveAttribute('data-estado', 'aberta');
  }
  expect(celulasNoEstado('mina-explodida')).toHaveLength(0);
});

test('TC-CM-20 abertura rápida exige todas as bandeiras', async () => {
  const user = await abrirJogo({ minas: MINAS_COLUNAS });
  await user.click(celula(0, 8));
  await cliqueDireito(user, celula(0, 9));
  await user.dblClick(celula(0, 8));
  for (const [linha, coluna] of [[0, 7], [1, 7], [1, 8]]) {
    expect(celula(linha, coluna)).toHaveAttribute('data-estado', 'fechada');
  }
  expect(celula(0, 8)).toHaveAttribute('data-estado', 'aberta');
});
