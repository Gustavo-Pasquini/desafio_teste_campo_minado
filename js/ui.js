// Tela: desenha o tabuleiro, o contador, o cronômetro e a mensagem, e escuta os cliques.
// Não tem regra do jogo: recebe o estado pronto e avisa quem chamou o que o jogador fez.

const porTestId = (raiz, id) => raiz.querySelector(`[data-testid="${id}"]`);

/** O que aparece escrito em cada célula, para o jogador ver (os testes usam data-estado). */
const SIMBOLOS = { fechada: '', bandeira: '🚩', mina: '💣', 'mina-explodida': '💥', 'bandeira-errada': '❌' };

/** [linha, coluna] da célula onde o evento aconteceu, ou null. */
function posicaoDe(alvo) {
  const id = alvo.closest?.('[data-testid^="celula-"]')?.dataset.testid;
  return id ? id.split('-').slice(1).map(Number) : null;
}

/** Muda um atributo só se ele mudou (redesenhar 252 células a cada clique fica barato). */
function definir(el, atributo, valor) {
  if (valor === null) {
    if (el.hasAttribute(atributo)) el.removeAttribute(atributo);
  } else if (el.getAttribute(atributo) !== valor) {
    el.setAttribute(atributo, valor);
  }
}

function definirTexto(el, texto) {
  if (el.textContent !== texto) el.textContent = texto;
}

/** Cria as células dentro do `tabuleiro` da página (uma vez só) e devolve como desenhar e escutar. */
export function criarTela(raiz, linhas, colunas) {
  const elTabuleiro = porTestId(raiz, 'tabuleiro');
  const elContador = porTestId(raiz, 'contador-minas');
  const elCronometro = porTestId(raiz, 'cronometro');
  const elMensagem = porTestId(raiz, 'mensagem');
  const elReiniciar = porTestId(raiz, 'btn-reiniciar');
  elReiniciar.textContent = 'Reiniciar';
  elTabuleiro.style.setProperty('--colunas', colunas);

  const celulas = Array.from({ length: linhas }, (_, l) =>
    Array.from({ length: colunas }, (_, c) => {
      const el = document.createElement('button');
      el.type = 'button';
      el.className = 'celula';
      el.dataset.testid = `celula-${l}-${c}`;
      elTabuleiro.append(el);
      return el;
    }),
  );

  function desenhar({ tabuleiro, minasRestantes, segundos, mensagem, travado }) {
    tabuleiro.forEach((linha, l) => linha.forEach((celula, c) => {
      const el = celulas[l][c];
      const aberta = celula.estado === 'aberta';
      definir(el, 'data-estado', celula.estado);
      definir(el, 'data-valor', aberta ? String(celula.valor) : null);
      definir(el, 'disabled', travado ? '' : null);
      definirTexto(el, aberta ? (celula.valor ? String(celula.valor) : '') : SIMBOLOS[celula.estado]);
    }));
    definirTexto(elContador, String(minasRestantes));
    definirTexto(elCronometro, String(segundos));
    definirTexto(elMensagem, mensagem);
  }

  /** Repassa o evento `tipo` de uma célula para `fn(linha, coluna)`. */
  function escutarCelulas(tipo, fn) {
    elTabuleiro.addEventListener(tipo, (evento) => {
      if (tipo === 'contextmenu') evento.preventDefault();
      const posicao = posicaoDe(evento.target);
      if (posicao) fn(...posicao);
    });
  }

  return {
    desenhar,
    aoAbrir: (fn) => escutarCelulas('click', fn),
    aoMarcar: (fn) => escutarCelulas('contextmenu', fn),
    aoAbrirRapido: (fn) => escutarCelulas('dblclick', fn),
    aoReiniciar: (fn) => elReiniciar.addEventListener('click', fn),
    conectada: () => elTabuleiro.isConnected,
  };
}

/**
 * Cronômetro em segundos desde `iniciar()`. `aoMudar(segundos)` é chamado a cada segundo;
 * ele para sozinho quando `ativo()` deixa de ser verdade (ex.: a tela saiu do documento).
 */
export function criarCronometro(aoMudar, ativo) {
  let intervalo = null;
  let inicio = 0;

  function parar() {
    clearInterval(intervalo);
    intervalo = null;
  }

  function iniciar() {
    if (intervalo !== null) return;
    inicio = Date.now();
    intervalo = setInterval(() => {
      if (!ativo()) return parar();
      aoMudar(Math.floor((Date.now() - inicio) / 1000));
    }, 1000);
  }

  return { iniciar, parar };
}
