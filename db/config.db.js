import { config } from 'dotenv';
config({ path: './.env' });

export default {
    client: 'pg',
    connection: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE
    },
    migrations: {
        tableName: 'knex_migrations',
        directory: './db/migrations'
    },
    searchPath: ['public'],
    pool: {
        min: 2,
        max: 6
    }
};
