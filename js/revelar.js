// Abrir células: mina explode; número abre só ela; zero abre as vizinhas em cascata.
import { contarVizinhas, vizinhas } from './tabuleiro.js';

export function revelar(tabuleiro, linha, coluna) {
  const celula = tabuleiro[linha][coluna];
  if (celula.estado !== 'fechada') return { explodiu: false };
  if (celula.mina) {
    celula.estado = 'mina-explodida';
    return { explodiu: true };
  }
  const pendentes = [[linha, coluna]];
  while (pendentes.length) {
    const [l, c] = pendentes.pop();
    const atual = tabuleiro[l][c];
    if (atual.estado !== 'fechada' || atual.mina) continue;
    atual.estado = 'aberta';
    atual.valor = contarVizinhas(tabuleiro, l, c);
    if (atual.valor === 0) pendentes.push(...vizinhas(l, c));
  }
  return { explodiu: false };
}
