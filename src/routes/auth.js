import bcrypt from 'bcrypt';
import { promisify } from 'util';

export default async function authRoutes(fastify, options) {
	fastify.post('/login', async (request, reply) => {
		const { emailOuCnpj, senha } = request.body;

		try {
			const query = emailOuCnpj.includes('@')
				? 'SELECT * FROM stocklog.empresa WHERE email = ?'
				: 'SELECT * FROM stocklog.empresa WHERE cnpj = ?';

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
}
