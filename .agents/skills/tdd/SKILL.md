---
name: tdd
description: Escreve os casos de teste de interface (Jest + Testing Library) de uma tarefa do PLANEJAMENTO.md (G1–G5, B1–B5), um TC por vez, a partir da especificação, confirmando que cada um falha pelo motivo certo. Modo atual — somente testes, a fase GREEN (implementar o jogo) está desativada. Use sempre que for criar ou alterar testes neste repositório, ou quando o usuário disser "próximo"/"go".
---

# TDD neste repositório — modo **somente testes**

> ⚠️ **A fase GREEN está desativada até segunda ordem.** Ninguém implementa o jogo: nada de código em `js/` (fora o `js/main.js` vazio), nada de fazer teste passar. A entrega são os casos de teste, **todos falhando pelo motivo certo**. Quando a implementação for liberada, siga [`docs/FASE-GREEN.md`](../../../docs/FASE-GREEN.md).

Vale para **Claude Code** (`/tdd G2`) e **Codex** (`$tdd G2`). Esta skill existe em duas cópias idênticas, `.claude/skills/tdd/SKILL.md` e `.agents/skills/tdd/SKILL.md`: ao mudar uma, mude a outra. As técnicas e as fontes estão em [`docs/TDD-COM-IA.md`](../../../docs/TDD-COM-IA.md).

## Por que assim

Testes escritos olhando o código acabam conferindo o que o código *faz*, não o que foi *pedido*. Aqui não existe código: cada teste nasce só da especificação (`PLANEJAMENTO.md`), exatamente como no RED do TDD. Testes escritos todos de uma vez, sem rodar cada um, costumam ter erros no próprio teste, e um erro desses parece "falha" sem testar nada.

Por isso a regra é **um teste por vez, rodando cada um**, e conferindo que ele falha **pelo motivo certo**:

- ✅ **Motivo certo:** a asserção não bate ou o elemento não existe, porque o jogo ainda não faz aquilo. Por exemplo, `AssertionError`, `TestingLibraryElementError: Unable to find an element...` ou `expect(element).toHaveTextContent()`.
- ❌ **Motivo errado:** erro do próprio teste, como `TypeError`, `ReferenceError`, import quebrado ou arquivo que não carrega.
- ❌ **Passou:** com a tela vazia, um teste que passa não testa nada.

## 0. Antes de começar: qual tarefa e de quem

1. Pergunte (se não foi dito) **qual tarefa** do `PLANEJAMENTO.md` será feita: `G1`…`G5` (Gustavo) ou `B1`…`B5` (Breno).
2. Leia no `PLANEJAMENTO.md`: as regras (seção 1), o contrato de interface (seção 3) e os casos de teste da tarefa (seção 5).
3. Trabalhe **só nos arquivos de teste do dono da tarefa** (coluna "Arquivos" da seção 4). Se precisar mexer em `tests/helpers.js` ou no arquivo do outro integrante, pare e avise.
4. Confira a branch: `gustavo/<tarefa>` ou `breno/<tarefa>` (seção 4). Nunca commite na `main`. Os commits saem com o `git config` da pessoa que está usando o agente; não altere `user.name`/`user.email`.

## 1. Lista de testes e planejamento

**Lista de testes:** os `TC` da tarefa, na ordem em que serão feitos (caminho principal primeiro, bordas depois). Para saber o que já foi feito:

```bash
git log --oneline --grep "TC-"       # cada TC feito tem um commit test:
npm run verificar                    # mostra os TCs que ainda não têm teste
```

Quando o usuário disser **"próximo"** ou **"go"**: pegue o primeiro `TC` da lista que ainda não tem teste e faça **um** ciclo com ele.

Apresente também e espere a confirmação:

- **Interface:** quais `data-testid` e parâmetros de URL da seção 3 cada TC usa. Se faltar algum, proponha a inclusão na seção 3 (commit `docs:` no mesmo PR).
- **Cenários:** quais constantes de cenário (cartas, minas, peças, frota, puzzle) vão para o `tests/helpers.js` ou para o topo do `*.spec.js`, com um comentário explicando o cenário.

## 2. O ciclo (repita para cada TC)

1. **Escrever** um `test('TC-XX-NN <cenário>', ...)` no `tests/*.spec.js` da tarefa, seguindo a tabela da seção 5 (mesmos passos, mesmo resultado esperado). TC parametrizado (vários valores) → `test.each`, que conta como um TC só.
2. **Não** abra nem crie nada em `js/`: o teste nasce só da especificação.
3. **Rodar só ele:**
   ```bash
   npx jest tests/<arquivo>.spec.js -t "TC-XX-NN"
   ```
