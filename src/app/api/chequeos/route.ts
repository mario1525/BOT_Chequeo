import { get } from "./Services";
import { Chequeo } from "@/Types/Chequeos";
import { WebhookClient, Payload, Platforms } from "dialogflow-fulfillment";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    let jsonResponse = {};
    const res = {
      json: (data: Record<string, unknown>) => {
        jsonResponse = data;
      },
    };

    const agent = new WebhookClient({ request: { body }, response: res });

    async function chequeoCl(agent: WebhookClient) {
      const queryText = body.queryResult?.queryText;

      if (!queryText) {
        agent.add("No se recibió un código válido.");
        return;
      }

      const result: Chequeo[] = await get(queryText, "", "");

      if (!result || result.length === 0) {
        agent.add("No se encontraron resultados.");
      } else {
        const enrichedResponse = {
          platform: "ZOHOSALESIQ",
          replies: result.map(
            (item) =>
              `El chequeo con ID ${item.id}, relacionado a la OL ${item.ol}, se encuentra en la fase de ${item.fase_del_chequeo}.`
          ),
          input: {
            options: ["Regresar al menú principal", "Consultar otro chequeo"],
            type: "select",
          },
        };
        const platformName = "ZOHOSALESIQ" as unknown as Platforms;
        const payload = new Payload(platformName, enrichedResponse, {
          sendAsMessage: true,
          rawPayload: true,
        });
        agent.add(payload);
      }
    }

    async function chequeo(agent: WebhookClient) {
      const queryText = body.queryResult?.queryText;

      if (!queryText) {
        agent.add("No se recibió un código válido.");
        return;
      }

      let result: Chequeo[];

      if (queryText.startsWith("CK")) {
        result = await get("", "", queryText);
      } else {
        result = await get("", queryText, "");
      }

      if (!result || result.length === 0) {
        agent.add("No se encontraron resultados.");
      } else {
        const enrichedResponse = {
          platform: "ZOHOSALESIQ",
          replies: result.map(
            (item) =>
              `El chequeo con ID ${item.id}, relacionado a la OL ${item.ol}, se encuentra en la fase de ${item.fase_del_chequeo}.`
          ),
          input: {
            options: ["Regresar al menú principal", "Consultar otro chequeo"],
            type: "select",
          },
        };
        const platformName = "ZOHOSALESIQ" as unknown as Platforms;
        const payload = new Payload(platformName, enrichedResponse, {
          sendAsMessage: true,
          rawPayload: true,
        });
        agent.add(payload);
      }
    }

    function fallback(agent: WebhookClient) {
      agent.add("Lo siento, no entendí la solicitud. ¿Puedes repetirlo?");
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