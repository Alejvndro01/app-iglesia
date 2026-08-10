import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('Admin_IASD_2026!', 10);

  const admin = await prisma.usuario.upsert({
    where: { email: 'alejvndro.arevalo@gmail.com' },
    update: {
      nombre: 'Alejvndro01',
    },
    create: {
      email: 'alejvndro.arevalo@gmail.com',
      nombre: 'Alejvndro01',
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