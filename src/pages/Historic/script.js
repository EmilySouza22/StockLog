//Variaveis para definir o formato das datas para usar com a biblioteca MOMENT.JS :)
const ISO_FORMAT = 'YYYY-MM-DDTHH:mm:ss.sssZ';
const PT_BR_DATE_FORMAT = 'DD/MM/YYYY';
const PT_BR_TIME_FORMAT = 'HH:mm';
const INPUT_FORMAT = 'YYYY-MM-DD';

//Pegando inputs paginação
const qtd_produtos = document.getElementById('footer-qtd-produtos');
const total_produtos = document.getElementById('footer-total-produtos');
const pagina_atual = document.getElementById('footer-pag-atual');
const pagina_total = document.getElementById('footer-pag-total');

const btnVoltarPagina = document.getElementById('bnt-pag-voltar');
const btnProximaPagina = document.getElementById('bnt-pag-proximo');

const limite_por_pagina = 10;

function voltarPagina() {
	const valor = parseInt(pagina_atual.innerHTML) - 1;
	pagina_atual.innerHTML = valor < 1 ? 1 : valor;
	return carregarHistorico();
}

function avancarPagina() {
	const valor = parseInt(pagina_atual.innerHTML) + 1;
	const maximo = parseInt(pagina_total.innerHTML);
	pagina_atual.innerHTML = valor > maximo ? maximo : valor;
	return carregarHistorico();
}

function obterTag(dados) {
	const { tipo } = dados;

	let icone;
	switch (tipo) {
		case 'ADICIONADO':
			icone = `/assets/imgs/historic/icon/entrada.svg`;
			break;

		case 'ALTO_VOLUME':
			icone = `/assets/imgs/historic/icon/maximo.svg`;
			break;

		case 'BAIXO_VOLUME':
			icone = `/assets/imgs/historic/icon/minimo.svg`;
			break;

		case 'CATEGORIA':
			icone = `/assets/imgs/historic/icon/categoria.svg`;
			break;

		case 'EDITADO':
			icone = `/assets/imgs/historic/icon/edit.svg`;
			break;

		case 'ETIQUETA':
			icone = `/assets/imgs/historic/icon/etiqueta.svg`;
			break;

		case 'EXCLUIDO':
			icone = `/assets/imgs/historic/icon/delete.svg`;
			break;

		case 'FORA_DE_ESTOQUE':
			icone = `/assets/imgs/historic/icon/saida.svg`;
			break;

		case 'VENCIDO':
			icone = `/assets/imgs/historic/icon/vencido.svg`;
			break;

		case 'VENCENDO':
			icone = `/assets/imgs/historic/icon/vencendo.svg`;
			break;

		default:
			icone = `/assets/imgs/historic/icon/empty.svg`;
			break;
	}

	return icone;
}

async function carregarHistorico() {
	const cache = localStorage.getItem('dados_empresa');
	const dadosEmpresa = JSON.parse(cache);

	if (!dadosEmpresa) {
		// TODO redirecionar usuario para a tela de login
		return;
	}

	const pagina = parseInt(pagina_atual.innerHTML);
	const offset = (pagina - 1) * limite_por_pagina;

	try {
		const response = await axios.post(
			`/historic/all?limit=${limite_por_pagina}&offset=${offset}`,
			dadosEmpresa
		);
		if (response.status === 200) {
			renderizarTabela(response.data.list);
			total_produtos.innerHTML = parseInt(response.data.total);
			qtd_produtos.innerHTML = response.data.list.length;

			const paginaCalculada = Math.ceil(
				parseInt(response.data.total) / parseInt(limite_por_pagina)
			);
			pagina_total.innerHTML = paginaCalculada > 0 ? paginaCalculada : 1;
		} else {
			alert('Falha ao carregar produtos.');
		}
	} catch (error) {
		console.log(error);
		alert(
			'Erro tela de produtos: ' + error.response?.data?.message || error.message
		);
	}
}

// Função para renderizar a tabela produtos
async function renderizarTabela(dados = []) {
	if (!dados || dados.length === 0 || !Array.isArray(dados)) {
		tbody.innerHTML = '<tr><td colspan="5">Nenhum dado disponível</td></tr>';
		return;
	}

	const tbody = document.getElementById('body');
	tbody.innerHTML = '';

	dados.forEach((item) => {
		const dataCriacao = moment(item.data_criacao);
		const tr = document.createElement('tr');
		tr.innerHTML = `
            <td>${dataCriacao.format(PT_BR_DATE_FORMAT)}</td>
            <td>${dataCriacao.format(PT_BR_TIME_FORMAT)}</td>
            <td>${item.produto_nome || ''}</td>
            <td>
                <img 
                    src="${obterTag(item)}" 
                    alt="${item.tipo}" 
                    class="icons-tabela"
                >
            </td>
            <td>${item.detalhe || ''}</td>
        `;
		tbody.appendChild(tr);
	});
}

// Carrega dados ao inicializar a página
document.addEventListener('DOMContentLoaded', () => {
	carregarHistorico();
});
