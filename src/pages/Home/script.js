// SIDEBAR MOBILE
function toggleSidebar() {
	document.getElementById('sidebar').classList.toggle('active');
}

const grafico1 = document.querySelector('.grafico1');
const grafico2 = document.querySelector('.grafico2');
const grafico3 = document.querySelector('.grafico3');
const grafico4 = document.querySelector('.grafico4');
const grafico5 = document.querySelector('.grafico5');
const grafico6 = document.querySelector('.grafico6');

const btnGraf1 = document.querySelector('#btnGraf1');
const btnGraf2 = document.querySelector('#btnGraf2');
const btnGraf3 = document.querySelector('#btnGraf3');
const btnGraf4 = document.querySelector('#btnGraf4');
const btnGraf5 = document.querySelector('#btnGraf5');
const btnGraf6 = document.querySelector('#btnGraf6');

// Variáveis globais para armazenar as instâncias dos gráficos
let chartInstances = {};

function mostrarGrafico(grafMostrar) {
	//Escondendo os gráficos
	grafico1.style.display = 'none';
	grafico2.style.display = 'none';
	grafico3.style.display = 'none';
	grafico4.style.display = 'none';
	grafico5.style.display = 'none';
	grafico6.style.display = 'none';

	//Mostra o gráfico selecionado
	grafMostrar.style.display = 'block';
}

btnGraf1.addEventListener('click', () => mostrarGrafico(grafico1));
btnGraf2.addEventListener('click', () => mostrarGrafico(grafico2));
btnGraf3.addEventListener('click', () => mostrarGrafico(grafico3));
btnGraf4.addEventListener('click', () => mostrarGrafico(grafico4));
btnGraf5.addEventListener('click', () => mostrarGrafico(grafico5));
btnGraf6.addEventListener('click', () => mostrarGrafico(grafico6));

mostrarGrafico(grafico1);

// Função para processar dados do histórico e agrupar por mês ; conta quantas atividades ocorreram em cada mês
function processarDadosHistorico(dadosHistorico) {
	const meses = [
		'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
		'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
	];

	// Inicializar contador para cada mês
	const atividadesPorMes = new Array(12).fill(0);

	// Processar cada registro do histórico
	dadosHistorico.forEach(registro => {
		// Assumindo que existe um campo 'data_criacao' ou similar no histórico
		const data = new Date(registro.data_criacao || registro.created_at || registro.data);
		const mes = data.getMonth(); // getMonth() retorna 0-11

		if (mes >= 0 && mes <= 11) {
			atividadesPorMes[mes]++;
		}
	});

	return {
		labels: meses,
		data: atividadesPorMes
	};
}

// Função para carregar dados do histórico (Faz uma requisição ao backend para buscar o histórico da empresa salva no LocalStorage)
async function carregarDadosHistorico() {
	const cache = localStorage.getItem('dados_empresa');
	const dadosEmpresa = JSON.parse(cache);

	try {
		const response = await axios.post(`/historic/all`, dadosEmpresa);
		if (response.status === 200) {
			return response.data.list;
		} else {
			console.error('Falha ao carregar histórico.');
			return [];
		}
	} catch (error) {
		console.error('Erro ao carregar histórico:', error);
		return [];
	}
}

// Função para criar/atualizar o gráfico de atividades
async function criarGraficoAtividades() {
	try {
		const dadosHistorico = await carregarDadosHistorico();
		const dadosProcessados = processarDadosHistorico(dadosHistorico);

		// Destruir gráfico existente se houver
		if (chartInstances.grafico2) {
			chartInstances.grafico2.destroy();
		}

		chartInstances.grafico2 = new Chart(grafico2, {
			type: 'bar',
			data: {
				labels: dadosProcessados.labels,
				datasets: [
					{
						label: 'Atividades executadas por mês',
						data: dadosProcessados.data,
						borderWidth: 1,
						backgroundColor: '#238856ff',
					},
				],
			},
			options: {
				responsive: true,
				scales: {
					y: {
						beginAtZero: true,
						ticks: {
							stepSize: 1, // Força incrementos de 1 em 1
							callback: function (value) {
								return Number.isInteger(value) ? value : ''; // Mostra apenas números inteiros
							}
						},
						title: {
							display: true,
							text: 'Quantidade de Atividades',
						},
					},
				},
			},
		});
	} catch (error) {
		console.error('Erro ao criar gráfico de atividades:', error);
		// Fallback para dados estáticos em caso de erro
		criarGraficoAtividadesEstatico();
	}
}

