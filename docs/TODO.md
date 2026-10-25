# TODOs e sugestões

Lista viva do que falta fazer e do que vale considerar. Itens marcados com `[ ]` estão em aberto. Prioridade: **P1** antes de abrir para mais usuários, **P2** próximo ciclo, **P3** quando houver tempo.

## TODOs

### E-mail e autenticação

- [ ] **P1 · Configurar SMTP próprio no Supabase.** Hoje os e-mails saem do servidor padrão do Supabase, com remetente genérico, limite baixo de envios por hora e risco de cair em spam. Passos:
  - Escolher o provedor (Resend, Postmark, Amazon SES ou Brevo) e criar a conta.
  - Verificar o domínio `dolfyn.com.br` no provedor e publicar no DNS os registros SPF, DKIM e DMARC.
  - Criar uma conta SMTP/API key no provedor.
  - No Supabase: Dashboard → Authentication → Emails → SMTP Settings → ativar "Custom SMTP". Preencher host, porta, usuário, senha, e-mail e nome do remetente (por exemplo `Amigo do Bolso <nao-responder@dolfyn.com.br>`).
  - Ajustar o limite de envios por hora em Authentication → Rate Limits.
  - Testar o fluxo "Esqueci minha senha" ponta a ponta e conferir se o e-mail não cai em spam.
  - Para o ambiente local, descomentar `[auth.email.smtp]` em `supabase/config.toml` com a senha vinda de variável de ambiente (`env(...)`), nunca no arquivo.
- [ ] **P1 · Publicar o template de reset de senha.** O HTML está em `supabase/templates/recovery.html` e no `config.toml`, mas isso só vale no Supabase local. Em produção, colar o HTML em Authentication → Emails → Reset password (ou usar `supabase config push`). Conferir antes se a URL do logo no template aponta para o domínio de produção.
- [ ] **P2 · Criar os demais templates de e-mail:** confirmação de cadastro, link mágico (se for usado), troca de e-mail e aviso de senha alterada (`password_changed_notification`). Reaproveitar o layout do `recovery.html`.
- [ ] **P2 · Definir o `site_url` e as URLs de redirecionamento** do Supabase para produção. O `config.toml` ainda aponta para `http://127.0.0.1:3000`.
- [ ] **P3 · Mostrar/ocultar senha:** conferir o comportamento no iOS e no Android (foco do campo, teclado) e ajustar o login para usar o mesmo componente dos outros formulários, se fizer sentido.

### Jurídico e privacidade

- [ ] **P1 · Conferir os DPAs** firmados com Supabase e Vercel e guardar uma cópia. A Política de Privacidade (seção 5) afirma que a transferência internacional se apoia neles.
- [ ] **P1 · Rever a Política de Privacidade e os Termos de Uso com um advogado** antes de divulgar em larga escala. O texto veio de um rascunho com notas internas, resolvidas em 25/10/2026.
- [ ] **P2 · Decidir sobre verificação de idade.** A política diz que o app é para maiores de 18 anos, mas não há nenhum controle. Pode ser uma confirmação no cadastro.
- [ ] **P2 · Registrar o aceite dos termos** (data e versão) no cadastro, em vez de só exibir o checkbox.
- [ ] **P3 · Indicar o encarregado (DPO)** ou formalizar a dispensa conforme a regulamentação da ANPD para agentes de pequeno porte.

### Dados e infraestrutura

