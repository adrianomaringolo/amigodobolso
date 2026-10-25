import { AmountTypes, TransactionTypes } from '@/components/financial/financial.types'

const CATEGORIAS = Object.values(TransactionTypes).filter(
	(def) => def.type === AmountTypes.expanses,
)

const LISTA_CATEGORIAS = CATEGORIAS.map((def) => `${def.label} (${def.max}%)`).join(', ')

export const PASSOS = [
	'Crie sua conta grátis e informe quanto você ganha no mês.',
	'Lance o que entra e o que sai, cada gasto na sua categoria.',
	'Veja a bandeira de cada categoria: azul, amarela ou vermelha.',
]

export const PERGUNTAS = [
	{
		pergunta: 'O que é o Amigo do Bolso?',
		resposta:
			'É um aplicativo gratuito de controle de gastos pessoais para o celular. Você lança o que entra e o que sai, e cada categoria do mês mostra uma bandeira azul, amarela ou vermelha, como na conta de luz, para indicar se você está dentro do plano.',
	},
	{
		pergunta: 'O Amigo do Bolso é grátis?',
		resposta: 'Sim. Criar a conta e usar o aplicativo não custa nada.',
	},
	{
		pergunta: 'Como o app divide a minha renda?',
		resposta: `Pelo método Dolfyn, que reparte a renda do mês em seis categorias, cada uma com um alvo em porcentagem: ${LISTA_CATEGORIAS}. Quando a renda muda, os valores se ajustam sozinhos.`,
	},
	{
		pergunta: 'O que significam as bandeiras azul, amarela e vermelha?',
		resposta:
			'Cada categoria compara o que você gastou com o seu alvo do mês. Azul é dentro do plano, amarela é quando você já gastou 85% ou mais do alvo e vermelha é quando passou do alvo.',
	},
	{
		pergunta: 'Preciso conectar minha conta bancária?',
		resposta:
			'Não. O Amigo do Bolso não pede dados de contas bancárias nem se conecta a bancos: você mesmo lança as receitas e as despesas.',
	},
	{
		pergunta: 'Funciona no iPhone e no Android?',
		resposta:
			'Sim. É um aplicativo web que pode ser instalado na tela inicial do celular, em iPhone ou Android, e também funciona no navegador do computador.',
	},
	{
		pergunta: 'Como entro e o que acontece com os meus dados?',
		resposta:
			'Você entra com e-mail e senha ou com a conta Google. Seus lançamentos são seus: não vendemos dados nem usamos para publicidade, e você pode excluir a conta a qualquer momento pelo Perfil. Detalhes na Política de Privacidade.',
	},
]

export function ComoFunciona() {
	return (
		<div>
			<h2 className="text-3xl font-extrabold leading-tight tracking-[-0.025em] md:text-[2.5rem]">
				Como funciona
			</h2>
			<ol className="mt-5 border-t border-border">
				{PASSOS.map((passo, i) => (
					<li key={passo} className="flex items-start gap-4 border-b border-border py-3">
						<span className="tabular mt-0.5 text-sm font-bold text-primary">{i + 1}</span>
						<span className="text-sm text-foreground">{passo}</span>
					</li>
				))}
			</ol>
		</div>
	)
}

export function Faq() {
	return (
		<div>
			<h2 className="text-3xl font-extrabold leading-tight tracking-[-0.025em] md:text-[2.5rem]">
				Perguntas frequentes
			</h2>
			<div className="mt-5 border-t border-border">
				{PERGUNTAS.map(({ pergunta, resposta }) => (
					<details key={pergunta} className="group border-b border-border py-3">
						<summary className="cursor-pointer list-none text-sm font-semibold text-foreground marker:hidden">
							{pergunta}
						</summary>
						<p className="mt-2 text-sm leading-relaxed text-muted-foreground">
							{resposta}
						</p>
					</details>
				))}
			</div>
		</div>
	)
}
