import JsBarcode from 'jsbarcode';
import moment from 'moment';

export function gerarCodigoBarra(DOMtarget) {
	return JsBarcode(DOMtarget);
	// .options({ font: 'OCR-B' }) // Will affect all barcodes
	// .EAN13(gerarNumeroCodigoBarra(), { fontSize: 18, textMargin: 0 })
	// .blank(20) // Create space between the barcodes
	// .EAN5('12345', {
	// 	height: 85,
	// 	textPosition: 'top',
	// 	fontSize: 16,
	// 	marginTop: 15,
	// });
}

export function gerarNumeroCodigoBarra() {}

export function formatarData(dataISO) {
	return moment(dataISO).format('DD/MM/YYYY');
}

/**
 * Insere na tabela histórico
 * @param {fastify: {}, { produto_id: integer, produto_nome: string, data_criacao: string, tipo: string, quantidade: integer }} dados
 */
export async function inserirHistorico(fastify, dados) {
	if (!dados) {
		return;
	}
	try {
		const historicoQuery = new Promise((resolve, reject) => {
			fastify.mysql.query(
				'INSERT INTO `stocklog`.`historico` (`data_criacao`, `tipo`, `detalhe`, `produto_nome`, `produto_id`, `empresa_id`) VALUES (?, ?, ?, ?, ?, ?);',
				[
					dados.data_criacao,
					dados.tipo,
					gerarDetalhe(dados),
					dados.produto_nome,
					dados.produto_id,
					dados.empresa_id,
				],
				(err, result) => (err ? reject(err) : resolve(result))
			);
		});

		return await historicoQuery;
	} catch (error) {
		console.error('inserirHistorico error:', error);
		return error;
	}
}

function gerarDetalhe(dados) {
	const { tipo, quantidade, quantidade_etiquetas, categoria } = dados;

	let detalhe;
	switch (tipo) {
		case 'ADICIONADO':
			detalhe = `Entrada de ${quantidade} unidades`;
			break;

		case 'ALTO_VOLUME':
			detalhe = `Produto acima do máximo`;
			break;

		case 'BAIXO_VOLUME':
			detalhe = `Produto abaixo do mínimo`;
			break;

		case 'CATEGORIA':
			detalhe = `Produto adicionado a categoria ${categoria}`;
			break;

		case 'EDITADO':
			detalhe = `Produto editado`;
			break;

		case 'ETIQUETA':
			detalhe = `${quantidade_etiquetas} etiquetas impressas`;
			break;

		case 'EXCLUIDO':
			detalhe = `Produto excluído`;
			break;

		case 'FORA_DE_ESTOQUE':
			detalhe = `Saída de ${quantidade} unidades`;
			break;

		case 'VENCIDO':
			detalhe = `${quantidade} unidades vencidas`;
			break;

		case 'VENCENDO':
			detalhe = `${quantidade} unidades perto de vencer`;
			break;

		default:
			detalhe = 'Nenhum detalhe';
			break;
	}

	return detalhe;
}
