export const Terms = () => {
	const pClasses = 'mb-2'
	const h2Classes = 'text-lg font-semibold mt-4 mb-2'

	return (
		<section>
			<h1 className="text-xl font-semibold mb-4">Termos de Uso do Amigo do Bolso</h1>

			<p className={pClasses}>
				Bem-vindo ao Amigo do Bolso! Ao utilizar nosso aplicativo, você concorda com os
				termos e condições descritos abaixo. Leia-os com atenção.
			</p>

			<h2 className={h2Classes}>1. Uso do Aplicativo</h2>
			<p className={pClasses}>
				O Amigo do Bolso permite que você registre suas despesas e receitas e visualize
				essas informações por meio de relatórios detalhados. O uso do aplicativo é
				destinado apenas para controle financeiro pessoal, e seu conteúdo não deve ser
				utilizado para fins comerciais ou profissionais sem nossa autorização.
			</p>

			<h2 className={h2Classes}>2. Registro de Informações</h2>
			<p className={pClasses}>
				As informações de receitas e despesas que você insere no Amigo do Bolso são de sua
				responsabilidade. O aplicativo oferece uma plataforma para registrar e visualizar
				seus dados financeiros, mas não é responsável pela precisão ou integridade dos
				dados inseridos.
			</p>

			<h2 className={h2Classes}>3. Privacidade e Segurança</h2>
			<p className={pClasses}>
				Respeitamos sua privacidade. Consulte nossa Política de Privacidade para saber
				mais sobre como tratamos suas informações pessoais. Embora tomemos medidas para
				proteger seus dados, não podemos garantir segurança total contra todos os riscos.
			</p>

			<h2 className={h2Classes}>4. Limitação de Responsabilidade</h2>
			<p className={pClasses}>
				O Amigo do Bolso é um aplicativo de apoio ao controle financeiro e não substitui
				aconselhamento financeiro profissional. Não somos responsáveis por qualquer
				decisão financeira tomada com base nas informações fornecidas pelo aplicativo.
			</p>

			<h2 className={h2Classes}>5. Alterações nos Termos</h2>
			<p className={pClasses}>
				Estes Termos de Uso podem ser modificados a qualquer momento. Qualquer alteração
				será publicada no aplicativo, e o uso contínuo do Amigo do Bolso após alterações
				indica sua aceitação dos novos termos.
			</p>

			<h2 className={h2Classes}>6. Contato</h2>
			<p className={pClasses}>
				Para dúvidas ou suporte, entre em contato conosco pelo e-mail:
				contato@dolfyn.com.br.
			</p>
		</section>
	)
}
