// Ponto de entrada do jogo: lê a URL e inicia o jogo (sem DOMContentLoaded).
import { lerMinas, LINHAS, COLUNAS } from './tabuleiro.js';
import { criarJogo } from './jogo.js';
import { criarTela, criarCronometro } from './ui.js';

const MENSAGENS = { jogando: '', vitoria: 'Você venceu!', derrota: 'Você perdeu!' };

const minasDaUrl = new URLSearchParams(location.search).get('minas');
const novoJogo = () => criarJogo(minasDaUrl ? lerMinas(minasDaUrl) : null);
const tela = criarTela(document.body, LINHAS, COLUNAS);
let jogo = novoJogo();
let segundos = 0;

const desenhar = () => tela.desenhar({
  tabuleiro: jogo.tabuleiro,
  minasRestantes: jogo.minasRestantes(),
  segundos,
  mensagem: MENSAGENS[jogo.situacao],
  travado: jogo.situacao !== 'jogando',
});
const cronometro = criarCronometro((s) => {
  segundos = s;
  desenhar();
}, tela.conectada);

/** Executa uma jogada de abrir: liga o cronômetro, e o para se a partida acabou. */
const jogadaDeAbrir = (acao) => (linha, coluna) => {
  if (jogo.situacao !== 'jogando') return;
  cronometro.iniciar();
  acao(linha, coluna);
  if (jogo.situacao !== 'jogando') cronometro.parar();
  desenhar();
};

tela.aoAbrir(jogadaDeAbrir((l, c) => jogo.abrir(l, c)));
tela.aoAbrirRapido(jogadaDeAbrir((l, c) => jogo.abrirRapido(l, c)));
tela.aoMarcar((linha, coluna) => {
  jogo.marcar(linha, coluna);
  desenhar();
});
tela.aoReiniciar(() => {
  cronometro.parar();
  segundos = 0;
  jogo = novoJogo();
  desenhar();
});
desenhar();
