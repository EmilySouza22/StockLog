
function cadastrar() { // Função para cadastrar o usuário, verificação e o salvamento no localStorage


let nomeEmpresa = document.getElementById("inpLogNome").value;
let telefone = document.getElementById("inpLogTelefone").value;
let cnpj = document.getElementById("inpLogCNPJ").value;
let email = document.getElementById("inpLogEmail").value;
let senha = document.getElementById("inpLogSenha").value;
let confirmarSenha = document.getElementById("inpLogSenhaConf").value;

if (senha !== confirmarSenha) { // Verifica se as senhas coincidem
    alert("As senhas não coincidem!");
    return; // Se não coincidirem, exibe um alerta e encerra a função
  }


let usuario = { // Cria um objeto com os dados do usuário
    nomeEmpresa: nomeEmpresa,
    telefone: telefone,
    cnpj: cnpj,
    email: email,
    senha: senha
  } 

let usuarios = JSON.parse(localStorage.getItem("usuarios")) || []; // Recupera os usuários do localStorage ou inicializa um array vazio se não houver nenhum

usuarios.push(usuario); // Adiciona o novo usuário ao array de usuários

localStorage.setItem("usuarios", JSON.stringify(usuarios)); // Salva o objeto no localStorage como uma string JSON
    alert("Usuário cadastrado com sucesso!"); // Exibe um alerta de sucesso
    window.location.href = "../Login/index.html"; // Redireciona para a página de login

}

