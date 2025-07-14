async function login() {
	let login = document.getElementById('inpLogNome').value; // pode ser email ou CNPJ
	let senha = document.getElementById('inpLogSenha').value;

	const usuario = {
		emailOuCnpj: login,
		senha,
	};

	try {
		const response = await axios.post('/login', usuario);
		console.log('RESPONSE: ', response);
		if (response.status === 200) {
			// Handle success - redirect or show success message
			window.location.href = '/home';
            localStorage.setItem('dados_empresa', JSON.stringify(response.data));
		}
	} catch (error) {
		console.log(error);
		alert('Erro no login: ' + error.response?.data?.message || error.message);
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
