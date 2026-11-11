// Testes das ajudas: modo bandeira e primeiro clique com área livre (Gustavo — G6).
// Modo somente testes: o jogo ainda não existe, então estes testes FALHAM de propósito.
import { abrirJogo, screen, celula, MINAS_COLUNAS } from './helpers.js';

const VIZINHAS = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];

test('TC-CM-23 modo bandeira: clique esquerdo marca e desmarca', async () => {
  const user = await abrirJogo({ minas: MINAS_COLUNAS });
  await user.click(screen.getByTestId('btn-modo-bandeira'));
  await user.click(celula(3, 3));
  expect(celula(3, 3)).toHaveAttribute('data-estado', 'bandeira');
  expect(screen.getByTestId('contador-minas')).toHaveTextContent(/^39$/);
  await user.click(celula(3, 3));
  expect(celula(3, 3)).toHaveAttribute('data-estado', 'fechada');
  expect(screen.getByTestId('contador-minas')).toHaveTextContent(/^40$/);
});

test('TC-CM-24 modo bandeira numa mina só marca; desligado, o clique volta a abrir', async () => {
  const user = await abrirJogo({ minas: MINAS_COLUNAS });
  await user.click(screen.getByTestId('btn-modo-bandeira'));
  await user.click(celula(0, 9)); // mina
  expect(celula(0, 9)).toHaveAttribute('data-estado', 'bandeira');
  expect(screen.getByTestId('mensagem')).toBeEmptyDOMElement();
  await user.click(screen.getByTestId('btn-modo-bandeira')); // desliga
  await user.click(celula(5, 0));
  expect(celula(5, 0)).toHaveAttribute('data-estado', 'aberta');
});

test('TC-CM-25 primeiro clique no meio abre uma área livre (20 partidas)', async () => {
  for (let i = 0; i < 20; i++) {
    const user = await abrirJogo();
    await user.click(celula(7, 9));
    expect(celula(7, 9)).toHaveAttribute('data-valor', '0');
    for (const [dl, dc] of VIZINHAS) expect(celula(7 + dl, 9 + dc)).toHaveAttribute('data-estado', 'aberta');
  }
});

test('TC-CM-26 primeiro clique no canto abre uma área livre (20 partidas)', async () => {
  for (let i = 0; i < 20; i++) {
    const user = await abrirJogo();
    await user.click(celula(0, 0));
    expect(celula(0, 0)).toHaveAttribute('data-valor', '0');
    for (const [l, c] of [[0, 1], [1, 0], [1, 1]]) expect(celula(l, c)).toHaveAttribute('data-estado', 'aberta');
    expect(screen.getByTestId('contador-minas')).toHaveTextContent(/^40$/);
  }
});
