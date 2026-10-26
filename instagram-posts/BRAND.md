# Instagram — Amigo do Bolso

Regras de identidade visual e voz para os posts do Instagram do Amigo do Bolso. A skill
`instagram-post` lê este arquivo como fonte de verdade. A identidade vem do app: `DESIGN.md`
(visual) e `PRODUCT.md` (produto, público, método) na raiz do repo mandam; este arquivo só
traduz os dois para o formato de post.

## Conta e marca

- **Sem @ nos slides.** A assinatura é o lockup (roundel + "Amigo do Bolso") e, no fecho, a URL.
- **O que é:** app gratuito, feito para o celular, que divide a renda do mês em seis categorias
  pelo **método Dolfyn** e mostra, como na conta de luz, a bandeira de cada uma: azul, amarela
  ou vermelha.
- **Para quem:** adulto assalariado de renda média, pouca familiaridade com finanças, que já
  tentou e largou planilha. A dor: "não sei pra onde vai o meu dinheiro".
- **Endereço do CTA:** `amigodobolso.vercel.app`.
- **Método:** sempre "método Dolfyn". As seis categorias, os nomes e os percentuais são do
  método licenciado e não mudam (ver tabela em "Regras de linguagem").

## Tipos de post

- **Lançamento / apresentação:** o problema, a resposta do app, convite para criar a conta.
- **Explicador:** um conceito do app por post (as bandeiras, o método, os medidores, parcelas).
- **Passo a passo:** como fazer algo no app, com telas reais.
- **Dica do Amigo:** educação financeira leve, ligada a uma categoria do método.

## Voz da marca

- **Tom:** amigo, simples, calmo, direto, confiável. Explica sem dar bronca.
- **Nunca:** culpar ou assustar com dinheiro ("você está falido"), jargão financeiro
  ("alocação", "portfólio"), promessa de enriquecer ou de resultado garantido, cara de banco
  digital ("revolucione suas finanças"), números de usuários, depoimentos ou imprensa
  (não existem: não invente).
- **Regras de linguagem inegociáveis:**
  - Nomes das categorias exatamente como no app: Necessidades Essenciais (55%), Tranquilidade
    Financeira (10%), Fazer Pelo Outro (5%), Diversão (10%), Compras de Longo Prazo (10%),
    Desenvolvimento Pessoal (10%).
  - Bandeiras: "no azul" (até 84% do alvo), "no amarelo" (de 85% a 100%), "no vermelho"
    (acima de 100%). Nunca "verde".
  - O app é grátis e é um app web instalável (PWA): "instala na tela do celular", nunca
    "baixe na App Store / Google Play".
  - Imperativo na forma culta: "Lance", "Comece", "Crie", "Acompanhe".
  - No máximo um travessão por slide.

## Paleta

### Papel (padrão)
| Papel | Hex |
|---|---|
| Fundo (papel de conta) | `#f7f5ef` + trama diagonal a ~2% |
| Painel (papel mais claro) | `#fcfbf7` |
| Tinta (texto) | `#16324f` |
| Tinta suave (texto secundário) | `#4d5f70` |
| Filete | `#d0ccc2` |
| Azul da marca (destaque, superfície) | `#09659c` |
| Laranja (ação: CTA e marcador ativo) | `#f28e38` |

### Campo azul (capa / fecho)
| Papel | Hex |
|---|---|
| Fundo | `#09659c` |
| Texto | `#f7f5ef` (6,3:1) |
| Texto suave | `#f7f5ef` a 75–88% |

### Bandeiras (só com significado)
| Bandeira | Cor | Texto | Fundo suave |
|---|---|---|---|
| Azul | `#09659c` | `#09659c` | `#deedf7` |
| Amarela | `#f0a017` | `#9a5f13` | `#f6ead4` |
| Vermelha | `#be2f26` | `#be2f26` | `#f6e2e0` |

- O laranja marca **uma** coisa por slide: o CTA ou o marcador ativo do carrossel. Nunca
  título, nunca fundo decorativo.
