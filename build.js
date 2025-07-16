import { setupDatabase, seedDatabase } from './src/services/database/setup.js';

const main = async () => {
	try {
		await setupDatabase();
		console.log('Setup completed successfully');
		process.exit(0);
	} catch (error) {
		console.error('Setup failed:', error);
		process.exit(1);
	}
};

main();
