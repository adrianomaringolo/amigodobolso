import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/lib/site'

export const dynamic = 'force-static'

const BODY = `# ${SITE_NAME}

> ${SITE_DESCRIPTION}

${SITE_NAME} é um aplicativo gratuito de controle de gastos pessoais para o celular, em português do Brasil. A renda do mês é dividida em seis categorias, cada uma com um alvo em porcentagem (método Dolfyn), e cada categoria mostra uma bandeira azul, amarela ou vermelha conforme o quanto já foi gasto. O app não se conecta a bancos: os lançamentos são feitos pelo próprio usuário.

## Páginas públicas

- [Sobre o app e perguntas frequentes](${SITE_URL}/produto): o que é, como funciona, o método e respostas diretas
- [Termos de uso](${SITE_URL}/termos-de-uso)
- [Política de privacidade](${SITE_URL}/politica-de-privacidade)

## Quem faz

- [Dolfyn](https://dolfyn.com.br/): site oficial do método e da empresa responsável
- [Instagram](https://www.instagram.com/dolfynoficial/)
- [LinkedIn](https://www.linkedin.com/company/dolfynoficial)
- Contato: contato@dolfyn.com.br
`

export function GET() {
	return new Response(BODY, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
}
