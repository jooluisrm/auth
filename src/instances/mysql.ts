// instances/mysql.ts
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

export const sequelize = new Sequelize(
    process.env.MYSQL_DB as string,
    process.env.MYSQL_USER as string,
    process.env.MYSQL_PASSWORD as string,
    {
        dialect: 'mysql',
        port: parseInt(process.env.MYSQL_PORT as string),
        host: process.env.MYSQL_HOST || 'localhost', // opcional, mas recomendado
        logging: false, // opcional, desativa logs SQL no console
    }
);
