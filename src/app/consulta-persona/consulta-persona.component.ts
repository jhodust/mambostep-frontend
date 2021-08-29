import { PersonaService } from './../personas/persona.service';
import { HttpClient } from '@angular/common/http';
import { MensualidadService } from './../mensualidad/mensualidad.service';
import { Mensualidad } from './../mensualidad/mensualidad';
import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Persona } from '../personas/persona';

const ELEMENT_DATA: Mensualidad[] = [
  {id: 1, nombrePersona: 'Jhocel', nombrePaquete: 'regular', precioPactado:'50000', fechaInicio: new Date(), fechaFin: new Date(), clases: 'bachata',idPersona:1, idsClases:undefined, observaciones:undefined, precioPaquete:"990000"},
  ];

@Component({
  selector: 'app-consulta-persona',
  templateUrl: './consulta-persona.component.html',
  styleUrls: ['./consulta-persona.component.css']
})
export class ConsultaPersonaComponent implements OnInit {

  documentoSearch:string ='';
  dataAlumno: Mensualidad[]=[];
  displayedColumns: string[] = ['nombre', 'paqueteAdquirido', 'fechaInicio', 'fechaFin', 'observaciones'];
  dataSource: any;
  dataCurrentAlumno: Mensualidad | undefined;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  datosBasicosAlumno:Persona;
  msgsErrorStatus:boolean=false;
  msgsError:string;
  constructor(private _mensualidadService:MensualidadService,
    private _personaService:PersonaService) { }

  ngOnInit(): void {




  }

  searchDatosAlumno(){
    this.msgsErrorStatus=false;
    this._personaService.searchDatosAlumno(this.documentoSearch).subscribe((response) =>{
      this.datosBasicosAlumno=response;
      console.log(response);
      if(response==null){
          this.msgsError="No existe alumno con ese documento ingresado en la base de datos";
          this.msgsErrorStatus=true;
      }
    });


  }

  searchPagosAlumno(){
    this._mensualidadService.searchLastMensualidad(this.documentoSearch).subscribe((response) =>{
      this.dataAlumno = (response as any);
        // Calling the DT trigger to manually render the table
        this.dtTrigger.next();
    });


  }

  searchAlumno(){
    this.searchDatosAlumno();
    this.searchPagosAlumno();
  }

}