4. **Conferir a falha:** precisa ser pelo motivo certo (lista acima). Se for erro do próprio teste, corrija e rode de novo. Se **passou**, o teste está fraco: ele precisa conferir algo que só existe com o jogo funcionando. Mostre ao usuário a mensagem de falha.
5. **Conferir o conjunto:** `npm run verificar` sem problemas (o hook já faz isso depois de cada edição).
6. **Commit:** `test: TC-XX-NN <cenário>`.

### Separação de papéis (sub-agentes)

- **Claude Code:** delegue cada ciclo ao sub-agente `escritor-de-testes` (passe só o ID do TC) e, no fim da tarefa, chame o `revisor-tdd` (os dois em `.claude/agents/`).
- **Codex** (ou sem sub-agentes): faça os ciclos aqui mesmo. Para a revisão final, abra **uma sessão nova** e peça a revisão do diff da branch com a seção 6 desta skill.

### Feedback automático (hook)

Depois de cada edição em `tests/`, o hook `scripts/hooks/rodar-testes.mjs` roda o verificador e devolve o resultado ao agente. Qualquer **PROBLEMA** listado deve ser resolvido antes do commit. (Claude Code: `.claude/settings.json`. Codex: `.codex/hooks.json`, que precisa ser aprovado uma vez com `/hooks`.)

## 3. Como escrever um bom teste aqui

Um bom teste lê como a especificação da seção 5 e vai continuar valendo quando o jogo for implementado, seja qual for a implementação.

✅ Faça:
- Abrir o jogo só com `abrirJogo(params)` do `tests/helpers.js`.
- Encontrar elementos com `screen.getByTestId(...)` / `getAllByTestId(...)` / `getByRole(...)`.
- Agir como o jogador: `user.click`, `user.dblClick`, `user.pointer({ keys: '[MouseRight]', target })`.
- Conferir o que aparece: `toHaveTextContent`, `toHaveAttribute('data-estado', ...)`, `toBeVisible`, `toBeDisabled`, `toHaveLength`.
- Conferir **o resultado positivo** da seção 5. Um teste que só confere ausência ("nada muda", "não aparece") passa com a tela vazia. Combine com uma conferência que exige o jogo, por exemplo `vez` = J1 antes e depois.
- Montar o cenário pelos parâmetros de URL da seção 3, com constantes nomeadas e comentário.

❌ Não faça:
- Criar, importar ou chamar código de `js/`.
- Usar `jest.mock`. O único "falso" permitido é o relógio (`jest.useFakeTimers()`).
- Ler variáveis globais, `localStorage` ou estado interno.
- Depender de sorte (sem parâmetro de URL, o teste só pode conferir regras que valem para qualquer sorteio).
- Usar `test.skip`, `test.todo` ou `.only`.

## 4. Regras que não podem ser quebradas

- **Nenhum código do jogo.** Se um teste parece "precisar" de código para fazer sentido, ele está certo em falhar: deixe falhando.
- Nunca altere o **resultado esperado** de um TC. Se a tabela da seção 5 parecer errada, pare e pergunte; se o usuário concordar, corrija o `PLANEJAMENTO.md` num commit `docs:` separado.
- Nunca deixe um teste que **passa** ou que falha pelo **motivo errado**.
- Um TC por ciclo, um ciclo por vez.

## 5. Checklist por ciclo

- [ ] O título do teste tem o ID `TC-XX-NN` da seção 5
- [ ] Escrevi o teste só com a especificação (sem `js/`)
- [ ] Rodei e vi o teste falhar pelo motivo certo
- [ ] `npm run verificar` sem problemas
- [ ] Commit `test:` feito

## 6. Fim da tarefa: revisão

1. **Revisão** (sub-agente `revisor-tdd` ou sessão nova). Confere:
   - cada TC da tarefa tem teste e commit `test:`;
   - cada teste segue a seção 5, com os mesmos passos e o mesmo resultado esperado;
   - os testes conferem o resultado positivo, não só ausência;
   - nada em `js/` foi criado;
   - `npm run verificar` está sem problemas.
2. Atualize a tabela "ID → arquivo → o que verifica" do README.
3. PR para o outro integrante revisar. Na entrega final: `npm run verificar:completo`.

## Exemplo de ciclo neste repositório

Tarefa **G3**, caso **TC-CM-04** (números das vizinhas).

Teste — `tests/tabuleiro.spec.js`:

```js
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

`npx jest tests/tabuleiro.spec.js -t "TC-CM-04"` → falha com `TestingLibraryElementError: Unable to find an element by: [data-testid="celula-0-8"]` — o tabuleiro não é desenhado porque o jogo não existe. É o motivo certo. `npm run verificar` → sem problemas → commit `test: TC-CM-04 números das vizinhas`.


Próximo ciclo: TC-CM-05.
