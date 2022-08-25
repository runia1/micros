import prisma from './client';

async function main() {
    const { id: masterAdminId } = await prisma.user.create({
        data: {
            email: 'masterAdmin@nextflight.io',
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
            name: 'KickAss Flight School',
            signupMetadata: { anyData: 1 },
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
