const nome = document.getElementById('novo-produto');
const codigoBarra = document.getElementById('novo-codigo-de-barra');
const quantidade = document.getElementById('novo-quantidade');
const dataValidade = document.getElementById('novo-validade');
const dataEntrada = document.getElementById('novo-entrada');
const minimo = document.getElementById('novo-minimo');
const maximo = document.getElementById('novo-maximo');
const categoria = document.getElementById('nova-categoria');

const ISO_FORMAT = 'YYYY-MM-DDTHH:mm:ss.sssZ';
const PT_BR_DATE_FORMAT = 'DD/MM/YYYY';

// Função para renderizar tabela
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
                    <img src="/assets/imgs/products/icon/icon-editar.svg" alt="" class="icons-tabela">
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

// CRUD Operations - IMPLEMENTAR COM AXIOS
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

async function deletarProduto(id) {
	// TODO: axios.delete(`/api/produtos/${id}`)
	// TODO: carregarProdutos() em caso de sucesso
	closeDeleteModal();
}

async function editarProduto(id) {
	// TODO: axios.get(`/api/produtos/${id}`)
	// TODO: preencher campos do modal com response.data
	document.getElementById('modal-editar').style.display = 'flex';
	document.getElementById('salvar-edicao').onclick = () => salvarEdicao(id);
}

async function salvarEdicao(id) {
	const dadosAtualizados = {
		produto: document.getElementById('editar-produto').value,
		codigoBarra: document.getElementById('editar-codigo-de-barra').value,
		quantidade: parseInt(document.getElementById('editar-quantidade').value),
		entrada: document.getElementById('novo-entrada').value,
		validade: document.getElementById('editar-validade').value,
		categoria: document.getElementById('editar-categoria').value,
	};

	// TODO: axios.put(`/api/produtos/${id}`, dadosAtualizados)
	// TODO: carregarProdutos() em caso de sucesso
	document.getElementById('modal-editar').style.display = 'none';
}

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
		const response = await axios.post('/product/id', novoProduto);

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
