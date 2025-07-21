const seletorProdutos = document.getElementById('formProducts');
const toggleProduto = document.getElementsByClassName('etiquetaToggleProduto');
const toggleValidade = document.getElementsByClassName(
	'etiquetaToggleValidade'
);
const toggleCodigo = document.getElementsByClassName('etiquetaToggleCodigo');
const etiquetaProduto = document.getElementById('etiquetaProduto');
const etiquetaValidade = document.getElementById('etiquetaValidade');
const etiquetaCodigo = document.getElementById('etiquetaCodigo');

const svg = document.getElementById('barcode');

const cache = localStorage.getItem('dados_empresa');
const dadosEmpresa = JSON.parse(cache);

const PT_BR_DATE_FORMAT = 'DD/MM/YYYY';

let produtos;
let produtoSelecionado;

document.addEventListener('DOMContentLoaded', () => {
	carregarProdutosSelect();
});

//Carregar produtos no select
async function carregarProdutosSelect() {
	//Select do modal editar categoria

	try {
		const response = await axios.post('/label/all', dadosEmpresa);
		if (response.status === 200) {
			produtos = response.data;
			//Criando option pro select
			seletorProdutos.innerHTML =
				'<option value="-1"> Selecione um produto </option>';

			response.data.forEach((produto) => {
				seletorProdutos.innerHTML += `<option value="${produto.id}"> ${produto.nome} </option>`;
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

seletorProdutos.addEventListener('change', async () => {
	const selectedId = parseInt(seletorProdutos.value);

	if (selectedId === -1) {
		produtoSelecionado = null;
		for (const p of toggleProduto) {
			p.style.display = 'none';
		}
		etiquetaProduto.textContent = '';

		for (const p of toggleValidade) {
			p.style.display = 'none';
		}
		etiquetaValidade.textContent = '';

		for (const p of toggleCodigo) {
			p.style.display = 'none';
		}
		etiquetaCodigo.textContent = '';

		svg.innerHTML = ''; // limpa o conteúdo do SVG
		svg.style.display = 'none';

		return;
	}

	try {
		produtoSelecionado = produtos.find((produto) => produto.id === selectedId);

		etiquetaProduto.textContent = produtoSelecionado.nome;

		for (const p of toggleProduto) {
			p.style.display = 'block';
		}

		// Atualiza validade/código se os checkboxes já estiverem marcados
		window.incluirValidade();
		window.incluirCodigoInterno();
		window.incluirCodigoBarra();
	} catch (error) {
		console.error('Erro ao buscar produto:', error);
	}
});

window.incluirValidade = function () {
	const checkbox = document.getElementById('inpCheckboxValidade');

	if (checkbox.checked && produtoSelecionado) {
		etiquetaValidade.textContent = moment(
			produtoSelecionado.data_validade
		).format(PT_BR_DATE_FORMAT);
		for (const p of toggleValidade) {
			p.style.display = 'block';
		}
	} else {
		etiquetaValidade.textContent = '';
		for (const p of toggleValidade) {
			p.style.display = 'none';
		}
	}
};

window.incluirCodigoInterno = function () {
	const checkbox = document.getElementById('inpCheckboxID');

	if (checkbox.checked && produtoSelecionado) {
		etiquetaCodigo.textContent = produtoSelecionado.id;
		for (const p of toggleCodigo) {
			p.style.display = 'block';
		}
	} else {
		etiquetaCodigo.textContent = '';
		for (const p of toggleCodigo) {
			p.style.display = 'none';
		}
	}
};

window.incluirCodigoBarra = function () {
	const selectedId = parseInt(seletorProdutos.value);
	const checkbox = document.getElementById('checkBoxBarcode');

	if (selectedId === -1) {
		svg.innerHTML = ''; // limpa o conteúdo do SVG
		svg.style.display = 'none';

		return;
	}
	console.log(
		'produtoSelecionado.codigo_barra',
		produtoSelecionado.codigo_barra
	);
	if (checkbox.checked && produtoSelecionado) {
		JsBarcode(svg, produtoSelecionado.codigo_barra, {
			format: 'CODE128B',
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
