//Pegando os inputs do modal de ADICIONAR produto
const nome = document.getElementById('novo-produto');
const codigoBarra = document.getElementById('novo-codigo-de-barra');
const quantidade = document.getElementById('novo-quantidade');
const dataValidade = document.getElementById('novo-validade');
const dataEntrada = document.getElementById('novo-entrada');
const minimo = document.getElementById('novo-minimo');
const maximo = document.getElementById('novo-maximo');
const categoria = document.getElementById('nova-categoria');

//Variaveis para definir o formato das datas para usar com a biblioteca MOMENT.JS :)
const ISO_FORMAT = 'YYYY-MM-DDTHH:mm:ss.sssZ';
const PT_BR_DATE_FORMAT = 'DD/MM/YYYY';
const INPUT_FORMAT = 'YYYY-MM-DD';

//Pegando os inputs do modal de EDITAR produto
const editar_produto = document.getElementById('editar-produto');
const editar_codigo_barra = document.getElementById('editar-codigo-de-barra');
const editar_quantidade = document.getElementById('editar-quantidade');
const editar_entrada = document.getElementById('editar-entrada');
const editar_validade = document.getElementById('editar-validade');
const editar_minimo = document.getElementById('editar-minimo');
const editar_maximo = document.getElementById('editar-maximo');
const editar_categoria = document.getElementById('editar-categoria');

//Pegando inputs paginação
const qtd_produtos = document.getElementById('footer-qtd-produtos');
const total_produtos = document.getElementById('footer-total-produtos');
const pagina_atual = document.getElementById('footer-pag-atual');
const pagina_total = document.getElementById('footer-pag-total');

const btnVoltarPagina = document.getElementById('bnt-pag-voltar');
const btnProximaPagina = document.getElementById('bnt-pag-proximo');

const limite_produtos = 10;

function voltarPagina() {
	const valor = parseInt(pagina_atual.innerHTML) - 1;
	pagina_atual.innerHTML = valor < 1 ? 1 : valor;
	return carregarProdutos();
}

function avancarPagina() {
	const valor = parseInt(pagina_atual.innerHTML) + 1;
	const maximo = parseInt(pagina_total.innerHTML);
	pagina_atual.innerHTML = valor > maximo ? maximo : valor;
	return carregarProdutos();
}

//Listeners para os botaos para voltar e avançar página
btnVoltarPagina.addEventListener('click', voltarPagina);
btnProximaPagina.addEventListener('click', avancarPagina);

// CRUD READ - CARREGAR PRODUTOS
async function carregarProdutos() {
	const cache = localStorage.getItem('dados_empresa');
	const dadosEmpresa = JSON.parse(cache);
	const pagina = parseInt(pagina_atual.innerHTML);
	const offset = (pagina - 1) * limite_produtos;

	try {
		const response = await axios.post(
			`/product/all?limit=${limite_produtos}&offset=${offset}`,
			dadosEmpresa
		);
		if (response.status === 200) {
			renderizarTabela(response.data.list);
			total_produtos.innerHTML = parseInt(response.data.total);
			qtd_produtos.innerHTML = response.data.list.length;
			pagina_total.innerHTML = Math.ceil(
				parseInt(response.data.total) / parseInt(limite_produtos)
			);
		} else {
			alert('Falha ao carregar produtos.');
		}
	} catch (error) {
		console.log(error);
		alert(
			'Erro tela de produtos: ' + error.response?.data?.message || error.message
		);
	}
}

//CRUD CREATE - ADICIONAR PRODUTO
async function adicionarProduto() {
	const cache = localStorage.getItem('dados_empresa');
	const dadosEmpresa = JSON.parse(cache);

	const novoProduto = {
		nome: nome.value,
		codigo_barra: codigoBarra.value,
		quantidade: quantidade.value,
		data_validade: moment(dataValidade.value).format(ISO_FORMAT),
		data_entrada: moment(dataEntrada.value).format(ISO_FORMAT),
		minimo: parseInt(minimo.value),
		maximo: parseInt(maximo.value),
		categoria: categoria.value,
		empresa_id: dadosEmpresa.id,
	};

	console.log('novoProduto: ', novoProduto);

	try {
		const response = await axios.post('/product', novoProduto);

		if (response.status === 200) {
			alert('Produto adicionado!');
			document.getElementById('adicionar-modal').classList.remove('visivel');
			window.location.reload();
		}
	} catch (error) {
		console.error(error);
		alert(
			'Erro no cadastro: ' + error.response?.data?.message || error.message
		);
	}
}

