export const Privacy = () => {
	const pClasses = 'mb-2'
	const h2Classes = 'text-lg font-semibold mt-4 mb-2'
	const ulClasses = 'mb-2 list-disc space-y-1 pl-6'
	const contactEmail = 'contato@dolfyn.com.br'

	return (
		<section>
			<h1 className="text-xl font-semibold mb-4">
				Política de Privacidade do Amigo do Bolso
			</h1>

			<p className={pClasses}>
				<strong>Última atualização: 25 de outubro de 2026</strong>
			</p>

			<p className={pClasses}>
				Esta Política explica como a{' '}
				<strong>Adriano Maríngolo Gomes Desenvolvimento de Software Ltda.</strong>, CNPJ{' '}
				<strong>59.563.105/0001-00</strong>, responsável pelo aplicativo{' '}
				<strong>Amigo do Bolso</strong> (“nós”), trata dados pessoais de quem utiliza o
				aplicativo (“você”). Leia também as informações exibidas no app. Esta versão
				descreve as funcionalidades e os fornecedores atualmente informados; mudanças
				relevantes serão refletidas em uma versão atualizada.
			</p>

			<h2 className={h2Classes}>1. Quem é responsável e como falar conosco</h2>
			<p className={pClasses}>
				O controlador dos dados pessoais tratados para operar o Amigo do Bolso é Adriano
				Maríngolo Gomes Desenvolvimento de Software Ltda., CNPJ 59.563.105/0001-00.
			</p>
			<p className={pClasses}>
				Para dúvidas, solicitações ou exercício de direitos de privacidade, use:{' '}
				<a
					href={`mailto:${contactEmail}`}
					className="font-semibold text-accent-text hover:underline"
				>
					{contactEmail}
				</a>
				. Este canal também recebe comunicações relacionadas ao tratamento de dados.
			</p>
			<p className={pClasses}>
				A empresa avaliará e manterá a indicação de encarregado conforme os requisitos
				legais aplicáveis. Se estiver dispensada nos termos da regulamentação da ANPD, o
				canal acima será disponibilizado para contato com os titulares.
			</p>

			<h2 className={h2Classes}>2. Quais dados tratamos</h2>
			<p className={pClasses}>
				Dependendo de como você usa o aplicativo, podemos tratar:
			</p>
			<ul className={ulClasses}>
				<li>
					<strong>Dados de conta:</strong> e-mail e credencial de autenticação. Na criação
					de conta com e-mail e senha, a senha é protegida pelo serviço de autenticação e
					não é disponibilizada em texto legível à equipe do aplicativo.
				</li>
				<li>
					<strong>Login Google:</strong> se você escolher essa opção, recebemos do Google
					os dados autorizados no fluxo de login, atualmente informados como nome, e-mail
					e foto de perfil. A foto e os demais dados só serão mantidos no app se isso
					ocorrer tecnicamente.
				</li>
				<li>
					<strong>Registros financeiros inseridos por você:</strong> valor, descrição,
					categoria, observações, tags e data de receitas e despesas.
				</li>
				<li>
					<strong>Uso de conteúdo:</strong> quais artigos do aplicativo você leu.
				</li>
				<li>
					<strong>Dados técnicos e de segurança:</strong> registros técnicos padrão
					gerados pelos serviços de hospedagem, autenticação e banco de dados, que podem
					conter informações como endereço IP, horário, identificadores técnicos e eventos
					de acesso, conforme as configurações e prazos dos fornecedores.
				</li>
			</ul>
			<p className={pClasses}>
				Não solicitamos dados financeiros de contas bancárias nem fazemos conexão com
				instituições financeiras, conforme as informações atualmente fornecidas. Evite
				incluir em campos livres dados sensíveis, dados de terceiros, senhas ou
				informações que não sejam necessárias para organizar suas finanças.
			</p>

			<h2 className={h2Classes}>3. Para que usamos os dados e bases legais</h2>
			<p className={pClasses}>Usamos os dados para:</p>
			<ul className={ulClasses}>
				<li>
					criar, autenticar e manter sua conta e fornecer as funcionalidades do aplicativo
					— conforme aplicável, para executar o contrato de uso;
				</li>
				<li>
					armazenar e exibir seus registros financeiros e seu histórico de leitura — para
					executar as funcionalidades solicitadas por você;
				</li>
				<li>
					proteger o serviço, prevenir acessos indevidos, diagnosticar falhas e manter a
					segurança — conforme a base legal adequada ao caso, que pode incluir legítimo
					interesse após avaliação e observância dos seus direitos;
				</li>
				<li>
					cumprir obrigações legais ou atender solicitações válidas de autoridades, quando
					aplicável — para cumprimento de obrigação legal ou regulatória e exercício
					regular de direitos.
				</li>
			</ul>
			<p className={pClasses}>
				As bases legais serão aplicadas de acordo com cada finalidade e não serão
				substituídas por uma autorização genérica nesta Política.
			</p>

			<h2 className={h2Classes}>4. Onde os dados ficam e fornecedores</h2>
			<p className={pClasses}>
				Os registros financeiros são armazenados em banco de dados em nuvem Supabase,
				baseado em PostgreSQL, no projeto atualmente informado como localizado em Oregon,
				Estados Unidos. O aplicativo é uma PWA desenvolvida com Next.js e hospedada na
				Vercel.
			</p>
			<p className={pClasses}>
				No dispositivo, o aplicativo guarda em cache os arquivos estáticos necessários à
				interface (código, imagens, fontes e ícones) e, por até 24 horas, cópias das
				páginas visitadas para agilizar a navegação. Os registros financeiros são
				consultados no servidor a cada uso e não ficam no cache de dados do aplicativo. Os
				dados de sessão (tokens de autenticação) ficam em cookies do navegador e são
				removidos quando você encerra a sessão. Para apagar também o cache, basta limpar
				os dados do site ou desinstalar o aplicativo.
			</p>
			<p className={pClasses}>
				Utilizamos fornecedores para executar o serviço: Supabase para banco de dados e
				autenticação; Vercel para hospedagem; e Google quando você escolhe o login Google.
				Esses fornecedores podem tratar dados conforme suas funções, contratos, instruções
				e políticas próprias. Não vendemos dados pessoais nem os compartilhamos para
				publicidade comportamental.
			</p>

			<h2 className={h2Classes}>5. Transferência internacional</h2>
			<p className={pClasses}>
				Para operar o serviço, dados podem ser armazenados ou tratados nos Estados Unidos,
				inclusive na região de Oregon, e em outros países onde nossos fornecedores ou
				subprocessadores mantenham infraestrutura, conforme a configuração efetiva de cada
				serviço. As finalidades são hospedar o aplicativo, autenticar usuários, armazenar
				e consultar registros, manter a segurança e prestar suporte técnico.
			</p>
			<p className={pClasses}>
				As transferências são realizadas com fundamento em hipótese legal aplicável e em
				mecanismo válido previsto na LGPD e na regulamentação da ANPD, em especial
				cláusulas contratuais constantes dos acordos de tratamento de dados (DPA) firmados
				com a Supabase e a Vercel. Nesses acordos, os fornecedores atuam como operadores,
				tratando os dados conforme nossas instruções e com medidas de segurança
				compatíveis. Você pode solicitar informações sobre as salvaguardas e, observados
				segredos comerciais e industriais, a íntegra das cláusulas aplicáveis pelo canal
				indicado acima.
			</p>

			<h2 className={h2Classes}>6. Analytics, rastreamento e publicidade</h2>
			<p className={pClasses}>
				Atualmente, conforme a configuração informada, não utilizamos ferramenta de
				analytics, rastreamento ou publicidade. Há apenas logs técnicos padrão dos
				serviços de infraestrutura. Se essa prática mudar, atualizaremos esta Política
				antes de ativar novos tratamentos e forneceremos as escolhas ou consentimentos
				exigidos pela legislação, quando aplicáveis.
			</p>

			<h2 className={h2Classes}>7. Segurança</h2>
			<p className={pClasses}>
				Adotamos medidas técnicas e administrativas proporcionais ao serviço. O banco
				utiliza regras de segurança em nível de linha (Row Level Security — RLS) para
				restringir operações aos registros do próprio usuário, conforme a configuração
				informada. Também dependemos dos controles de segurança dos fornecedores e da
				proteção das credenciais e dispositivos usados para acessar o app.
			</p>
			<p className={pClasses}>
				Nenhum serviço conectado à internet pode ter segurança absoluta. Se ocorrer
				incidente que possa gerar risco ou dano relevante, adotaremos as providências e
				comunicações exigidas pela legislação e pela regulamentação aplicável.
			</p>

			<h2 className={h2Classes}>8. Retenção, exclusão da conta e backups</h2>
			<p className={pClasses}>
				Você pode excluir a conta pelo Perfil no aplicativo. A exclusão remove a conta de
				autenticação e, em cascata, os lançamentos, tags e o histórico de leitura
				associados a ela, no banco de dados de produção, no momento da confirmação. A
				exclusão não pode ser desfeita.
			</p>
			<p className={pClasses}>
				Podemos conservar dados estritamente necessários para cumprir obrigações legais ou
				regulatórias, exercer direitos ou manter registros técnicos pelo prazo aplicável.
				Logs mantidos por provedores podem seguir os prazos e processos desses
				fornecedores.
			</p>
			<p className={pClasses}>
				Atualmente, não há backup automatizado configurado, conforme informado. Portanto,
				não prometemos cópias de segurança automatizadas. Se isso mudar, esta Política
				será atualizada antes da ativação, com os prazos de retenção e a explicação sobre
				a eventual permanência temporária de dados excluídos em cópias de segurança até
				sua expiração.
			</p>

			<h2 className={h2Classes}>9. Seus direitos</h2>
			<p className={pClasses}>
				Nos termos da LGPD, você pode solicitar confirmação do tratamento, acesso,
				correção, informações sobre compartilhamento, anonimização, bloqueio ou eliminação
				nas hipóteses legais, portabilidade conforme a regulamentação aplicável e
				revogação de consentimento quando o tratamento se basear nele. Também pode
				apresentar petição à ANPD.
			</p>
			<p className={pClasses}>
				Envie seu pedido ao canal indicado na seção 1. Podemos solicitar informações
				razoáveis para confirmar sua identidade e proteger a conta. Responderemos
				gratuitamente, observados os prazos legais e as limitações previstas em lei.
			</p>

			<h2 className={h2Classes}>10. Crianças e adolescentes</h2>
			<p className={pClasses}>
				O Amigo do Bolso não é direcionado a crianças nem a adolescentes e é destinado a
				maiores de 18 anos. O aplicativo não possui verificação de idade; por isso,
				contamos que você nos informe se acredita que dados de uma criança ou adolescente
				foram fornecidos ao aplicativo, entrando em contato pelo canal de privacidade para
				que possamos avaliar e tomar as medidas cabíveis, inclusive a exclusão da conta.
			</p>

			<h2 className={h2Classes}>11. Alterações desta Política</h2>
			<p className={pClasses}>
				Podemos atualizar esta Política para refletir mudanças no aplicativo, nos
				fornecedores, nas práticas ou na legislação. Publicaremos a versão atualizada no
				aplicativo ou em página acessível a partir dele, indicando a data de atualização.
				Quando a lei exigir, informaremos previamente os titulares e solicitaremos
				consentimento ou ofereceremos escolhas adequadas.
			</p>
		</section>
	)
}
