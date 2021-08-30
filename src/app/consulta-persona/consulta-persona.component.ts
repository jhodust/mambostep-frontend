import { HorarioClaseService } from './../horario-clase/horario-clase.service';
import { PersonaService } from './../personas/persona.service';
import { HttpClient } from '@angular/common/http';
import { MensualidadService } from './../mensualidad/mensualidad.service';
import { Mensualidad } from './../mensualidad/mensualidad';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { Persona } from '../personas/persona';
import { DataTableDirective } from 'angular-datatables';
import { HorarioClase } from '../horario-clase/horario-clase';


@Component({
  selector: 'app-consulta-persona',
  templateUrl: './consulta-persona.component.html',
  styleUrls: ['./consulta-persona.component.css']
})
export class ConsultaPersonaComponent implements OnInit {

  documentoSearch:string ='';
  dataAlumno: Mensualidad[]=[];
  horarioClase: HorarioClase[]=[];
  displayedColumns: string[] = ['nombre', 'paqueteAdquirido', 'fechaInicio', 'fechaFin', 'observaciones'];
  dataSource: any;
  dataCurrentAlumno: Mensualidad | undefined;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  datosBasicosAlumno:Persona;
  msgsErrorStatus:boolean=false;
  msgsError:string;

  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;

  isDtInitialized:boolean = false;

  constructor(private _mensualidadService:MensualidadService,
    private _personaService:PersonaService,
    private _horarioClaseService:HorarioClaseService) { }

  ngOnInit(): void {



  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
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
      this.initializedDataTable();
      this.dataAlumno = (response as any);


    });


  }

  searchHorarioAlumno(){
    this._horarioClaseService.getHorarioAlumno(this.documentoSearch).subscribe((response) =>{
      this.horarioClase = response;


    });
  }

  searchAlumno(){
    this.searchDatosAlumno();
    this.searchPagosAlumno();
    this.searchHorarioAlumno();
  }

  initializedDataTable(){
    if (this.isDtInitialized) {
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
          this.dtTrigger.next();// Calling the DT trigger to manually render the table
      });
  } else {
      this.isDtInitialized = true;
      this.dtTrigger.next();// Calling the DT trigger to manually render the table
  }
  }
}
