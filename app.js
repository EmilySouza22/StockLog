import Fastify from 'fastify';
import cors from '@fastify/cors';
import fastify_static from '@fastify/static';
import path from 'path';
import fastify_mysql from '@fastify/mysql';
import { fileURLToPath } from 'url';

import authRoutes from './src/routes/auth.js';
import accountRoutes from './src/routes/account.js';
import productRoutes from './src/routes/products.js';
import categoryRoutes from './src/routes/category.js';
import historicRoutes from './src/routes/historic.js';
import homeRoutes from './src/routes/home.js';
import labelRoutes from './src/routes/label.js';
import pageRoutes from './src/routes/pages.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const fastify = Fastify({
	logger: false,
});

await fastify.register(cors);

await fastify.register(fastify_mysql, {
	uri: 'mysql://root@localhost/mysql?password="root"',
});

await fastify.register(fastify_static, {
	root: path.join(__dirname, 'src/assets'),
	prefix: '/assets/',
	decorateReply: false,
});

await fastify.register(fastify_static, {
	root: path.join(__dirname, 'src/pages'),
	prefix: '/',
});

await fastify.register(fastify_static, {
	root: path.join(__dirname, 'src/services'),
	prefix: '/services/',
	decorateReply: false,
});

await fastify.register(authRoutes, { prefix: '/auth' });
await fastify.register(accountRoutes, { prefix: '/account' });
await fastify.register(productRoutes, { prefix: '/product' });
await fastify.register(categoryRoutes, { prefix: '/category' });
await fastify.register(historicRoutes, { prefix: '/historic' });
await fastify.register(homeRoutes, { prefix: '/home' });
await fastify.register(labelRoutes, { prefix: '/label' });
await fastify.register(pageRoutes);

try {
	await fastify.listen({ port: 3000 });
} catch (err) {
	fastify.log.error(err);
	process.exit(1);
}
