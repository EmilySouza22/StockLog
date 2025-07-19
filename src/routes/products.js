// Total de 5 rotas para produtos

export default async function productRoutes(fastify, options) {
	fastify.post('', async (request, reply) => {
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
			'SELECT * FROM stocklog.produto WHERE id=? AND ativo=1',
			[req.params.id],
			function onResult(err, result) {
				reply.send(err || result);
			}
		);
	});

	fastify.post('/all', async function (req, reply) {
		const dadosEmpresa = req.body;
		const parametros = req.query;

		let query = 'SELECT * FROM stocklog.produto WHERE empresa_id=? AND ativo=1';

		if (parametros && parametros.limit && parametros.offset) {
			query += ` LIMIT ${parametros.limit} OFFSET ${parametros.offset}`;
		}

		try {
			const countQuery = new Promise((resolve, reject) => {
				fastify.mysql.query(
					'SELECT COUNT(id) AS total FROM stocklog.produto WHERE empresa_id=? AND ativo=1',
					[dadosEmpresa.id],
					(err, result) => (err ? reject(err) : resolve(result))
				);
			});

			const listQuery = new Promise((resolve, reject) => {
				fastify.mysql.query(query, [dadosEmpresa.id], (err, result) =>
					err ? reject(err) : resolve(result)
				);
			});

			const [countResult, dataResult] = await Promise.all([
				countQuery,
				listQuery,
			]);

			const result = {
				total: countResult[0].total,
				list: dataResult,
			};

			reply.send(result);
		} catch (error) {
			reply.send(error);
		}
	});

	fastify.put('/:id', function (req, reply) {
		const {
			nome,
			codigo_barra,
			quantidade,
			data_entrada,
			data_validade,
			minimo,
			maximo,
		} = req.body;

		fastify.mysql.query(
			'UPDATE stocklog.produto SET nome=?, codigo_barra=?, quantidade=?, data_entrada=?, data_validade=?, minimo=?, maximo=? WHERE id=?',
			[
				nome,
				codigo_barra,
				quantidade,
				data_entrada,
				data_validade,
				minimo,
				maximo,
				req.params.id,
			],
			function onResult(err, result) {
				reply.send(err || result);
			}
		);
	});

	fastify.put('/delete/:id', function (req, reply) {
		fastify.mysql.query(
			'UPDATE stocklog.produto SET ativo=0 WHERE id=?',
			[req.params.id],
			function onResult(err, result) {
				reply.send(err || result);
			}
		);
	});
}
