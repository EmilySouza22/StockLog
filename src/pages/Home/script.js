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
/* 
    Gráfico 1. Status Geral do Estoque
    - Radar
*/
grafico1.style.display = 'block';
new Chart(grafico1, {
	type: 'pie',
	data: {
		labels: [
			'Janeiro',
			'Fevereiro',
			'Março',
			'Abril',
			'Maio',
			'Junho',
			'Julho',
			'Agosto',
			'Setembro',
			'Outubro',
			'Novembro',
			'Dezembro',
		],
		datasets: [
			{
				label: 'Etiquetas Impressas',
				data: [120, 40, 34, 60, 58, 47, 140, 150, 157, 102, 98, 183],
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

/* 
    Gráfico 2. Quantidade de Produtos por Categoria
    Gráfico de barras ou pizza

*/

new Chart(grafico2, {
	type: 'bar',
	data: {
		labels: [
			'Janeiro',
			'Fevereiro',
			'Março',
			'Abril',
			'Maio',
			'Junho',
			'Julho',
			'Agosto',
			'Setembro',
			'Outubro',
			'Novembro',
			'Dezembro',
		],
		datasets: [
			{
				label: 'Etiquetas Impressas',
				data: [120, 40, 34, 60, 58, 47, 140, 150, 157, 102, 98, 183],
				borderWidth: 1,
				backgroundColor: '#2596be',
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

/*

    Gráfico 3. Entradas e Saídas no Mês
    Gráfico de linhas ou colunas agrupadas

*/

new Chart(grafico3, {
	type: 'line',
	data: {
		labels: [
			'Janeiro',
			'Fevereiro',
			'Março',
			'Abril',
			'Maio',
			'Junho',
			'Julho',
			'Agosto',
			'Setembro',
			'Outubro',
			'Novembro',
			'Dezembro',
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

/* 
    Gráfico 4. Histórico de Ações
    Gráfico de Área

*/

new Chart(grafico4, {
	type: 'line',
	data: {
		labels: [
			'Janeiro',
			'Fevereiro',
			'Março',
			'Abril',
			'Maio',
			'Junho',
			'Julho',
			'Agosto',
			'Setembro',
			'Outubro',
			'Novembro',
			'Dezembro',
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

/* 
    Gráfico 5. Etiquetas impressas por período
    Gráfico de colunas

*/

new Chart(grafico5, {
	type: 'bar',
	data: {
		labels: [
			'Janeiro',
			'Fevereiro',
			'Março',
			'Abril',
			'Maio',
			'Junho',
			'Julho',
			'Agosto',
			'Setembro',
			'Outubro',
			'Novembro',
			'Dezembro',
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

/*
    Gráfico 6. Tendência de Validades
    Gráfico de Linhas Duplas
*/

new Chart(grafico6, {
	type: 'bar',
	data: {
		labels: [
			'Janeiro',
			'Fevereiro',
			'Março',
			'Abril',
			'Maio',
			'Junho',
			'Julho',
			'Agosto',
			'Setembro',
			'Outubro',
			'Novembro',
			'Dezembro',
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

document.addEventListener('click', function(event) {
    const modal = document.getElementById('ModalConfig');
    const boxLogout = document.getElementById('boxLogout');
    const boxConfigEtiq = document.getElementById('boxConfigEtiq');
    
    if (modal.style.display === 'block' && 
        !boxLogout.contains(event.target) && 
        !boxConfigEtiq.contains(event.target)) {
        fecharModal();
    }
});