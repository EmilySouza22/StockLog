export default async function categoryRoutes(fastify, options) {
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
}