// Função para renderizar a tabela produtos
async function renderizarTabela(dados = []) {
	if (!dados) {
		return;
	}

	console.log('dados do banco:', dados);
	const tbody = document.getElementById('body');
	tbody.innerHTML = '';

	dados.forEach((produto) => {
		const tr = document.createElement('tr');
		tr.innerHTML = `
            <td>${produto.id}</td>
            <td>${produto.nome}</td>
            <td>${produto.codigo_barra}</td>
            <td>${produto.quantidade}</td>
            <td>${moment(produto.data_entrada).format(PT_BR_DATE_FORMAT)}</td>
            <td>${moment(produto.data_validade).format(PT_BR_DATE_FORMAT)}</td>
            <td>
                <div class="tag-categoria" id="color-${produto.categoria_id}">
                    ${produto.categoria_id}
                </div>
            </td>
            <td>
                <button class="delete-icon" data-id="${produto.id}">
                    <img src="/assets/imgs/products/icon/icon-lixeira.svg" alt="apagar" class="icons-tabela">
                </button>
            </td>
            <td>
                <button class="editar-icon" data-id="${produto.id}">
                    <img src="/assets/imgs/products/icon/icon-editar.svg" alt="editar" class="icons-tabela">
                </button>
            </td>
        `;
		tbody.appendChild(tr);
	});
	criarEventListeners();
}

// Função para criar event listeners produto
function criarEventListeners() {
	// Delete listeners
	document.querySelectorAll('.delete-icon').forEach((botao) => {
		botao.addEventListener('click', function () {
			const id = parseInt(this.dataset.id);
			document.getElementById('confirm-modal').style.display = 'flex';
			document.getElementById('confirmar-delete').onclick = () =>
				deletarProduto(id);
		});
	});

	// Edit listeners
	document.querySelectorAll('.editar-icon').forEach((botao) => {
		botao.addEventListener('click', function () {
			const id = parseInt(this.dataset.id);
			editarProduto(id);
		});
	});
}

/* 

Deletando produto da tabela: 

>>> Não deleta realmente apenas deixa o ativo = 0, 
assim não mostra na tela de produtos, mas na tabela produto ele ainda existe, apenas está desativado (ativo = 0)

>>> Por esse motivos não usamos o fastify.delete() mas sim só para dar um update na coluna ativo da tabela produto, usamos fastify.put()

>>> Assim ativo default é 1 e quando deletado fica 0

>>> Isso vale tanto para a tabela produto quanto para a empresa

*/
async function deletarProduto(id) {
	try {
		const response = await axios.put(`/product/delete/${id}`);

		if (response.status === 200) {
			carregarProdutos();
		}
	} catch (error) {
		console.log(error);
		alert(
			'Erro ao apagar produto: ' + error.response?.data?.message ||
				error.message
		);
	}
	closeDeleteModal();
}

//Trazendo as informações do produto selecionado
async function editarProduto(id) {
	try {
		const response = await axios.get(`/product/${id}`);

		if (response.status === 200) {
			const resultado = response.data[0];
			console.log('resultado: ', resultado);
			editar_produto.value = resultado.nome;
			editar_codigo_barra.value = resultado.codigo_barra;
			editar_quantidade.value = resultado.quantidade;
			editar_entrada.value = moment(resultado.data_entrada).format(
				INPUT_FORMAT
			);
			editar_validade.value = moment(resultado.data_validade).format(
				INPUT_FORMAT
			);
			editar_minimo.value = resultado.minimo;
			editar_maximo.value = resultado.maximo;
			editar_categoria.value = resultado.categoria_id;
		}
	} catch (error) {
		console.log(error);
		alert(
			'Erro em carregar as infos dos produtos: ' +
				error.response?.data?.message || error.message
		);
	}
	document.getElementById('modal-editar').style.display = 'flex';
	document.getElementById('salvar-edicao').onclick = () => salvarEdicao(id);
}

//Edição dos dados do produto selecionado
async function salvarEdicao(id) {
	const dadosAtualizados = {
		nome: document.getElementById('editar-produto').value,
		codigo_barra: document.getElementById('editar-codigo-de-barra').value,
		quantidade: parseInt(document.getElementById('editar-quantidade').value),
		data_entrada: document.getElementById('editar-entrada').value,
		data_validade: document.getElementById('editar-validade').value,
		minimo: parseInt(document.getElementById('editar-minimo').value),
		maximo: parseInt(document.getElementById('editar-maximo').value),
	};

	try {
		const response = await axios.put(`/product/${id}`, dadosAtualizados);

		if (response.status === 200) {
			alert('Dados do produto atualizados!');
			document.getElementById('modal-editar').style.display = 'none';
			window.location.reload(true);
		}
	} catch (error) {
		console.error(error);
		alert(
			'Erro na edição do produto: ' + error.response?.data?.message ||
				error.message
		);
	}
}

