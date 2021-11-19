import { FormBuilder, Validators } from '@angular/forms';
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

  readOnlyFields:boolean= true;

  datosPersonalesForm = this._formBuilder.group({
    id: ['', Validators.required],
    nombre: [{value: '', disabled: true}, Validators.required],
    identificacion: [{value: '', disabled: true}, Validators.required],
    fechaNacimiento: [{value: '', disabled: true}, Validators.required],
    fechaIngreso: [{value: '', disabled: true}, Validators.required],
    instagram: [{value: '', disabled: true}, Validators.required],
    telefono: [{value: '', disabled: true}, Validators.required],
    nombreAcudiente: [{value: '', disabled: true}, Validators.required],
    telefonoAcudiente: [{value: '', disabled: true}, Validators.required],
    parentescoAcudiente: [{value: '', disabled: true}, Validators.required]
  });

  constructor(private _formBuilder: FormBuilder,
    private _mensualidadService:MensualidadService,
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
      this.loadOldDataForm();
      console.log(response);
      if(response==null){
          this.msgsError="No existe alumno con ese documento ingresado en la base de datos";
          this.msgsErrorStatus=true;
      }
    });


  }

  loadOldDataForm(){
    console.log(this.datosBasicosAlumno);
    if(this.datosBasicosAlumno){
      this.datosPersonalesForm.setValue({
        'id':this.datosBasicosAlumno,
        'nombre':this.datosBasicosAlumno.nombre,
        'identificacion':this.datosBasicosAlumno.identificacion,
        'fechaNacimiento':this.datosBasicosAlumno.fechaNacimiento,
        'fechaIngreso':this.datosBasicosAlumno.fechaIngreso,
        'instagram':this.datosBasicosAlumno.instagram,
        'telefono':this.datosBasicosAlumno.telefono,
        'nombreAcudiente':this.datosBasicosAlumno.nombreAcudiente,
        'telefonoAcudiente':this.datosBasicosAlumno.telefonoAcudiente,
        'parentescoAcudiente':this.datosBasicosAlumno.parentescoAcudiente
      });
    }

  }
  searchPagosAlumno(){
    this._mensualidadService.searchLastMensualidad(this.documentoSearch).subscribe((response) =>{
      this.initializedDataTable();
      this.dataAlumno = (response as any);
      console.log(this.dataAlumno);

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

  editDatosPersonales(){
    this.readOnlyFields=false;
    this.datosPersonalesForm.get('nombre').enable();
    this.datosPersonalesForm.get('identificacion').enable();
    this.datosPersonalesForm.get('fechaNacimiento').enable();
    this.datosPersonalesForm.get('fechaIngreso').enable();
    this.datosPersonalesForm.get('instagram').enable();
    this.datosPersonalesForm.get('telefono').enable();
    this.datosPersonalesForm.get('nombreAcudiente').enable();
    this.datosPersonalesForm.get('telefonoAcudiente').enable();
    this.datosPersonalesForm.get('parentescoAcudiente').enable();
  }

  disabledForm(){
    this.readOnlyFields=true;
    this.datosPersonalesForm.get('nombre').disable();
    this.datosPersonalesForm.get('identificacion').disable();
    this.datosPersonalesForm.get('fechaNacimiento').disable();
    this.datosPersonalesForm.get('fechaIngreso').disable();
    this.datosPersonalesForm.get('instagram').disable();
    this.datosPersonalesForm.get('telefono').disable();
    this.datosPersonalesForm.get('nombreAcudiente').disable();
    this.datosPersonalesForm.get('telefonoAcudiente').disable();
    this.datosPersonalesForm.get('parentescoAcudiente').disable();
  }

  cancelEditDatosPersonales(){
    this.disabledForm();
    this.loadOldDataForm();
  }

  updateDatosPersonales(){
    let dto={
      id:this.datosBasicosAlumno.id,
      nombre: this.datosPersonalesForm.get('nombre').value,
      identificacion: this.datosPersonalesForm.get('identificacion').value,
      fechaNacimiento: this.datosPersonalesForm.get('fechaNacimiento').value,
      fechaIngreso: this.datosPersonalesForm.get('fechaIngreso').value,
      instagram: this.datosPersonalesForm.get('instagram').value,
      telefono: this.datosPersonalesForm.get('telefono').value,
      nombreAcudiente: this.datosPersonalesForm.get('nombreAcudiente').value,
      telefonoAcudiente: this.datosPersonalesForm.get('telefonoAcudiente').value,
      parentescoAcudiente: this.datosPersonalesForm.get('parentescoAcudiente').value,
      idSede: this.datosBasicosAlumno.idSede,
    }

    this._personaService.updatePersona(dto.id,dto).subscribe((response) =>{
      this.datosBasicosAlumno=response;
      this.cancelEditDatosPersonales();
    });
  }
}