// Função de fallback com dados estáticos !para a apresentação somente!
function criarGraficoAtividadesEstatico() {
	if (chartInstances.grafico2) {
		chartInstances.grafico2.destroy();
	}

	// Dados mockados mais realistas para apresentação
	const dadosMockados = [45, 62, 78, 91, 156, 134, 89, 102, 67, 85, 73, 95]; // Maio tem 156 atividades
	const coresPorMes = dadosMockados.map((valor, index) => {
		// Maio (índice 4) em destaque
		return index === 4 ? '#1a5f3f' : '#238856ff';
	});

	chartInstances.grafico2 = new Chart(grafico2, {
		type: 'bar',
		data: {
			labels: [
				'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
				'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
			],
			datasets: [
				{
					label: 'Atividades executadas por mês',
					data: dadosMockados,
					borderWidth: 1,
					backgroundColor: coresPorMes,
					borderColor: coresPorMes,
				},
			],
		},
		options: {
			responsive: true,
			plugins: {
				tooltip: {
					callbacks: {
						afterLabel: function (context) {
							if (context.dataIndex === 4) { // Maio
								return 'Pico de atividades no mês!';
							}
							return '';
						}
					}
				}
			},
			scales: {
				y: {
					beginAtZero: true,
					ticks: {
						stepSize: 20,
						callback: function (value) {
							return Number.isInteger(value) ? value : '';
						}
					},
					title: {
						display: true,
						text: 'Quantidade de Atividades',
					},
				},
			},
		},
	});
}

// ===== FUNÇÕES PARA GRÁFICO DE CATEGORIAS (NOVO) =====

// Função para carregar dados das categorias
async function carregarDadosCategorias() {
	const cache = localStorage.getItem('dados_empresa');
	const dadosEmpresa = JSON.parse(cache);

	try {
		const response = await axios.post(`/category/all`, dadosEmpresa);
		if (response.status === 200) {
			return response.data;
		} else {
			console.error('Falha ao carregar categorias.');
			return [];
		}
	} catch (error) {
		console.error('Erro ao carregar categorias:', error);
		return [];
	}
}

// Função para carregar produtos e contar por categoria
async function carregarProdutosPorCategoria() {
	const cache = localStorage.getItem('dados_empresa');
	const dadosEmpresa = JSON.parse(cache);

	try {
		const response = await axios.post(`/product/all`, dadosEmpresa);
		if (response.status === 200) {
			return response.data.list;
		} else {
			console.error('Falha ao carregar produtos.');
			return [];
		}
	} catch (error) {
		console.error('Erro ao carregar produtos:', error);
		return [];
	}
}

// Função para processar dados de categorias
function processarDadosCategorias(categorias, produtos) {
	// Criar um mapa para contar produtos por categoria
	const contagemPorCategoria = {};

	// Inicializar contador para todas as categorias
	categorias.forEach(categoria => {
		contagemPorCategoria[categoria.id] = {
			nome: categoria.nome,
			cor: categoria.cor,
			quantidade: 0
		};
	});

	// Contar produtos por categoria
	produtos.forEach(produto => {
		if (produto.categoria_id && contagemPorCategoria[produto.categoria_id]) {
			contagemPorCategoria[produto.categoria_id].quantidade++;
		}
	});

	// Converter para arrays para o gráfico
	const labels = [];
	const data = [];
	const backgroundColors = [];

	Object.values(contagemPorCategoria).forEach(categoria => {
		labels.push(categoria.nome);
		data.push(categoria.quantidade);
		backgroundColors.push(categoria.cor || '#489d73'); // Usa a cor da categoria ou uma padrão
	});

	return {
		labels: labels,
		data: data,
		backgroundColors: backgroundColors
	};
}

