//Este arquivo App.js está sendo controller, component e model ao mesmo tempo pq tamo usando stack vanilla (js, css e html puro)

//Importando a dependencia fastify de package.json
import bcrypt from 'bcrypt';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import fastify_static from '@fastify/static';
import path from 'path';
import fastify_mysql from '@fastify/mysql';
import { fileURLToPath } from 'url';
import { promisify } from 'util';

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

////////// TELA DETALHES DA CONTA  //////////

fastify.get('/account', async (request, reply) => {
	return reply.sendFile('Account/index.html');
});

fastify.get('/account/:id', function (req, reply) {
	fastify.mysql.query(
		'SELECT * FROM stocklog.empresa WHERE id=?',
		[req.params.id],
		function onResult(err, result) {
			reply.send(err || result);
		}
	);
});

fastify.delete('/account/:id', function (req, reply) {
	fastify.mysql.query(
		'DELETE FROM stocklog.empresa WHERE id=?',
		[req.params.id],
		function onResult(err, result) {
			reply.send(err || result);
		}
	);
});

fastify.put('/account/:id', function (req, reply) {
    const { nome, cnpj , telefone, email } = req.body;

	fastify.mysql.query(
		'UPDATE stocklog.empresa SET nome=?, cnpj=?, telefone=?, email=? WHERE id=?',
		[nome, cnpj ,telefone, email, req.params.id],
		function onResult(err, result) {
			reply.send(err || result);
		}
	);
});

/////////////////////////////////////////////////

fastify.get('/alerts', async (request, reply) => {
	return reply.sendFile('Alerts/index.html');
});

fastify.get('/home', async (request, reply) => {
	return reply.sendFile('Home/index.html');
});

fastify.get('/label', async (request, reply) => {
	return reply.sendFile('Label/index.html');
});

////////// TELA DE login  //////////
fastify.get('/login', async (request, reply) => {
	return reply.sendFile('Login/index.html');
});

fastify.post('/login', async (request, reply) => {
	const data = request.body;

	try {
		const { emailOuCnpj, senha } = data;

		let query = '';
		if (emailOuCnpj.includes('@')) {
			// SE FOR EMAIL
			query = 'SELECT * FROM stocklog.empresa WHERE email = ?';
		} else {
			// SE FOR CNPJ
			query = 'SELECT * FROM stocklog.empresa WHERE cnpj = ?';
		}

		const queryAsync = promisify(fastify.mysql.query).bind(fastify.mysql);
		const result = await queryAsync(query, [emailOuCnpj]);

		const userData = result[0];
		const compare = bcrypt.compareSync(senha, userData.senha);

		if (!compare) {
			return reply.code(404).send({ message: 'Credenciais inválidas' });
		}

		return reply.code(200).send(userData);
	} catch (error) {
		console.error('Falha no login:', error);
		return reply.code(500).send({ message: 'Credenciais não existem' });
	}
});

/////////////////////////////////////////////////

fastify.get('/products', async (request, reply) => {
	return reply.sendFile('Products/index.html');
});

////////// TELA DE CADASTRO (REGISTER) //////////
fastify.get('/register', async (request, reply) => {
	return reply.sendFile('Register/index.html');
});

fastify.post('/register', async (request, reply) => {
	const data = request.body;

	try {
		const { nome, telefone, cnpj, email, senha } = data;

		fastify.mysql.query(
			'INSERT INTO stocklog.empresa(`nome`,`telefone`,`cnpj`,`email`,`senha`) VALUES (?,?,?,?,?)',
			[nome, telefone, cnpj, email, bcrypt.hashSync(senha, 10)],
			function onResult(err, result) {
				console.log('insert result', result);
				reply.send(err || result);
			}
		);

		return reply;
	} catch (error) {
		console.error('Falha ao inserir dados na tabela empresa:', error);
		return reply;
	}
});
/////////////////////////////////////////////////

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
