import fastify from '../../../app.js';

export async function inserirEmpresa(data) {
	if (!data) {
		return false;
	}

	try {
		const { nome, telefone, cnpj, email, senha } = data;

		const connection = await fastify.mysql.getConnection();
		const result = await connection.query(
			'INSERT INTO `stocklog`.`empresa`(`nome`,`telefone`,`cnpj`,`email`,`senha`) VALUES (?,?,?,?,?)',
			[nome, telefone, cnpj, email, senha]
		);

		// verificar o que a variavel result tem para que o return retorne apenas verdadeiro ou falso se foi inserido com sucesso os dados na tabela.
		console.log('insert result', result);
		connection.release();

		return result;
	} catch (error) {
		console.error('Falha ao inserir dados na tabela empresa:', error);
		return false;
	}
}
