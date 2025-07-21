const cache = localStorage.getItem('dados_empresa');
const dadosEmpresa = JSON.parse(cache);

//Carregar produtos no select
async function carregarProdutosSelect() {
	//Select do modal editar categoria
	const selectModal = document.getElementById('formProducts');

	try {
		const response = await axios.post('/label/all', dadosEmpresa);
		if (response.status === 200) {
			//Criando option pro select
			selectModal.innerHTML =
				'<option value=""> Selecione um produto </option>';

			response.data.forEach((produto) => {
				selectModal.innerHTML += `<option value="${produto.nome}"> ${produto.nome} </option>`;
			});
		}
	} catch (error) {
		console.log(error);
		alert(
			'Erro ao carregar produtos do select das etiquetas: ' +
				error.response?.data?.message || error.message
		);
	}
}

document.addEventListener('DOMContentLoaded', () => {
	carregarProdutosSelect();
});

window.incluirCodigoBarra = function () {
	const checkbox = document.getElementById('checkBoxBarcode');
	const svg = document.getElementById('barcode');

	if (checkbox.checked) {
		const valor = '123456789012'; // aqui você pode colocar o código real do produto
		JsBarcode(svg, valor, {
			format: 'EAN13',
			displayValue: true,
			fontSize: 14,
			height: 40,
		});
		svg.style.display = 'block';
	} else {
		svg.innerHTML = ''; // limpa o conteúdo do SVG
		svg.style.display = 'none';
	}
};

window.incluirValidade = function () {
	const checkbox = document.querySelector('#inpCheckboxValidade input');

	if (checkbox.checked && produtoSelecionado) {
		etiquetaValidade.textContent = `Validade: ${produtoSelecionado.validade}`;
		toggleValidade.forEach((p) => (p.style.display = 'block'));
	} else {
		etiquetaValidade.textContent = '';
		toggleValidade.forEach((p) => (p.style.display = 'none'));
	}
};

window.incluirCodigoInterno = function () {
	const checkbox = document.querySelector('#inpCheckboxID input');

	if (checkbox.checked && produtoSelecionado) {
		etiquetaCodigo.textContent = `Código: ${produtoSelecionado.codigo_interno}`;
		toggleCodigo.forEach((p) => (p.style.display = 'block'));
	} else {
		etiquetaCodigo.textContent = '';
		toggleCodigo.forEach((p) => (p.style.display = 'none'));
	}
};

selectProdutos.addEventListener('change', async () => {
	const selectedIndex = selectProdutos.value;

	if (selectedIndex === '-1') {
		produtoSelecionado = null;
		toggleProduto.forEach((p) => (p.style.display = 'none'));
		etiquetaProduto.textContent = '';
		return;
	}

	try {
		const { data } = await axios.get(`/produtos/${produto.id}`);
		produtoSelecionado = data;

		etiquetaProduto.textContent = `Produto: ${produtoSelecionado.nome}`;
		toggleProduto.forEach((p) => (p.style.display = 'block'));

		// Atualiza validade/código se os checkboxes já estiverem marcados
		window.incluirValidade();
		window.incluirCodigoInterno();
	} catch (error) {
		console.error('Erro ao buscar produto:', error);
	}
});