// Modal de adicionar produto
document.addEventListener('DOMContentLoaded', () => {
	carregarProdutos();

	const modalAdicionar = document.getElementById('adicionar-modal');
	const btnAbrirModal = document.getElementById('btn-produto');
	const btnCancelarModal = document.getElementById('btn-cancelar-produto');
	const btnSalvarProduto = document.getElementById('btn-salvar-produto');

	btnAbrirModal.addEventListener('click', () => {
		modalAdicionar.classList.add('visivel');
	});

	btnCancelarModal.addEventListener('click', () => {
		modalAdicionar.classList.remove('visivel');
	});

	btnSalvarProduto.addEventListener('click', adicionarProduto);
});

// Cancelar modal de adicionar produto
function closeDeleteModal() {
	document.getElementById('confirm-modal').style.display = 'none';
}
document.getElementById('cancelar-delete').onclick = closeDeleteModal;

document.getElementById('cancelar-edicao').onclick = () => {
	document.getElementById('modal-editar').style.display = 'none';
};

/* 
    
    Daqui pra baixo é relacionado ao CRUD DAS CATEGORIAS 
    
*/

/* 

    ADICIONAR CATEGORIA

*/

// CRUD - MODAL ADICIONAR CATEGORIA
async function adicionarCategoria() {
	const cache = localStorage.getItem('dados_empresa');
	const dadosEmpresa = JSON.parse(cache);

	const inpNome = document.getElementById('inpNomeAddCateg');
	const inpColor = document.getElementById('inpColorAddCateg');

	const novaCategoria = {
		nome: inpNome.value,
		cor: inpColor.value,
		empresa_id: dadosEmpresa.id,
	};

	console.log('novaCategoria: ', novaCategoria);

	try {
		const response = await axios.post('/category', novaCategoria);

		if (response.status === 200) {
			alert('Categoria adicionada!');
			document
				.getElementById('adicionar-modal-categ')
				.classList.remove('visivel');
			window.location.reload();
		}
	} catch (error) {
		console.error(error);
		alert(
			'Erro ao adicionar categoria: ' + error.response?.data?.message ||
				error.message
		);
	}
}

// Modal de adicionar nova categoria
document.addEventListener('DOMContentLoaded', () => {
	const modalAddCateg = document.getElementById('adicionar-modal-categ');
	const btnAbrirModalAddCateg = document.getElementById(
		'btn-adicionarCategoria'
	);
	const btnCancelarModalCateg = document.getElementById(
		'btn-cancelar-categoria'
	);
	const btnAddCateg = document.getElementById('btn-adicionar-categoria');

	btnAbrirModalAddCateg.addEventListener('click', () => {
		modalAddCateg.classList.add('visivel');
	});

	btnCancelarModalCateg.addEventListener('click', () => {
		modalAddCateg.classList.remove('visivel');
	});

	btnAddCateg.addEventListener('click', adicionarCategoria);
});

/* 

    EDITAR OU DELETAR CATEGORIA 

*/

//Pegando os inputs do modal de EDITAR categoria
const editarNomeCategoria = document.getElementById('inpNomeEditCateg');
const editarCorCategoria = document.getElementById('inpColorEditCateg');

//Trazendo as informaçõesd do banco relacionados ao produto selecionado
async function editarCategoria(id) {
	try {
		const response = await axios.get(`/category/${id}`);

		if (response.status === 200) {
			const resultado = response.data[0];
			console.log('resultado: ', resultado);
			//
			editarNomeCategoria.value = resultado.nome;
			editarCorCategoria.value = resultado.cor;
		}
	} catch (error) {
		console.log('Erro completo:', error);
		alert(
			'Erro em carregar as informações da categoria: ' +
				error.response?.data?.message || error.message
		);
	}
	document.getElementById('edit-modal-categ').style.display = 'flex';
	document.getElementById('btn-editar-edit-categ').onclick = () =>
		salvarEdicaoCategoria(id);
}

