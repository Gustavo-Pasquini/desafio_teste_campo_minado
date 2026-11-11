// Partida: estados (jogando/vitória/derrota) e o que cada jogada faz no tabuleiro.
import { criarTabuleiro, sortearMinas, colocarMinas, TOTAL_MINAS } from './tabuleiro.js';
import { revelar } from './revelar.js';
import { alternarBandeira, contarBandeiras, aberturaRapida } from './bandeiras.js';

/** Na derrota: mostra as minas sem bandeira e marca as bandeiras erradas. */
export function mostrarDerrota(tabuleiro) {
  for (const celula of tabuleiro.flat()) {
    if (celula.mina && celula.estado === 'fechada') celula.estado = 'mina';
    else if (!celula.mina && celula.estado === 'bandeira') celula.estado = 'bandeira-errada';
  }
}

/** Vitória = todas as células sem mina abertas. */
export function venceu(tabuleiro) {
  return tabuleiro.flat().every((celula) => celula.mina || celula.estado === 'aberta');
}

/** Na vitória: as minas restantes recebem bandeira. */
export function mostrarVitoria(tabuleiro) {
  for (const celula of tabuleiro.flat()) if (celula.mina) celula.estado = 'bandeira';
}

/**
 * Cria uma partida. `minasFixas` (lista de [linha, coluna]) desliga o primeiro clique seguro;
 * sem elas, as minas são sorteadas no primeiro clique, nunca na célula clicada.
 */
export function criarJogo(minasFixas = null, aleatorio = Math.random) {
  const tabuleiro = criarTabuleiro();
  let minasColocadas = false;
  if (minasFixas) {
    colocarMinas(tabuleiro, minasFixas);
    minasColocadas = true;
  }
  const jogo = {
    tabuleiro,
    situacao: 'jogando',
    minasRestantes: () => TOTAL_MINAS - contarBandeiras(tabuleiro),

    abrir(linha, coluna) {
      if (jogo.situacao !== 'jogando' || tabuleiro[linha][coluna].estado !== 'fechada') return;
      if (!minasColocadas) {
        colocarMinas(tabuleiro, sortearMinas(TOTAL_MINAS, [linha, coluna], aleatorio));
        minasColocadas = true;
      }
      concluir(revelar(tabuleiro, linha, coluna));
    },

    abrirRapido(linha, coluna) {
      if (jogo.situacao !== 'jogando') return;
      concluir(aberturaRapida(tabuleiro, linha, coluna));
    },

    marcar(linha, coluna) {
      if (jogo.situacao !== 'jogando') return;
      alternarBandeira(tabuleiro, linha, coluna, TOTAL_MINAS);
    },
  };

  /** Depois de abrir células: derrota se algo explodiu, vitória se só restam minas. */
  function concluir({ explodiu }) {
    if (explodiu) {
      jogo.situacao = 'derrota';
      mostrarDerrota(tabuleiro);
    } else if (venceu(tabuleiro)) {
      jogo.situacao = 'vitoria';
      mostrarVitoria(tabuleiro);
    }
  }

  return jogo;
}