// Função para criar/atualizar o gráfico de categorias
async function criarGraficoCategorias() {
	try {
		const categorias = await carregarDadosCategorias();
		const produtos = await carregarProdutosPorCategoria();

		if (categorias.length === 0) {
			console.warn('Nenhuma categoria encontrada, usando dados estáticos');
			criarGraficoCategoriasEstatico();
			return;
		}

		const dadosProcessados = processarDadosCategorias(categorias, produtos);

		// Destruir gráfico existente se houver
		if (chartInstances.grafico1) {
			chartInstances.grafico1.destroy();
		}

		chartInstances.grafico1 = new Chart(grafico1, {
			type: 'bar',
			data: {
				labels: dadosProcessados.labels,
				datasets: [
					{
						label: 'Quantidade de produtos por categoria',
						data: dadosProcessados.data,
						borderWidth: 1,
						backgroundColor: dadosProcessados.backgroundColors,
						borderColor: dadosProcessados.backgroundColors,
					},
				],
			},
			options: {
				responsive: true,
				plugins: {
					tooltip: {
						callbacks: {
							afterLabel: function (context) {
								const total = context.dataset.data.reduce((a, b) => a + b, 0);
								const percentage = ((context.parsed.y / total) * 100).toFixed(1);
								return `${percentage}% do total`;
							}
						}
					}
				},
				scales: {
					y: {
						beginAtZero: true,
						ticks: {
							stepSize: 1,
							callback: function (value) {
								return Number.isInteger(value) ? value : '';
							}
						},
						title: {
							display: true,
							text: 'Quantidade de Produtos',
						},
					},
					x: {
						ticks: {
							maxRotation: 45,
							minRotation: 0
						}
					}
				},
			},
		});

		console.log('Gráfico de categorias carregado com dados reais');

	} catch (error) {
		console.error('Erro ao criar gráfico de categorias:', error);
		// Fallback para dados estáticos em caso de erro
		criarGraficoCategoriasEstatico();
	}
}

// Função de fallback com dados estáticos para categorias
function criarGraficoCategoriasEstatico() {
	if (chartInstances.grafico1) {
		chartInstances.grafico1.destroy();
	}

	chartInstances.grafico1 = new Chart(grafico1, {
		type: 'bar',
		data: {
			labels: [
				'Eletrônicos', 'Roupas', 'Alimentação', 'Casa', 'Livros', 'Esporte'
			],
			datasets: [
				{
					label: 'Quantidade de produtos por categoria',
					data: [120, 40, 34, 60, 58, 47],
					borderWidth: 1,
					backgroundColor: '#489d73',
				},
			],
		},
		options: {
			responsive: true,
			scales: {
				y: {
					beginAtZero: true,
					title: {
						display: true,
						text: 'Quantidade',
					},
				},
			},
		},
	});
}

// ===== FUNÇÕES PARA GRÁFICO DE VALIDADES (NOVO) =====

// Função para carregar todos os produtos para análise de validade
async function carregarProdutosParaValidade() {
	const cache = localStorage.getItem('dados_empresa');
	const dadosEmpresa = JSON.parse(cache);

	try {
		const response = await axios.post(`/product/all`, dadosEmpresa);
		if (response.status === 200) {
			return response.data.list;
		} else {
			console.error('Falha ao carregar produtos para validade.');
			return [];
		}
	} catch (error) {
		console.error('Erro ao carregar produtos para validade:', error);
		return [];
	}
}

// Função para processar dados de validade e agrupar por mês
function processarDadosValidade(produtos) {
	const meses = [
		'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
		'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
	];

	// Inicializar contadores para cada mês
	const produtosVencendoEm30Dias = new Array(12).fill(0);
	const produtosVencidos = new Array(12).fill(0);

	const hoje = new Date();
	const em30Dias = new Date();
	em30Dias.setDate(hoje.getDate() + 30);

	// Processar cada produto
	produtos.forEach(produto => {
		if (produto.data_validade) {
			const dataValidade = new Date(produto.data_validade);
			const mes = dataValidade.getMonth(); // getMonth() retorna 0-11

			if (mes >= 0 && mes <= 11) {
				// Produto já vencido
				if (dataValidade < hoje) {
					produtosVencidos[mes]++;
				}
				// Produto vence em 30 dias
				else if (dataValidade <= em30Dias) {
					produtosVencendoEm30Dias[mes]++;
				}
			}
		}
	});

	return {
		labels: meses,
		vencendoEm30Dias: produtosVencendoEm30Dias,
		vencidos: produtosVencidos
	};
}

