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

// CRUD READ - CARREGAR PRODUTOS
async function carregarProdutos() {
	const cache = localStorage.getItem('dados_empresa');
	const dadosEmpresa = JSON.parse(cache);

	try {
		const response = await axios.post('/product/all', dadosEmpresa);
		if (response.status === 200) {
			renderizarTabela(response.data);
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

// Função para renderizar a tabela toda
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

// Função para criar event listeners
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

/* Deletando produto da tabela - (Não deleta realmente apenas deixa o ativo = 0, 
assim não mostra na tela de produtos, mas na tabela produto ele ainda existe, apenas está desativado ) */
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

//
//Editando as informações do produto selecionado
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

	// TODO: axios.put(`/api/produtos/${id}`, dadosAtualizados)
	// TODO: carregarProdutos() em caso de sucesso
}

// Filtros
const selectPrincipal = document.getElementById('select-filtro-principal');
const selectCategorias = document.getElementById('select-categorias');

selectPrincipal.addEventListener('change', function () {
	if (this.value === 'categoria') {
		selectCategorias.classList.remove('escondido');
	} else {
		selectCategorias.classList.add('escondido');
	}
});

document
	.getElementById('select-categorias')
	.addEventListener('change', function () {
		const categoriaSelecionada = this.value;
		if (categoriaSelecionada === 'Todos') {
			carregarProdutos();
		} else {
			// TODO: axios.get(`/api/produtos?categoria=${categoriaSelecionada}`)
			// TODO: renderizarTabela(response.data)
		}
	});

// Modals
function closeDeleteModal() {
	document.getElementById('confirm-modal').style.display = 'none';
}

document.getElementById('cancelar-delete').onclick = closeDeleteModal;
document.getElementById('cancelar-edicao').onclick = () => {
	document.getElementById('modal-editar').style.display = 'none';
};

// Inicialização
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
