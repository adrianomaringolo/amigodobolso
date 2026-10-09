# Testes e2e (Playwright)

Cobrem o fluxo de **Dica de Amigo** (visão geral, série, artigo, marcar como lido), a navegação
(barra inferior no mobile, menu do topo no desktop), o acesso sem login e o **guia de instalação
no iOS** (Safari e Chrome).

Não precisam de Supabase real: `e2e/fixtures.ts` simula a sessão (cookie) e intercepta as chamadas
do navegador ao Supabase com dados em memória.

```bash
pnpm exec playwright install chromium   # uma vez
pnpm test:e2e                           # desktop + iPhone (Chromium); sobe o servidor sozinho
pnpm test:e2e --ui                      # modo interativo

# Safari de verdade (WebKit emulando iPhone) — recomendado rodar no macOS
pnpm exec playwright install webkit
pnpm test:e2e:ios
```

Variáveis úteis: `E2E_BASE_URL` (testar um servidor já rodando, ex.: preview da Vercel — precisa ter
o Supabase apontando para `http://127.0.0.1:54321`, então prefira o servidor local),
`PW_CHROMIUM_EXECUTABLE` (usar um Chromium já instalado), `CI=1` (faz `build` + `start`).
