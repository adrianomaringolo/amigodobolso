# Assets compartilhados dos posts

Arquivos reutilizáveis entre posts. Os slides apontam para eles por path relativo
(`../../assets/...` a partir de `html/post-NN/`). Não copie para a pasta do post.

| Arquivo | O que é | Quando usar | Notas de uso |
|---|---|---|---|
| `css/slide.css` | Base dos slides: tokens, fontes, papel, campo azul, painel, chip, CTA, celular, rodapé | Todo slide | `<link rel="stylesheet" href="../../assets/css/slide.css">` + `body.paper` ou `body.field` |
| `logos/logo.png` | Roundel laranja (calculadora + seta), 500×500 | Rodapé e capa, junto do nome em Archivo 800 | Fixe só a altura |
| `logos/logo-negativo.png` | Lockup branco (roundel + nome), 529×128 | Campo azul, quando o nome vai em imagem | Só sobre fundo escuro |
| `icons/bandeira-azul.svg` | Bandeira do app (mastro + flâmula), azul | Estado "no azul" | Cor fixa: pode ir por `<img>`. Nunca sobre o campo azul |
| `icons/bandeira-amarela.svg` | Bandeira amarela | Estado "no amarelo" | Idem |
| `icons/bandeira-vermelha.svg` | Bandeira vermelha | Estado "no vermelho" | Idem |
| `telas/lancamentos-lista.png` | Tela Lançamentos (conta fictícia), 780×1688 | Mostrar o mês dia a dia | Dentro de `.phone` |
| `telas/lancar-receita.png` | Formulário de receita | Passo "lance a receita" | Idem |
| `telas/lancar-despesa.png` | Formulário de despesa preenchido | Passo "lance a despesa" | Idem |
| `telas/lancar-escolher-categoria.png` | Lista das seis categorias no formulário | Método / categorias | Idem |
| `telas/relatorios-resumo.png` | Relatórios: receitas, despesas, balanço | Visão do mês | Idem |
| `telas/relatorios-medidores.png` | Os seis medidores | Bandeiras / medidores | Idem |
| `telas/relatorios-quanto-falta.png` | Tabela real / ideal / a completar | Método em reais | Idem |

As telas vêm de `public/tutoriais/` (script `scripts/tutorials/capture.mjs`, conta fictícia).
Se o app mudar, recapture lá e copie de novo para cá.
