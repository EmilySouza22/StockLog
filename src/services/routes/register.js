import { adicionarEmpresa } from '../components/register.js';

export default function (fastify, opts, done) {
	fastify.post('/register', async (request, reply) => {
        request.auth.token;
		const data = request.body;
		const result = await adicionarEmpresa(data);
		reply.send(result);
	});
	done();
}

// Front >> Controller >> Component >> Model >> Banco
