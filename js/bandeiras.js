// Bandeiras: marcar/desmarcar, limite e abertura rápida.
import { vizinhas } from './tabuleiro.js';
import { revelar } from './revelar.js';

export function contarBandeiras(tabuleiro) {
  return tabuleiro.flat().filter((celula) => celula.estado === 'bandeira').length;
}

/** Coloca ou tira a bandeira de uma célula fechada, sem passar de `limite` bandeiras. */
export function alternarBandeira(tabuleiro, linha, coluna, limite) {
  const celula = tabuleiro[linha][coluna];
  if (celula.estado === 'fechada' && contarBandeiras(tabuleiro) < limite) celula.estado = 'bandeira';
  else if (celula.estado === 'bandeira') celula.estado = 'fechada';
}

/**
 * Abertura rápida: num número aberto com a mesma quantidade de bandeiras em volta,
 * abre as vizinhas sem bandeira. Devolve { explodiu } como `revelar`.
 */
export function aberturaRapida(tabuleiro, linha, coluna) {
  const celula = tabuleiro[linha][coluna];
  const vizinhasDela = vizinhas(linha, coluna);
  const bandeiras = vizinhasDela.filter(([l, c]) => tabuleiro[l][c].estado === 'bandeira').length;
  if (celula.estado !== 'aberta' || bandeiras !== celula.valor) return { explodiu: false };
  const explodiu = vizinhasDela
    .map(([l, c]) => revelar(tabuleiro, l, c).explodiu)
    .some(Boolean);
  return { explodiu };
}
