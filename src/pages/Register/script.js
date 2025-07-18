// Função para cadastrar o usuário, verificação e o salvamento no localStorage
const nomeEmpresa = document.getElementById('inpLogNome');
const telefone = document.getElementById('inpLogTelefone');
const cnpj = document.getElementById('inpLogCNPJ');
const email = document.getElementById('inpLogEmail');
const senha = document.getElementById('inpLogSenha');
const confirmarSenha = document.getElementById('inpLogSenhaConf');

//Listener para o telefone e cnpj ver se tem palavras e traços
// telefone.addEventListener('input', (event) => {
// 	console.log(event);
// 	if (!(event.data >= '0' && event.data <= '9')) {
// 	}
// });

//Função que vai verificar se já existe algum usuário com o cpnj ou com o email

function usuarioJaExiste(cnpj, email) {
	const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

	return usuarios.some(
		(u) =>
			u.cnpj.toLowerCase() === cnpj.toLowerCase() ||
			u.email.toLowerCase() === email.toLowerCase()
	);
}


async function cadastrar() {
	if (senha.value.toString() !== confirmarSenha.value.toString()) {
		// Verifica se as senhas coincidem
		alert('As senhas não coincidem!');
		return; // Se não coincidirem, exibe um alerta e encerra a função
	}

	let usuario = {
		// Cria um objeto com os dados do usuário
		nome: nomeEmpresa.value.toString(),
		telefone: telefone.value.toString(),
		cnpj: cnpj.value.toString(),
		email: email.value.toString(),
		senha: senha.value.toString(),
	};

	if (usuarioJaExiste(usuario.cnpj, usuario.email)) {
	alert('Já existe uma conta com esse CNPJ ou e-mail!');
	return;
	}

	try {
		const response = await axios.post('/account/register', usuario);

		if (response.status === 200) {
			// Handle success - redirect or show success message
			window.location.href = '/login';
		}
	} catch (error) {
		console.error(error);
		alert(
			'Erro no cadastro: ' + error.response?.data?.message || error.message
		);
	}
}


// Senha escondida e vísivel
function alternarSenha(inputId, iconId) {
	const input = document.getElementById(inputId);
	const icon = document.getElementById(iconId);

	if (input.type === 'password') {
		input.type = 'text';
		icon.src = '/assets/imgs/register/icon/eye.svg'; // ícone de olho aberto
	} else {
		input.type = 'password';
		icon.src = '/assets/imgs/register/icon/eye-closed.svg'; // ícone de olho fechado
	}
}
