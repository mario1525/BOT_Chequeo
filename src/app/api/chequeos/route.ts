import { get, getLocalidades, sendNotifications } from "./Services";
import { Chequeo } from "@/Types/Chequeos";
import { WebhookClient} from "dialogflow-fulfillment";
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
    const agent = new WebhookClient({ request:  { body }, response: res });

    console.log(body);

    // metodo para mostrar los chequeos por cliente 
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
        const responseText = result
          .map(
            (item) =>
              `El chequeo con ID ${item.id}, relacionado a la OL ${item.ol}, se encuentra en la fase de ${item.fase_del_chequeo}.`
          )
          .join("\n");
          agent.add(responseText + "\n\n¿Desea volver al menú principal? \n 1. Sí \n 2. No");
        //agent.add("¿Desea volver al menú principal? \n 1.Si \n 2.No"); 
      };      
    }

        // metodo para mostrar los chequeos por localidad
    async function chequeoLocalidad(agent: WebhookClient) {
      const queryText = body.queryResult?.queryText;
      const queryClient = body.queryResult?.queryText;

      if (!queryText) {
        agent.add("No se recibió un código válido.");
        return;
      }

      const result: string[] = await getLocalidades( queryClient,queryText);

      if (!result || result.length === 0) {
        agent.add("No se encontraron resultados.");
      } else {
        const responseText = `Se tienen ${result} Muestras en chequeo en la localidad de ${queryText}.`;
         
          agent.add(responseText + "\n\n¿Desea volver al menú principal? \n 1. Sí \n 2. No");
        //agent.add("¿Desea volver al menú principal? \n 1.Si \n 2.No"); 
      };      
    }


    // Método para Crear un chequeo
    async function chequeoCreate(agent: WebhookClient) {
      const querymessage = body.queryResult?.queryText;
      const queryClient = body.queryResult?.queryText;

      if (!queryClient) {
        agent.add("No se recibió un código válido.");
        return;      }

        const res = await sendNotifications(queryClient, querymessage);
      
          agent.add(res + "\n\n¿Desea volver al menú principal? \n 1. Sí \n 2. No");      
    }

    // buscar por CK o JOB
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
        const responseText = result
          .map(
            (item) =>
              `El chequeo con ID ${item.id}, relacionado a la OL ${item.ol}, se encuentra en la fase de ${item.fase_del_chequeo}.`
          )
          .join("\n");
          agent.add(responseText + "\n\n¿Desea volver al menú principal? \n 1. Sí \n 2. No");
        //agent.add("¿Desea volver al menú principal? \n 1.Si \n 2.No");
      };

    }
    
    // para enviar link del reporte
    function Reporte(agent: WebhookClient) {
      const queryText = body.queryResult?.queryText;
     let url : string = ""
      
      if (queryText == "CO2500197.025") {
          url = "712"
      } 
      if (queryText == "co2500197.026") {
         url = "712"
      }
      if (queryText == "CO2500293.001") {
        url = "712"
      }

      agent.add( "para continuar ingrese su codigo de seguridad" + url );
      // agent.contexts.set({
      //   name: "Reporte",
      //   lifespan: 1, // El contexto durará 5 turnos en la conversación
      //   parameters: {
      //     Url: url
      //   },
      // });

      
    }

    function fallback(agent: WebhookClient) {
      agent.add("Lo siento, no entendí la solicitud. ¿Puedes repetirlo?");
    }

    const intentMap = new Map();
    intentMap.set("1.1. Response", chequeo);
    intentMap.set("2.1. Response", chequeoCl);
    intentMap.set("3.3.1. Response", chequeoCreate);
    intentMap.set("3.1.1. Response", Reporte);
    intentMap.set("3.1.1. Response", chequeoLocalidad);
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