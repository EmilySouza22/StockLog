import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const setupDatabase = async () => {
	const connection = await mysql.createConnection({
		host: 'localhost',
		user: 'root',
		password: 'senai',
	});

	try {
		// Create database first
		await connection.execute('DROP DATABASE IF EXISTS stocklog');
		await connection.execute('CREATE DATABASE stocklog');
		await connection.end();

		const dbConnection = await mysql.createConnection({
			host: 'localhost',
			user: 'root',
			password: 'senai',
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
		password: 'senai',
		database: 'stocklog',
	});

	try {
		await connection.execute(`
			INSERT IGNORE INTO empresa (nome, telefone, cnpj, email, senha) VALUES 
			('Empresa Teste', '11999999999', '12345678901234', 'teste@empresa.com', '$2b$10$dummy.hash.for.testing')
		`);

		console.log('Database seeded successfully');
	} catch (error) {
		console.error('Database seeding failed:', error);
		throw error;
	} finally {
		await connection.end();
	}
};
