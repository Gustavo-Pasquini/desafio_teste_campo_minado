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

test('TC-CM-13 modo aleatório contém quarenta minas', async () => {
  const user = await abrirJogo();
  for (const alvo of todasAsCelulas()) {
    if (screen.getByTestId('mensagem').textContent.includes('perdeu')) break;
    if (alvo.getAttribute('data-estado') === 'fechada') await user.click(alvo);
  }
  expect(screen.getByTestId('mensagem')).toHaveTextContent('Você perdeu!');
  expect([...celulasNoEstado('mina'), ...celulasNoEstado('mina-explodida')]).toHaveLength(40);
});

test('TC-CM-14 derrota marca bandeira errada', async () => {
  const user = await abrirJogo({ minas: MINAS_COLUNAS });
  await cliqueDireito(user, celula(5, 0));
  await user.click(celula(0, 9));
  expect(celula(5, 0)).toHaveAttribute('data-estado', 'bandeira-errada');
});

test('TC-CM-15 vitória abre seguras e marca minas', async () => {
  vi.useFakeTimers();
  const user = await abrirJogo({ minas: MINAS_COLUNAS }, { advanceTimers: vi.advanceTimersByTime });
  await user.click(celula(5, 0));
  await user.click(celula(5, 12));
  expect(celulasNoEstado('aberta')).toHaveLength(212);
  expect(screen.getByTestId('mensagem')).toHaveTextContent('Você venceu!');
  expect(celulasNoEstado('bandeira')).toHaveLength(40);
  expect(screen.getByTestId('contador-minas')).toHaveTextContent(/^0$/);
  const tempo = screen.getByTestId('cronometro').textContent;
  vi.advanceTimersByTime(2000);
  expect(screen.getByTestId('cronometro')).toHaveTextContent(tempo);
});
