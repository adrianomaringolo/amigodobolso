---
name: Amigo do Bolso
description: A conta de serviço público aplicada ao dinheiro do mês — cada categoria hasteia uma bandeira verde, amarela ou vermelha.
colors:
  bill-paper: "#f7f5ef"
  panel-paper: "#fcfbf7"
  institutional-blue: "#16324f"
  ink-muted: "#4d5f70"
  action-orange: "#ef7d24"
  hairline: "#d0ccc2"
  field-stroke: "#c1bbae"
  flag-green: "#29704f"
  flag-green-soft: "#dcefe6"
  flag-amber: "#9a5f13"
  flag-amber-fill: "#f0a017"
  flag-amber-soft: "#f6ead4"
  flag-red: "#be2f26"
  flag-red-soft: "#f6e2e0"
  income-blue: "#2b5f9d"
  expense-red: "#b23a30"
typography:
  headline:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 700
    lineHeight: 1.35
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: "normal"
  label:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0.09em"
  reading:
    fontFamily: "Spline Sans Mono, ui-monospace, SF Mono, monospace"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "-0.01em"
    fontFeature: "tabular-nums lining-nums"
rounded:
  sm: "1px"
  md: "3px"
  lg: "4px"
spacing:
  xs: "6px"
  sm: "10px"
  md: "16px"
  lg: "24px"
  xl: "40px"
components:
  button-primary:
    backgroundColor: "{colors.action-orange}"
    textColor: "#ffffff"
    rounded: "{rounded.lg}"
    padding: "12px 16px"
  button-secondary:
    backgroundColor: "{colors.institutional-blue}"
    textColor: "{colors.bill-paper}"
    rounded: "{rounded.lg}"
    padding: "10px 16px"
  button-outline:
    backgroundColor: "{colors.panel-paper}"
    textColor: "{colors.institutional-blue}"
    rounded: "{rounded.lg}"
    padding: "10px 16px"
  panel:
    backgroundColor: "{colors.panel-paper}"
    textColor: "{colors.institutional-blue}"
    rounded: "{rounded.lg}"
    padding: "14px 16px"
  input:
    backgroundColor: "{colors.panel-paper}"
    textColor: "{colors.institutional-blue}"
    rounded: "{rounded.lg}"
    padding: "10px 12px"
  flag-chip-red:
    backgroundColor: "{colors.flag-red-soft}"
    textColor: "{colors.flag-red}"
    rounded: "{rounded.sm}"
    padding: "2px 6px"
---

# Design System: Amigo do Bolso

## Overview

**Creative North Star: "A conta de luz do seu mês"**

Amigo do Bolso is built to look and read like a Brazilian utility bill — a `conta de serviço público`. The ground is recycled bill paper, the ink is an institutional deep blue, the numbers are set in a tabular monospace like a meter reading, and every section is a labeled, ruled field. The one loud colour in the system is not a brand colour — it is the `bandeira tarifária`: the verde / amarela / vermelha escalation flag that every Brazilian already reads on the back of the electric bill. Each budget category flies one of those flags against its target, and the month as a whole flies one too.

The design deliberately refuses the personal-finance category default: no fintech gradient, no donut-chart dashboard, no giant balance number as the hero. The reading that matters is *"estou dentro do plano?"* — a flag and a bar against a shared tick — and the raw reais are always secondary to it. Energy comes from the flag system and the density of a real statement, never from decoration.

Anti-references (confirmed): the neobank look (saturated purple, glossy rounded cards), the trading-app look (near-black + neon), and the spreadsheet/ledger-grid look. The audience is a salaried middle-income Brazilian with little finance literacy; the surface must feel official and calm, never slick and never intimidating.

**Key Characteristics:**
- Warm bill-paper ground with a faint diagonal security-tint hatch; institutional-blue ink.
- One action colour (`Amigo do Bolso` orange), reserved for the single primary action.
- The bandeira (green/amber/red) is functional-only and appears one flag per category.
- Every monetary or measured value is tabular monospace; labels are small-caps official-notice type.
- Near-square corners, ruled hairlines, perforated (`boleto`-style) dashed edges. Flat by default.

## Colors

A restrained shell — paper, blue ink, one orange action — with a strictly semantic three-colour flag layer laid on top.

### Primary
- **Institutional Blue** (`#16324f`): the ink of the whole system. Masthead fill, all headings and body text, meter target ticks, rules and meter-frame lines, the secondary (`Entrar`) button, income figures.
- **Amigo do Bolso Orange** (`#ef7d24`): the one action colour. The `+ Lançar` control (fixed bottom bar and the tracker button), the active nav underline, active tab underline, links, focus rings, avatar fallback. Never used as a fill for anything that isn't a primary action or active-state marker.

