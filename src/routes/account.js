import bcrypt from 'bcrypt';

export default async function accountRoutes(fastify, options) {
	fastify.post('/register', async (request, reply) => {
		const { nome, telefone, cnpj, email, senha } = request.body;

		try {
			fastify.mysql.query(
				'INSERT INTO stocklog.empresa(`nome`,`telefone`,`cnpj`,`email`,`senha`) VALUES (?,?,?,?,?)',
				[nome, telefone, cnpj, email, bcrypt.hashSync(senha, 10)],
				function onResult(err, result) {
					console.log('insert result', result);
					reply.send(err || result);
				}
			);

			return reply;
		} catch (error) {
			console.error('Falha ao inserir dados na tabela empresa:', error);
			return reply;
		}
	});

	fastify.get('/:id', function (req, reply) {
		fastify.mysql.query(
			'SELECT * FROM stocklog.empresa WHERE id=? AND ativo=1',
			[req.params.id],
			function onResult(err, result) {
				reply.send(err || result);
			}
		);
	});

	fastify.put('/:id', function (req, reply) {
		const { nome, cnpj, telefone, email } = req.body;

		fastify.mysql.query(
			'UPDATE stocklog.empresa SET nome=?, cnpj=?, telefone=?, email=? WHERE id=?',
			[nome, cnpj, telefone, email, req.params.id],
			function onResult(err, result) {
				reply.send(err || result);
			}
		);
	});

	fastify.put('/delete/:id', function (req, reply) {
		fastify.mysql.query(
			'UPDATE stocklog.empresa SET ativo=0, cnpj=CONCAT(NOW(),cnpj), email=CONCAT(NOW(),email) WHERE id=?',
			[req.params.id],
			function onResult(err, result) {
				reply.send(err || result);
			}
		);
	});
}
