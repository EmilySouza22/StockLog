/* LISTA DE PRODUTOS */

import { gerarCodigoBarra } from '../../services/components/utils';

let listaProdutos = [
	{
		id: 1,
		nome: 'Café Melitta Tradicional 500g',
		validade: '15/02/2026',
	},
	{
		id: 2,
		nome: 'Suco Maguary Néctar Uva 1l',
		validade: '12/02/2026',
	},
	{
		id: 3,
		nome: 'Leite Ninho Tradicional 1l ',
		validade: '13/02/2026',
	},
	{
		id: 4,
		nome: 'Waffle Forno de Minas 280g Tradicional',
		validade: '21/05/2026',
	},
];

/* PRODUTO SELECIONADO */

let PRODUTO_SELECIONADO = -1;

// Captura o seletor que contém os options (produtos) para selecionar.
const seletorProdutos = document.getElementById('formProducts');

// Cria um listener que vai ser responsável apenas por disparar a função quando tiver uma mudança no seletor.
// Para conseguir manipular o objeto da mudança, é nomeado o objeto como "event".
seletorProdutos.addEventListener('change', (event) => {
	// event é o objeto contendo as informações do evento "change"
	// event.target é o elemento alvo que está sendo ouvido (no caso, é o seletor que possui o id "formProducts")
	// event.target.value é o valor atual que o seletor está segurando, um número. O numero é inicializado como -1.
	PRODUTO_SELECIONADO = event.target.value;

	// Com a lista de produtos disponíveis, busca o produto pelo id se for igual ao numero atual do seletor.
	const dadosProduto = listaProdutos.find(
		(produto) => produto.id === parseInt(PRODUTO_SELECIONADO)
	);

	// Renderizar titulo "Produto:" e nome do produto na tela.
	// Puxa a lista dos elementos da classe "etiquetaToggleProduto"
	const etiquetaToggleProduto = document.querySelectorAll(
		'.etiquetaToggleProduto'
	);

	// Para cada elemento da lista de elementos da classe "etiquetaToggleProduto"
	for (let elemento of etiquetaToggleProduto) {
		// Verifica se é uma opção de um produto ao invés da opção vazia (Selecionar Produto) que possui o valor -1.
		if (PRODUTO_SELECIONADO > -1) {
			// Se for um produto, exibe na tela tanto o titulo "Produto:" quanto o nome do produto.
			elemento.style.setProperty('display', 'inline');
		} else {
			// Se não, oculta da tela.
			elemento.style.setProperty('display', 'none');
		}

		// Se for o elemento onde precisa ser preenchido com o nome do produto e existe o objeto "dadosProduto"
		if (elemento.id === 'etiquetaProduto' && dadosProduto) {
			// Então, incluir na tela o nome do produto.
			elemento.innerHTML = dadosProduto.nome;
		}
	}
});

/* SELETOR DOS PRODUTOS */

function popularSeletor() {
	const seletorProdutos = document.getElementById('formProducts');

	for (const produto of listaProdutos) {
		const option = document.createElement('option');

		option.value = produto.id;
		option.text = produto.nome;

		seletorProdutos.add(option);
	}
}

popularSeletor();

/* MODAL */

const openButtons = document.querySelectorAll('.btnConfig2');

openButtons.forEach((button) => {
	button.addEventListener('click', () => {
		const modalId = button.getAttribute('data-modal');
		const modal = document.getElementById(modalId);

		modal.showModal();
	});
});

// JsBarcode(".barcode").init();

function incluiCodebar() {
	gerarCodigoBarra('.barcode').init();
}
