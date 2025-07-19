import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const setupDatabase = async () => {
	const connection = await mysql.createConnection({
		host: 'localhost',
		user: 'root',
		password: 'root',
	});

	try {
		// Create database first
		await connection.execute('DROP DATABASE IF EXISTS stocklog');
		await connection.execute('CREATE DATABASE stocklog');
		await connection.end();

		const dbConnection = await mysql.createConnection({
			host: 'localhost',
			user: 'root',
			password: 'root',
			database: 'stocklog',
		});

		// Read and execute schema without CREATE DATABASE and USE statements
		const schemaPath = path.join(__dirname, '../../../db/schema.sql');
		const schema = fs.readFileSync(schemaPath, 'utf8');
		// Split by semicolon and execute each statement
		const statements = schema.split(';').filter((stmt) => stmt.trim());

		for (const statement of statements) {
			if (statement.trim()) {
				await dbConnection.execute(statement);
			}
		}

		await dbConnection.end();
		console.log('Database setup completed');
	} catch (error) {
		console.error('Database setup failed:', error);
		throw error;
	}
};

export const seedDatabase = async () => {
	const connection = await mysql.createConnection({
		host: 'localhost',
		user: 'root',
		password: 'root',
		database: 'stocklog',
	});

	try {
		await connection.execute(`
			INSERT INTO produto (nome,codigo_barra,quantidade,data_validade,data_entrada,data_saida,minimo,maximo,ativo,categoria_id,empresa_id)
            VALUES
            ('Café Melitta 200g', '1234567891011', '20', '2026-09-22', '2025-09-22', NULL, '10', '30', '1', NULL, '1'),
            ('Pizza Perdigão de Mussarela', '1234567891012', '10', '2026-09-22T00:00:00.000-03:00', '2025-09-22T00:00:00.000-03:00', NULL, '10', '30', '1', NULL, '1'),
            ('Sobrecoxa 1kg', '1234567891021', '30', '2026-09-22T00:00:00.000-03:00', '2025-09-22T00:00:00.000-03:00', NULL, '20', '50', '1', NULL, '1'),
            ('Melancia Orgânica', '1234567891028', '6', '2026-09-22T00:00:00.000-03:00', '2025-09-22T00:00:00.000-03:00', NULL, '4', '10', '1', NULL, '1'),
            ('Coca Cola 2L', '1234567891013', '30', '2026-09-22T00:00:00.000-03:00', '2025-09-22T00:00:00.000-03:00', NULL, '20', '50', '1', NULL, '1'),
            ('Mortadela Fatiada', '1234567891030', '12', '2025-09-22T00:00:00.000-03:00', '2024-06-22T00:00:00.000-03:00', NULL, '10', '20', '1', NULL, '1'),
            ('Pureza 1L', '1234567891015', '10', '2026-09-22T00:00:00.000-03:00', '2025-09-22T00:00:00.000-03:00', NULL, '5', '20', '1', NULL, '1'),
            ('Uva Roxa ', '1234567891009', '8', '2026-09-22T00:00:00.000-03:00', '2025-09-22T00:00:00.000-03:00', NULL, '5', '15', '1', NULL, '1'),
            ('Capuccino Tradicional', '1234567891022', '10', '2026-09-22T00:00:00.000-03:00', '2025-09-22T00:00:00.000-03:00', NULL, '10', '20', '1', NULL, '1'),
            ('Queijo Mussarela Fatiado 300g', '1234567891018', '18', '2026-09-22T00:00:00.000-03:00', '2025-09-22T00:00:00.000-03:00', NULL, '10', '202', '1', NULL, '1'),
            ('Café Melitta Light', '1234567891111', '17', '2026-09-22T00:00:00.000-03:00', '2025-09-22T00:00:00.000-03:00', NULL, '5', '20', '0', NULL, '1'),
            ('Café Melitta Tradicional', '1234567891008', '10', '2026-09-22T00:00:00.000-03:00', '2025-09-22T00:00:00.000-03:00', NULL, '10', '15', '1', NULL, '1'),
            ('Café Melitta 213', '64545645654', '20', '2026-09-22T00:00:00.000-03:00', '2025-09-22T00:00:00.000-03:00', NULL, '10', '50', '1', NULL, '1')
		`);

		console.log('Database seeded successfully');
	} catch (error) {
		console.error('Database seeding failed:', error);
		throw error;
	} finally {
		await connection.end();
	}
};
