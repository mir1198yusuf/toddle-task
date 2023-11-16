import * as dotenv from 'dotenv';
dotenv.config({ path: './.env' });

function checkEnvsOnStartup() {
    const envs = {
        DB_HOST: process.env.DB_HOST,
        DB_USER: process.env.DB_USER,
        DB_PASSWORD: process.env.DB_PASSWORD,
        DB_DATABASE: process.env.DB_DATABASE,
        SERVER_PORT: process.env.SERVER_PORT,
        JWT_SECRET: process.env.JWT_SECRET
    };

    Object.keys(envs).forEach((key) => {
        if (envs[key] == undefined) {
            throw new Error(`env ${key} is not set`);
        }
    });
}

export { checkEnvsOnStartup };
