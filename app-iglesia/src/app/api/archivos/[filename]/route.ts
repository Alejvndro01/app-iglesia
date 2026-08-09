import { NextResponse } from 'next/server';
import { readFile, stat } from 'fs/promises';
import path from 'path';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;
    
    // Evitar ataques de Traversal Path
    const safeFilename = path.basename(filename);
    const filePath = path.join(process.cwd(), 'public', 'uploads', safeFilename);

    // Comprobar si existe el archivo físicamente
    await stat(filePath);

    // Leer el buffer del archivo desde el disco
    const fileBuffer = await readFile(filePath);

    // Crear la respuesta con la cabecera de descarga
    const response = new NextResponse(fileBuffer);
    response.headers.set('Content-Type', 'application/octet-stream');
    response.headers.set('Content-Disposition', `attachment; filename="${safeFilename}"`);

    return response;
  } catch (error) {
    return NextResponse.json({ error: 'Archivo no encontrado en el servidor' }, { status: 404 });
  }
}