//Importando a dependencia fastify de package.json
import Fastify from 'fastify';
import cors from '@fastify/cors';
import fastify_static from '@fastify/static';
import path from 'path';
import fastify_mysql from '@fastify/mysql';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

//Configurando fastify
const fastify = Fastify({
	logger: true,
});

//Conf de conexao de 'terceiros'
await fastify.register(cors);

//Conexão banco de dados
await fastify.register(fastify_mysql, {
	uri: 'mysql://root@localhost/mysql?password="root"',
});

// Servir assets (CSS, JS, imagens)
await fastify.register(fastify_static, {
	root: path.join(__dirname, 'src/assets'),
	prefix: '/assets/',
	decorateReply: false,
});

// Registrar plugin para servir as telas
await fastify.register(fastify_static, {
	root: path.join(__dirname, 'src/pages'),
	prefix: '/',
});

// Servir services
await fastify.register(fastify_static, {
	root: path.join(__dirname, 'src/services'),
	prefix: '/services/',
	decorateReply: false,
});

fastify.get('/', async function handler(request, reply) {
	return reply.sendFile('Login/index.html');
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

fastify.get('/login', async (request, reply) => {
	return reply.sendFile('Login/index.html');
});

fastify.get('/products', async (request, reply) => {
	return reply.sendFile('Products/index.html');
});

fastify.get('/register', async (request, reply) => {
	return reply.sendFile('Register/index.html');
});

fastify.get('/report', async (request, reply) => {
	return reply.sendFile('Report/index.html');
});

//Inicializando fastify
try {
	await fastify.listen({ port: 3000 });
} catch (err) {
	fastify.log.error(err);
	process.exit(1);
}

export default fastify;
