export class Mensualidad {

  id: number | undefined;
  fechaInicio: Date | undefined;
  fechaFin: Date | undefined;
  nombrePaquete: String | undefined;
  precioPactado: String | undefined;
  precioPaquete: String | undefined;
  observaciones: String | undefined;
  idPersona: number | undefined;
  nombrePersona: String | undefined;
  idsClases: number[] | undefined;
  clases: String | undefined;
  hasClasesIlimitadas: boolean;

}
