import { gerarNumeroCodigoBarra } from '../components/utils';

/**
 * @description Função para adicionar produto no banco de dados.
 * @param {{nome: string; quantidade: number; validade: string; categoria: string;}} dados
 * @returns {string}
 */
export function adicionarProduto(dados) {
	// data_entrada VARCHAR(255),
	// data_saída VARCHAR(255),
	// mínimo INTEGER DEFAULT 0,
	// máximo INTEGER DEFAULT 0,
	// empresa_id INTEGER,
	// FOREIGN KEY (categoria_id) REFERENCES categoria(id),
	// FOREIGN KEY (empresa_id) REFERENCES empresa(id)

	const codigoBarra = gerarNumeroCodigoBarra();

	// productModel.adicionarProduto({nome, quantidade, codigoBarra, validade, categoria})

	return 'Olá';
}
