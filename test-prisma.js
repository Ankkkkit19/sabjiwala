const { PrismaClient } = require('@prisma/client');
try {
    const prisma = new PrismaClient();
    prisma.user.findFirst().then(console.log).catch(console.error);
} catch (e) {
    console.error("Initialization error:", e);
}
