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
            <td>${moment(produto.data_entrada).format('DD/MM/YYYY')}</td>
            <td>${moment(produto.data_validade).format('DD/MM/YYYY')}</td>
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
	const novoProduto = {
		produto: document.getElementById('novo-produto').value,
		quantidade: parseInt(document.getElementById('novo-quantidade').value),
		codigoBarra: document.getElementById('novo-codigo-de-barra').value,
		entrada: document.getElementById('novo-entrada').value,
		validade: document.getElementById('novo-validade').value,
		categoria: document.getElementById('nova-categoria').value,
	};

	// TODO: axios.post('/api/produtos', novoProduto)
	// TODO: carregarProdutos() em caso de sucesso
	// TODO: limpar formulário em caso de sucesso
	document.getElementById('adicionar-modal').classList.remove('visivel');
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
