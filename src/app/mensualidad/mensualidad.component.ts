import { ClaseService } from './../clases/clase.service';
import { Subject } from 'rxjs';
import { PaqueteService } from './../paquete/paquete.service';
import { MensualidadService } from './mensualidad.service';
import { PersonaService } from './../personas/persona.service';
import { Validators, FormBuilder } from '@angular/forms';
import { Component, OnInit, QueryList, ViewChildren, ElementRef } from '@angular/core';
import { Paquete } from '../paquete/paquete';
import { Persona } from '../personas/persona';
import { Clase } from '../clases/clase';
@Component({
  selector: 'app-mensualidad',
  templateUrl: './mensualidad.component.html',
  styleUrls: ['./mensualidad.component.css']
})
export class MensualidadComponent implements OnInit {
  @ViewChildren("checkboxClase") checkboxes: QueryList<ElementRef>;

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
  hideClases:boolean;
  disableClases:boolean;
  totalClasesPosibles:number;
  showMessageError: boolean = false;
  messageError: string = "Este campo es obligatorio";
  hiddenFormMensualidad:boolean;
  showMessageErrorResponse:boolean;
  msgErrorResponseForm:string;
  showMessageInfoPersona:boolean;
  infoPersona:string;
  ngOnInit(): void {
    this.listPersonas=[];
  this.listarPaquetes();
  this.listarClases();
  this.initConditions();
  }

  initConditions(){
    this.hideClases=true;
    this.disableClases=false;
    this.hiddenFormMensualidad=true;
    this.showMessageErrorResponse=false;
    this.showMessageInfoPersona=false;
  }

  get formDatosMensualidad() { return this.mensualidadForm.controls; }

  listarPaquetes(){
    this.paquetes=[];
    this._paqueteService.getPaquetes().subscribe(json => {
      this.paquetes=json;

    });
  }

  listarClases(){
    this.listClases=[];
    this._claseService.getClasesActivas().subscribe(json => {
      this.listClases=json;

    });
  }





  guardarMensualidad(){
    /*if(!this.validateAllClasesSeleccionadas(this.paqueteSelected.hasClasesIlimitadas) ||
    !this.validateForm){
      return;
    }*/
    let dto={
      fechaInicio: this.mensualidadForm.get('fechaInicio')?.value,
      fechaFin: this.mensualidadForm.get('fechaFin')?.value,
      nombrePaquete: this.paqueteSelected.nombre,
      precioPaquete: this.paqueteSelected.precio,
      precioPactado: this.mensualidadForm.get('precioPactado')?.value,
      observaciones: this.mensualidadForm.get('observaciones')?.value,
      idPersona: this.mensualidadForm.get('idPersona')?.value,
      idsClases: this.idsClasesSeleccionadas,
      hasClasesIlimitadas: this.paqueteSelected.hasClasesIlimitadas
    }
    this._mensualidadService.saveMensualidad(dto).subscribe(response => {

      this.msgsSuccessStatus=true;
      this.msgsSuccess=response.message;
      this.resetForm();
    })
  }

  validateAllClasesSeleccionadas(hasClasesSeleccionadas){
    if(!this.paqueteSelected.hasClasesIlimitadas && this.totalClasesPosibles != 0){
      this.showMessageErrorResponse=true;
      this.msgErrorResponseForm="Selecciona la cantidad de clases posibles para el paquete elegido";
      return false;
    }
    return true;
  }

  validateForm(){
    this.showMessageError=true;
    if (this.mensualidadForm.invalid ) {
      return false;
    }
    return true;
  }

  changePaquete(){
    this.paqueteSelected=this.loadPaqueteSelected();
    this.loadPaquetePrecio(this.paqueteSelected);
    this.hiddenClases(this.paqueteSelected);
    this.resetClasesSelected();
  }

  loadPaquetePrecio(paquete:Paquete){
    this.mensualidadForm.get('precioPactado').setValue(paquete.precio);
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
      this.showInfoPersona(response);
      this.mensualidadForm.get('idPersona').setValue(response.data.id);
    }, err => {
      this.showErrorInfoPersona(err.error);
    })
  }


  showInfoPersona(response){

      this.showMessageErrorResponse=false;
      this.showMessageInfoPersona=true;
      this.infoPersona=response.data.nombre;
      this.hiddenFormMensualidad=false;

  }
  showErrorInfoPersona(error){
    this.hiddenFormMensualidad=true;
    this.showMessageErrorResponse=true;
    this.showMessageInfoPersona=false;
    this.msgErrorResponseForm=error.message;
  }

  hiddenClases(paquete:Paquete){
    if(paquete.hasClasesIlimitadas){
      this.idsClasesSeleccionadas=[];
      this.hideClases=true;
    }else{
      this.totalClasesPosibles=Number(paquete.cantidadClasesEstandarSemana);
      this.hideClases=false;
    }

  }

  loadClase(idClase:any, event){
    if(event.target.checked){
      this.idsClasesSeleccionadas.push(idClase);
    }else{
      this.idsClasesSeleccionadas.forEach((element,index)=>{
        if(element==idClase) this.idsClasesSeleccionadas.splice(index, 1);
     });
    }
    this.validateClaseSelected(event);

  }

  validateClaseSelected(event){
    if(event.target.checked){

      if(this.totalClasesPosibles > 0){
        this.totalClasesPosibles=this.totalClasesPosibles-1;

      }else{
        event.target.checked=false;

      }
    }else{
      this.totalClasesPosibles=this.totalClasesPosibles+1;
    }

  }

  resetClasesSelected(){
    this.idsClasesSeleccionadas=[];
    this.checkboxes.forEach((element) => {
      element.nativeElement.checked = false;
    });
  }

  resetForm(){
    this.initConditions();
    this.resetClasesSelected();
    this.totalClasesPosibles=0;
    this.mensualidadForm.reset();
  }



  getFechaFinMensualidad(){
    this._mensualidadService.getFechaFinMensualidad(this.mensualidadForm.get('fechaInicio').value,String(this.paqueteSelected.diasDuracion)).subscribe(response => {

      this.mensualidadForm.get('fechaFin').setValue(response.data);
    }, err => {
      console.log("error");
      console.log(err);
    })
  }
}