// Função para criar/atualizar o gráfico de validades com dados reais
async function criarGraficoValidades() {
	try {
		const produtos = await carregarProdutosParaValidade();

		if (produtos.length === 0) {
			console.warn('Nenhum produto encontrado, usando dados estáticos');
			criarGraficoValidadesEstatico();
			return;
		}

		const dadosProcessados = processarDadosValidade(produtos);

		// Destruir gráfico existente se houver
		if (chartInstances.grafico3) {
			chartInstances.grafico3.destroy();
		}

		chartInstances.grafico3 = new Chart(grafico3, {
			type: 'bar',
			data: {
				labels: dadosProcessados.labels,
				datasets: [
					{
						label: 'Produtos a vencer em 30 dias',
						data: dadosProcessados.vencendoEm30Dias,
						borderWidth: 1,
						backgroundColor: '#138848ff',
					},
					{
						label: 'Produtos vencidos',
						data: dadosProcessados.vencidos,
						borderWidth: 1,
						backgroundColor: '#48a77aff',
					},
				],
			},
			options: {
				responsive: true,
				plugins: {
					tooltip: {
						callbacks: {
							afterLabel: function (context) {
								const dataset = context.dataset.label;
								const value = context.parsed.y;
								if (value > 0) {
									if (dataset.includes('vencer')) {
										return 'Atenção necessária!';
									} else if (dataset.includes('vencidos')) {
										return 'Ação urgente requerida!';
									}
								}
								return '';
							}
						}
					}
				},
				scales: {
					y: {
						beginAtZero: true,
						ticks: {
							stepSize: 1,
							callback: function (value) {
								return Number.isInteger(value) ? value : '';
							}
						},
						title: {
							display: true,
							text: 'Quantidade de Produtos',
						},
					},
				},
			},
		});

		console.log('Gráfico de validades carregado com dados reais');

	} catch (error) {
		console.error('Erro ao criar gráfico de validades:', error);
		// Fallback para dados estáticos em caso de erro
		criarGraficoValidadesEstatico();
	}
}

// Função de fallback com dados estáticos para validades
function criarGraficoValidadesEstatico() {
	if (chartInstances.grafico3) {
		chartInstances.grafico3.destroy();
	}

	chartInstances.grafico3 = new Chart(grafico3, {
		type: 'bar',
		data: {
			labels: [
				'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
				'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
			],
			datasets: [
				{
					label: 'Produtos a vencer em 30 dias',
					data: [120, 40, 34, 60, 58, 47, 140, 150, 157, 102, 98, 183],
					borderWidth: 1,
					backgroundColor: '#138848ff',
				},
				{
					label: 'Produtos vencidos',
					data: [100, 50, 45, 70, 65, 55, 130, 140, 145, 95, 88, 170],
					borderWidth: 1,
					backgroundColor: '#48a77aff',
				},
			],
		},
		options: {
			responsive: true,
			scales: {
				y: {
					beginAtZero: true,
					title: {
						display: true,
						text: 'Quantidade',
					},
				},
			},
		},
	});
}

/* 
	Gráficos 4, 5, 6 (desabilitados - mantidos estáticos) --> falta integração daquelas funções com o banco ainda
*/
chartInstances.grafico4 = new Chart(grafico4, {
	type: 'line',
	data: {
		labels: [
			'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
			'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
		],
		datasets: [
			{
				label: 'Movimentação',
				data: [120, 40, 34, 60, 58, 47, 140, 150, 157, 102, 98, 183],
				borderWidth: 1,
				backgroundColor: '#873e23',
			},
		],
	},
	options: {
		responsive: true,
		scales: {
			y: {
				beginAtZero: true,
				title: {
					display: true,
					text: 'Quantidade',
				},
			},
		},
	},
});

