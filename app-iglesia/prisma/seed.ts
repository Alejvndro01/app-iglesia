import 'dotenv/config'; // <--- Carga automática de .env
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import bcrypt from 'bcryptjs';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('La variable de entorno DATABASE_URL no está definida en el archivo .env.');
}

const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const hashedPassword = await bcrypt.hash('Admin_IASD_2026!', 10);

  const admin = await prisma.usuario.upsert({
    where: { email: 'admin@iasdchualqui.cl' },
    update: {},
    create: {
      email: 'admin@iasdchualqui.cl',
      nombre: 'Administrador IASD',
      password: hashedPassword,
      rol: 'ADMIN',
    },
  });

  console.log('Usuario administrador creado/verificado:', admin.email);
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