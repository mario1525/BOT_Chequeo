export type Chequeo = {
    id: string;       
    estado: string;
    descripcion: string;
    calificacion: number;
    fase_del_chequeo :string;
    cliente : string;
    ol :string;
    job :string;
    analisis_a_chequear :string;
    numero_muestras : number;
    solicitado_por :string;
    localidad :string;
  }

export type Mensaje = {
  Response: string;
}  