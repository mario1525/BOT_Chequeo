import { get } from './Services';
import { Chequeo } from '@/Types/Chequeos';


import { WebhookClient } from "dialogflow-fulfillment";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    //console.log("🔍 Payload recibido:", JSON.stringify(body, null, 2));

    // Crear un objeto de respuesta simulado para WebhookClient
    let jsonResponse = {};
    const res = {
      json: (data: Record<string, unknown>) => {
        jsonResponse = data; // Guardar la respuesta
      },
    };

    const agent = new WebhookClient({ request: { body }, response: res });

    // se pasa el CK
    async function chequeoCl(agent: WebhookClient) {
      const queryText = body.queryResult?.queryText;

      if (!queryText) {
        agent.add("No se recibió un código válido.");
        return;
      }

      const result: Chequeo[] = await  get(queryText,"","");

      if (!result || result.length === 0) {
        agent.add("No se encontraron resultados.");
      } else {
        const responseText = result
          .map(
            (item) =>
              `El ID del chequeo: ${item.id}, relacionado a la OL: ${item.ol} se encuentra en la fase: "${item.fase_del_chequeo}. \n"`
          )
          .join("\n");
        agent.add(responseText);
      }
    }

    
    // se pasa la OL o el CK
    async function chequeo(agent: WebhookClient) {
      const queryText = body.queryResult?.queryText;

      if (!queryText) {
        agent.add("No se recibió un código válido.");
        return;
      }

      if (queryText.startsWith("CK")) {
        const result: Chequeo[] = await get("", "", queryText);

        if (!result || result.length === 0) {
          agent.add("No se encontraron resultados.");
        } else {
          const responseText = result
            .map(
              (item) =>
                `El ID del chequeo: ${item.id}, relacionado a la OL: ${item.ol} se encuentra en la fase: "${item.fase_del_chequeo}".`
            )
            .join("\n");
          agent.add(responseText);
        }

      } else
      {
        const result: Chequeo[] = await  get("", queryText, "");

        if (!result || result.length === 0) {
          agent.add("No se encontraron resultados.");
        } else {
          const responseText = result
            .map(
              (item) =>
                `El ID del chequeo: ${item.id}, relacionado a la OL: ${item.ol} se encuentra en la fase: "${item.fase_del_chequeo}".`
            )
            .join("\n");
          agent.add(responseText);
        }
      } 

    }

   


    function fallback(agent: WebhookClient) {
      agent.add("Lo siento, no entendí eso. ¿Puedes repetirlo?");
    }

    const intentMap = new Map();
    intentMap.set("1.1. Response", chequeo);
    intentMap.set("2.1. Response", chequeoCl);
    intentMap.set("Default Fallback Intent", fallback);

    await agent.handleRequest(intentMap);

    return new Response(JSON.stringify(jsonResponse), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("❌ Error en el webhook:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
