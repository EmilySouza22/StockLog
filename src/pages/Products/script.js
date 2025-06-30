// Espera o carregamento completo do DOM para executar o script
document.addEventListener("DOMContentLoaded", function () {

    // Seleciona o botão "Voltar" pelo ID
    const btnVoltar = document.getElementById("btn-voltar");

    // Adiciona um evento de clique no botão "Voltar"
    btnVoltar.addEventListener("click", function () {
        // Redireciona para a home page
        window.location.href = ""; // <-- Trocar pelo caminho correto
    });

    // Seleciona o botão "Próximo" pelo ID
    const btnProximo = document.getElementById("btn-proximo");

    // Adiciona um evento de clique no botão "Próximo"
    btnProximo.addEventListener("click", function () {
        // Redireciona para a tela de alertas (trocar o link depois)
        window.location.href = ""; // caminho correto
    });
});