### Secondary — the bandeira (semantic status only)
- **Bandeira Verde** (`#29704f`, soft `#dcefe6`): category comfortably under target (< 85% of alvo).
- **Bandeira Amarela** (text `#9a5f13`, fill `#f0a017`, soft `#f6ead4`): category approaching target (85–100%).
- **Bandeira Vermelha** (`#be2f26`, soft `#f6e2e0`): category over target (> 100%). Also the destructive colour and the negative-money colour (`expense`, `sobra` negative).

### Neutral
- **Bill Paper** (`#f7f5ef`): the page ground. Carries a fixed diagonal `repeating-linear-gradient` hatch at ~2% opacity — the security tint of a real bill.
- **Panel Paper** (`#fcfbf7`): raised statement panels, inputs, cards. A shade lighter than the ground.
- **Ink Muted** (`#4d5f70`): secondary text — tinted from the blue, never a flat gray.
- **Hairline** (`#d0ccc2`): every rule, panel border, list divider. Pencil-line-on-paper weight (1px).
- **Field Stroke** (`#c1bbae`): input borders, slightly darker than hairlines.
- **Tooltip ink** (`--tooltip` ≈ `hsl(209 54% 15%)`, text `--tooltip-foreground` ≈ paper): the one dark surface in the system — a small ink chip. Only the tooltip primitive uses it (buildgrid-ui reads `bg-tooltip` / `text-tooltip-foreground`).

### Named Rules
**The One Action Rule.** Orange (`#ef7d24`) marks exactly one thing per screen: the primary action, plus the active-state markers that point at navigation. It is never a decorative fill, a heading colour, or a second CTA. On the login screen the submit button stays institutional blue — the "one action" is the in-app `Lançar`, and auth is a different context.

**The Flag-Never-Alone Rule.** A bandeira colour never carries meaning by itself. Every flag ships with its word (`no verde` / `no amarelo` / `no vermelho`) and its percentage, and an inline flag-pennant SVG. Colour is the third signal, not the only one.

**The Two Grounds Rule.** Only two paper values exist: `bill-paper` for the page, `panel-paper` for anything raised. No third surface tone, no tinted category backgrounds behind content (soft flag tints are allowed only inside a chip or a flag column).

## Typography

**Display / UI Font:** Archivo (with `ui-sans-serif, system-ui, sans-serif`) — self-hosted via `next/font`.
**Reading Font:** Spline Sans Mono (with `ui-monospace, "SF Mono", monospace`) — self-hosted via `next/font`.

**Character:** Archivo is a grotesque with an official-notice stiffness — it reads like the label print on a government form, which is exactly the register. Spline Sans Mono is a warm, humanist monospace: it carries every number without looking like a terminal. The pairing is "utility statement": form labels in the grotesque, meter readings in the mono.

### Hierarchy
- **Headline** (Archivo 700, 1.25rem / `-0.02em`, `text-wrap: balance`): page titles (`Lançamentos`, `Relatórios`), the greeting (`Olá, Maria`).
- **Title** (Archivo 700, 1.125rem): the month bandeira sentence (`Alguma categoria passou do plano`), dialog titles.
- **Body** (Archivo 400, 0.875rem, 1.55): explanatory prose (Ajuda, help text, form descriptions). Keep help prose to ~65–75ch.
- **Label** — the "notice-label" (Archivo 600, 0.6875rem, `letter-spacing: 0.09em`, uppercase, `ink-muted`): the recurring device of the whole system. Panel headers (`OS SEIS MEDIDORES`), field labels (`E-MAIL`, `MÊS DE REFERÊNCIA`), category names inside a medidor, small captions (`gasto / alvo do mês`). Used with `!normal-case !tracking-normal` overrides when it needs to read as a plain caption rather than a stamped label.
- **Reading** (Spline Sans Mono 500, tabular-nums): every `R$` value, every `gasto / alvo` pair, histogram month labels, running day balances, the `%` inside a flag chip. Applied via `.tabular` / `[data-reading]`.

### Named Rules
**The Meter-Reading Rule.** If a value is money or a measurement, it is set in Spline Sans Mono with `font-variant-numeric: tabular-nums`. Never set a currency figure in Archivo. Never set running prose in the mono.

**The Notice-Label Rule.** Section titles and field labels are the small-caps `notice-label`, not `<h2>`-scale headings. The label *is* the heading in a statement layout — it is a functional field label, not a decorative eyebrow, and it never sits above a redundant larger title.

## Layout

Single-column statement, centred. The app shell is `max-w-5xl` (64rem); the masthead, main content, and footer all align to that width. Content padding is `px-4` on mobile, `px-6` on desktop, with `pb-28` on mobile to clear the fixed bottom bar.

