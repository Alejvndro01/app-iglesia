import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('123456', 10);

  const admin = await prisma.usuario.upsert({
    where: { email: 'alejvndro.arevalo@gmail.com' },
    update: {
      name: 'Alejvndro01', // Corregido: 'name' en lugar de 'nombre'
      password: hashedPassword,
    },
    create: {
      email: 'alejvndro.arevalo@gmail.com',
      name: 'Alejvndro01', // Corregido: 'name' en lugar de 'nombre'
      password: hashedPassword,
    },
  });

  console.log('Usuario administrador actualizado/creado:', admin.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });