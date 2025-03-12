import { query } from './../BD'; 
import { Chequeo } from '@/Types/Chequeos';

// Método para obtener productos
export async function get(cliente : string, ol : string, job: string): Promise<Chequeo[]> {
    try {
      const result = await query("SELECT * from getchequeos($1, $2, $3)", [cliente, ol, job]);
      return result.rows as Chequeo[];
    } catch (error) {
      console.error('Error in Service:', error);
      throw new Error('Error calling stored procedure');
    }
  }