// Testes de derrota, vitória e reinício (Breno — B3 e B4).
import { test, expect, vi, afterEach } from 'vitest';
import { abrirJogo, screen, celula, todasAsCelulas, celulasNoEstado, cliqueDireito, MINAS_COLUNAS } from './helpers.js';

afterEach(() => vi.useRealTimers());

test('TC-CM-12 derrota revela minas e trava a partida', async () => {
  vi.useFakeTimers();
  const user = await abrirJogo({ minas: MINAS_COLUNAS }, { advanceTimers: vi.advanceTimersByTime });
  await user.click(celula(0, 9));
  expect(celula(0, 9)).toHaveAttribute('data-estado', 'mina-explodida');
  expect(celulasNoEstado('mina')).toHaveLength(39);
  expect(screen.getByTestId('mensagem')).toHaveTextContent('Você perdeu!');
  const tempo = screen.getByTestId('cronometro').textContent;
  await user.click(celula(5, 0));
  expect(celula(5, 0)).toHaveAttribute('data-estado', 'fechada');
  vi.advanceTimersByTime(2000);
  expect(screen.getByTestId('cronometro')).toHaveTextContent(tempo);
});
