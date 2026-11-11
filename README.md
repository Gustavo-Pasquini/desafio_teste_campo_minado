# desafio_teste_campo_minado

Desafio de testes: casos de teste para testar o **campo minado** com tabuleiro **18 × 14** e **40 bombas**, com **casos de teste em JavaScript para testar JavaScript** (Jest + Testing Library).

## Colaboradores

| Nome | RA | GitHub | Parte no trabalho |
|---|---|---|---|
| Breno Bertaglia Nosima | 24113673-2 | [BrenoNosima](https://github.com/BrenoNosima) | Tarefas B1–B5: CI, documentação dos testes e 14 casos de teste |
| Gustavo Mazeto Pasquini | 24183078-2 | [Gustavo-Pasquini](https://github.com/Gustavo-Pasquini) | Tarefas G1–G6: estrutura do projeto e 12 casos de teste |

As contribuições de cada um aparecem em **Insights → Contributors** e nos commits. A divisão das tarefas e as regras completas estão em [PLANEJAMENTO.md](PLANEJAMENTO.md).

## Como rodar

Requisitos: Node.js 18 ou superior.

```bash
npm install
npm test                    # roda todos os casos de teste (Jest)
npm run verificar           # confere o motivo de cada falha e o ID de cada teste
npm run verificar:completo  # idem + confere que todo caso do plano tem teste
npx jest tests/<arquivo>.spec.js -t "TC-XX-NN"   # um caso só
```

## Funcionamento dos casos de teste

**Situação atual:** somente os casos de teste. O jogo ainda não está implementado, então **todos os testes falham de propósito**, pelo motivo certo (o comportamento ainda não existe). O `npm run verificar` confere isso.

- **Ferramentas:** [Jest](https://jestjs.io) roda os testes; [Testing Library](https://testing-library.com) (`@testing-library/dom`, `user-event` e `jest-dom`) simula o jogador; o [jsdom](https://github.com/jsdom/jsdom) faz o papel do navegador, sem precisar abrir um.
- **Testes de interface:** cada teste abre o `index.html` do jogo pela função `abrirJogo(params)` de `tests/helpers.js`, clica como um jogador e confere o que aparece na tela. Os testes não chamam funções internas do jogo.
- **Elementos da tela:** encontrados pelo atributo `data-testid` (contrato na seção 3 do PLANEJAMENTO.md).
- **Sem depender de sorte:** o cenário (cartas, minas, peças, frota, puzzle) é montado por parâmetros de URL, então cada teste começa sempre do mesmo jeito. O tempo usa relógio falso (`jest.useFakeTimers()`).
- **Rastreabilidade:** cada teste tem no título o ID do caso (`TC-..-NN`), o mesmo da tabela abaixo e da seção 5 do PLANEJAMENTO.md.
- **Metodologia:** TDD, um caso de teste por vez: escrever, rodar, ver falhar pelo motivo certo e fazer o commit `test:`.
- **Integração contínua:** o GitHub Actions roda `npm ci` e `npm run verificar` em todo push e Pull Request.

## Casos de teste (26)

| ID | Cenário | Arquivo | Resultado esperado | Autor |
|---|---|---|---|---|
| TC-CM-01 | Tamanho do tabuleiro | `tests/tabuleiro.spec.js` | 252 células, 14 linhas × 18 colunas, todas `fechada` | Gustavo |
| TC-CM-02 | Estado inicial | `tests/tabuleiro.spec.js` | `contador-minas` = 40, `cronometro` = 0 | Gustavo |
| TC-CM-03 | Primeiro clique seguro | `tests/tabuleiro.spec.js` | `celula-0-0` sempre `aberta` (nunca `mina-explodida`) | Gustavo |
| TC-CM-04 | Números corretos | `tests/tabuleiro.spec.js` | `data-valor` = 2, 3, 1 e 4 | Gustavo |
| TC-CM-05 | Cascata | `tests/revelar.spec.js` | 126 células `aberta` (colunas 0–8); `celula-5-10` continua `fechada` | Gustavo |
| TC-CM-06 | Célula aberta não muda | `tests/revelar.spec.js` | Continua `aberta`; contador continua 40 | Gustavo |
| TC-CM-07 | Cronômetro | `tests/revelar.spec.js` | Antes do clique = 0; depois do clique ≥ 1 e aumentando | Gustavo |
| TC-CM-08 | Colocar bandeira | `tests/bandeiras.spec.js` | `bandeira`; `contador-minas` = 39 | Breno |
| TC-CM-09 | Tirar bandeira | `tests/bandeiras.spec.js` | `fechada`; contador = 40 | Breno |
| TC-CM-10 | Bandeira protege | `tests/bandeiras.spec.js` | Continua `bandeira`; jogo não termina | Breno |
| TC-CM-11 | Limite de bandeiras | `tests/bandeiras.spec.js` | 41ª célula continua `fechada`; contador = 0 | Breno |
| TC-CM-12 | Derrota | `tests/fim-de-jogo.spec.js` | `celula-0-9` = `mina-explodida`; as outras 39 = `mina`; `mensagem` = "Você perdeu!"; clicar 5-0 depois não abre nada; cronômetro para | Breno |
| TC-CM-13 | 40 minas no modo aleatório | `tests/fim-de-jogo.spec.js` | Contar `mina` + `mina-explodida` = 40 | Breno |
| TC-CM-14 | Bandeira errada | `tests/fim-de-jogo.spec.js` | `celula-5-0` = `bandeira-errada` | Breno |
| TC-CM-15 | Vitória | `tests/fim-de-jogo.spec.js` | 212 células `aberta`; `mensagem` = "Você venceu!"; 40 minas com `bandeira`; contador = 0; cronômetro para | Breno |
| TC-CM-16 | Reiniciar | `tests/fim-de-jogo.spec.js` | 252 `fechada`; contador 40; cronômetro 0; `mensagem` vazia | Breno |
| TC-CM-17 | Abertura rápida | `tests/bandeiras.spec.js` | 0-7, 1-7 e 1-8 ficam `aberta`; nada explode | Breno |
| TC-CM-18 | Célula sem minas em volta | `tests/tabuleiro.spec.js` | `celula-5-0` = `aberta` com `data-valor` = 0 | Gustavo |
| TC-CM-19 | A cascata não abre bandeira | `tests/bandeiras.spec.js` | `celula-7-3` continua `bandeira`; 125 células `aberta`; contador 39 | Breno |
| TC-CM-20 | Abertura rápida com bandeiras a menos | `tests/bandeiras.spec.js` | 0-7, 1-7 e 1-8 continuam `fechada` | Breno |
| TC-CM-21 | Abertura rápida com bandeira errada | `tests/bandeiras.spec.js` | `celula-0-9` = `mina-explodida`; `mensagem` = "Você perdeu!"; `celula-0-7` = `bandeira-errada` | Breno |
| TC-CM-22 | Bandeiras não dão vitória | `tests/fim-de-jogo.spec.js` | Sem "Você venceu!"; contador 0; as células seguras continuam `fechada` | Breno |
| TC-CM-23 | Modo bandeira | `tests/ajudas.spec.js` | `bandeira` e contador 39; depois `fechada` e contador 40 | Gustavo |
| TC-CM-24 | Modo bandeira numa mina | `tests/ajudas.spec.js` | 0-9 = `bandeira`, sem derrota (`mensagem` vazia); 5-0 abre | Gustavo |
| TC-CM-25 | Área livre no 1º clique (meio) | `tests/ajudas.spec.js` | 7-9 `aberta` com valor 0 e as 8 vizinhas `aberta` | Gustavo |
| TC-CM-26 | Área livre no 1º clique (canto) | `tests/ajudas.spec.js` | 0-0 valor 0; 0-1, 1-0 e 1-1 `aberta`; contador 40 | Gustavo |

## Estrutura

```
index.html                esqueleto da tela (elementos da seção 3)
js/main.js                ponto de entrada do jogo
tests/helpers.js          abrirJogo(), cenários fixos e atalhos
tests/*.spec.js           casos de teste
scripts/verificar-testes.mjs  verificador (npm run verificar e CI)
PLANEJAMENTO.md           regras, contrato, tarefas e casos de teste
docs/                     matriz de cobertura e TDD com IA
```
