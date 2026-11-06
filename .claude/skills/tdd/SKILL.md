---
name: tdd
description: Implementa uma tarefa do PLANEJAMENTO.md (G1–G5, B1–B5) com TDD em fatias verticais — um caso de teste de interface (Vitest + Testing Library) falhando, o mínimo de código para passar, repetir, e só então refatorar. Use sempre que for criar ou alterar casos de teste ou código do jogo neste repositório.
---

# TDD neste repositório

Baseado nas ideias de [Test-Driven Development com Claude Code (AI Hero)](https://www.aihero.dev/skill-test-driven-development-claude-code), adaptadas para este projeto: testes de interface com Vitest + Testing Library, casos de teste numerados (`TC-..-NN`) no `PLANEJAMENTO.md` e duas pessoas dividindo o trabalho.

## Por que assim

Quando o agente escreve o código antes e os testes depois (ou todos os testes de uma vez), os testes acabam conferindo o que o agente *imagina* que o código faz, não o comportamento pedido. Aí aparecem testes que passam sem testar nada, mocks do próprio jogo e testes reescritos só para ficarem verdes. Por isso a regra aqui é **um teste por vez, falhando primeiro**.

- ❌ **Horizontal (proibido):** escrever todos os testes da tarefa, depois todo o código.
- ✅ **Vertical (obrigatório):** um ciclo por caso de teste: `TC` vermelho → código mínimo → verde → próximo `TC`. Cada ciclo aproveita o que o anterior mostrou.

## 0. Antes de começar: qual tarefa e de quem

1. Pergunte (se não foi dito) **qual tarefa** do `PLANEJAMENTO.md` será feita: `G1`…`G5` (Gustavo) ou `B1`…`B5` (Breno).
2. Leia no `PLANEJAMENTO.md`: as regras (seção 1), os arquivos da tarefa (seção 2), o contrato de interface (seção 3) e os casos de teste da tarefa (seção 5).
3. Trabalhe **só nos arquivos do dono da tarefa**. Se precisar mexer num arquivo do outro integrante, pare e avise.
4. Confira a branch: `gustavo/<tarefa>` ou `breno/<tarefa>` (seção 4). Nunca commite na `main`. Os commits saem com o `git config` da pessoa que está usando o agente; não altere `user.name`/`user.email`.

## 1. Planejamento (antes de qualquer código)

Apresente ao usuário e espere a confirmação:

- **Interface:** quais `data-testid` e parâmetros de URL da seção 3 a tarefa usa. Se faltar algum, proponha a inclusão na seção 3 (no mesmo PR).
- **Ordem dos casos:** liste os `TC` da tarefa na ordem em que vai fazer. Comece pelo caminho principal; casos de borda depois.
- **Módulos profundos:** cada arquivo de `js/` expõe poucas funções simples que escondem a regra complicada (ex.: `manilhaDe(vira)`, `abrir(tabuleiro, linha, coluna)`). A lógica fica separada da tela (`ui*.js` só desenha e escuta cliques).
- **Projeto testável:** funções da lógica **recebem** o que precisam (ex.: `embaralhar(cartas, aleatorio = Math.random)`) e **devolvem** o resultado, em vez de ler variáveis globais ou mexer no DOM. A aleatoriedade sempre pode ser trocada pelos parâmetros de URL.

## 2. O ciclo (repita para cada TC)

### 🔴 RED — um teste que falha

1. Escreva **um** `test('TC-XX-NN <cenário>', ...)` no `tests/*.spec.js` indicado, seguindo a tabela da seção 5 (mesmos passos, mesmo resultado esperado).
2. Rode só ele:
   ```bash
   npx vitest run tests/<arquivo>.spec.js -t "TC-XX-NN"
   ```
3. Ele **tem que falhar pelo motivo certo**: a asserção não bate porque o comportamento ainda não existe. Erro de sintaxe, import quebrado ou `data-testid` com nome errado no teste não contam: corrija e rode de novo.
4. Commit: `test: TC-XX-NN <cenário>`.

### 🟢 GREEN — o mínimo para passar

1. Escreva só o código necessário para **este** teste. Nada "para depois", nada de casos que ainda não têm teste.
2. Rode o teste do ciclo e depois `npm test` (todos). Tudo verde.
3. Commit: `feat: <regra implementada> (TC-XX-NN)`.

### 🔵 REFACTOR — só com tudo verde

Quando os testes da tarefa passarem: tire duplicação, melhore nomes, simplifique. Sem mudar comportamento e **sem mexer nos testes para eles passarem**. `npm test` de novo → commit `refactor: ...`.

## 3. Como escrever um bom teste aqui

Um bom teste lê como a especificação da seção 5 e continua passando se a implementação for reescrita.

✅ Faça:
- Abrir o jogo só com `abrirJogo(params)` do `tests/helpers.js`.
- Encontrar elementos com `screen.getByTestId(...)` / `getAllByTestId(...)` / `getByRole(...)`.
- Agir como o jogador: `user.click`, `user.dblClick`, `user.pointer({ keys: '[MouseRight]', target })`.
- Conferir o que aparece: `toHaveTextContent`, `toHaveAttribute('data-estado', ...)`, `toBeVisible`, `toBeDisabled`, `toHaveLength`.
- Montar o cenário pelos parâmetros de URL da seção 3 (cartas, minas, peças, frota, puzzle), com constantes nomeadas e um comentário explicando o cenário.

❌ Não faça:
- Importar `js/*.js` direto no teste ou chamar funções internas do jogo.
- Usar `vi.mock` nos módulos do próprio jogo. O único "falso" permitido é o relógio (`vi.useFakeTimers()`).
- Ler variáveis globais, `localStorage` ou estado interno para conferir resultado.
- Conferir quantas vezes uma função foi chamada ou o formato de objetos internos.
- Depender de sorte (sem parâmetro de URL, o teste só pode conferir regras que valem para qualquer sorteio, como "252 células" ou "nenhuma carta repetida").

Se um teste quebra quando você refatora sem mudar o comportamento, ele está preso à implementação: reescreva-o pela interface.

## 4. Regras que não podem ser quebradas

- Nunca altere o **resultado esperado** de um TC para o teste passar. Se a tabela da seção 5 parecer errada, pare e pergunte; se o usuário concordar, corrija o `PLANEJAMENTO.md` num commit `docs:` separado.
- Nunca pule o RED. Teste que já nasce verde indica que não testa nada novo (ou que o comportamento já existia): investigue antes de seguir.
- Nunca desative (`test.skip`, `.only`) ou apague teste para deixar a suíte verde.
- Um TC por ciclo, um ciclo por vez.

## 5. Checklist por ciclo

- [ ] O título do teste tem o ID `TC-XX-NN` da seção 5
- [ ] Rodei e vi o teste falhar pelo motivo certo
- [ ] Commit `test:` feito
- [ ] Código mínimo, só nos arquivos do dono da tarefa
- [ ] `npm test` inteiro verde
- [ ] Commit `feat:` feito
- [ ] (fim da tarefa) refatorei com tudo verde, commit `refactor:`, abri o PR para o outro integrante revisar

## Exemplo de ciclo neste repositório

Tarefa **G3**, caso **TC-CM-04** (números das vizinhas).

🔴 RED — `tests/tabuleiro.spec.js`:

```js
import { test, expect } from 'vitest';
import { screen } from '@testing-library/dom';
import { abrirJogo, MINAS_COLUNAS } from './helpers.js';

test('TC-CM-04 números mostram quantas minas há em volta', async () => {
  const user = await abrirJogo({ minas: MINAS_COLUNAS });
  const esperado = { '0-8': '2', '5-8': '3', '12-15': '1', '12-16': '4' };

  for (const [posicao, valor] of Object.entries(esperado)) {
    await user.click(screen.getByTestId(`celula-${posicao}`));
    const celula = screen.getByTestId(`celula-${posicao}`); // busca de novo: a tela pode ter sido redesenhada
    expect(celula).toHaveAttribute('data-estado', 'aberta');
    expect(celula).toHaveAttribute('data-valor', valor);
  }
});
```

`npx vitest run tests/tabuleiro.spec.js -t "TC-CM-04"` → falha porque `data-valor` não existe ainda. É o motivo certo → `test: TC-CM-04 números das vizinhas`.

🟢 GREEN: em `js/tabuleiro.js`, `contarVizinhas(minas, linha, coluna)`; a tela coloca o resultado em `data-valor`. `npm test` verde → `feat: mostrar quantidade de minas vizinhas (TC-CM-04)`.

Próximo ciclo: TC-CM-05.
