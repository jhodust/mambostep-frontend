export class HorarioClase {

    id:number;
    dia:string;
    horaInicio:string;
    horaFin:string;
    idClase:number;
    clase:string;

    validateHoraFinDespuesHoraInicio(){
      return this.horaFin>this.horaInicio;
    }
}
