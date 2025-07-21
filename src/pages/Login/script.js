async function login() {
	let login = document.getElementById('inpLogNome').value.trim(); // pode ser email ou CNPJ // trim: remove os espaços em branco do início e do fim de uma string.
	let senha = document.getElementById('inpLogSenha').value;

	// Verifica se os campos estão preenchidos
	if (!login || !senha) {
		toastr["error"]("Preencha todos os campos!", "Erro");
		return;
	}

	// Verifica se é um CNPJ ou um e-mail
	const cnpjLimpo = login.replace(/\D/g, '');
	const confereCNPJ = cnpjLimpo.length === 14;
	const confereEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(login);

	if (!confereCNPJ && !confereEmail) {
		toastr["error"]("Digite um e-mail ou CNPJ válido!", "Erro");
		return;
	}

	// Validação de senha (opcional)
	if (senha.length < 6) {
		toastr["error"]("A senha deve ter pelo menos 6 caracteres.", "Erro");
		return;
	}

	const usuario = {
		emailOuCnpj: login,
		senha,
	};

	try {
		const response = await axios.post('/auth/login', usuario);
		console.log('RESPONSE: ', response);
		if (response.status === 200) {
			// Handle success - redirect or show success message
			toastr["success"]("Login realizado com sucesso!", "Bem-vindo!");
			localStorage.setItem('dados_empresa', JSON.stringify(response.data));
			setTimeout(() => {
				window.location.href = '/home';
			}, 1500);
		}
	} catch (error) {
		console.log(error);
		const mensagem = error.response?.data?.message || "Erro inesperado no login.";
		toastr["error"](mensagem, "Erro no login");
	}
}

// A mais

function alternarSenha(inputId) {
	const input = document.getElementById(inputId);
	const icon = input.parentElement.querySelector('img'); // pega o ícone dentro do mesmo container

	if (input.type === 'password') {
		input.type = 'text';
		icon.src = '/assets/imgs/login/icon/cadeado-aberto.svg'; // olho aberto
	} else {
		input.type = 'password';
		icon.src = '/assets/imgs/login/icon/cadeado.svg'; // olho fechado
	}
}
