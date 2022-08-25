/// <reference types="../global" />
import { PrismaClient } from '../generated/prisma-client';

const prisma =
    global.prisma ||
    new PrismaClient({
        //log: ["query"],
        datasources: {
            db: {
                url: process.env.CLIENT_DATABASE_URL,
            },
        },
    });

global.prisma = prisma;

export default prisma;
