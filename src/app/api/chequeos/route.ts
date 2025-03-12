import { NextResponse } from 'next/server';
import { get } from './Services';
import { Chequeo } from '@/Types/Chequeos';

export async function GET(req: Request) {
  try {
    // Extraer parámetros de la URL
    const { searchParams } = new URL(req.url);
    const Cliente = searchParams.get('Cliente');
    const Ol = searchParams.get('Ol');
    const Job = searchParams.get('Job');

    // Verificar que todos los parámetros están presentes
    if (!Cliente || !Ol || !Job) {
      return NextResponse.json({ message: "Faltan parámetros en la consulta" }, { status: 400 });
    }

    // Llamar al servicio
    const result: Chequeo[] = await get(Cliente, Ol, Job);

    // Retornar resultado
    return NextResponse.json(result, { status: 200 });

  } catch (error) {
    console.error('Error en API route:', error);
    return NextResponse.json({ message: 'Error procesando la solicitud', error }, { status: 500 });
  }
}
