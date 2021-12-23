import { Clase } from './../clases/clase';


import { PaqueteService } from './../paquete/paquete.service';
import { Subject } from 'rxjs';
import { MensualidadService } from './../mensualidad/mensualidad.service';
import { PersonaService } from './persona.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Persona } from './persona';
import { Paquete } from '../paquete/paquete';
import { ClaseService } from '../clases/clase.service';

@Component({
  selector: 'app-personas',
  templateUrl: './personas.component.html',
  styleUrls: ['./personas.component.css']
})
export class PersonasComponent implements OnInit {

  constructor(private _formBuilder: FormBuilder,
    private _personaService:PersonaService,
    private _mensualidadService: MensualidadService,
    private _paqueteService: PaqueteService,
    private _claseService: ClaseService) { }


  showMessageError: boolean = false;
  messageError: string = "Este campo es obligatorio";
  datosPersonalesForm = this._formBuilder.group({
    nombre: ['', Validators.required],
    identificacion: ['', Validators.required],
    fechaNacimiento: ['', Validators.required],
    fechaIngreso: ['', Validators.required],
    instagram: ['', Validators.required],
    telefono: ['', Validators.required],
    nombreAcudiente: [''],
    telefonoAcudiente: [''],
    parentescoAcudiente: [''],
    profesor: [false],
    alumno: [false]
  });

  primeraMensualidadForm = this._formBuilder.group({
    fechaInicio: ['', Validators.required],
    fechaFin: ['', Validators.required],
    idPaquete: ['', Validators.required],
    precioPactado: ['', Validators.required],
    observaciones: ['']
  });

  profesorForm = this._formBuilder.group({
    valorClase: ['', Validators.required],
    valorMensualidad: ['', Validators.required]
  });


  paquetes: Paquete[] = [];
  paqueteSelected: Paquete=new Paquete();
  listClases: Clase[];

  idsClasesSeleccionadas:any[]=[];
  listPersonas: Persona[] = [];

  viewForm:boolean=false;
  dtTrigger: Subject<any> = new Subject<any>();
  msgsSuccessStatus:boolean=false;
  msgsSuccess:string;
  msgsErrorStatus:boolean=false;
  msgsError:string;
  hiddenFormPagoMensualidad:boolean;
  hiddenFormProfesor:boolean;

  ngOnInit(): void {
    this.listPersonas=[];
  this.listarPersonas();
  this.listarPaquetes();
  this.listarClases();
  this.hiddenFormPagoMensualidad=true;
  this.hiddenFormProfesor=true;
  }

  get formDatos() { return this.datosPersonalesForm.controls; }
  get formMensualidad() { return this.primeraMensualidadForm.controls; }
  get formProfesor() { return this.profesorForm.controls; }

  listarPaquetes(){
    this.paquetes=[];
    this._paqueteService.getPaquetes().subscribe(json => {
      this.paquetes=json;

    });
  }

