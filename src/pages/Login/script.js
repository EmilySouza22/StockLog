function login() {
	let login = document.getElementById('inpLogNome').value; // pode ser email ou CNPJ
	let senha = document.getElementById('inpLogSenha').value;

	let usuarios = JSON.parse(localStorage.getItem('usuarios'));

	if (!usuarios) {
		alert('Nenhum usuário cadastrado, por favor, cadastre-se primeiro.');
		return;
	}
	// Procura usuário que tenha email OU cnpj igual ao que digitou
	let usuarioEncontrado = usuarios.find(
		(usuario) => usuario.email === login || usuario.cnpj === login
	);

	if (!usuarioEncontrado) {
		alert('E-mail ou CNPJ não cadastrado');
		return;
	}

	if (usuarioEncontrado.senha !== senha) {
		alert('Senha incorreta');
		return;
	}

	alert('Login aprovado! Seja bem-vindo(a)!');
	window.location.href = '/home';
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
