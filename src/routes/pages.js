export default async function pageRoutes(fastify, options) {
	fastify.get('/', async function handler(request, reply) {
		return reply.type('application/json').sendFile('Login/index.html');
	});

	fastify.get('/login', async (request, reply) => {
		return reply.type('application/json').sendFile('Login/index.html');
	});

	fastify.get('/register', async (request, reply) => {
		return reply.type('application/json').sendFile('Register/index.html');
	});

	fastify.get('/alerts', async (request, reply) => {
		return reply.type('application/json').sendFile('Alerts/index.html');
	});

	fastify.get('/home', async (request, reply) => {
		return reply.type('application/json').sendFile('Home/index.html');
	});

	fastify.get('/label', async (request, reply) => {
		return reply.type('application/json').sendFile('Label/index.html');
	});

	fastify.get('/products', async (request, reply) => {
		return reply.type('application/json').sendFile('Products/index.html');
	});

	fastify.get('/historic', async (request, reply) => {
		return reply.type('application/json').sendFile('Historic/index.html');
	});

	fastify.get('/account', async (request, reply) => {
		return reply.type('application/json').sendFile('Account/index.html');
	});
}