- Texto sobre laranja é tinta `#16324f`, nunca branco (branco não passa AA).
- Cor de bandeira nunca sozinha: sempre com a palavra ("no azul") e, se houver, o %.
- Bandeira azul nunca direto sobre o campo azul: vai dentro de um painel de papel.

## Tipografia

```html
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;600;700;800&family=Spline+Sans+Mono:wght@500;700&display=swap" rel="stylesheet">
```

- **Títulos:** Archivo 800, `-0.03em` a `-0.035em`, entrelinha ~1. Capa `112px`, slides `80px`.
- **Corpo:** Archivo 400, `38px`, entrelinha 1.4, tinta suave.
- **Rótulo (notice-label):** Archivo 600, `26px`, caixa alta, `0.09em`, tinta suave. É o
  "cabeçalho de campo" da conta: `O PROBLEMA`, `PASSO 1`.
- **Valores e medidas:** todo `R$`, `%` e leitura em Spline Sans Mono (tabular). Nunca dinheiro
  em Archivo.

## Elementos de marca

Tudo em `instagram-posts/assets/` (ver `ASSETS.md`); a base visual está em
`assets/css/slide.css`, que todo slide carrega.

- **Lockup:** roundel `assets/logos/logo.png` + "Amigo do Bolso" em Archivo 800. No campo azul
  pode ser `assets/logos/logo-negativo.png` (lockup branco).
- **Rodapé de todo slide:** linha picotada (boleto) + lockup pequeno à esquerda + marcador do
  carrossel à direita. Post único: sem marcador.
- **Marcador de carrossel:** quadradinhos de 14px, cantos de 2px; ativo laranja, inativos
  filete (papel) ou papel a 30% (campo azul).
- **CTA:** botão laranja, texto tinta em caixa alta, seta Lucide `arrow-right`.
- **Peças da conta:** painel com filete e sombra de folha, chip de bandeira, medidor
  (o `Gauge` do app: arco vermelho → amarelo → azul, ponteiro em tinta), linha picotada.
- **Telas do app:** dentro de um celular simples (moldura tinta), cortado na linha picotada do
  rodapé. Só telas da conta fictícia (Ana Souza) do script dos tutoriais.
- **Cantos:** quase retos (3–6px). Nada de pílula, exceto o celular.
- **Sombra:** azulada e longa, nunca cinza neutro; só em painel e celular.

## Ícones

- **Lucide** (https://lucide.dev), a mesma lib do app. Wrapper padrão (`viewBox="0 0 24 24"`,
  `stroke-width="2"`, caps e joins `round`), cor via `currentColor`. Nunca desenhar à mão.
- Ícones das categorias = os do app: `shopping-cart`, `piggy-bank`, `heart`, `smile`,
  `calendar-arrow-up`, `graduation-cap`.

## Fotos

- Não usamos foto de banco. A "foto" do post é a tela do app.

## Acessibilidade

- Proibido: branco sobre laranja; laranja como cor de texto corrido; amarelo `#f0a017` como
  texto (use `#9a5f13`).
- Mínimo AA (4,5:1) em todo corpo de texto.

## Estrutura de arquivos

| O quê | Caminho |
|---|---|
| HTML dos slides | `instagram-posts/html/post-NN/` |
| PNGs exportados + `caption.md` | `instagram-posts/output/post-NN/` |
| Assets compartilhados + índice | `instagram-posts/assets/` · `ASSETS.md` |
| CSS base dos slides | `instagram-posts/assets/css/slide.css` |
| Telas do app | `instagram-posts/assets/telas/` (origem: `public/tutoriais/`, script `scripts/tutorials/capture.mjs`) |
| Script de export | `node instagram-posts/scripts/export.mjs post-NN [--slides 1,3]` |
| Índice de posts | `instagram-posts/POSTS.md` |

Formato: **1080×1350**, carrossel de 5 a 7 slides (post único quando for uma frase ou dado).

## Referências no repo

- `DESIGN.md`, `PRODUCT.md`, `src/app/produto/page.tsx` (cópia da landing),
  `src/components/produto/experimente.tsx` (texto das bandeiras),
  `src/components/financial/financial.types.tsx` (categorias), `src/components/bandeira/`
  (bandeira e medidor).
