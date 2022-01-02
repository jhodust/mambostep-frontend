export class Profesor {
   id: number = 0;
	 nombre: String | undefined;
   identificacion: String | undefined;
   fechaIngreso: Date | undefined;
   fechaNacimiento: Date | undefined;
   instagram: String | undefined;
   telefono: String | undefined;
   nombreAcudiente: String | undefined;
   telefonoAcudiente: String | undefined;
   parentescoAcudiente: String | undefined;
   idSede: number | undefined;
   nombreSede: String | undefined;
   username: string;
   password: string;
   enabled: boolean;
   roles:any[]=[];
   profesor: boolean;
   alumno: boolean;
   tipoPersona: string;
   valorClase: number;
   pagoClasesMes: number;
}
