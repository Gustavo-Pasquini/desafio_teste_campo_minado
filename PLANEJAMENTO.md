# Planejamento — desafio_teste_campo_minado

Campo minado com tabuleiro **18 × 14 e 40 bombas**: **casos de teste de interface em JavaScript**. O jogo em si não é implementado por enquanto (fase GREEN desativada); os testes ficam falhando pelo motivo certo.

| Integrante | GitHub | Papel neste repositório |
|---|---|---|
| Gustavo Mazeto Pasquini (24183078-2) | Gustavo-Pasquini | Setup do projeto e testes de: tabuleiro, geração das minas, números e abertura em cascata |
| Breno Bertaglia Nosima (24113673-2) | BrenoNosima | Testes de: bandeiras, derrota, vitória, reinício, abertura rápida; CI e documentação dos testes |

---

## 1. Regras do jogo (o que os testes verificam)

- **Tabuleiro:** 18 colunas × 14 linhas = **252 células**. Linhas `0..13`, colunas `0..17`.
- **40 minas**, 212 células seguras.
- **Primeiro clique abre uma área livre:** no modo aleatório, as minas são sorteadas **depois** do primeiro clique, sem usar a célula clicada **nem as 8 vizinhas**. Assim a célula clicada vale 0 e abre em cascata.
- **Clique esquerdo** abre a célula:
  - mina → derrota;
  - número → mostra quantas das 8 vizinhas têm mina;
  - zero → abre automaticamente todas as vizinhas, em cascata, até chegar em células com número.
- **Clique direito** coloca/tira bandeira numa célula fechada. Célula com bandeira não abre no clique esquerdo.
- **Contador de minas** = 40 − bandeiras. Não é possível colocar mais de 40 bandeiras.
- **Abertura rápida:** clique duplo num número já aberto, com a mesma quantidade de bandeiras em volta, abre as vizinhas sem bandeira.
- **Cronômetro** começa no primeiro clique e para no fim do jogo.
- **Derrota:** mostra todas as minas, marca a mina clicada e as bandeiras erradas; o tabuleiro trava.
- **Vitória:** abrir as 212 células seguras. As minas restantes recebem bandeira, contador vai a 0; o tabuleiro trava.
- **Reiniciar** volta tudo ao estado inicial.
- **Modo bandeira:** o botão `btn-modo-bandeira` (elemento fixo do esqueleto) liga e desliga um modo em que o clique esquerdo coloca/tira bandeira em vez de abrir. Desligado, o clique esquerdo volta a abrir.

## 2. Stack, comandos e estrutura

