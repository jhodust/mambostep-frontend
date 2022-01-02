import { Subject } from 'rxjs';
import { SedeService } from './../sedes/sede.service';
import { ClaseService } from './../clases/clase.service';
import { PaqueteService } from './../paquete/paquete.service';
import { AlumnoService } from './alumno.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Alumno } from './alumno';
import { Paquete } from '../paquete/paquete';
import { Clase } from '../clases/clase';
import { Sede } from '../sedes/sede';

@Component({
  selector: 'app-alumnos',
  templateUrl: './alumnos.component.html',
  styleUrls: ['./alumnos.component.css']
})
export class AlumnosComponent implements OnInit {


  constructor(private _formBuilder: FormBuilder,
    private _alumnoService:AlumnoService,
    private _paqueteService: PaqueteService,
    private _claseService: ClaseService,
    private _sedeService: SedeService) { }


  showMessageError: boolean = false;
  messageError: string = "Este campo es obligatorio";
  datosPersonalesForm = this._formBuilder.group({
    id:[''],
    nombre: ['', Validators.required],
    identificacion: ['', Validators.required],
    fechaNacimiento: ['', Validators.required],
    fechaIngreso: ['', Validators.required],
    instagram: ['', Validators.required],
    telefono: ['', Validators.required],
    sede: ['', Validators.required],
    nombreAcudiente: [''],
    telefonoAcudiente: [''],
    parentescoAcudiente: [''],
    profesor: [false],
    alumno: [false]
  });




  paquetes: Paquete[] = [];
  paqueteSelected: Paquete=new Paquete();
  listClases: Clase[];

  idsClasesSeleccionadas:any[]=[];
  listAlumnos: Alumno[] = [];

  viewForm:boolean=false;
  dtTrigger: Subject<any> = new Subject<any>();
  msgsSuccessStatus:boolean=false;
  msgsSuccess:string;
  msgsErrorStatus:boolean=false;
  msgsError:string;
  listSedes:Sede[];

  ngOnInit(): void {
    this.listAlumnos=[];
  this.listarAlumnos();
  this.listarPaquetes();
  this.listarClases();
  this.listarSedes();
  }

  get formDatos() { return this.datosPersonalesForm.controls; }

  listarPaquetes(){
    this.paquetes=[];
    this._paqueteService.getPaquetes().subscribe(json => {
      this.paquetes=json;

    });
  }

  listarSedes(){
    this.listSedes=[];
    this._sedeService.getSedes().subscribe(json => {
      this.listSedes=json.data;
    });
  }

  listarClases(){
    this.listClases=[];
    this._claseService.getClasesActivas().subscribe(json => {
      this.listClases=json;

    });
  }

  validarMenorEdad(){
    let fechaNac=this.datosPersonalesForm.get('fechaNacimiento')?.value;
    let fechaNacimiento = new Date(fechaNac);
    let diferencia = Math.abs(Date.now() - fechaNacimiento.getTime());
    if((Math.floor((diferencia / (1000 * 3600 * 24))/365))<18){
      this.formDatos.nombreAcudiente.setValidators([Validators.required]);
      this.formDatos.nombreAcudiente.updateValueAndValidity();
      this.formDatos.telefonoAcudiente.setValidators([Validators.required]);
      this.formDatos.telefonoAcudiente.updateValueAndValidity();
      this.formDatos.parentescoAcudiente.setValidators([Validators.required]);
      this.formDatos.parentescoAcudiente.updateValueAndValidity();
      return true;
    }else{
      this.formDatos.nombreAcudiente.setValidators([]);
      this.formDatos.nombreAcudiente.updateValueAndValidity();
      this.formDatos.telefonoAcudiente.setValidators([]);
      this.formDatos.telefonoAcudiente.updateValueAndValidity();
      this.formDatos.parentescoAcudiente.setValidators([]);
      this.formDatos.parentescoAcudiente.updateValueAndValidity();
      return false;
    }
  }


  listarAlumnos(){
    this.listAlumnos=[];
    this._alumnoService.getAlumnos().subscribe(response => {

      this.listAlumnos=response.data;
      this.dtTrigger.next();

    });
  }

  loadFormPersona(){
    this.msgsSuccessStatus=false;
    this.viewForm=true;
  }

  cancelForm(){
    this.dtTrigger.unsubscribe();
    this.viewForm=false;
    this.listarAlumnos();
    this.datosPersonalesForm.reset();
  }

  guardarAlumno(){
    this.showMessageError = true;
    if (this.validateForm()){
      let alumno= this.buildAlumno();
      this.requestSaveAlumno(alumno);
    }

  }


  buildAlumno(): Alumno{
    let alumno = new Alumno();
    alumno.id= this.datosPersonalesForm.get('id').value;
    alumno.nombre= this.datosPersonalesForm.get('nombre').value;
    alumno.identificacion= this.datosPersonalesForm.get('identificacion').value;
    alumno.fechaNacimiento= this.datosPersonalesForm.get('fechaNacimiento').value;
    alumno.fechaIngreso= this.datosPersonalesForm.get('fechaIngreso').value;
    alumno.instagram= this.datosPersonalesForm.get('instagram').value;
    alumno.telefono= this.datosPersonalesForm.get('telefono').value;
    alumno.nombreAcudiente= this.datosPersonalesForm.get('nombreAcudiente').value;
    alumno.telefonoAcudiente= this.datosPersonalesForm.get('telefonoAcudiente').value;
    alumno.parentescoAcudiente= this.datosPersonalesForm.get('parentescoAcudiente').value;
    alumno.idSede= this.datosPersonalesForm.get('sede').value;
    alumno.profesor= this.datosPersonalesForm.get('profesor').value;
      alumno.alumno= this.datosPersonalesForm.get('alumno').value;
      return alumno;
  }

  validateForm():boolean{
    this.showMessageError = true;
    if (this.datosPersonalesForm.invalid ) {
      return false;
    }
    return true;
  }

  requestSaveAlumno(alumno:Alumno){
    this._alumnoService.saveAlumno(alumno).subscribe(response => {
      this.msgsSuccessStatus=true;
      this.msgsSuccess=response.message;
      this.cancelForm();

    });
  }




  editAlumno(idPersona: number){

      this._alumnoService.findAlumno(idPersona).subscribe(response => {
        this.loadCurrentAlumno(response.data);
        this.loadFormPersona();
      });

  }

  loadCurrentAlumno(alumno: Alumno){
      this.datosPersonalesForm.get('id').setValue(alumno.id);
      this.datosPersonalesForm.get('nombre').setValue(alumno.nombre);
      this.datosPersonalesForm.get('identificacion').setValue(alumno.identificacion);
      this.datosPersonalesForm.get('fechaNacimiento').setValue(alumno.fechaNacimiento);
      this.datosPersonalesForm.get('fechaIngreso').setValue(alumno.fechaIngreso);
      this.datosPersonalesForm.get('instagram').setValue(alumno.instagram);
      this.datosPersonalesForm.get('telefono').setValue(alumno.telefono);
      this.datosPersonalesForm.get('nombreAcudiente').setValue(alumno.nombreAcudiente);
      this.datosPersonalesForm.get('telefonoAcudiente').setValue(alumno.telefonoAcudiente);
      this.datosPersonalesForm.get('parentescoAcudiente').setValue(alumno.parentescoAcudiente);
      this.datosPersonalesForm.get('sede').setValue(alumno.idSede);
      this.datosPersonalesForm.get('profesor').setValue(alumno.profesor);
      this.datosPersonalesForm.get('alumno').setValue(alumno.alumno);
  }

}
