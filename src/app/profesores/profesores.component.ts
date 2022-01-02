import { ProfesorService } from './profesor.service';
import { ClaseService } from './../clases/clase.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { SedeService } from './../sedes/sede.service';
import { Sede } from './../sedes/sede';
import { Profesor } from './profesor';
import { Clase } from '../clases/clase';


import { PaqueteService } from './../paquete/paquete.service';
import { Subject } from 'rxjs';
import { Paquete } from '../paquete/paquete';
@Component({
  selector: 'app-profesores',
  templateUrl: './profesores.component.html',
  styleUrls: ['./profesores.component.css']
})
export class ProfesoresComponent implements OnInit {

  constructor(private _formBuilder: FormBuilder,
    private _profesorService:ProfesorService,
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
    alumno: [false],
    valorClase: ['', Validators.required],
    valorMensualidad: ['', Validators.required]
  });




  paquetes: Paquete[] = [];
  paqueteSelected: Paquete=new Paquete();
  listClases: Clase[];

  idsClasesSeleccionadas:any[]=[];
  listProfesores: Profesor[] = [];

  viewForm:boolean=false;
  dtTrigger: Subject<any> = new Subject<any>();
  msgsSuccessStatus:boolean=false;
  msgsSuccess:string;
  msgsErrorStatus:boolean=false;
  msgsError:string;
  listSedes:Sede[];

  ngOnInit(): void {
    this.listProfesores=[];
  this.listarProfesores();
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


  listarProfesores(){
    this.listProfesores=[];
    this._profesorService.getProfesores().subscribe(response => {

      this.listProfesores=response.data;
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
    this.listarProfesores();
    this.datosPersonalesForm.reset();
  }

  guardarProfesor(){
    this.showMessageError = true;
    if (this.validateForm()){
      let profesor= this.buildProfesor();
      this.requestSaveProfesor(profesor);
    }

  }


  buildProfesor(): Profesor{
    let profesor = new Profesor();
    profesor.id= this.datosPersonalesForm.get('id').value;
    profesor.nombre= this.datosPersonalesForm.get('nombre').value;
    profesor.identificacion= this.datosPersonalesForm.get('identificacion').value;
    profesor.fechaNacimiento= this.datosPersonalesForm.get('fechaNacimiento').value;
    profesor.fechaIngreso= this.datosPersonalesForm.get('fechaIngreso').value;
    profesor.instagram= this.datosPersonalesForm.get('instagram').value;
    profesor.telefono= this.datosPersonalesForm.get('telefono').value;
      profesor.nombreAcudiente= this.datosPersonalesForm.get('nombreAcudiente').value;
      profesor.telefonoAcudiente= this.datosPersonalesForm.get('telefonoAcudiente').value;
      profesor.parentescoAcudiente= this.datosPersonalesForm.get('parentescoAcudiente').value;
      profesor.idSede= this.datosPersonalesForm.get('sede').value;
      profesor.profesor= this.datosPersonalesForm.get('profesor').value;
      profesor.alumno= this.datosPersonalesForm.get('alumno').value;
      profesor.valorClase= this.datosPersonalesForm.get('valorClase').value;
      profesor.pagoClasesMes= this.datosPersonalesForm.get('valorMensualidad').value;
      return profesor;
  }

  validateForm():boolean{
    this.showMessageError = true;
    if (this.datosPersonalesForm.invalid ) {
      return false;
    }
    return true;
  }

  requestSaveProfesor(profesor:Profesor){
    this._profesorService.saveProfesor(profesor).subscribe(response => {
      this.msgsSuccessStatus=true;
      this.msgsSuccess=response.message;
      this.cancelForm();

    });
  }




  editProfesor(idPersona: number){

      this._profesorService.findProfesor(idPersona).subscribe(response => {
        this.loadCurrentProfesor(response.data);
        this.loadFormPersona();
      });

  }

  loadCurrentProfesor(profesor: Profesor){
      this.datosPersonalesForm.get('id').setValue(profesor.id);
      this.datosPersonalesForm.get('nombre').setValue(profesor.nombre);
      this.datosPersonalesForm.get('identificacion').setValue(profesor.identificacion);
      this.datosPersonalesForm.get('fechaNacimiento').setValue(profesor.fechaNacimiento);
      this.datosPersonalesForm.get('fechaIngreso').setValue(profesor.fechaIngreso);
      this.datosPersonalesForm.get('instagram').setValue(profesor.instagram);
      this.datosPersonalesForm.get('telefono').setValue(profesor.telefono);
      this.datosPersonalesForm.get('nombreAcudiente').setValue(profesor.nombreAcudiente);
      this.datosPersonalesForm.get('telefonoAcudiente').setValue(profesor.telefonoAcudiente);
      this.datosPersonalesForm.get('parentescoAcudiente').setValue(profesor.parentescoAcudiente);
      this.datosPersonalesForm.get('sede').setValue(profesor.idSede);
      this.datosPersonalesForm.get('profesor').setValue(profesor.profesor);
      this.datosPersonalesForm.get('alumno').setValue(profesor.alumno);
      this.datosPersonalesForm.get('valorClase').setValue(profesor.valorClase);
      this.datosPersonalesForm.get('valorMensualidad').setValue(profesor.pagoClasesMes);
  }

}
