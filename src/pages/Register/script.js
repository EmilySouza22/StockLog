// Permite ler os valores digitados pelo usuário no formulário.

const nomeEmpresa = document.getElementById("inpLogNome");
const telefone = document.getElementById("inpLogTelefone");
const cnpj = document.getElementById("inpLogCNPJ");
const email = document.getElementById("inpLogEmail");
const senha = document.getElementById("inpLogSenha");
const confirmarSenha = document.getElementById("inpLogSenhaConf");

// Função pra tirar tudo do CNPJ que não for número
function limparCNPJ(cnpj) {
	return cnpj.replace(/\D/g, ""); // Remove tudo que não é dígito
}

// Função pra tirar tudo do telefone que não for número
function limparTelefone(telefone) {
	return telefone.replace(/\D/g, ""); // Remove tudo que não é dígito
}

async function cadastrar() {
	if (senha.value !== confirmarSenha.value) {
		//Verifica se as senhas coincidem
		toastr["error"]("As senhas não coincidem!", "Erro")
		return;
	}

	// VALIDAÇÕES PRIMEIRO (com os dados originais)

	//Confere se todos os campos estão preenchidos
	if (
		!nomeEmpresa.value ||
		!telefone.value ||
		!cnpj.value ||
		!email.value ||
		!senha.value
	) {
		toastr["error"]("Preencha todos os campos", "Erro")
		return;
	}

	// Limpa os dados primeiro
	const telefoneLimpo = limparTelefone(telefone.value);
	const cnpjLimpo = limparCNPJ(cnpj.value);

	// Confere se o telefone é válido
	if (telefoneLimpo.length < 10 || telefoneLimpo.length > 11) {
		toastr["error"]("Telefone inválido!", "Erro");
		return;
	}

	//Confere se o e-mail é válido
	const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value);
	if (!emailValido) {
		toastr["error"]("Digite um e-mail válido!", "Erro")
		return;
	}

	//CNPJ com 14 dígitos (já limpo)
	if (cnpjLimpo.length !== 14) {
		toastr["error"]("CNPJ inválido! Deve conter 14 números", "Erro")
		return;
	}

	//Senha com no mínimo 6 caracteres
	if (senha.value.length < 6) {
		toastr["error"]("A senha deve ter pelo menos 6 caracteres", "Erro")
		return;
	}

	// AGORA CRIA O OBJETO COM OS DADOS LIMPOS PARA ENVIAR AO BANCO
	let usuario = {
		nome: nomeEmpresa.value.trim(), // Remove espaços em branco no início e fim
		telefone: telefoneLimpo, // Só números
		cnpj: cnpjLimpo, // Só números
		email: email.value.toLowerCase().trim(), // Minúsculas e sem espaços
		senha: senha.value,
	};

	// Envia os dados do usuário para o servidor
	try {
		const response = await axios.post("/account/register", usuario);

		if (response.status === 200) {
			toastr["success"]("Cadastro realizado com sucesso!", "Sucesso");

			setTimeout(() => {
				window.location.href = "/login";
			}, 1500);
		}

	} catch (error) {
		console.error(error);

		const mensagem = error.response?.data?.message || "Erro inesperado no cadastro.";
		toastr["error"](mensagem, "Erro no cadastro");
	}
}

// Senha escondida e visível (ícone do olho)
function alternarSenha(inputId, iconId) {
	const input = document.getElementById(inputId);
	const icon = document.getElementById(iconId);

	if (input.type === "password") {
		input.type = "text";
		icon.src = "/assets/imgs/register/icon/eye.svg";
	} else {
		input.type = "password";
		icon.src = "/assets/imgs/register/icon/eye-closed.svg";
	}
}