The dashboard is the one two-column layout: at `lg` it splits into `[1.4fr_1fr]` — the six medidores on the left, the secondary panels (`Maiores despesas`, `Pendentes`) stacked on the right. Everything else is a single column. Reports, Ajuda, and the profile use their own inner `max-w` (`max-w-xl` for profile).

Spacing rhythm: sections separated by `space-y-5` / `space-y-6`; inside a panel, rows are `py-2.5`–`py-3.5`; a heading gets more space above than below. Panels are edge-to-edge bordered blocks, never floating cards with large gaps.

Responsive: mobile shows no top nav (a fixed 5-slot bottom bar carries it, with the orange `Lançar` action raised in the centre); desktop shows the horizontal nav in the masthead and hides the bottom bar. Auth screens are a two-pane split at `md` (institutional-blue pitch panel left, form on paper right), stacked on mobile.

## Elevation & Depth

Flat by default. This is paper — depth is conveyed by ruled hairlines, the two paper values, and the perforated edges, not by shadow.

### Shadow Vocabulary
- **`shadow-bill`** (`0 1px 0 0 hsl(hairline), 0 8px 24px -16px hsl(209 40% 20% / 0.28)`): the only ambient shadow. A hairline seat plus a very soft, far-offset drop — a statement lying on a desk. Applied to statement panels and the month bandeira.
- **`shadow-bill-raised`** (`0 1px 0 0 hsl(hairline), 0 18px 40px -20px hsl(209 40% 20% / 0.35)`): the fixed bottom-bar `Lançar` button only.

### Named Rules
**The Paper Rule.** Surfaces do not lift on hover. Interactive rows respond with a `bg-secondary/40` tint and, where present, a 2px translate on a chevron — never a shadow change, never a scale.

## Shapes

Near-square. Radius scale is `1px` / `3px` / `4px` (`--radius: 0.25rem`, minus 1–2px for the smaller steps). Nothing in the system is pill-shaped or `rounded-full` except the user avatar and the bottom-bar active-tab dash.

Recurring geometry:
- **Ruled hairlines** (1px `hairline`): every panel border, list divider, section rule.
- **Perforated edge** (`.edge-perf`): a 6px-on / 6px-off dashed 1px line — the `boleto` tear line. Sits under the masthead, over the footer, over the mobile bottom bar.
- **The flag pennant**: a swallowtail SVG (`M6.2 3H44l-9.5 10.5L44 24H6.2z`) on a faint pole. The single non-rectilinear shape in the system.
- **The icon plate**: category icons sit in a 36px bordered square tinted with the category's current flag-soft colour.

## Components

### Buttons
- **Shape:** near-square (`4px` / `rounded-lg`).
- **Primary (`+ Lançar`):** `action-orange` fill, white text, uppercase bold `tracking-wide`, `px-4 py-3`. This is the only orange fill in the app. Hover `bg-accent/90`.
- **Secondary (`Entrar`, dialog confirms):** `institutional-blue` fill, paper text, `size="lg"`.
- **Outline (`Editar`, `Alterar senha`):** `panel-paper` fill, blue text, hairline border.
- **Focus:** 2px `action-orange` outline, `outline-offset: 2px` — system-wide via `:focus-visible`.

### Chips — the bandeira tag
- **Style:** flag-soft background, flag-colour text, 1px flag-colour border, near-square. Inline flag-pennant SVG + uppercase `chip` word + tabular `%`. Sizes `sm` (0.6875rem) and `md` (0.75rem).
- **State:** not a filter chip — it is a read-only status marker. One per category, one for the month.

### Cards / Containers — the statement panel
- **Corner Style:** `4px`.
- **Background:** `panel-paper`; header strip and body separated by a hairline.
- **Header:** a `notice-label` title left, an optional plain-caption aside right, `py-2.5`.
- **Shadow:** `shadow-bill` (see Elevation).
- **Border:** 1px `hairline`, always.
- **Internal Padding:** `px-4`; body `py-3.5`, or `px-0 py-0` when the body is a divided list.

### Inputs / Fields
- **Style:** `panel-paper` fill, 1px `field-stroke` border, `4px` radius, `px-3 py-2.5`. Label above is a `notice-label`.
- **Focus:** border shifts to `action-orange` + the global 2px focus outline. `accent-color` and `caret-color` are orange system-wide.
- **Disabled:** muted, from the buildgrid-ui default reading the tokens.

