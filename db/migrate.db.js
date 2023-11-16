import knex from 'knex';
import config from './config.db.js';

async function runMigrations() {
    try {
        const pgDBConfig = JSON.parse(JSON.stringify(config));
        pgDBConfig.connection.database = 'postgres';
        let connection = knex(pgDBConfig);
        const dbDetails = await connection.raw(
            `select 1 from pg_database where datname = '${config.connection.database}'`
        );
        if (!dbDetails.rows.length) {
            await connection.raw(
                `create database ${config.connection.database}`
            );
        }

        connection = knex(config);
        await connection.migrate.latest();

        console.log('Ran all migrations');
    } catch (error) {
        console.error(error.stack);
    } finally {
        process.exit();
    }
}

runMigrations();