| Item | Escolha |
|---|---|
| Entrega atual | **Somente os casos de teste** (`tests/`). O código do jogo não é implementado até segunda ordem (ver [docs/FASE-GREEN.md](docs/FASE-GREEN.md)) |
| Executor dos testes | [Vitest](https://vitest.dev) |
| Testes de interface | [Testing Library](https://testing-library.com) (`@testing-library/dom` + `@testing-library/user-event` + `@testing-library/jest-dom`), em JavaScript |
| "Navegador" dos testes | [jsdom](https://github.com/jsdom/jsdom) (`environment: 'jsdom'` no `vitest.config.js`). Não precisa baixar navegador |
| Esqueleto da tela | `index.html` com os elementos da seção 3 **vazios** + `js/main.js` vazio. É só o "molde" que os testes abrem |
| Node | 18 ou superior |
| CI | GitHub Actions rodando `npm ci` e `npm run verificar` em todo push e Pull Request |

Dependências de desenvolvimento (tarefa G1): `vitest`, `@vitest/ui`, `jsdom`, `@testing-library/dom`, `@testing-library/user-event`, `@testing-library/jest-dom`.

Comandos que o projeto deve ter (`package.json` da tarefa G1):

```bash
npm install                 # instala dependências (não baixa navegador)
npm test                    # roda os testes (vitest run) — por enquanto TODOS falham, de propósito
npm run verificar           # confere se cada teste falha pelo motivo certo e tem um ID do plano
npm run verificar:completo  # idem + acusa TCs do plano que ainda não têm teste (usar na entrega)
npm run test:ui             # interface visual do Vitest no navegador (vitest --ui)
```

```json
"scripts": {
  "test": "vitest run",
  "test:ui": "vitest --ui",
  "verificar": "node scripts/verificar-testes.mjs",
  "verificar:completo": "node scripts/verificar-testes.mjs --completo"
}
```

### Por que os testes ficam falhando

A fase GREEN (implementar o jogo) está **desativada até segunda ordem**. Então cada teste é escrito a partir da especificação (seções 1, 3 e 5) e precisa **falhar pelo motivo certo**:

- ✅ **Motivo certo:** a asserção não bate ou o elemento não existe, porque o jogo ainda não faz aquilo. Por exemplo, `AssertionError`, `Unable to find an element by: [data-testid="carta-j1-0"]` ou `expect(element).toHaveTextContent()`.
- ❌ **Motivo errado:** erro no próprio teste, como `TypeError`, `ReferenceError`, import quebrado ou arquivo que não carrega.
- ❌ **Teste passando:** se passa com a tela vazia, ele não testa nada. Reescreva-o para conferir o comportamento da seção 5.

O `scripts/verificar-testes.mjs` (já no repositório) faz essa conferência sozinho; o CI e o hook dos agentes usam ele.

### Esqueleto da tela (`index.html`, tarefa G1)

- Tem os elementos **fixos** da seção 3, cada um com seu `data-testid`, **sem texto, sem valor e sem atributos de estado** (`data-estado`, `disabled`, `hidden`). Senão algum teste passaria sem o jogo existir.
- Elementos criados pelo jogo (células, cartas, peças, casas) **não** entram no esqueleto.
- Carrega `<script type="module" src="js/main.js"></script>`; `js/main.js` fica só com um comentário até a fase GREEN.

### Como um teste abre o jogo — `tests/helpers.js` (tarefa G1)

```js
// tests/helpers.js
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';

// Caminho a partir da raiz (no ambiente jsdom, `new URL(..., import.meta.url)` não funciona com o fs).
const html = readFileSync(resolve(process.cwd(), 'index.html'), 'utf8');
const corpo = html.match(/<body[^>]*>([\s\S]*)<\/body>/)[1];

export async function abrirJogo(params = {}, opcoesUser = {}) {
  window.history.replaceState({}, '', '/?' + new URLSearchParams(params)); // parâmetros da seção 3
  document.body.innerHTML = corpo;          // mesmo HTML do jogo
  vi.resetModules();                        // cada teste começa um jogo novo
  await import('../js/main.js');            // vazio por enquanto; na fase GREEN, inicia o jogo
  return userEvent.setup(opcoesUser);       // "user" para clicar como um jogador
}
```

Exemplo de caso de teste:

```js
import { test, expect } from 'vitest';
import { screen } from '@testing-library/dom';
import { abrirJogo } from './helpers.js';

test('TC-XX-01 exemplo', async () => {
  const user = await abrirJogo({ /* parâmetros */ });
  await user.click(screen.getByTestId('btn-nova-partida'));
  expect(screen.getByTestId('mensagem')).toHaveTextContent('...');
});
```

### Regras para os testes

- Os testes **só** acessam o jogo pelo que o usuário vê/clica: `screen.getByTestId(...)`, `getByRole(...)` e `user.click`, `user.dblClick`, `user.pointer(...)`. Nada de importar `js/*.js` ou chamar funções internas.
- Clique direito: `await user.pointer({ keys: '[MouseRight]', target: elemento })`. Clique duplo: `await user.dblClick(elemento)`.
- O jsdom **não lê CSS**. Esconder/mostrar se confere pelo atributo `hidden` (`toBeVisible()`); bloqueio, pelo `disabled` (`toBeDisabled()`).
- Tempo (cronômetro): `vi.useFakeTimers()` no teste, `abrirJogo(params, { advanceTimers: vi.advanceTimersByTime })` e `vi.advanceTimersByTime(2000)` para "esperar" 2 s sem esperar de verdade.
- Todo elemento que um teste usa tem `data-testid` (lista na seção 3). Se precisar de um novo, adicione na seção 3 no mesmo PR.
- Aleatoriedade é controlada por **parâmetros de URL** (seção 3). Um teste nunca depende de sorte.
- Cada caso de teste da seção 5 vira um `test('TC-XX-NN ...')` com o **mesmo ID no título** (o verificador exige).
- Proibido `test.skip`, `test.todo` e `.only` (o verificador acusa).

### Arquivos para agentes de IA (já estão no repositório; ver [docs/TDD-COM-IA.md](docs/TDD-COM-IA.md))

```
AGENTS.md                        instruções para qualquer agente (Codex lê sozinho)
CLAUDE.md                        Claude Code: carrega o AGENTS.md + sub-agentes
.agents/skills/tdd/SKILL.md      skill tdd para o Codex        ($tdd G2)
.claude/skills/tdd/SKILL.md      skill tdd para o Claude Code  (/tdd G2) — cópia idêntica
.claude/agents/                  sub-agentes: escritor-de-testes, revisor-tdd
.claude/settings.json            hook do Claude Code
.codex/hooks.json                hook do Codex (aprovar uma vez com /hooks)
scripts/verificar-testes.mjs     verificador (npm run verificar, CI e hook)
scripts/hooks/rodar-testes.mjs   o hook: roda o verificador após editar tests/
docs/TDD-COM-IA.md               técnicas de TDD com IA usadas aqui e fontes
docs/FASE-GREEN.md               o que fazer quando a implementação for liberada
```

Estrutura de pastas e dono de cada arquivo.

> ⚠️ Os arquivos de `js/` (fora o `main.js` vazio) e o `css/` são da **fase GREEN, desativada até segunda ordem**: ninguém os cria agora. A divisão fica pronta para quando ela for liberada ([docs/FASE-GREEN.md](docs/FASE-GREEN.md)).

```
desafio_teste_campo_minado/
├── index.html              G1  esqueleto: elementos fixos da seção 3, vazios
├── js/main.js              G1  vazio (na fase GREEN: lê a URL e inicia o jogo)
├── js/tabuleiro.js         Gustavo  cria a grade, sorteia/recebe minas, conta vizinhas
├── js/revelar.js           Gustavo  abrir célula e cascata
├── js/ui.js                Gustavo  desenha o tabuleiro, contador, cronômetro
├── js/bandeiras.js         Breno    marcar/desmarcar, limite, abertura rápida
├── js/jogo.js              Breno    estados (jogando/vitória/derrota), reinício
├── tests/helpers.js        G1  (inclui as constantes de minas da seção 3)
├── tests/tabuleiro.spec.js      Gustavo
├── tests/revelar.spec.js        Gustavo
├── tests/bandeiras.spec.js      Breno
├── tests/fim-de-jogo.spec.js    Breno
├── .github/workflows/testes.yml Breno
├── vitest.config.js        G1
└── package.json            G1
```

## 3. Contrato de interface (o que os testes usam)

### Elementos (`data-testid`)

| data-testid | O que é |
|---|---|
| `tabuleiro` | A grade |
| `celula-L-C` | Cada célula (ex.: `celula-0-17`). Atributos: `data-estado` = `fechada` \| `aberta` \| `bandeira` \| `mina` \| `mina-explodida` \| `bandeira-errada`; `data-valor` = 0..8 quando aberta |
| `contador-minas` | 40 − bandeiras |
| `cronometro` | Segundos desde o primeiro clique |
| `btn-reiniciar` | Reinicia |
| `mensagem` | "Você venceu!" / "Você perdeu!" |

### Parâmetros de URL

| Parâmetro | Exemplo | Efeito |
|---|---|---|
| `minas` | `?minas=0-9,1-9,2-9,...` | Posições `linha-coluna` das 40 minas. Com este parâmetro, a regra do primeiro clique seguro fica desligada |

### Cenário fixo usado nos testes: `MINAS_COLUNAS`

Coluna 9 inteira (14 minas) + coluna 17 inteira (14) + coluna 16 das linhas 0 a 11 (12) = **40 minas**. Fica no `tests/helpers.js`.

```
coluna:  0 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17
linha 0  . . . . . . . . . *  .  .  .  .  .  .  *  *
...      (igual até a linha 11)
linha 12 . . . . . . . . . *  .  .  .  .  .  .  .  *
linha 13 . . . . . . . . . *  .  .  .  .  .  .  .  *
```

Com ele: clicar `5-0` abre as colunas 0–8 inteiras (126 células); clicar `5-12` abre todo o lado direito; os dois cliques juntos dão vitória.

## 4. Divisão de tarefas

> ⚠️ **Modo atual: somente testes.** A fase GREEN (implementar o jogo) está desativada até segunda ordem. As tarefas abaixo são de **escrever os casos de teste**; o código do jogo não é feito. Cada teste fica **falhando pelo motivo certo**. Quando a implementação for liberada: [docs/FASE-GREEN.md](docs/FASE-GREEN.md).

Cada tarefa segue o mesmo ciclo, **um caso de teste por vez**:

1. Escrever o teste do TC só a partir da especificação (seções 1, 3 e 5), sem código do jogo.
2. Rodar só ele (`npx vitest run tests/<arquivo>.spec.js -t "TC-XX-NN"`) e conferir que **falha pelo motivo certo**: asserção ou elemento não encontrado, e não erro do próprio teste.
3. `npm run verificar` sem problemas → commit `test: TC-XX-NN <cenário>`.
4. No fim da tarefa: revisão, atualizar a tabela de testes do README e abrir o Pull Request; o outro integrante revisa.

Cada integrante é **dono de arquivos de teste diferentes** (coluna "Arquivos"). Assim, depois da G1, os dois trabalham em paralelo sem conflito. `tests/helpers.js` é da G1: se precisar mudar, combine antes e faça um commit pequeno e separado.

**Usando agentes de IA (Claude Code ou Codex):** os dois seguem a skill `tdd` (lida pelo [`AGENTS.md`](AGENTS.md)). Para começar uma tarefa: `/tdd G2` no Claude Code ou `$tdd G2` no Codex; depois, "go" escreve o próximo TC. Como e por que funciona: [docs/TDD-COM-IA.md](docs/TDD-COM-IA.md). Cada integrante roda o agente na própria máquina, com o próprio `git config`, para os commits saírem no nome de quem fez.

### Gustavo

| Tarefa | Branch | Arquivos | Casos de teste |
|---|---|---|---|
| **G1** Setup: `package.json`, `vitest.config.js` (`environment: 'jsdom'`), `js/main.js` vazio, `.gitignore`, `index.html` esqueleto (elementos fixos da seção 3 **vazios**, sem texto nem atributos de estado), `tests/helpers.js` com `abrirJogo(params)` e `MINAS_COLUNAS` | `gustavo/g1-setup` | index.html, js/main.js, config, tests/helpers.js | — |
| **G2** Tabuleiro 18 × 14, contador e geração das 40 minas | `gustavo/g2-tabuleiro` | tests/tabuleiro.spec.js | TC-CM-01 a 03 |
| **G3** Números das vizinhas | `gustavo/g3-numeros` | tests/tabuleiro.spec.js | TC-CM-04, 18 |
| **G4** Abertura em cascata, célula aberta e cronômetro | `gustavo/g4-cascata` | tests/revelar.spec.js | TC-CM-05 a 07 |
| **G6** Modo bandeira e primeiro clique com área livre | `gustavo/g6-ajudas` | tests/ajudas.spec.js | TC-CM-23 a 26 |

### Breno

| Tarefa | Branch | Arquivos | Casos de teste |
|---|---|---|---|
| **B1** CI no GitHub Actions (`npm ci`, `npm run verificar`) + tabela de testes no README | `breno/b1-ci-readme` | .github/workflows, README.md | — |
| **B2** Bandeiras e limite de 40 | `breno/b2-bandeiras` | tests/bandeiras.spec.js | TC-CM-08 a 11, 19 |
| **B3** Derrota e bandeira errada | `breno/b3-derrota` | tests/fim-de-jogo.spec.js | TC-CM-12 a 14 |
| **B4** Vitória e reinício | `breno/b4-vitoria` | tests/fim-de-jogo.spec.js | TC-CM-15, 16, 22 |
| **B5** Abertura rápida (clique duplo) | `breno/b5-abertura-rapida` | tests/bandeiras.spec.js | TC-CM-17, 20, 21 |

## 5. Casos de teste (interface)

Clique direito: `user.pointer({ keys: '[MouseRight]', target: celula })` (o jogo escuta o evento `contextmenu`). Clique duplo: `user.dblClick(celula)`. Cronômetro: relógio falso do Vitest (`vi.useFakeTimers()`).

### Gustavo — tabuleiro, números e cascata

| ID | Cenário | Parâmetros / passos | Resultado esperado |
|---|---|---|---|
| TC-CM-01 | Tamanho do tabuleiro | Abrir a página | 252 células, 14 linhas × 18 colunas, todas `fechada` |
| TC-CM-02 | Estado inicial | Abrir a página | `contador-minas` = 40, `cronometro` = 0 |
| TC-CM-03 | Primeiro clique seguro | Sem parâmetros. 50 vezes: abrir o jogo de novo com `abrirJogo()` e clicar `0-0` | `celula-0-0` sempre `aberta` (nunca `mina-explodida`) |
| TC-CM-04 | Números corretos | `minas=MINAS_COLUNAS`. Clicar 0-8, 5-8, 12-15 e 12-16 | `data-valor` = 2, 3, 1 e 4 |
| TC-CM-05 | Cascata | `minas=MINAS_COLUNAS`, clicar 5-0 | 126 células `aberta` (colunas 0–8); `celula-5-10` continua `fechada` |
| TC-CM-06 | Célula aberta não muda | Abrir 5-8, depois clique esquerdo e direito nela | Continua `aberta`; contador continua 40 |
| TC-CM-07 | Cronômetro | Com relógio falso: avançar 2 s sem clicar; depois clicar 5-0 e avançar 2 s | Antes do clique = 0; depois do clique ≥ 1 e aumentando |
| TC-CM-18 | Célula sem minas em volta | `minas=MINAS_COLUNAS`, clicar 5-0 | `celula-5-0` = `aberta` com `data-valor` = 0 |
| TC-CM-23 | Modo bandeira | `minas=MINAS_COLUNAS`; `btn-modo-bandeira`; clique esquerdo em 3-3, depois de novo | `bandeira` e contador 39; depois `fechada` e contador 40 |
| TC-CM-24 | Modo bandeira numa mina | Modo ligado, clique esquerdo em 0-9; desligar o modo; clicar 5-0 | 0-9 = `bandeira`, sem derrota (`mensagem` vazia); 5-0 abre |
| TC-CM-25 | Área livre no 1º clique (meio) | Sem parâmetros. 20 vezes: abrir e clicar 7-9 | 7-9 `aberta` com valor 0 e as 8 vizinhas `aberta` |
| TC-CM-26 | Área livre no 1º clique (canto) | Sem parâmetros. 20 vezes: abrir e clicar 0-0 | 0-0 valor 0; 0-1, 1-0 e 1-1 `aberta`; contador 40 |

### Breno — bandeiras e fim de jogo

| ID | Cenário | Parâmetros / passos | Resultado esperado |
|---|---|---|---|
| TC-CM-08 | Colocar bandeira | Clique direito em 3-3 | `bandeira`; `contador-minas` = 39 |
| TC-CM-09 | Tirar bandeira | Clique direito de novo em 3-3 | `fechada`; contador = 40 |
| TC-CM-10 | Bandeira protege | `minas=MINAS_COLUNAS`. Bandeira em 0-9 (mina), clique esquerdo nela | Continua `bandeira`; jogo não termina |
| TC-CM-11 | Limite de bandeiras | Colocar 40 bandeiras, tentar a 41ª | 41ª célula continua `fechada`; contador = 0 |
| TC-CM-12 | Derrota | `minas=MINAS_COLUNAS`, clicar 0-9 | `celula-0-9` = `mina-explodida`; as outras 39 = `mina`; `mensagem` = "Você perdeu!"; clicar 5-0 depois não abre nada; cronômetro para |
| TC-CM-13 | 40 minas no modo aleatório | Sem parâmetros. Clicar células em sequência até perder | Contar `mina` + `mina-explodida` = 40 |
| TC-CM-14 | Bandeira errada | `minas=MINAS_COLUNAS`. Bandeira em 5-0 (sem mina), depois clicar 0-9 | `celula-5-0` = `bandeira-errada` |
| TC-CM-15 | Vitória | `minas=MINAS_COLUNAS`, clicar 5-0 e 5-12 | 212 células `aberta`; `mensagem` = "Você venceu!"; 40 minas com `bandeira`; contador = 0; cronômetro para |
| TC-CM-16 | Reiniciar | Jogar um pouco, clicar `btn-reiniciar` | 252 `fechada`; contador 40; cronômetro 0; `mensagem` vazia |
| TC-CM-17 | Abertura rápida | `minas=MINAS_COLUNAS`. Abrir 0-8 (valor 2), bandeira em 0-9 e 1-9, clique duplo em 0-8 | 0-7, 1-7 e 1-8 ficam `aberta`; nada explode |
| TC-CM-19 | A cascata não abre bandeira | `minas=MINAS_COLUNAS`. Bandeira em 7-3 (sem mina), clicar 5-0 | `celula-7-3` continua `bandeira`; 125 células `aberta`; contador 39 |
| TC-CM-20 | Abertura rápida com bandeiras a menos | `minas=MINAS_COLUNAS`. Abrir 0-8 (valor 2), bandeira só em 0-9, clique duplo em 0-8 | 0-7, 1-7 e 1-8 continuam `fechada` |
| TC-CM-21 | Abertura rápida com bandeira errada | `minas=MINAS_COLUNAS`. Abrir 0-8, bandeiras em 1-9 e 0-7 (errada), clique duplo em 0-8 | `celula-0-9` = `mina-explodida`; `mensagem` = "Você perdeu!"; `celula-0-7` = `bandeira-errada` |
| TC-CM-22 | Bandeiras não dão vitória | `minas=MINAS_COLUNAS`. Bandeira nas 40 minas, sem abrir nada | Sem "Você venceu!"; contador 0; as células seguras continuam `fechada` |

## 6. Fluxo de trabalho no Git

Para o professor enxergar a contribuição dos dois, **cada um commita da própria conta**:

1. **Gustavo** cria o repositório e adiciona `BrenoNosima` como colaborador (Settings → Collaborators). **Breno** aceita o convite.
2. Cada um configura o Git com o e-mail **cadastrado na própria conta do GitHub** (senão o commit não conta como contribuição):
   ```bash
   git config user.name "Seu Nome"
   git config user.email "email-da-sua-conta@exemplo.com"
   ```
3. Ninguém commita direto na `main`. Uma branch por tarefa: `gustavo/g2-...`, `breno/b2-...`, etc.
4. Mensagens no padrão Conventional Commits, em português: `test:`, `docs:`, `chore:`, `ci:`. Commits pequenos: um caso de teste por commit.
5. Pull Request para `main` → o **outro** integrante revisa e aprova → merge com **"Create a merge commit"** (não usar *squash*, para manter todos os commits de cada autor no histórico).
6. Antes de abrir o PR: `git pull origin main` e `npm run verificar` sem problemas (os testes falham de propósito; o que não pode é teste passando ou falhando por erro do próprio teste). O CI precisa estar verde no PR.
7. Ordem: **G1 entra primeiro** (estrutura do projeto). Depois disso as tarefas G e B podem andar em paralelo.

Conferir no fim: aba **Insights → Contributors** do repositório deve mostrar os dois.

## 7. Definição de pronto

O desafio só está pronto para entrega quando:

- [ ] Todos os casos de teste da seção 5 escritos em `tests/`, com o ID no título
- [ ] `npm run verificar:completo` sem problemas: todos os TCs têm teste, e todos **falham pelo motivo certo** (a fase GREEN está desativada)
- [ ] Nenhum código do jogo em `js/` (só o `js/main.js` vazio)
- [ ] README com: colaboradores, como rodar, **funcionamento dos casos de teste** (tabela ID → arquivo → o que verifica) — tarefa B1
- [ ] CI (GitHub Actions rodando `npm run verificar`) verde na `main` — tarefa B1
- [ ] Commits dos dois integrantes aparecendo em Insights → Contributors
- [ ] Nome do repositório exatamente `desafio_teste_campo_minado`