- [ ] **P1 · Configurar backups.** Hoje não há backup automatizado, e a Política de Privacidade diz isso. Avaliar o plano Pro do Supabase (backups diários e point-in-time recovery). Se ativar, **atualizar a seção 8 da política antes**.
- [ ] **P1 · Ligar o domínio `amigodobolso.dolfyn.com.br`:** adicionar o domínio no projeto da Vercel, criar o registro DNS, definir `NEXT_PUBLIC_SITE_URL=https://amigodobolso.dolfyn.com.br` e redirecionar o endereço `vercel.app` para ele. O código já usa o novo domínio como padrão (`src/lib/site.ts`).
- [ ] **P1 · Atualizar as URLs no Supabase e no Google** para o novo domínio: Site URL e Redirect URLs (Authentication → URL Configuration) e as origens/redirects do login Google.
- [ ] **P2 · SEO:** cadastrar o domínio no Google Search Console, enviar `/sitemap.xml` e conferir o compartilhamento com o depurador de links.
- [ ] **P2 · Monitoramento de erros** (por exemplo Sentry). Hoje um erro em produção só aparece se o usuário contar. Se entrar, atualizar a seção 6 da política (hoje diz que não há ferramenta de rastreamento).
- [ ] **P3 · Alertas de uso** no Supabase e na Vercel (banco, banda, e-mails).
- [ ] **P3 · Gerenciar o `public/sw.js` e o `workbox-*.js`.** São gerados pelo `next-pwa` e estão no repositório. Avaliar colocar no `.gitignore` para evitar ruído nos commits.

### Qualidade e código

- [ ] **P2 · Rodar o Prettier no projeto inteiro em um commit só.** Vários arquivos (como `src/app/login/page.tsx` e o perfil) não estão no formato do Prettier, e qualquer edição acaba reformatando linhas alheias.
- [ ] **P2 · Testes e2e para os fluxos de conta:** cadastro, login, recuperar senha, excluir conta e logout (que agora leva para `/produto`). Hoje existem testes de educação, navegação e instalação (`e2e/`).
- [ ] **P2 · Rodar os testes e2e no CI** (GitHub Actions), se ainda não rodam, bloqueando o merge em caso de falha.
- [ ] **P3 · Trocar o README**, que ainda é o texto padrão do `create-next-app`, por instruções reais: como rodar o Supabase local, variáveis de ambiente, migrations, testes e captura de tutoriais.
- [ ] **P3 · Documentar o `.env.example`** com a função de cada variável.

## Sugestões

### Produto

- **Lembrete mensal por e-mail ou notificação push**, no início do mês e quando houver lançamentos pendentes vencendo. Ataca diretamente o objetivo do produto: o usuário voltar no mês seguinte. Exige o SMTP configurado.
- **Resumo mensal por e-mail** com o termômetro de cada categoria no fechamento do mês.
- **Exportar os dados (CSV)**. Além de atender ao direito de portabilidade da LGPD, dá confiança a quem vem de planilha.
- **Importar lançamentos de planilha** para facilitar a migração de quem já controlava no Excel.
- **Lançamentos recorrentes** (aluguel, assinaturas) para reduzir o trabalho mensal, aproveitando a lógica de parcelas.
- **Login sem senha** (link mágico) como alternativa, já que o público tem pouca familiaridade com ferramentas financeiras e esquece senhas.
- **Ajuda dentro do fluxo:** abrir o tutorial certo a partir da tela onde o usuário está.

### Crescimento e conteúdo

- **Página de produto e SEO:** a rota `/produto` agora é o destino ao sair. Vale cuidar de título, descrição, imagem de compartilhamento e de um chamado claro para criar conta.
- **Eventos de uso anônimos** (por exemplo Plausible ou Umami, sem cookies) para medir cadastro, primeiro lançamento e retorno no mês seguinte. Se entrar, atualizar a seção 6 da política.
- **Coletar feedback no app** com um botão simples, já que o produto está em validação com usuários reais.
- **Série de posts e vídeo do produto** reaproveitando as capturas dos tutoriais.

### Técnico

- **Convidar testadores** com um ambiente de preview na Vercel ligado a um projeto Supabase separado do de produção.
- **Política de migrations:** revisar cada migration em um branch do Supabase antes de aplicar em produção.
- **Acessibilidade:** passar um leitor de tela e uma checagem de contraste nas telas principais, em especial nas bandeiras do termômetro, que não podem depender só da cor.
