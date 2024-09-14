import 'dotenv/config';
import * as env from 'env-var';


export const envs = {
    PORT: env.get('PORT').required().asPortNumber(),
    DB_HOST: env.get('DB_HOST').required().asString(),
    DB_PORT: env.get('DB_PORT').required().asPortNumber(),
    DB_NAME: env.get('DB_NAME').required().asString(),
    DB_USERNAME: env.get('DB_USERNAME').required().asString(),
    DB_PASSWORD: env.get('DB_PASSWORD').required().asString(),
}