### Navigation
- **Masthead (desktop):** `institutional-blue` bar, `logo-letter-white.png` mark, nav links in Archivo 500 0.875rem at `primary-foreground/70`, active link gets an `action-orange` 2px bottom border and full-opacity text. A perforated edge closes the bar.
- **Bottom bar (mobile):** fixed, `panel-paper`, 5 slots (`Início`, `Lançamentos`, `[+ Lançar]`, `Relatórios`, `Perfil`). The centre `Lançar` is a raised `action-orange` square (`-mt-4`, `shadow-bill-raised`). Active tab: orange icon + label + a 20px orange dash underline.
- **Tabs (Relatórios, Ajuda):** ruled — a hairline under the list, active trigger gets an `action-orange` 2px underline, no pill/box/shadow. Enforced via the `billTabsList` / `billTabsTrigger` class constants (heavy `!` overrides on the buildgrid-ui defaults).

### Signature Component — O Medidor
The category meter row. Left: the icon plate (flag-soft tinted). Body: category name (`notice-label`) + `alvo %` caption; `gasto / alvo` in mono + the bandeira tag; the meter bar; the 6-month `consumo` histogram.
- **Meter bar (`MedidorBar`):** a `secondary` track with a coloured fill (flag colour). Every category's target sits at a fixed **72% of the track** — one shared scale — marked by a bare 2px `institutional-blue` tick (no text label). Overrun fills toward 100% of the track in solid flag-red.
- **Consumo histogram (`ConsumoHistograma`):** short bars (~22px max), one per recent month. Past months `bg-primary/20`, current month `bg-primary/70`, any over-target month `bg-flag-red/70`. Labelled `consumo`.

### Signature Component — A Bandeira Geral
The month headline. A flag-soft column (`sm:w-44`) with the flag pennant at 52px + `Bandeira do mês` / `no vermelho`; then the plain-language status sentence and the `plano` / `gasto` / `sobra` readings in mono. The flag has a one-time `flag-raise` entrance (translate + scaleY from 0 opacity, 0.45s ease-out).

### Signature Component — Filtro (statement filter bar)
A statement panel titled `FILTRAR` above the Lançamentos ledger. Search input with a leading `Search` icon (matches description / notes / tags), two ruled `Select`s (category, day), and a `Só pendentes` toggle rendered as a bordered button with a square check that turns `flag-amber-fill` when active. A `Limpar` link (accent) appears only while filtering, and a `N de M lançamentos` count line closes the panel. All controls are 36px tall, square, `border-input`, `bg-card`. The month's `Fechamento` summary always reflects **all** entries, never the filtered set.

### Signature Component — Tags
Free-form labels on an entry. **Display** (`TagList`): read-only `#tag` chips — `border-border`, `bg-secondary`, `text-muted-foreground`, near-square, `0.625–0.6875rem`. **Entry** (`TagField`): a bordered field (orange focus) holding removable chips + a text input, with a `bg-popover` suggestion dropdown fed by the `user_tags` view (the user's existing tags, most-used first). Type to filter; Enter / click adds an existing tag or a new one (`Criar «…»`), Backspace on empty removes the last. Tags are normalised to trimmed lowercase, max 32 chars.

## Do's and Don'ts

### Do:
- **Do** set every `R$` value, percentage, and measurement in Spline Sans Mono with `tabular-nums`.
- **Do** pair every bandeira colour with its word and its `%` — colour is never the only signal.
- **Do** keep all six category meters on the one shared scale: target at 72% of the track, always marked by the bare tick.
- **Do** use the `notice-label` (uppercase, `0.09em`, `ink-muted`) for section titles and field labels.
- **Do** build sections as edge-to-edge bordered statement panels with a hairline header rule.
- **Do** reserve `action-orange` (`#ef7d24`) for the single primary action and the active-nav markers.
- **Do** keep surfaces flat — hover is a `bg-secondary/40` tint, never a shadow or lift.

- **Do** render tags as `#tag` chips (`TagList`) — neutral, never coloured by category.

### Don't:
- **Don't** introduce a donut / pie chart, a fintech gradient, or a giant balance number as a screen hero. The bandeira reading is the hero.
- **Don't** add a third paper tone or a tinted category background behind content.
- **Don't** use `action-orange` as a decorative fill, a heading colour, or a second CTA on the same screen.
- **Don't** set currency or data figures in Archivo, or running prose in the monospace.
- **Don't** give category meters private scales — the shared 72% target tick is what makes them comparable.
- **Don't** use `rounded-full` or pill shapes except the avatar; the system is near-square.
- **Don't** reach for the AI-cluster renditions this world attracts (warm cream + serif display + terracotta): the ground is newsprint bill-paper, the type is a grotesque, the accent is a utility-flag system.

<!-- Not canonized: the `year-bar-chart` and `distribution bar` are plain-div charts (no chart lib) — kept as an implementation note, not a system rule; a future charting need should follow the same "CSS bars in the bill palette, no library" approach. The `needle-settle` keyframe and a `mostrador de medidor` (rotary meter dial) named in the direction's quality bar were dropped in favour of the horizontal bar + tick; a dial remains an open enhancement, not a debt. -->
