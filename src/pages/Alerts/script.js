const produtos = {
	vencidos: Array(8).fill({
		nome: 'Queijo Ralado Crioulo',
		quantidade: 3,
		data: '08/06/2025',
		imagem:
			'https://latco.com.br/wp-content/uploads/2019/12/latco_queijo_ralado_1000g_mockup-1-1536x1536.png',
		check: true,
	}),
	proximo: Array(8).fill({
		nome: 'Molho De Tomate Orgânico Tradicional',
		quantidade: 3,
		data: '02/07/2025',
		imagem:
			'https://images.tcdn.com.br/img/img_prod/1049139/molho_de_tomate_caseiro_organico_330g_origo_1344_1_3fe841337912587ee682797a7aacb03d.jpg',
		check: true,
	}),
	maximo: Array(16).fill({
		nome: 'Feijão Preto Urbano',
		quantidade: 3,
		data: '08/06/2025',
		imagem:
			'https://sp.cdifoodservice.com.br/wp-content/uploads/2020/10/feijao-preto-urbano-kg-600x600.jpg',
		check: true,
	}),
	minimo: Array(10).fill({
		nome: 'Arroz Tio João',
		quantidade: 3,
		data: '08/06/2025',
		imagem:
			'https://boa.vtexassets.com/arquivos/ids/575600/Arroz-Tipo-1-Tio-Joao-2kg.jpg?v=638550511829100000',
		check: true,
	}),
};

const cardsPorPagina = 12;
let abaAtual = 'vencidos';
let paginaAtual = 1;

function renderCards() {
	const container = document.getElementById('cards-container');
	container.innerHTML = '';
	const lista = produtos[abaAtual];
	const inicio = (paginaAtual - 1) * cardsPorPagina;
	const fim = inicio + cardsPorPagina;
	const pagina = lista.slice(inicio, fim);

	pagina.forEach((produto) => {
		const card = document.createElement('div');
		card.className = 'card';
		card.innerHTML = `
      <img src="${produto.imagem}" alt="${produto.nome}">
      <div>
        <div class="nome">${produto.nome}</div>
        <div class="quantidade">Quantidade: ${produto.quantidade} UNI</div>
        <div class="data">Data: ${produto.data}</div>
      </div>
      <div>
        ${produto.check ? '<input type="checkbox" class="checkbox" >' : ''}
      </div>
    `;
		container.appendChild(card);
	});

	// Atualiza paginação e rodapé
	document.getElementById(
		'pagina-info'
	).textContent = `Página ${paginaAtual} de ${Math.ceil(
		lista.length / cardsPorPagina
	)}`;
	document.getElementById(
		'itens-info'
	).textContent = `Mostrando ${pagina.length} itens de ${lista.length}`;
}

function trocarAba(aba) {
	abaAtual = aba;
	paginaAtual = 1;
	document
		.querySelectorAll('.aba')
		.forEach((btn) => btn.classList.remove('ativa'));
	document.querySelector(`.aba[data-aba="${aba}"]`).classList.add('ativa');
	renderCards();
}

document.querySelectorAll('.aba').forEach((btn) => {
	btn.addEventListener('click', () => trocarAba(btn.dataset.aba));
});

document.getElementById('bnt-pag-voltar').addEventListener('click', () => {
	if (paginaAtual > 1) {
		paginaAtual--;
		renderCards();
	}
});
document.getElementById('bnt-pag-proximo').addEventListener('click', () => {
	const total = produtos[abaAtual].length;
	if (paginaAtual < Math.ceil(total / cardsPorPagina)) {
		paginaAtual++;
		renderCards();
	}
});

document.querySelector('.btn-excluir').addEventListener('click', () => {
	alert('Funcionalidade de exclusão não implementada neste exemplo.');
});

renderCards();
