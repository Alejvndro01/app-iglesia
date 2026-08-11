import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('123456', 10);

  const admin = await prisma.usuario.upsert({
    where: { email: 'alejvndro.arevalo@gmail.com' },
    update: {
      nombre: 'Alejvndro01',
      password: hashedPassword, // <-- Agregado para sobrescribir la clave si el usuario ya existe
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