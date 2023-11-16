import knex from 'knex';
import configDb from './config.db.js';

let dbKnex = knex(configDb);

export { dbKnex };
