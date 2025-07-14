// Mock de dados
let produtos = [
    { id: 1, produto: "Leite Ninho Tradicional 1l", codigoBarra: "11238946334", quantidade: 12, entrada: "2025-01-18", validade: "2025-09-18", categoria: "Frios" },
    { id: 2, produto: "Coca-Cola 2L", codigoBarra: "11238946335", quantidade: 3, entrada: "2025-01-18", validade: "2025-09-18", categoria: "Bebidas" },
    { id: 3, produto: "Café Pilão 500g", codigoBarra: "11238946336", quantidade: 6, entrada: "2025-01-18", validade: "2025-09-18", categoria: "Frios" },
    { id: 4, produto: "Maçã Gala", codigoBarra: "11238946337", quantidade: 10, entrada: "2025-01-18", validade: "2025-09-18", categoria: "Frios" },
    { id: 5, produto: "Feijão Preto 1kg", codigoBarra: "11238946338", quantidade: 13, entrada: "2025-01-18", validade: "2025-09-18", categoria: "Frios" },
    { id: 6, produto: "Pão Francês", codigoBarra: "11238946339", quantidade: 8, entrada: "2025-01-18", validade: "2025-09-18", categoria: "Padaria" },
    { id: 7, produto: "Farinha de Trigo 1kg", codigoBarra: "11238946340", quantidade: 5, entrada: "2025-01-18", validade: "2025-09-18", categoria: "Farinhas" },
    { id: 8, produto: "Presunto Sadia", codigoBarra: "11238946341", quantidade: 6, entrada: "2025-01-18", validade: "2025-09-18", categoria: "Frios" },
    { id: 9, produto: "Sorvete Kibon", codigoBarra: "11238946342", quantidade: 4, entrada: "2025-01-18", validade: "2025-09-18", categoria: "Congelados" },
    { id: 10, produto: "Banana Prata", codigoBarra: "11238946343", quantidade: 7, entrada: "2025-01-18", validade: "2025-09-18", categoria: "Frutas" }
];