  listarClases(){
    this.listClases=[];
    this._claseService.getClases().subscribe(json => {
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


  loadClase(idClase:any, checkActivo:any){
    console.log(idClase);
    console.log(checkActivo);
    if(checkActivo){
      this.idsClasesSeleccionadas.push(idClase);
    }else{
      this.idsClasesSeleccionadas.forEach((element,index)=>{
        if(element==idClase) this.idsClasesSeleccionadas.splice(index, 1);
     });
    }

  }

  listarPersonas(){
    this.listPersonas=[];
    this._personaService.getPersonas().subscribe(json => {
      this.listPersonas=json;
      this.dtTrigger.next();

    });
  }

  createAlumno(){
    this.viewForm=true;
  }

  cancelForm(){
    this.dtTrigger.unsubscribe();
    this.viewForm=false;
    this.listarPersonas();
  }

  guardarPersona(){
    this.showMessageError = true;
    if (this.datosPersonalesForm.invalid ||
      (this.datosPersonalesForm.get('profesor').value && this.profesorForm.invalid) ||
      (this.datosPersonalesForm.get('alumno').value  && this.primeraMensualidadForm.invalid)) {
      console.log(this.datosPersonalesForm);
      console.log(this.primeraMensualidadForm);
      console.log(this.profesorForm);
      console.log("campos invalidos");
      return;
    }
    let dto={
      nombre: this.datosPersonalesForm.get('nombre').value,
      identificacion: this.datosPersonalesForm.get('identificacion').value,
      fechaNacimiento: this.datosPersonalesForm.get('fechaNacimiento').value,
      fechaIngreso: this.datosPersonalesForm.get('fechaIngreso').value,
      instagram: this.datosPersonalesForm.get('instagram').value,
      telefono: this.datosPersonalesForm.get('telefono').value,
      nombreAcudiente: this.datosPersonalesForm.get('nombreAcudiente').value,
      telefonoAcudiente: this.datosPersonalesForm.get('telefonoAcudiente').value,
      parentescoAcudiente: this.datosPersonalesForm.get('parentescoAcudiente').value,
      idSede: 1,
      profesor: this.datosPersonalesForm.get('profesor').value,
      alumno: this.datosPersonalesForm.get('alumno').value,
    }
    console.log(dto);
    this._personaService.savePersona(dto).subscribe(response => {
      console.log("guardando persona")
      console.log(response);
      if(response.alumno){
        this.guardarAlumno(response.id);
        this.guardarMensualidad(response.id);
      }else if( response.profesor){
        this.guardarProfesor(response.id);
      }

    });
  }

  guardarMensualidad(idPersona:number){
    let dto={
      fechaInicio: this.primeraMensualidadForm.get('fechaInicio')?.value,
      fechaFin: this.primeraMensualidadForm.get('fechaFin')?.value,
      nombrePaquete: this.paqueteSelected.nombre,
      precioPaquete: this.paqueteSelected.precio,
      precioPactado: this.primeraMensualidadForm.get('precioPactado')?.value,
      observaciones: this.primeraMensualidadForm.get('observaciones')?.value,
      idPersona: idPersona,
      idsClases: this.idsClasesSeleccionadas,
    }
    this._mensualidadService.saveMensualidad(dto).subscribe(response => {
      console.log("guardando mensualidad");
      console.log(response);
      this.msgsSuccessStatus=true;
      this.msgsSuccess="Registro exitoso persona";
      this.cancelForm();
    })
  }
  guardarProfesor(idPersona:number){
    let dto={
      valorClase: this.profesorForm.get('valorClase')?.value,
      pagoClasesMes: this.profesorForm.get('valorMensualidad')?.value,
      idPersona: idPersona,
    }

    this._personaService.saveProfesor(dto).subscribe(response => {
      this.msgsSuccessStatus=true;
      this.msgsSuccess="Registro exitoso persona";
      this.cancelForm();
    })
  }

  guardarAlumno(idPersona:number){
    let dto={
      idPersona: idPersona,
    }

    this._personaService.saveAlumno(dto).subscribe(response => {

    })
  }

  loadPaquetePrecio(){
    this.paqueteSelected=this.loadPaqueteSelected();
    console.log(this.paqueteSelected);
    this.primeraMensualidadForm.get('precioPactado').setValue(this.paqueteSelected.precio);
  }

  loadPaqueteSelected(){
    let paqueteElegido;
    let idPaquete=this.primeraMensualidadForm.get('idPaquete').value;
    this.paquetes.forEach(function (paquete) {
      if(paquete.id == idPaquete){
        paqueteElegido=paquete;
      }
    });
    return paqueteElegido;
  }

  changeTipoPersonaAlumno(){
    this.datosPersonalesForm.get('profesor').setValue(!this.datosPersonalesForm.get('alumno').value);
    this.hiddenFormPagoMensualidad=!this.datosPersonalesForm.get('alumno').value;
    this.hiddenFormProfesor=!this.datosPersonalesForm.get('profesor').value;
  }

  changeTipoPersonaProfesor(){
    this.datosPersonalesForm.get('alumno').setValue(!this.datosPersonalesForm.get('profesor').value);
    this.hiddenFormPagoMensualidad=!this.datosPersonalesForm.get('alumno').value;
    this.hiddenFormProfesor=!this.datosPersonalesForm.get('profesor').value;
  }
}