chartInstances.grafico5 = new Chart(grafico5, {
	type: 'bar',
	data: {
		labels: [
			'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
			'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
		],
		datasets: [
			{
				label: 'Alertas',
				data: [120, 40, 34, 60, 58, 47, 140, 150, 157, 102, 98, 183],
				borderWidth: 1,
				backgroundColor: '#873e23',
			},
		],
	},
	options: {
		responsive: true,
		scales: {
			y: {
				beginAtZero: true,
				title: {
					display: true,
					text: 'Quantidade',
				},
			},
		},
	},
});

chartInstances.grafico6 = new Chart(grafico6, {
	type: 'bar',
	data: {
		labels: [
			'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
			'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
		],
		datasets: [
			{
				label: 'Etiquetas Impressas',
				data: [120, 40, 34, 60, 58, 47, 140, 150, 157, 102, 98, 183],
				borderWidth: 1,
				backgroundColor: '#873e23',
			},
		],
	},
	options: {
		responsive: true,
		scales: {
			y: {
				beginAtZero: true,
				title: {
					display: true,
					text: 'Quantidade',
				},
			},
		},
	},
});

//Modal de configurações >>>>>>>> LOGOUT
function abrirModalConfig() {
	document.getElementById('ModalConfig').style.display = 'block';
}

function fecharModal() {
	document.getElementById('ModalConfig').style.display = 'none';
}

document.addEventListener('click', function (event) {
	const modal = document.getElementById('ModalConfig');
	const boxLogout = document.getElementById('boxLogout');
	const boxConfigEtiq = document.getElementById('boxConfigEtiq');

	if (
		modal.style.display === 'block' &&
		!boxLogout.contains(event.target) &&
		!boxConfigEtiq.contains(event.target)
	) {
		fecharModal();
	}
});

// Carregar as informações da home
async function carregarHome() {
	const cache = localStorage.getItem('dados_empresa');
	const dadosEmpresa = JSON.parse(cache);

	// Se não tem dados da empresa, sai sem fazer nada
	if (!dadosEmpresa) {
		return;
	}

	try {
		const response = await axios.post(`/product/all`, dadosEmpresa);
		if (response.status === 200) {
			renderizarTabela(response.data.list);
		} else {
			alert('Falha ao carregar a home.');
		}
	} catch (error) {
		console.log(error);
		// Não mostra alert se não tem dados da empresa
		// alert('Erro tela home: ' + error.response?.data?.message || error.message);
	}
}

// ===== FUNÇÃO PARA CARREGAR DADOS DA ÚLTIMA ATUALIZAÇÃO =====

function getDescricaoAcao(tipoAcao) {
	if (!tipoAcao) return 'Ação';

	const acoes = {
		'ADICIONADO': 'Entrada de',
		'EDITADO': 'Alteração de',
		'EXCLUIDO': 'Exclusão de'
	};

	return acoes[tipoAcao] || tipoAcao;
} 

async function carregarUltimaAtualizacao() {
	const cache = localStorage.getItem('dados_empresa');
	const dadosEmpresa = JSON.parse(cache);

	try {
		const response = await axios.post(`/historic/recent`, dadosEmpresa);
		if (response.status === 200) {
			const ultimaEntrada = response.data;
			atualizarUltimaAtualizacao(ultimaEntrada);
		}
	} catch (error) {
		console.error('Erro ao carregar última atualização:', error);
		atualizarUltimaAtualizacao(null);
	}
}

function atualizarUltimaAtualizacao(entradas) {
	const quantidadeElement = document.querySelector('.ultima-atualizacao .quantidade');
	const horaElement = document.querySelector('.ultima-atualizacao .hora');
	if (!quantidadeElement || !horaElement) return;

	if (!entradas || entradas.length === 0) {
		quantidadeElement.textContent = 'Nenhuma ação recente';
		horaElement.textContent = '';
		return;
	}

	const ultima = Array.isArray(entradas) ? entradas[0] : entradas;

	const descricaoAcao = getDescricaoAcao(ultima.tipo);
	const quantidade = ultima.quantidade || 1;

	const data = new Date(ultima.data_criacao || ultima.created_at);
	const horaFormatada = `${data.getHours()}:${data.getMinutes().toString().padStart(2, '0')}`;

	quantidadeElement.textContent = `${descricaoAcao} ${quantidade} produto${quantidade > 1 ? 's' : ''}`;
	horaElement.textContent = `às ${horaFormatada}`;
}

