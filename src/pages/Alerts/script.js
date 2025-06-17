// Dados mockados para cada aba
const produtos = {
  vencidos: Array(36).fill({
    nome: "Café Melitta Tradicional",
    quantidade: 3,
    data: "08/06/2025",
    imagem: "https://www.melitta.com.br/images/products/packshot-cafe-tradicional.png",
    check: true
  }),
  proximo: Array(8).fill({
    nome: "Café Melitta Tradicional",
    quantidade: 3,
    data: "08/06/2025",
    imagem: "https://www.melitta.com.br/images/products/packshot-cafe-tradicional.png",
    check: false
  }),
  maximo: Array(5).fill({
    nome: "Café Melitta Tradicional",
    quantidade: 3,
    data: "08/06/2025",
    imagem: "https://www.melitta.com.br/images/products/packshot-cafe-tradicional.png",
    check: false
  }),
  minimo: Array(4).fill({
    nome: "Café Melitta Tradicional",
    quantidade: 3,
    data: "08/06/2025",
    imagem: "https://www.melitta.com.br/images/products/packshot-cafe-tradicional.png",
    check: false
  }),
};

const cardsPorPagina = 12;
let abaAtual = "vencidos";
let paginaAtual = 1;

function renderCards() {
  const container = document.getElementById('cards-container');
  container.innerHTML = '';
  const lista = produtos[abaAtual];
  const inicio = (paginaAtual - 1) * cardsPorPagina;
  const fim = inicio + cardsPorPagina;
  const pagina = lista.slice(inicio, fim);

  pagina.forEach(produto => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="${produto.imagem}" alt="${produto.nome}">
      <div class="nome">${produto.nome}</div>
      <div class="quantidade">Quantidade: ${produto.quantidade} UNI</div>
      <div class="data">Data: ${produto.data}</div>
      ${produto.check ? '<img src="https://cdn-icons-png.flaticon.com/512/190/190411.png" class="check" alt="check">' : ''}
    `;
    container.appendChild(card);
  });

  // Atualiza paginação e rodapé
  document.getElementById('pagina-info').textContent = `Página ${paginaAtual} de ${Math.ceil(lista.length / cardsPorPagina)}`;
  document.getElementById('itens-info').textContent = `Mostrando ${pagina.length} itens de ${lista.length}`;
}

function trocarAba(aba) {
  abaAtual = aba;
  paginaAtual = 1;
  document.querySelectorAll('.aba').forEach(btn => btn.classList.remove('ativa'));
  document.querySelector(`.aba[data-aba="${aba}"]`).classList.add('ativa');
  renderCards();
}

document.querySelectorAll('.aba').forEach(btn => {
  btn.addEventListener('click', () => trocarAba(btn.dataset.aba));
});

document.getElementById('anterior').addEventListener('click', () => {
  if (paginaAtual > 1) {
    paginaAtual--;
    renderCards();
  }
});
document.getElementById('proximo').addEventListener('click', () => {
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