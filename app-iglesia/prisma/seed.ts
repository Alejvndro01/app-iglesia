import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import bcrypt from 'bcryptjs';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('La variable DATABASE_URL no está definida.');
}

const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

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
    await pool.end();
  });