// ===== FUNÇÃO PARA CARREGAR ALERTAS DO ESTOQUE =====
async function carregarAlertas() {
	const cache = localStorage.getItem('dados_empresa');
	const dadosEmpresa = JSON.parse(cache);

	try {
		const response = await axios.post(`/product/all`, dadosEmpresa);
		if (response.status === 200) {
			const produtos = response.data.list;
			processarAlertas(produtos);
		}
	} catch (error) {
		console.error('Erro ao carregar alertas:', error);
		// Fallback - manter os dados que já estão na tela
	}
}

// Função para processar e contar os alertas
function processarAlertas(produtos) {
	const hoje = new Date();
	const em30Dias = new Date();
	em30Dias.setDate(hoje.getDate() + 30);

	let contadores = {
		maximo: 0,
		minimo: 0,
		vencidos: 0,
		proximoVencimento: 0
	};

	produtos.forEach(produto => {
		// Verificar estoque máximo (assumindo que existe um campo estoque_maximo)
		if (produto.estoque_maximo && produto.quantidade > produto.estoque_maximo) {
			contadores.maximo++;
		}

		// Verificar estoque mínimo (assumindo que existe um campo estoque_minimo)
		if (produto.estoque_minimo && produto.quantidade < produto.estoque_minimo) {
			contadores.minimo++;
		}

		// Verificar produtos vencidos
		if (produto.data_validade) {
			const dataValidade = new Date(produto.data_validade);
			if (dataValidade < hoje) {
				contadores.vencidos++;
			} else if (dataValidade <= em30Dias) {
				contadores.proximoVencimento++;
			}
		}
	});

	// Atualizar a UI dos alertas
	atualizarAlertas(contadores);
}

// Função para atualizar a UI dos alertas
function atualizarAlertas(contadores) {
	// Você precisa adicionar IDs ou classes específicas nos elementos HTML dos alertas
	const alertaMaximo = document.querySelector('.alerta-maximo .quantidade');
	const alertaMinimo = document.querySelector('.alerta-minimo .quantidade');
	const alertaVencidos = document.querySelector('.alerta-vencidos .quantidade');
	const alertaProximoVenc = document.querySelector('.alerta-proximo-venc .quantidade');

	if (alertaMaximo) {
		alertaMaximo.textContent = `${contadores.maximo} produto${contadores.maximo !== 1 ? 's' : ''} ${contadores.maximo !== 1 ? 'excedem' : 'excede'} o estoque máximo`;
	}

	if (alertaMinimo) {
		alertaMinimo.textContent = `${contadores.minimo} produto${contadores.minimo !== 1 ? 's' : ''} abaixo do estoque mínimo`;
	}

	if (alertaVencidos) {
		alertaVencidos.textContent = `${contadores.vencidos} produto${contadores.vencidos !== 1 ? 's estão' : ' está'} vencido${contadores.vencidos !== 1 ? 's' : ''} no estoque`;
	}

	if (alertaProximoVenc) {
		alertaProximoVenc.textContent = `${contadores.proximoVencimento} produto${contadores.proximoVencimento !== 1 ? 's próximos' : ' próximo'} do vencimento`;
	}
}


// Função para inicializar tudo
async function inicializarHome() {
	await carregarHome();

	// Carregar última atualização e alertas
	await carregarUltimaAtualizacao();
	await carregarAlertas();

	// Para !!apresentação!! vamos usar dados mockados pra ficar perto da realidade
	// GRÁFICOS ESTÁTICOS (dados mockados) ================

	// gráfico de categoria
	// criarGraficoCategoriasEstatico();

	// gráfico de atividades
	criarGraficoAtividadesEstatico();

	// gráfico de validades
	criarGraficoValidadesEstatico();

	// GRÁFICOS REAIS (dados do banco) ================

	// Tirar o coment das linhas abaixo pra usar dados reais (e lembrar de comentar as de cima)

	// Carregar gráfico de atividades com dados reais
	// await criarGraficoAtividades();

	// Carregar gráfico de categorias com dados reais
	await criarGraficoCategorias();

	// Carregar gráfico de validades com dados reais
	// await criarGraficoValidades();
}

document.addEventListener('DOMContentLoaded', () => {
	inicializarHome();
});