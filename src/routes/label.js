export default async function labelRoutes(fastify, options) {
	//Buscar todas os produtos
	fastify.post('/all', function (req, reply) {
		const dadosEmpresa = req.body;
		fastify.mysql.query(
			'SELECT * FROM stocklog.produto WHERE empresa_id=? AND ativo=1',
			[dadosEmpresa.id],
			function onResult(err, result) {
				reply.type('application/json').send(err || result);
			}
		);
	});
}
