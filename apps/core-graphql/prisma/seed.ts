import prisma from './client';

async function main() {
    const { id: masterAdminId } = await prisma.user.create({
        data: {
            email: 'masterAdmin@micros.io',
            firstName: 'Master',
            lastName: 'Admin',
            phone: '+11234567890',
        },
        select: {
            id: true,
        },
    });

    const { id: clientId } = await prisma.client.create({
        data: {
            name: 'Some Sick Company',
            masterAdminId,
            users: {
                connect: [{ id: masterAdminId }],
            },
        },
        select: {
            id: true,
        },
    });
}

main();
