// Permite ler os valores digitados pelo usuário no formulário.

const nomeEmpresa = document.getElementById("inpLogNome");
const telefone = document.getElementById("inpLogTelefone");
const cnpj = document.getElementById("inpLogCNPJ");
const email = document.getElementById("inpLogEmail");
const senha = document.getElementById("inpLogSenha");
const confirmarSenha = document.getElementById("inpLogSenhaConf");

//Função pra tirar tudo do cnpj que não for número

function limparCNPJ(cnpj) {
	return cnpj.replace(/\D/g, ""); // Remove tudo que não é dígito -- // .replace() serve para substituir parte de uma string por outra.
}


async function cadastrar() {
	// sobre o async: "Esta função de cadastro pode fazer algo que demora (como se comunicar com o servidor), então quero que ela espere essas coisas acontecerem antes de continuar.
	if (senha.value !== confirmarSenha.value) {
		//Verifica se as senhas coincidem
		alert("As senhas não coincidem!");
		return; // Se não coincidirem, exibe um alerta e encerra a função
	}

	let usuario = {		//Cria um objeto com os dados do usuário e salva no localstorage
		nome: nomeEmpresa.value,
		telefone: telefone.value,
		cnpj: cnpj.value,
		email: email.value,
		senha: senha.value,
	};
	
	// VALIDAÇÕES DO CADASTRO

	//Confere se todos os campos estão preenchidos
	if (
		!usuario.nome ||
		!usuario.telefone ||
		!usuario.cnpj ||
		!usuario.email ||
		!usuario.senha
	) {
		toastr.info("Erro 404", "teste2");
		return;
	}

	//Confere se o e-mail é válido
	const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(usuario.email);
	if (!emailValido) {
		alert("Digite um e-mail válido!");
		return;
	}

	//Confere se o CPNJ é válido --> não precisou fazer isso com o telefone pq no CPNJ pode ter pontos, barras e hífens...
	const cnpjValido = /^[0-9./-]+$/.test(usuario.cnpj);
	if (!cnpjValido) {
		alert("CNPJ contém caracteres inválidos! Use apenas números, '.', '/' ou '-'.");
		return;
	}

	//CNPJ com 14 dígitos (limpando antes)
	if (limparCNPJ(usuario.cnpj).length !== 14) {
		alert("CNPJ inválido! Deve conter 14 números.");
		return;
	}

	//Senha com no mínimo 6 caracteres
	if (usuario.senha.length < 6) {
		alert("A senha deve ter pelo menos 6 caracteres.");
		return;
	}


	// Envia os dados do usuário para o servidor

	try {
		const response = await axios.post("/account/register", usuario);

		if (response.status === 200) {
			// Handle success - redirect or show success message
			window.location.href = "/login";
		}
	} catch (error) {
		console.error(error);
		alert(
			"Erro no cadastro: " + error.response?.data?.message || error.message
		);
	}
}

// Senha escondida e vísivel (ícone do olho)

function alternarSenha(inputId, iconId) {
	const input = document.getElementById(inputId);
	const icon = document.getElementById(iconId);

	if (input.type === "password") {
		input.type = "text";
		icon.src = "/assets/imgs/register/icon/eye.svg"; // ícone de olho aberto
	} else {
		input.type = "password";
		icon.src = "/assets/imgs/register/icon/eye-closed.svg"; // ícone de olho fechado
	}
}

		//Função que vai verificar se já existe algum usuário com o cpnj ou com o email --> COMENTADA POIS AGR FOI CONFIGURADA COM O BANCO
		
		// function usuarioJaExiste(cnpj, email) {
		// 	// vai verificar se já existe algum usuário com esse CNPJ ou email cadastrado no localStorage.
		// 	const usuarios = JSON.parse(localStorage.getItem("usuarios")) || []; // pega os usuários salvos e converte de volta para um array. Se não houver usuários, usa um array vazio.
		
		// 	const cnpjLimpo = limparCNPJ(cnpj);
		
		// 	return usuarios.some(
		// 		// Verifica se existe algum usuário com o mesmo CNPJ ou email (o some)
		// 		(usuario) =>
		// 			limparCNPJ(usuario.cnpj) === cnpjLimpo ||
		// 			usuario.email.toLowerCase() === email.toLowerCase()
		// 	);
		// }