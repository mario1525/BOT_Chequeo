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


  export async function sendNotifications(Correo: string, Chequeo: Chequeo): Promise<{ message: string }> {

    const url = "https://smtp-ginvent.azurewebsites.net/smtp/custom";
   
 
    try {

       // Enviar mensaje para el cliente
      const responseCliente = await fetch(`${url}/users/smtp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: Correo,
          subject: `Confirmación de solicitud de chequeo / OL ${Chequeo.ol} / JOB ${Chequeo.job}`,
          html: `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirmación de Registro - Chequeo de Muestras</title>
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
        <h1>Estimado cliente,</h1>
        <p>Le informamos que su solicitud para el chequeo de muestras ha sido registrada exitosamente con el número de chequeo <span class="highlight">CK00873</span>.</p>
        <p>Los resultados estarán disponibles en un plazo de <span class="highlight">tres (3) días hábiles</span> a partir de la fecha de emisión de este correo.</p>

        <div class="product-info">
            <p><span class="highlight">Detalles del chequeo:</span></p>
            <p><span class="highlight">Job:</span> ${Chequeo.job}</p>
            <p><span class="highlight">Análisis a realizar:</span> ${Chequeo.analisis_a_chequear}</p>
            <p><span class="highlight">Número de muestras:</span> ${Chequeo.numero_muestras}</p>
        </div>

        <p>Para consultar el estado de sus muestras, puede acceder a la siguiente plataforma: <a href="https://bot-chequeo.vercel.app/" target="_blank">https://sgs.com/es-co/chequeos</a>.</p>
        <p>Agradecemos su confianza en nuestros servicios y estamos a su disposición para cualquier consulta adicional.</p>
        <p>Atentamente,</p>
        <p><strong>SGS Colombia</strong></p>
        <p>Correo de atención: <a href="mailto:customercaremin@sgs.com">customercaremin@sgs.com</a></p>

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
  