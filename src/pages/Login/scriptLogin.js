function login() {

  let login = document.getElementById("inpLogNome").value; // pode ser email ou CNPJ
  let senha = document.getElementById("inpLogSenha").value;

  let usuarios = JSON.parse(localStorage.getItem("usuarios")); 

  if (!usuarios) {
  alert("Nenhum usuário cadastrado, por favor, cadastre-se primeiro.");
  return;
}
  // Procura usuário que tenha email OU cnpj igual ao que digitou
  let usuarioEncontrado = usuarios.find(usuario => usuario.email === login || usuario.cnpj === login);

  if (!usuarioEncontrado) {
    alert("E-mail ou CNPJ não cadastrado");
    return;
  }

  if (usuarioEncontrado.senha !== senha) {
    alert("Senha incorreta");
    return;
  }

  alert("Login aprovado! Seja bem-vindo(a)!")
  window.location.href = "../Home/index.html"
}