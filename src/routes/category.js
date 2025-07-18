// Total de 5 rotas para categoria

export default async function categoryRoutes(fastify, options) {
	//Criar categoria
	fastify.post('', async (request, reply) => {
		const { nome, cor, empresa_id } = request.body;

		try {
			fastify.mysql.query(
				'INSERT INTO stocklog.categoria(`nome`,`cor`,`empresa_id`) VALUES (?,?,?)',
				[nome, cor, empresa_id],
				function onResult(err, result) {
					console.log('insert result', result);
					reply.send(err || result);
				}
			);

			return reply;
		} catch (error) {
			console.error('Falha ao inserir dados na tabela categoria:', error);
			return reply;
		}
	});

	//Buscar por categoria por id no banco
	fastify.get('/:id', function (req, reply) {
		fastify.mysql.query(
			'SELECT * FROM stocklog.categoria WHERE id=? AND ativo=1',
			[req.params.id],
			function onResult(err, result) {
				reply.send(err || result);
			}
		);
	});

	//Buscar todas as categorias da empresa
	fastify.post('/all', function (req, reply) {
		const dadosEmpresa = req.body;
		fastify.mysql.query(
			'SELECT * FROM stocklog.categoria WHERE empresa_id=? AND ativo=1',
			[dadosEmpresa.id],
			function onResult(err, result) {
				reply.send(err || result);
			}
		);
	});

	//Atualizar categoria
	fastify.put('/:id', function (req, reply) {
		const { nome, cor, empresa_id } = req.body;

		fastify.mysql.query(
			'UPDATE stocklog.categoria SET nome=?, cor=?, empresa_id=? WHERE id=?',
			[nome, cor, empresa_id, req.params.id],
			function onResult(err, result) {
				reply.send(err || result);
			}
		);
	});

	//Deletar categoria (soft delete)
	fastify.put('/delete/:id', function (req, reply) {
		fastify.mysql.query(
			'UPDATE stocklog.categoria SET ativo=0 WHERE id=?',
			[req.params.id],
			function onResult(err, result) {
				reply.send(err || result);
			}
		);
	});
}
