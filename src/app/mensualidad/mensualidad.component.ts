import { ClaseService } from './../clases/clase.service';
import { Subject } from 'rxjs';
import { PaqueteService } from './../paquete/paquete.service';
import { MensualidadService } from './mensualidad.service';
import { PersonaService } from './../personas/persona.service';
import { Validators, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Paquete } from '../paquete/paquete';
import { Persona } from '../personas/persona';
import { Clase } from '../clases/clase';
@Component({
  selector: 'app-mensualidad',
  templateUrl: './mensualidad.component.html',
  styleUrls: ['./mensualidad.component.css']
})
export class MensualidadComponent implements OnInit {

  constructor(private _formBuilder: FormBuilder,
    private _personaService:PersonaService,
    private _mensualidadService: MensualidadService,
    private _paqueteService: PaqueteService,
    private _claseService: ClaseService){ }


  mensualidadForm = this._formBuilder.group({
    identificacion: ['', Validators.required],
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

  dtTrigger: Subject<any> = new Subject<any>();
  msgsSuccessStatus:boolean=false;
  msgsSuccess:string;
  msgsErrorStatus:boolean=false;
  msgsError:string;
  ngOnInit(): void {
    this.listPersonas=[];
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


  cancelForm(){
    this.mensualidadForm.reset();
    this.idsClasesSeleccionadas=[];
  }


  guardarMensualidad(){
    let dto={
      fechaInicio: this.mensualidadForm.get('fechaInicio')?.value,
      fechaFin: this.mensualidadForm.get('fechaFin')?.value,
      nombrePaquete: this.paqueteSelected.nombre,
      precioPaquete: this.paqueteSelected.precio,
      precioPactado: this.mensualidadForm.get('precioPactado')?.value,
      observaciones: this.mensualidadForm.get('observaciones')?.value,
      idPersona: this.mensualidadForm.get('idPersona')?.value,
      idsClases: this.idsClasesSeleccionadas,
    }
    this._mensualidadService.saveMensualidad(dto).subscribe(response => {
      console.log("guardando mensualidad");
      console.log(response);
      this.msgsSuccessStatus=true;
      this.msgsSuccess="Registro exitoso mensualidad";
      this.cancelForm();
    })
  }

  loadPaquetePrecio(){
    this.paqueteSelected=this.loadPaqueteSelected();
    console.log(this.paqueteSelected);
    this.mensualidadForm.get('precioPactado').setValue(this.paqueteSelected.precio);
  }

  loadPaqueteSelected(){
    let paqueteElegido;
    let idPaquete=this.mensualidadForm.get('idPaquete').value;
    this.paquetes.forEach(function (paquete) {
      if(paquete.id == idPaquete){
        paqueteElegido=paquete;
      }
    });
    return paqueteElegido;
  }

  searchAlumnoByIdentificacion(){
    let identificacion=this.mensualidadForm.get('identificacion').value;
    this._personaService.searchDatosAlumno(identificacion).subscribe(response => {
      console.log(response);
      this.mensualidadForm.get('idPersona').setValue(response.id);
    })
  }
}
