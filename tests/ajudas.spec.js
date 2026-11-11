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
