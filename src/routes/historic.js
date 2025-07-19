export default async function historicRoutes(fastify, options) {
	fastify.post('/all', async function (req, reply) {
		const dadosEmpresa = req.body;
		const parametros = req.query;

		let query =
			'SELECT * FROM stocklog.historico WHERE empresa_id=? ORDER BY id DESC';

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

			reply.send(result);
		} catch (error) {
			reply.send(error);
		}
	});
}