//Edição dos dados do produto selecionado
async function salvarEdicaoCategoria(id) {
	console.log('ID enviado:', id);
	const cache = localStorage.getItem('dados_empresa');
	const dadosEmpresa = JSON.parse(cache);

	const inpEditNome = document.getElementById('inpNomeEditCateg');
	const inpEditColor = document.getElementById('inpColorEditCateg');

	const dadosAtualizados = {
		nome: inpEditNome.value,
		cor: inpEditColor.value,
		empresa_id: dadosEmpresa.id,
	};

	try {
		const response = await axios.put(`/category/${id}`, dadosAtualizados);
		console.log('Resposta completa:', response);
		console.log('Dados retornados:', response.data);

		if (response.status === 200) {
			alert('Dados da categoria atualizados!');
			document.getElementById('edit-modal-categ').style.display = 'none';
			window.location.reload(true);
		}
	} catch (error) {
		console.error(error);
		alert(
			'Erro na edição da categoria: ' + error.response?.data?.message ||
				error.message
		);
	}
}

// Modal de editar / deletar categoria já existente
document.addEventListener('DOMContentLoaded', () => {
	const modalEditCateg = document.getElementById('edit-modal-categ');
	const btnVerCateg = document.getElementById('btn-VerCategorias');
	const btnCancelarVerCateg = document.getElementById(
		'btn-cancelar-edit-categ'
	);
	const btnEditCateg = document.getElementById('btn-editar-edit-categ');

	btnVerCateg.addEventListener('click', () => {
		modalEditCateg.classList.add('visivel');
	});

	btnCancelarVerCateg.addEventListener('click', () => {
		modalEditCateg.classList.remove('visivel');
	});
});

//Carregar categorias no select
async function carregarCategorias() {
	const cache = localStorage.getItem('dados_empresa');
	const dadosEmpresa = JSON.parse(cache);

	try {
		const response = await axios.post('/category/all', dadosEmpresa);
		if (response.status === 200) {
			//Select do modal editar categoria
			const selectModal = document.getElementById('selectModalEditCateg');
			//Select do modal adicionar produto
			const selectProduto = document.getElementById('nova-categoria');

			//Criando option pro select
			selectModal.innerHTML =
				'<option value="">Selecione uma categoria</option>';
			selectProduto.innerHTML =
				'<option value="">Selecione uma categoria</option>';

			response.data.forEach((categoria) => {
				selectModal.innerHTML += `<option value="${categoria.id}">${categoria.nome}</option>`;
				selectProduto.innerHTML += `<option value="${categoria.id}">${categoria.nome}</option>`;
			});
		}
	} catch (error) {
		console.log(error);
		alert(
			'Erro ao carregar categorias: ' + error.response?.data?.message ||
				error.message
		);
	}
}

//Deletar categoria
async function deletarCategoria(id) {
	try {
		const response = await axios.put(`/category/delete/${id}`);
		if (response.status === 200) {
			alert('Categoria deletada!');
			document.getElementById('edit-modal-categ').style.display = 'none';
			carregarCategorias();
		}
	} catch (error) {
		console.error('Erro ao deletar categoria:', error);
		alert(
			'Erro ao deletar categoria: ' +
				(error.response?.data?.message || error.message)
		);
	}
}

//Atualizar o DOMContentLoaded para o modal de edição
document.addEventListener('DOMContentLoaded', () => {
	carregarCategorias();

	const modalEditCateg = document.getElementById('edit-modal-categ');
	const btnVerCateg = document.getElementById('btn-VerCategorias');
	const btnCancelarVerCateg = document.getElementById(
		'btn-cancelar-edit-categ'
	);
	const selectCategoria = document.getElementById('selectModalEditCateg');
	const btnDeletarCateg = document.getElementById('btn-deletar-edit-categ');

	btnVerCateg.addEventListener('click', () => {
		modalEditCateg.style.display = 'flex';
		carregarCategorias();
	});

	btnCancelarVerCateg.addEventListener('click', () => {
		modalEditCateg.style.display = 'none';
	});

	//Carregar dados da categoria quando selecionada
	selectCategoria.addEventListener('change', function () {
		const categoriaId = this.value;
		if (categoriaId) {
			editarCategoria(categoriaId);
		}
	});

	//Função para quando clicar no botão deletar categoria
	btnDeletarCateg.addEventListener('click', function () {
		const categoriaId = selectCategoria.value;
		if (categoriaId) {
			if (confirm('Tem certeza que deseja deletar esta categoria?')) {
				deletarCategoria(categoriaId);
			}
		} else {
			alert('Selecione uma categoria primeiro');
		}
	});
});
