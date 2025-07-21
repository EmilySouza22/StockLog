// Total de 5 rotas para produtos

import moment from 'moment';

import { inserirHistorico } from '../components/utils.js';

const ISO_FORMAT = 'YYYY-MM-DDTHH:mm:ss.sssZ';

export default async function productRoutes(fastify, options) {
	fastify.post('', async (request, reply) => {
		const {
			nome,
			codigo_barra,
			quantidade,
			data_validade,
			data_entrada,
			minimo,
			maximo,
			categoria_id,
			empresa_id,
		} = request.body;

		try {
			fastify.mysql.query(
				'INSERT INTO stocklog.produto(`nome`,`codigo_barra`,`quantidade`,`data_validade`,`data_entrada`,`minimo`,`maximo`, `categoria_id`, `empresa_id`) VALUES (?,?,?,?,?,?,?,?,?)',
				[
					nome,
					codigo_barra,
					quantidade,
					data_validade,
					data_entrada,
					minimo,
					maximo,
					categoria_id,
					empresa_id,
				],
				function onResult(err, result) {
					if (result) {
						inserirHistorico(fastify, {
							empresa_id,
							produto_id: result.insertId,
							produto_nome: nome,
							data_criacao: moment().format(ISO_FORMAT),
							tipo: 'ADICIONADO',
							quantidade,
						});
					}
					reply.send(err || result);
				}
			);

			return reply;
		} catch (error) {
			console.error('Falha ao inserir dados na tabela produto:', error);
			return reply;
		}
	});

	fastify.get('/:id', function (req, reply) {
		fastify.mysql.query(
			'SELECT * FROM stocklog.produto WHERE id=? AND ativo=1',
			[req.params.id],
			function onResult(err, result) {
				reply.send(err || result);
			}
		);
	});

	fastify.post('/all', async function (req, reply) {
		const dadosEmpresa = req.body;
		const parametros = req.query;

		let query =
			'SELECT p.*, c.nome as categoria_nome, c.cor as categoria_cor FROM stocklog.produto p LEFT JOIN stocklog.categoria c ON p.categoria_id = c.id WHERE p.empresa_id=? AND p.ativo=1';

		if (parametros && parametros.limit && parametros.offset) {
			query += ` LIMIT ${parametros.limit} OFFSET ${parametros.offset}`;
		}

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

			reply.send(result);
		} catch (error) {
			reply.send(error);
		}
	});

	fastify.put('/:id', function (req, reply) {
		const {
			nome,
			codigo_barra,
			quantidade,
			data_entrada,
			data_validade,
			minimo,
			maximo,
			categoria_id,
			empresa_id,
		} = req.body;

		fastify.mysql.query(
			'UPDATE stocklog.produto SET nome=?, codigo_barra=?, quantidade=?, data_entrada=?, data_validade=?, minimo=?, maximo=?, categoria_id=? WHERE id=?',
			[
				nome,
				codigo_barra,
				quantidade,
				data_entrada,
				data_validade,
				minimo,
				maximo,
				categoria_id,
				req.params.id,
			],
			function onResult(err, result) {
				if (result) {
					inserirHistorico(fastify, {
						empresa_id,
						produto_id: req.params.id,
						produto_nome: nome,
						data_criacao: moment().format(ISO_FORMAT),
						tipo: 'EDITADO',
						quantidade,
					});
				}
				reply.send(err || result);
			}
		);
	});

	fastify.put('/delete/:id', function (req, reply) {
		const { empresa_id, produto_nome } = req.body;
		const { id } = req.params;
		try {
			fastify.mysql.query(
				'UPDATE stocklog.produto SET ativo=0 WHERE id=?',
				[id],
				function onResult(err, result) {
					if (result) {
						inserirHistorico(fastify, {
							empresa_id,
							produto_id: id,
							produto_nome,
							data_criacao: moment().format(ISO_FORMAT),
							tipo: 'EXCLUIDO',
						});
					}
					reply.send(err || result);
				}
			);
		} catch (error) {
			reply.send(error);
		}
	});
}
