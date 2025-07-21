export default async function homeRoutes(fastify, options) {
	fastify.post('/', async function (req, reply) {
		const dadosEmpresa = req.body;

		let query = 'SELECT * FROM stocklog.produto WHERE empresa_id=? AND ativo=1';

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

			reply.type('application/json').send(result);
		} catch (error) {
			reply.type('application/json').send(error);
		}
	});
}
