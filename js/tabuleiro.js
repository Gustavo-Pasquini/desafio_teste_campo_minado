// Tabuleiro: cria a grade e sorteia as minas.
export const LINHAS = 14;
export const COLUNAS = 18;
export const TOTAL_MINAS = 40;

export function criarTabuleiro() {
  return Array.from({ length: LINHAS }, () =>
    Array.from({ length: COLUNAS }, () => ({ estado: 'fechada', mina: false })),
  );
}

/** Sorteia `quantidade` posições [linha, coluna] distintas, nunca a posição `excluida`. */
export function sortearMinas(quantidade, [linhaExcluida, colunaExcluida], aleatorio = Math.random) {
  const livres = [];
  for (let l = 0; l < LINHAS; l++) {
    for (let c = 0; c < COLUNAS; c++) {
      if (l !== linhaExcluida || c !== colunaExcluida) livres.push([l, c]);
    }
  }
  for (let i = 0; i < quantidade; i++) {
    const j = i + Math.floor(aleatorio() * (livres.length - i));
    [livres[i], livres[j]] = [livres[j], livres[i]];
  }
  return livres.slice(0, quantidade);
}

export function colocarMinas(tabuleiro, posicoes) {
  for (const [l, c] of posicoes) tabuleiro[l][c].mina = true;
}

/** Lê "linha-coluna,linha-coluna,..." (parâmetro `minas` da URL) como lista de [linha, coluna]. */
export function lerMinas(texto) {
  return texto.split(',').filter(Boolean).map((posicao) => posicao.split('-').map(Number));
}

/** Posições [linha, coluna] das até 8 vizinhas que existem no tabuleiro. */
export function vizinhas(linha, coluna) {
  const resultado = [];
  for (let dl = -1; dl <= 1; dl++) {
    for (let dc = -1; dc <= 1; dc++) {
      const l = linha + dl;
      const c = coluna + dc;
      if ((dl || dc) && l >= 0 && l < LINHAS && c >= 0 && c < COLUNAS) resultado.push([l, c]);
    }
  }
  return resultado;
}

export function contarVizinhas(tabuleiro, linha, coluna) {
  return vizinhas(linha, coluna).filter(([l, c]) => tabuleiro[l][c].mina).length;
}
