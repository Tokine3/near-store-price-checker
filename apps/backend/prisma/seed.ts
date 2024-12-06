import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const stores = [
    { name: 'バロー' },
    { name: 'ゲンキー' },
    { name: 'スギ薬局' },
  ];

  stores.forEach(async (store, index) => {
    await prisma.store.upsert({
      where: { id: index },
      update: {
        name: store.name,
      },
      create: {
        name: store.name,
      },
    });
  });

  console.log('Seed data has been inserted');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
