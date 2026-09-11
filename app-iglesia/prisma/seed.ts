import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const defaultPassword = process.env.ADMIN_DEFAULT_PASSWORD || 'Admin2026!';
  const hashedPassword = await bcrypt.hash(defaultPassword, 10);

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