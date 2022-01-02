import { HorarioClase } from '../horario-clase/horario-clase';
export class Clase {
  id: number;
  nombre: string;
  status: boolean;
  idProfesor: number;
  nombreProfesor: string;
  listHorarioClase: HorarioClase[];
  idSede: number;
  sede: string;
}
