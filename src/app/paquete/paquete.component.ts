import { Subject } from 'rxjs';
import { PaqueteService } from './paquete.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Paquete } from './paquete';
@Component({
  selector: 'app-paquete',
  templateUrl: './paquete.component.html',
  styleUrls: ['./paquete.component.css']
})
export class PaqueteComponent implements OnInit {

  constructor(private _formBuilder: FormBuilder,
    private _paqueteService: PaqueteService) { }

  ngOnInit(): void {

    this.dtTrigger=new Subject<any>();
    this.hiddenInputCantidadHorasSemanales=false;
    this.listarPaquetes();
  }

  showMessageError: boolean = false;
  messageError: string = "Este campo es obligatorio";
  datosPaqueteForm = this._formBuilder.group({
    id: [''],
    nombre: ['', Validators.required],
    precio: ['', Validators.required],
    diasDuracion: ['', Validators.required],
    cantidadClasesEstandarPorSemana: [''],
    hasClasesCrewLatina: [false, Validators.required],
    hasClasesCrewUrbana: [false, Validators.required],
    hasClasesIlimitadas: [false, Validators.required],
    isVentaPublico: [false, Validators.required],
    status: [true, Validators.required],
  });

  paquetes: Paquete[] = [];

  viewForm:boolean=false;
  dtTrigger: Subject<any> = new Subject<any>();
  msgsSuccessStatus:boolean=false;
  msgsSuccess:string;
  msgsErrorStatus:boolean=false;
  msgsError:string;

  hiddenInputCantidadHorasSemanales:boolean;

  get formDatos() { return this.datosPaqueteForm.controls; }

  loadFormPaquete(){
    this.dtTrigger.unsubscribe();
    this.viewForm=true;
  }

  listarPaquetes(){
    this.paquetes=[];
    this._paqueteService.getPaquetes().subscribe(json => {
      this.paquetes=json;
      this.dtTrigger.next();
    });
  }
  closeForm(){
    this.viewForm=false;
    this.listarPaquetes();
  }

  validateFormPaquete():Boolean{
    this.showMessageError=false;
    if (this.datosPaqueteForm.invalid) {
      this.showMessageError=true;
      this.msgsError="Diligencia el formulario correctamente";
      return false;
    }
    return true;
  }

  guardarPaquete(){
    if(this.validateFormPaquete()){
      let paquete= this.buildPaquete();
      this.sendRequestSavePaquete(paquete);
    }

  }

  buildPaquete(){
    let paquete= new Paquete();
    paquete.id=this.datosPaqueteForm.get('id').value;
    paquete.nombre= this.datosPaqueteForm.get('nombre').value;
    paquete.precio= this.datosPaqueteForm.get('precio').value;
    paquete.diasDuracion= this.datosPaqueteForm.get('diasDuracion').value;
    paquete.cantidadClasesEstandarSemana= this.datosPaqueteForm.get('cantidadClasesEstandarPorSemana').value;
    paquete.hasClasesCrewLatina= this.datosPaqueteForm.get('hasClasesCrewLatina').value;
    paquete.hasClasesCrewUrbano= this.datosPaqueteForm.get('hasClasesCrewUrbana').value;
    paquete.ventaPublico= this.datosPaqueteForm.get('isVentaPublico').value;
    paquete.hasClasesIlimitadas= this.datosPaqueteForm.get('hasClasesIlimitadas').value;
    paquete.status= this.datosPaqueteForm.get('status').value;
    return paquete;
  }

  sendRequestSavePaquete(paquete:Paquete){
    this._paqueteService.savePaquete(paquete).subscribe(response => {
      this.msgsSuccessStatus=true;
      this.msgsSuccess=response.body.message;
      this.closeForm();
    });
  }

  validateCheck(condition:boolean){
    return condition ? "SI":"NO";
  }

  changeCheckClasesIlimitadas(event){
    if(event.target.checked){
      this.hiddenInputCantidadHorasSemanales=true;
      this.datosPaqueteForm.get('cantidadClasesEstandarPorSemana').setValue(null);
    }else{
      this.hiddenInputCantidadHorasSemanales=false;
    }
  }

  editPaquete(idPaquete: number){
    this._paqueteService.editPaquete(idPaquete).subscribe(response => {
      this.loadCurrentPaquete(response.data);
      this.loadFormPaquete();
    });
  }

  loadCurrentPaquete(paquete: Paquete){
    this.datosPaqueteForm.get('id').setValue(paquete.id);
    this.datosPaqueteForm.get('nombre').setValue(paquete.nombre);
    this.datosPaqueteForm.get('precio').setValue(paquete.precio);
    this.datosPaqueteForm.get('diasDuracion').setValue(paquete.diasDuracion);
    this.datosPaqueteForm.get('cantidadClasesEstandarPorSemana').setValue(paquete.cantidadClasesEstandarSemana);
    this.datosPaqueteForm.get('hasClasesCrewLatina').setValue(paquete.hasClasesCrewLatina);
    this.datosPaqueteForm.get('hasClasesCrewUrbana').setValue(paquete.hasClasesCrewUrbano);
    this.datosPaqueteForm.get('isVentaPublico').setValue(paquete.ventaPublico);
    this.datosPaqueteForm.get('hasClasesIlimitadas').setValue(paquete.hasClasesIlimitadas);
    this.datosPaqueteForm.get('status').setValue(paquete.status);
  }
}
