//Pegando inputs
const nomeInput = document.getElementById('inpAccountNome');
const cnpjInput = document.getElementById('inpAccountCNPJ');
const emailInput = document.getElementById('inpAccountEmail');
const telefoneInput = document.getElementById('inpAccountTel');

document.addEventListener('DOMContentLoaded', async () => {
	const cache = localStorage.getItem('dados_empresa');
	const dadosEmpresa = JSON.parse(cache);

	try {
		const response = await axios.get(`/account/${dadosEmpresa.id}`);

		if (response.status === 200) {
			const conta = response.data[0];
			console.log(conta);
			nomeInput.value = conta.nome;
			cnpjInput.value = conta.cnpj;
			emailInput.value = conta.email;
			telefoneInput.value = conta.telefone;
		}
	} catch (error) {
		console.log(error);
		alert(
			'Erro detalhes da conta: ' + error.response?.data?.message ||
				error.message
		);
	}
});

async function excluirConta() {
	const cache = localStorage.getItem('dados_empresa');
	const dadosEmpresa = JSON.parse(cache);

	try {
		const response = await axios.delete(`/account/${dadosEmpresa.id}`);

		if (response.status === 200) {
			window.location.href = '/login';
			localStorage.removeItem('dados_empresa');
		}
	} catch (error) {
		console.log(error);
		alert(
			'Erro detalhes da conta: ' + error.response?.data?.message ||
				error.message
		);
	}
}

async function salvarAlteracoes() {
	const cache = localStorage.getItem('dados_empresa');
	const dadosEmpresa = JSON.parse(cache);

	const usuario = {
		nome: nomeInput.value.toString(),
		telefone: telefoneInput.value.toString(),
		cnpj: cnpjInput.value.toString(),
		email: emailInput.value.toString(),
	};

	try {
		const response = await axios.put(`/account/${dadosEmpresa.id}`, usuario);

		if (response.status === 200) {
			window.location.reload(true);
		}
	} catch (error) {
		console.error(error);
		alert(
			'Erro no cadastro: ' + error.response?.data?.message || error.message
		);
	}
}
