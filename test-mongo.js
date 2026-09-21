const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
    try {
        const user = await prisma.user.create({
            data: {
                name: 'test',
                email: 'test' + Date.now() + '@example.com',
                passwordHash: 'hash',
                role: 'CUSTOMER'
            }
        });
        console.log("Success:", user);
    } catch (e) {
        console.error("Prisma Error:", e);
    }
}
test();
