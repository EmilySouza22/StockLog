export default async function historicRoutes(fastify, options) {
	// Rota existente (já funcionando)
	fastify.post('/all', async function (req, reply) {
		const dadosEmpresa = req.body;
		const parametros = req.query;

		let query =
			'SELECT * FROM stocklog.historico WHERE empresa_id=? ORDER BY id DESC';

		// Aplicar paginação apenas se os parâmetros forem fornecidos
		if (parametros && parametros.limit && parametros.offset) {
			query += ` LIMIT ${parametros.limit} OFFSET ${parametros.offset}`;
		}

		try {
			const countQuery = new Promise((resolve, reject) => {
				fastify.mysql.query(
					'SELECT COUNT(id) AS total FROM stocklog.historico WHERE empresa_id=?',
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

			reply.type('application/json').send(result);
		} catch (error) {
			console.error('Erro na rota do histórico:', error);
			reply.status(500).send({
				error: 'Erro interno do servidor',
				message: error.message,
			});
		}
	});

	// NOVA ROTA - Buscar última entrada do histórico (mais recente)
	fastify.post('/recent', async function (req, reply) {
		const dadosEmpresa = req.body;

		// Query para buscar só o registro mais recente da empresa
		const query = `
      SELECT * FROM stocklog.historico
      WHERE empresa_id = ?
      ORDER BY data_criacao DESC, id DESC
      LIMIT 1
    `;

		try {
			const result = await new Promise((resolve, reject) => {
				fastify.mysql.query(query, [dadosEmpresa.id], (err, res) =>
					err ? reject(err) : resolve(res)
				);
			});

			reply.type('application/json').send(result); // Envia um array com 0 ou 1 elemento
		} catch (error) {
			console.error('Erro na rota do histórico recente:', error);
			reply.status(500).send({
				error: 'Erro interno do servidor',
				message: error.message,
			});
		}
	});
}
