export default async function pageRoutes(fastify, options) {
	fastify.get('/', async function handler(request, reply) {
		return reply.sendFile('Login/index.html');
	});

	fastify.get('/login', async (request, reply) => {
		return reply.sendFile('Login/index.html');
	});

	fastify.get('/register', async (request, reply) => {
		return reply.sendFile('Register/index.html');
	});

	fastify.get('/alerts', async (request, reply) => {
		return reply.sendFile('Alerts/index.html');
	});

	fastify.get('/home', async (request, reply) => {
		return reply.sendFile('Home/index.html');
	});

	fastify.get('/label', async (request, reply) => {
		return reply.sendFile('Label/index.html');
	});

	fastify.get('/products', async (request, reply) => {
		return reply.sendFile('Products/index.html');
	});

	fastify.get('/report', async (request, reply) => {
		return reply.sendFile('Report/index.html');
	});

	fastify.get('/account', async (request, reply) => {
		return reply.sendFile('Account/index.html');
	});
}
