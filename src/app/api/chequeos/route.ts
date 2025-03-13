//import { get } from './Services';
//import { Chequeo } from '@/Types/Chequeos';

// export async function GET(req: Request) {
//   try {
//     // Extraer parámetros de la URL
//     const { searchParams } = new URL(req.url);
//     const Cliente = searchParams.get('Cliente');
//     const Ol = searchParams.get('Ol');
//     const Job = searchParams.get('Job');

//     // Verificar que todos los parámetros están presentes
//     if (!Cliente || !Ol || !Job) {
//       return NextResponse.json({ message: "Faltan parámetros en la consulta" }, { status: 400 });
//     }

//     // Llamar al servicio
//     const result: Chequeo[] = await get(Cliente, Ol, Job);

//     // Retornar resultado
//     return NextResponse.json(result, { status: 200 });

//   } catch (error) {
//     console.error('Error en API route:', error);
//     return NextResponse.json({ message: 'Error procesando la solicitud', error }, { status: 500 });
//   }
// }


import { WebhookClient } from "dialogflow-fulfillment";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json(); // 🔥 Obtener el body correctamente
    const res = new NextResponse(); // 🔥 Crear la respuesta correctamente

    const agent = new WebhookClient({ request: body, response: res }); // 🔥 Usar el body en lugar de req

    function chequeo(agent: WebhookClient) {
      agent.add("ok ");
    }

    function fallback(agent: WebhookClient) {
      agent.add("Lo siento, no entendí eso. ¿Puedes repetirlo?");
    }

    const intentMap = new Map();
    intentMap.set("1.1 Response CK", chequeo);
    intentMap.set("Default Fallback Intent", fallback);

    await agent.handleRequest(intentMap);

    return NextResponse.json({ success: true }); // 🔥 Respuesta JSON correcta
  } catch (error) {
    console.error("Error en el webhook:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}