// Função para renderizar tabela
function renderizarTabela(dados = produtos) {
    const tbody = document.getElementById("body");
    tbody.innerHTML = "";
    
    dados.forEach(produto => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${produto.id}</td>
            <td>${produto.produto}</td>
            <td>${produto.codigoBarra}</td>
            <td>${produto.quantidade}</td>
            <td>${formatarData(produto.entrada)}</td>
            <td>${formatarData(produto.validade)}</td>
            <td>
                <div class="tag-categoria" id="color-${produto.categoria.toLowerCase()}">
                    ${produto.categoria}
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
    
    // Recriar event listeners
    criarEventListeners();
}

// Função para formatar data
function formatarData(data) {
    return new Date(data).toLocaleDateString("pt-BR");
}

// Função para criar event listeners
function criarEventListeners() {
    // Delete listeners
    document.querySelectorAll(".delete-icon").forEach(botao => {
        botao.addEventListener("click", function() {
            const id = parseInt(this.dataset.id);
            document.getElementById("confirm-modal").style.display = "flex";
            document.getElementById('confirmar-delete').onclick = () => deletarProduto(id);
        });
    });
    
    // Edit listeners
    document.querySelectorAll('.editar-icon').forEach(botao => {
        botao.addEventListener('click', function() {
            const id = parseInt(this.dataset.id);
            editarProduto(id);
        });
    });
}

// CRUD Operations
function deletarProduto(id) {
    produtos = produtos.filter(produto => produto.id !== id);
    renderizarTabela();
    closeDeleteModal();
}

function editarProduto(id) {
    const produto = produtos.find(p => p.id === id);
    if (produto) {
        document.getElementById("editar-produto").value = produto.produto;
        document.getElementById("editar-codigo-de-barra").value = produto.codigoBarra;
        document.getElementById("editar-quantidade").value = produto.quantidade;
        document.getElementById("novo-entrada").value = produto.entrada;
        document.getElementById("editar-validade").value = produto.validade;
        document.getElementById("editar-categoria").value = produto.categoria;
        document.getElementById('modal-editar').style.display = 'flex';
        
        document.getElementById('salvar-edicao').onclick = () => salvarEdicao(id);
    }
}

function salvarEdicao(id) {
    const produto = produtos.find(p => p.id === id);
    if (produto) {
        produto.produto = document.getElementById("editar-produto").value;
        produto.codigoBarra = document.getElementById("editar-codigo-de-barra").value;
        produto.quantidade = parseInt(document.getElementById("editar-quantidade").value);
        produto.entrada = document.getElementById("novo-entrada").value;
        produto.validade = document.getElementById("editar-validade").value;
        produto.categoria = document.getElementById("editar-categoria").value;
        
        renderizarTabela();
        document.getElementById('modal-editar').style.display = 'none';
    }
}

function adicionarProduto() {
    const produto = document.getElementById("novo-produto").value;
    const quantidade = parseInt(document.getElementById("novo-quantidade").value);
    const codigoDeBarra = document.getElementById("novo-codigo-de-barra").value;
    const entrada = document.getElementById("novo-entrada").value;
    const validade = document.getElementById("novo-validade").value;
    const categoria = document.getElementById("nova-categoria").value;
    
    if (!produto || !quantidade || !codigoDeBarra || !entrada || !validade || !categoria) {
        alert("Preencha todos os campos!");
        return;
    }
    
    const novoId = Math.max(...produtos.map(p => p.id)) + 1;
    produtos.push({
        id: novoId,
        produto,
        codigoBarra,
        quantidade,
        entrada,
        validade,
        categoria
    });
    
    renderizarTabela();
    document.getElementById("adicionar-modal").classList.remove("visivel");
    limparFormulario();
}

function limparFormulario() {
    document.getElementById("novo-produto").value = "";
    document.getElementById("novo-quantidade").value = "";
    document.getElementById("novo-codigo-de-barra").value = "";
    document.getElementById("novo-entrada").value = "";
    document.getElementById("novo-validade").value = "";
    document.getElementById("nova-categoria").value = "Laticínios";
}

// Filtros
const selectPrincipal = document.getElementById("select-filtro-principal");
const selectCategorias = document.getElementById("select-categorias");

selectPrincipal.addEventListener("change", function() {
    if (this.value === "categoria") {
        selectCategorias.classList.remove("escondido");
    } else {
        selectCategorias.classList.add("escondido");
    }
});

document.getElementById('select-categorias').addEventListener("change", function() {
    const categoriaSelecionada = this.value;
    if (categoriaSelecionada === "Todos") {
        renderizarTabela();
    } else {
        const produtosFiltrados = produtos.filter(produto => produto.categoria === categoriaSelecionada);
        renderizarTabela(produtosFiltrados);
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
document.addEventListener("DOMContentLoaded", () => {
    renderizarTabela();
    
    const modalAdicionar = document.getElementById("adicionar-modal");
    const btnAbrirModal = document.getElementById("btn-produto");
    const btnCancelarModal = document.getElementById("btn-cancelar-produto");
    const btnSalvarProduto = document.getElementById("btn-salvar-produto");
    
    btnAbrirModal.addEventListener("click", () => {
        modalAdicionar.classList.add("visivel");
    });
    
    btnCancelarModal.addEventListener("click", () => {
        modalAdicionar.classList.remove("visivel");
    });
    
    btnSalvarProduto.addEventListener("click", adicionarProduto);
});









// //Crud Filtro (categorias)
// const selectPrincipal = document.getElementById('select-filtro-principal');
// const selectCategorias = document.getElementById('select-categorias');

// selectPrincipal.addEventListener('change', function () {
// 	if (this.value === 'categoria') {
// 		selectCategorias.classList.remove('escondido');
// 	} else {
// 		selectCategorias.classList.add('escondido');
// 	}
// });

// //Crud listagem (READ) com filtro categoria
// document
// 	.getElementById('select-categorias')
// 	.addEventListener('change', function () {
// 		const categoriaSelecionada = this.value;
// 		const linhas = document.querySelectorAll('#body tr');

// 		linhas.forEach((linha) => {
// 			const categoriaTd = linha.querySelector('.tag-categoria');
// 			const categoriaTexto = categoriaTd?.textContent.trim();

// 			if (
// 				categoriaSelecionada === 'Todos' ||
// 				categoriaTexto === categoriaSelecionada
// 			) {
// 				linha.classList.remove('escondido');
// 			} else {
// 				linha.classList.add('escondido');
// 			}
// 		});
// 	}
// );

// let trParaRemover = null;
// //Crud modal (delete)
// document.querySelectorAll('.delete-icon').forEach((botao) => {
// 	botao.addEventListener('click', function () {
// 		trParaRemover = this.parentNode.parentNode;
// 		document.getElementById('confirm-modal').style.display = 'flex';
// 		document
// 			.getElementById('confirmar-delete')
// 			.addEventListener('click', function () {
// 				document.getElementById('body').removeChild(trParaRemover);
// 				closeDeleteModal();
// 			});
// 	});
// });

// function closeDeleteModal() {
// 	document.getElementById('confirm-modal').style.display = 'none';
// }

// //Crud modal (editção tabela)

// document.querySelectorAll('.editar-icon').forEach((botao) => {
// 	botao.addEventListener('click', function () {
// 		// Pega a linha (tr) mais próxima do botão clicado
// 		trParaRemover = this.closest('tr');
// 		// Mostra o modal
// 		document.getElementById('modal-editar').style.display = 'flex';
// 	});
// });

// //Crud adicionar produto
// document.addEventListener('DOMContentLoaded', () => {
// 	const modalAdicionar = document.getElementById('adicionar-modal');
// 	const btnAbrirModal = document.getElementById('btn-produto');
// 	const btnCancelarModal = document.getElementById('btn-cancelar-produto');
// 	const btnSalvarProduto = document.getElementById('btn-salvar-produto'); // AQUI ESTAVA FALTANDO

// 	btnAbrirModal.addEventListener('click', (event) => {
// 		modalAdicionar.classList.add('visivel');
// 		console.log('event', event);
// 	});

// 	btnCancelarModal.addEventListener('click', () => {
// 		modalAdicionar.classList.remove('visivel');
// 	});

// 	btnSalvarProduto.addEventListener('click', () => {
// 		const produto = document.getElementById('novo-produto').value;
// 		const quantidade = document.getElementById('novo-quantidade').value;
// 		const codigoDeBarra = document.getElementById('novo-codigo-de-barra').value;
// 		const entrada = document.getElementById('novo-entrada').value;
// 		const validade = document.getElementById('novo-validade').value;
// 		const categoria = document.getElementById('nova-categoria').value;

// 		if (
// 			!produto ||
// 			!quantidade ||
// 			!codigoDeBarra ||
// 			!entrada ||
// 			!validade ||
// 			!categoria
// 		) {
// 			alert('Preencha todos os campos!');
// 			return;
// 		}

// 		const tbody = document.querySelector('tbody');
// 		const novaLinha = document.createElement('tr');

// 		const codigo = tbody.children.length + 1;

// 		novaLinha.innerHTML = `
//         <td>${codigo}</td>
//         <td>${produto}</td>
//         <td>---</td>
//         <td>${quantidade}</td>
//         <td>${codigoDeBarra}</td>
//         <td>${new Date().toLocaleDateString()}</td>
//         <td>${validade}</td>
//         <td>${new Date().toLocaleDateString()}</td>
//         <td>${entrada}</td>
//         <td class="tag-categoria" id="color-${categoria.toLowerCase()}">${categoria}</td>
//         <td><button class="delete-icon"><img src="../../assets/imgs/products/icon/icon-lixeira.svg" alt="apagar" class="icons-tabela"></button></td>
//         <td><button class="editar-icon"><img src="../../assets/imgs/products/icon/icon-editar.svg" alt="" class="icons-tabela"></button></td>
//         `;

// 		tbody.appendChild(novaLinha);
// 		modalAdicionar.classList.remove('visivel'); // não usa mais .style
// 	});
// });
