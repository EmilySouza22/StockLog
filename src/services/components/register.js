import { inserirEmpresa } from '../models/register.js';

export async function adicionarEmpresa(data) {
	// AQUI PODEMOS TRATAR O OBJETO ANTES DE IR PRO MODEL
	// Ex: data.cnpj podemos verificar se tem 14 digitos e apenas numeros
	return await inserirEmpresa(data);
}
