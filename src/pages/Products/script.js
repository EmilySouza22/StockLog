//Crud Filtro (categorias)

document.getElementById('select-btn').addEventListener("change", function () {
    const categoriaSelecionada = this.value;
    const linhas = document.querySelectorAll("tbody tr");

    linhas.forEach(linha => {
        const categoriaTd = linha.querySelector(".tag-categoria");
        const categoriaTexto = categoriaTd?.textContent.trim();

        if (categoriaSelecionada === "Todos" || categoriaTexto === categoriaSelecionada) {
            linha.classList.remove("escondido"); // mostra a linha
        } else {
            linha.classList.add("escondido") // esconde a linha
        }
    });
});

//Crud modal (delete)

let trParaRemover = null;

// Seleciona todos os botões de deletar
document.querySelectorAll(".delete-icon").forEach(botao => {
    botao.addEventListener("click", function () {
        // Pega a linha (tr) mais próxima do botão clicado
        trParaRemover = this.parentNode.parentNode
        // Mostra o modal
        document.getElementById("confirm-modal").style.display = "flex";
        document.getElementById('confirmar-delete').addEventListener(
            "click", function(){
                document.getElementById('body').removeChild(trParaRemover)
                closeDeleteModal()
            }
        )
    });
});

function closeDeleteModal(){
    document.getElementById("confirm-modal").style.display = "none";
}
//Crud modal (editção tabela)

document.querySelectorAll(".editar-icon").forEach(botao => {
    botao.addEventListener("click", function () {
        // Pega a linha (tr) mais próxima do botão clicado
        trParaRemover = this.closest("tr");
        // Mostra o modal
        document.getElementById("modal-editar").style.display = "flex";
    });
});


    //Crud adicionar produto

    document.addEventListener("DOMContentLoaded", () => {
        const modalAdicionar = document.getElementById("adicionar-modal");
        const btnAbrirModal = document.getElementById("btn-produto");
        const btnCancelarModal = document.getElementById("btn-cancelar-produto");
        const btnSalvarProduto = document.getElementById("btn-salvar-produto"); // AQUI ESTAVA FALTANDO
      
        btnAbrirModal.addEventListener("click", () => {
          modalAdicionar.classList.add("visivel");
        });
      
        btnCancelarModal.addEventListener("click", () => {
          modalAdicionar.classList.remove("visivel");
        });
      
        btnSalvarProduto.addEventListener("click", () => {
          const produto = document.getElementById("novo-produto").value;
          const quantidade = document.getElementById("novo-quantidade").value;
          const validade = document.getElementById("novo-validade").value;
          const categoria = document.getElementById("nova-categoria").value;
      
          if (!produto || !quantidade || !validade || !categoria) {
            alert("Preencha todos os campos!");
            return;
          }
      
          const tbody = document.querySelector("tbody");
          const novaLinha = document.createElement("tr");
      
          const codigo = tbody.children.length + 1;
      
          novaLinha.innerHTML = `
            <td>${codigo}</td>
            <td>${produto}</td>
            <td>---</td>
            <td>${quantidade}</td>
            <td>${new Date().toLocaleDateString()}</td>
            <td>${validade}</td>
            <td class="tag-categoria" id="color-${categoria.toLowerCase()}">${categoria}</td>
            <td><button class="delete-icon"><img src="../../assets/imgs/products/icon/icon-lixeira.svg" alt="apagar" class="icons-tabela"></button></td>
            <td><button class="editar-icon"><img src="../../assets/imgs/products/icon/icon-editar.svg" alt="" class="icons-tabela"></button></td>
          `;
      
          tbody.appendChild(novaLinha);
          modalAdicionar.classList.remove("visivel"); // não usa mais .style
        });
      });
