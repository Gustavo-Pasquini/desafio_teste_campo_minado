# Matriz regra → casos de teste — Campo minado

| # | Regra (seção 1) | TCs | Situação |
|---|---|---|---|
| 1 | 18 × 14 = 252 células | 01 | ✅ |
| 2 | 40 minas, 212 seguras | 13, 15 | ✅ |
| 3 | Primeiro clique nunca é mina | 03 (20 partidas, ~3% de falso positivo) | ⚠️ → ajuste: **50 repetições** (~0,02%) |
| 4 | Número = minas nas 8 vizinhas | 04 (4 valores) | ✅ |
| 5 | Zero abre em cascata até os números | 05, 18 | ✅ |
| 6 | Mina → derrota | 12 | ✅ |
| 7 | Clique direito põe/tira bandeira (só em fechada) | 06, 08, 09 | ✅ |
| 8 | Bandeira não abre no clique esquerdo | 10 | ✅ |
| 9 | A cascata não abre célula com bandeira | — | ❌ → **TC-CM-19** |
| 10 | Contador = 40 − bandeiras, máximo 40 | 08, 11 | ✅ |
| 11 | Abertura rápida (bandeiras = número) | 17 (só o caso certo) | ⚠️ faltam bandeiras a menos e bandeira errada → **TC-CM-20, 21** |
| 12 | Cronômetro começa no 1º clique e para no fim | 07, 12, 15 | ✅ |
| 13 | Derrota: mostra minas e bandeiras erradas, trava | 12, 14 | ✅ |
| 14 | Vitória = abrir as 212 seguras (bandeiras não contam); reiniciar | 15, 16 | ❌ falta "40 bandeiras certas não dão vitória" → **TC-CM-22** |

### TCs novos — Campo minado (todos com `minas=MINAS_COLUNAS`)

| ID | Dono / tarefa | Cenário | Parâmetros / passos | Resultado esperado |
|---|---|---|---|---|
| TC-CM-19 | Breno / B2 | A cascata não abre bandeira | Bandeira em 7-3 (sem mina), clicar 5-0 | 7-3 continua `bandeira`; 125 células `aberta`; contador 39 |
| TC-CM-20 | Breno / B5 | Abertura rápida com bandeiras a menos | Abrir 0-8 (valor 2), bandeira só em 0-9, clique duplo em 0-8 | 0-7, 1-7 e 1-8 continuam `fechada` |
| TC-CM-21 | Breno / B5 | Abertura rápida com bandeira errada | Abrir 0-8, bandeiras em 1-9 e 0-7 (errada), clique duplo em 0-8 | 0-9 = `mina-explodida`; "Você perdeu!"; 0-7 = `bandeira-errada` |
| TC-CM-22 | Breno / B4 | Bandeiras não dão vitória | Bandeira nas 40 minas, sem abrir nada | Sem "Você venceu!"; contador 0; células seguras continuam `fechada` |
| ajuste TC-CM-03 | Gustavo / G2 | Primeiro clique seguro | 50 repetições em vez de 20 | igual |

**Para que serve:** se o código dos jogos vai ser gerado só a partir dos testes, cada regra da seção 1 do PLANEJAMENTO.md tem um teste que a obriga a existir?

**Legenda**
- ✅ coberta, com exemplo suficiente para não dar para "decorar";
- ⚠️ coberta, mas com um exemplo só ou de forma parcial;
- ❌ sem teste;
- ❓ a regra não está definida no plano e precisa de uma decisão de vocês.

Mantenha esta matriz atualizada: todo TC novo entra na linha da regra que ele cobre. Uma regra sem TC não vai existir no jogo gerado.
