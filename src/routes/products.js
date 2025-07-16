export default async function productRoutes(fastify, options) {
	fastify.post('/id', async (request, reply) => {
		const {
			nome,
			codigo_barra,
			quantidade,
			data_validade,
			data_entrada,
			minimo,
			maximo,
			empresa_id,
		} = request.body;

		try {
			fastify.mysql.query(
				'INSERT INTO stocklog.produto(`nome`,`codigo_barra`,`quantidade`,`data_validade`,`data_entrada`,`minimo`,`maximo`,`empresa_id`) VALUES (?,?,?,?,?,?,?,?)',
				[
					nome,
					codigo_barra,
					quantidade,
					data_validade,
					data_entrada,
					minimo,
					maximo,
					empresa_id,
				],
				function onResult(err, result) {
					console.log('insert result', result);
					reply.send(err || result);
				}
			);

			return reply;
		} catch (error) {
			console.error('Falha ao inserir dados na tabela produto:', error);
			return reply;
		}
	});

	fastify.get('/:id', function (req, reply) {
		fastify.mysql.query(
			'SELECT * FROM stocklog.produto WHERE id=?',
			[req.params.id],
			function onResult(err, result) {
				reply.send(err || result);
			}
		);
	});

	fastify.post('/all', function (req, reply) {
		const dadosEmpresa = req.body;
		fastify.mysql.query(
			'SELECT * FROM stocklog.produto WHERE empresa_id=?',
			[dadosEmpresa.id],
			function onResult(err, result) {
				reply.send(err || result);
			}
		);
	});
}
