# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

<!-- Installable PWA, used predominantly on phones. Design mobile-first; the
codebase is Next.js 15 (App Router) + Tailwind + the `buildgrid-ui` component
library + Supabase. Not a native app. -->

## Users

Primary user: a salaried Brazilian adult on a middle income with little
familiarity with personal finance. Their driving frustration is "não sei pra
onde vai o meu dinheiro" — money disappears each month and they can't say why.
They have tried and abandoned spreadsheets. They want a sense of control
without accounting knowledge, in light everyday language, mostly from their
phone.

Status: MVP seeking validation with real users. It must feel trustworthy and
finished, but the team iterates fast.

## Product Purpose

Amigo do Bolso turns a monthly income into a spending plan split across six
life categories and then shows, in plain terms, how "hot" each category is
running against its target. Success = the user logs their income and expenses
for a month, understands where the money went, and comes back the next month.

## Positioning

Built around a licensed third-party budgeting methodology from **No Final das
Contas** (partnership / license in place). The method assigns each expense to
one of six categories, each with a target share of monthly income:

| Category (PT-BR) | Key | Target % of income |
|---|---|---|
| Necessidades essenciais | `essential` | 55 |
| Tranquilidade financeira | `financial-security` | 10 |
| Fazer pelo outro | `charity` | 5 |
| Lazer | `leisure` | 10 |
| Compras de longo prazo | `long-term` | 10 |
| Desenvolvimento pessoal | `personal-growth` | 10 |

Category names, keys, and target percentages are **fixed by the licensed
method** and must not be renamed, re-weighted, merged, or dropped in a
redesign. Income is its own type (`income`).

The signature interpretive layer is the **termômetro / gauge**: a
green → orange → red scale showing how far a category's spending has gone
toward (and past) its target. This metaphor is core to the product identity
and must survive the redesign (its exact visual form is open).

## Operating Context

- Monthly cycle. The user picks a month/year and works within it.
- Core loop: add an entry (amount, description, category, date, "pago /
  pendente", optional notes and installments), see it grouped by day, watch
  category gauges and the month summary update.
- Surfaces today: **Início** (dashboard of cards: shortcuts, category alerts,
  month summary, expenses by category, top expenses, pending expenses),
  **Lançamentos** (month navigator + day-grouped tracker with add/edit/delete),
  **Relatórios** (tabs: Despesas, Mapa, Anual — charts via Recharts),
  **Ajuda / Como usar** (explains each category), **Perfil**, **Admin** (user
  table, admin-gated).
- Auth: email + password, plus "Acessar com Google" (Supabase OAuth).
  Supporting screens: login, cadastro, recuperar senha, redefinir senha,
  erro de autenticação. Public: termos de uso, política de privacidade.

## Capabilities and Constraints

- Stack is fixed: Next.js 15 App Router, React 19, Tailwind 3, `buildgrid-ui`
  (shared component library — primitives like Card, Tabs, Dialog, Sidebar,
  MonthNavigator come from it), Supabase (auth + `entries` table),
  TanStack Query, react-hook-form + zod, Recharts, `lucide-react` icons,
  `next-pwa`.
- All amounts in BRL; dates and copy in pt-BR (`date-fns` + `ptBR` locale).
- Entry shape: `{ id, amount, description, notes?, times?, isCompleted,
  date, createdAt, category }`.
- `isCompleted` distinguishes paid vs. pending (scheduled) entries.
- PWA install prompt is a real feature (`InstallPWAButton`).
- Known unfinished areas: change-password and delete-account on Perfil are
  stubs; Admin role detection is currently hardcoded off; some Ajuda tabs are
  placeholder text.
- No i18n layer — pt-BR only, by decision.

## Brand Commitments

- Name: **Amigo do Bolso** (kept).
- Logo assets kept: `public/logo.png` (blue roundel: calculator + rising
  orange arrow), `public/logo-drawing.svg` (full lockup), and
  `public/logo-letter-white.png` (mark for dark backgrounds). Brand mark
  palette in the art: blue `#295f9d`, orange `#ee9931`/`#ff7827`, red accent
  `#cc232a`.
- Co-branding with **No Final das Contas** exists under license; their brand
  assets (colors, logo, guidelines) are not yet on hand and must be supplied
  before any "em parceria com" lockup is designed. Until then treat the
  partnership as an endorsement line, not a visual takeover.
- Voice today is warm and first-person ("Olá, {nome} 👋", "Amigo do Bolso").
  Keep it friendly and plainspoken, never scolding about money.

## Evidence on Hand

- Full working app with real screens and components (see Operating Context).
- Category definitions and educational copy: `src/components/financial/
  financial.types.tsx`.
- Logo art in `public/`. No screenshots, testimonials, user counts, press, or
  marketing copy exist yet — do not fabricate them.
- No No Final das Contas brand assets on hand yet.

## Product Principles

1. **Plano antes de planilha.** The user should feel guided by a plan, not
   asked to do bookkeeping. Every screen answers "estou dentro do plano?"
   before it shows raw numbers.
2. **O termômetro é a verdade.** Category health (green → red vs. target) is
   the primary signal on every surface; exact reais are secondary.
3. **Linguagem de amigo.** Plain, warm pt-BR. Explain, never lecture or shame.
4. **O mês é a unidade.** Everything is scoped to the selected month; moving
   between months must be effortless.
5. **Método licenciado, intocável.** The six categories, their keys, and their
   target percentages come from No Final das Contas and are not product
   decisions to revisit.

## Accessibility & Inclusion

No formal standard established. Practical needs from the audience: legible on
small/older phones, high-contrast money states, gauges that never rely on
color alone (pair with numeric % and label), large touch targets for the
add-entry loop.
