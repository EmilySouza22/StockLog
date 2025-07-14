export default async function productRoutes(fastify, options) {
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
