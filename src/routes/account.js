// Total de 4 rotas para account

import bcrypt from 'bcrypt';

export default async function accountRoutes(fastify, options) {
	fastify.post('/register', async (request, reply) => {
		const { nome, telefone, cnpj, email, senha } = request.body;

		const telefoneLimpo = telefone.replace(/\D/g, '');
		if (telefoneLimpo.length < 10 || telefoneLimpo.length > 11) {
			return reply.status(400).send({ message: 'Telefone inválido!' });
		}

		try {
			const verificarCNPJ = new Promise((resolve, reject) => {
				fastify.mysql.query(
					'SELECT id FROM stocklog.empresa WHERE cnpj=?',
					[cnpj],
					function onResult(err, result) {
						if (err) {
							reject(err);
						} else if (result.length > 0) {
							resolve(true); // CNPJ já existe
						} else {
							resolve(false); // CNPJ não existe
						}
					}
				);
			});

			const cnpjExiste = await verificarCNPJ;
			if (cnpjExiste) {
				return reply.status(400).send({ message: 'CNPJ já cadastrado.' });
			}

			const verificarEmail = new Promise((resolve, reject) => {
				fastify.mysql.query(
					'SELECT id FROM stocklog.empresa WHERE email=?',
					[email],
					function onResult(err, result) {
						if (err) {
							reject(err);
						} else if (result.length > 0) {
							resolve(true); // Email já existe
						} else {
							resolve(false); // Email não existe
						}
					}
				);
			});

			const emailExiste = await verificarEmail;
			if (emailExiste) {
				return reply.status(400).send({ message: 'E-mail já cadastrado.' });
			}

			fastify.mysql.query(
				'INSERT INTO stocklog.empresa(`nome`,`telefone`,`cnpj`,`email`,`senha`) VALUES (?,?,?,?,?)',
				[nome, telefone, cnpj, email, bcrypt.hashSync(senha, 10)],
				function onResult(err, result) {
					console.log('insert result', result);
					reply.type('application/json').send(err || result);
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
				reply.type('application/json').send(err || result);
			}
		);
	});

	fastify.put('/:id', function (req, reply) {
		const { nome, cnpj, telefone, email } = req.body;

		fastify.mysql.query(
			'UPDATE stocklog.empresa SET nome=?, cnpj=?, telefone=?, email=? WHERE id=?',
			[nome, cnpj, telefone, email, req.params.id],
			function onResult(err, result) {
				reply.type('application/json').send(err || result);
			}
		);
	});

	fastify.put('/delete/:id', function (req, reply) {
		fastify.mysql.query(
			'UPDATE stocklog.empresa SET ativo=0, cnpj=CONCAT(NOW(),cnpj), email=CONCAT(NOW(),email) WHERE id=?',
			[req.params.id],
			function onResult(err, result) {
				reply.type('application/json').send(err || result);
			}
		);
	});
}
