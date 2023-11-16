import knex from 'knex';
import config from './config.db.js';

async function rollbackMigrations() {
    try {
        let connection = knex(config);
        await connection.migrate.rollback();

        const pgDBConfig = JSON.parse(JSON.stringify(config));
        pgDBConfig.connection.database = 'postgres';
        connection = knex(pgDBConfig);
        await connection.raw(
            `drop database ${config.connection.database} with (force)`
        );

        console.log('Rollback all migrations');
    } catch (error) {
        console.error(error.stack);
    } finally {
        process.exit();
    }
}

rollbackMigrations();
