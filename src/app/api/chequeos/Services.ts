import { query } from './../BD'; 
import { Chequeo } from '@/Types/Chequeos';

// Método para obtener productos
export async function get(cliente : string, ol : string, CK: string): Promise<Chequeo[]> {
    try {
      const result = await query("SELECT * from getchequeos($1, $2, $3)", [cliente, ol, CK]);
      return result.rows as Chequeo[];
    } catch (error) {
      console.error('Error in Service:', error);
      throw new Error('Error calling stored procedure');
    }
  }

  // Método para obtener las localidades
export async function getLocalidades(cliente : string, localidad : string): Promise<string[]> {
  try {
    const result = await query("SELECT * from getClient($1, $2)", [cliente, localidad]);
    return result.rows as string[];
  } catch (error) {
    console.error('Error in Service:', error);
    throw new Error('Error calling stored procedure');
  }
}

  


  export async function sendNotifications( solicitud: string, cliente: string): Promise<{ message: string }> {

    const url = "https://smtp-ginvent.azurewebsites.net/service/smtp/custom";
   
 
    try {

       // Enviar mensaje para el cliente
      const responseCliente = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: "mario.beltran@sgs.com;jesus.sanjuan@sgs.com",
          subject: `Solicitud de chequeo / cliente ${cliente}`,
          html: `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            color: #333;
            margin: 0;
            padding: 0;
        }
        .container {
            width: 80%;
            margin: 20px auto;
            background-color: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        h1 {
            color: rgb(255, 83, 31);
            font-size: 24px;
        }
        p {
            line-height: 1.6;
            margin: 10px 0;
        }
        .highlight {
            font-weight: bold;
        }
        .product-info {
            margin: 15px 0;
            padding: 10px;
            background-color: #e9f5e9;
            border-left: 4px solid rgb(255, 83, 31);
        }
        .footer {
            margin-top: 20px;
            border-top: 1px solid #ddd;
            padding-top: 10px;
            font-size: 14px;
            color: #777;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Estimados,</h1>
        <p>Les informamos que hemos recibido una solicitud para el chequeo de muestras.</p>

        <div class="product-info">
            <p><span class="highlight">Detalles de la solicitud:</span></p>
            <p>${solicitud}</p>
        </div>

        <p>Agradecemos su pronta gestión para procesar esta solicitud.</p>
        <p>Atentamente,</p>
        <p><strong>SGS Colombia</strong></p>

        <div class="footer">
            <p>Este es un mensaje generado automáticamente. Por favor, no responda a este correo.</p>
        </div>
    </div>
</body>
</html>
  `
      }),
      });
  
      if (!responseCliente.ok) {
        console.error("Error al enviar el correo al cliente:", await responseCliente.text());
        throw new Error("Error al enviar el correo al cliente.");
      } 

  
      return { message: 'mensaje enviado' };
    } catch (error) {
      console.error('Error en sendNotifications:', error);
      throw new Error('Error al procesar la solicitud de notificación.');
    }
  }
  