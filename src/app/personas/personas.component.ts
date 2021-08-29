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



  datosPersonalesForm = this._formBuilder.group({
    nombre: ['', Validators.required],
    identificacion: ['', Validators.required],
    fechaNacimiento: ['', Validators.required],
    fechaIngreso: ['', Validators.required],
    instagram: ['', Validators.required],
    telefono: ['', Validators.required],
    nombreAcudiente: ['', Validators.required],
    telefonoAcudiente: ['', Validators.required],
    parentescoAcudiente: ['', Validators.required],
    idSede: ['', Validators.required],
  });
  primeraMensualidadForm = this._formBuilder.group({
    fechaInicio: ['', Validators.required],
    fechaFin: ['', Validators.required],
    idPaquete: ['', Validators.required],
    precioPaquete: ['', Validators.required],
    precioPactado: ['', Validators.required],
    observaciones: ['', Validators.required],
    idPersona: ['', Validators.required],
    clases: ['', Validators.required]
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
  ngOnInit(): void {
    this.listPersonas=[];
  this.listarPersonas();
  this.listarPaquetes();
  this.listarClases();
  }

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
    let fechaActual: any=new Date();
    return (Math.floor(((fechaActual-fechaNac) / (1000 * 3600 * 24)) / 365))<18;
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

  guardarAlumno(){
    let dto={
      nombre: this.datosPersonalesForm.get('nombre')?.value,
      identificacion: this.datosPersonalesForm.get('identificacion')?.value,
      fechaNacimiento: this.datosPersonalesForm.get('fechaNacimiento')?.value,
      fechaIngreso: this.datosPersonalesForm.get('fechaIngreso')?.value,
      instagram: this.datosPersonalesForm.get('instagram')?.value,
      telefono: this.datosPersonalesForm.get('telefono')?.value,
      nombreAcudiente: this.datosPersonalesForm.get('nombreAcudiente')?.value,
      telefonoAcudiente: this.datosPersonalesForm.get('telefonoAcudiente')?.value,
      parentescoAcudiente: this.datosPersonalesForm.get('parentescoAcudiente')?.value,
      idSede: 1,
    }

    this._personaService.savePersona(dto).subscribe(response => {
      console.log("guardando persona")
      console.log(response);
      this.guardarMensualidad(response.id);
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
      this.msgsSuccess="Registro exitoso alumno";
      this.cancelForm();
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
}
