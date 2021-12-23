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
    this.listarPaquetes();
  }

  showMessageError: boolean = false;
  messageError: string = "Este campo es obligatorio";
  datosPaqueteForm = this._formBuilder.group({
    nombre: ['', Validators.required],
    precio: ['', Validators.required],
    cantidadClasesEstandarPorSemana: ['', Validators.required],
    hasClasesCrewLatina: [false, Validators.required],
    hasClasesCrewUrbana: [false, Validators.required],
    isVentaPublico: [false, Validators.required],
    status: [false, Validators.required],
  });

  paquetes: Paquete[] = [];

  viewForm:boolean=false;
  dtTrigger: Subject<any> = new Subject<any>();
  msgsSuccessStatus:boolean=false;
  msgsSuccess:string;
  msgsErrorStatus:boolean=false;
  msgsError:string;

  get formDatos() { return this.datosPaqueteForm.controls; }

  createPaquete(){
    this.viewForm=true;
  }

  listarPaquetes(){
    this.paquetes=[];
    this._paqueteService.getPaquetes().subscribe(json => {
      this.paquetes=json;
      console.log(this.paquetes);
      this.dtTrigger.next();
    });
  }
  cancelForm(){
    this.dtTrigger.unsubscribe();
    this.viewForm=false;
    this.listarPaquetes();
  }

  guardarPaquete(){
    this.showMessageError = true;
    if (this.datosPaqueteForm.invalid || this.datosPaqueteForm.invalid) {
      console.log(this.datosPaqueteForm);
      console.log("campos invalidos");
      return;
    }
    let dto={
      nombre: this.datosPaqueteForm.get('nombre').value,
      precio: this.datosPaqueteForm.get('precio').value,
      cantidadClasesEstandarSemana: this.datosPaqueteForm.get('cantidadClasesEstandarPorSemana').value,
      hasClasesCrewLatina: this.datosPaqueteForm.get('hasClasesCrewLatina').value,
      hasClasesCrewUrbano: this.datosPaqueteForm.get('hasClasesCrewUrbana').value,
      ventaPublico: this.datosPaqueteForm.get('isVentaPublico').value,
      status: this.datosPaqueteForm.get('status').value
    }
    console.log(dto);
    this._paqueteService.savePaquete(dto).subscribe(response => {
      this.msgsSuccessStatus=true;
      this.msgsSuccess="Registro exitoso paquete";
      this.cancelForm();
    });
  }

  validateCheck(condition:boolean){
    return condition ? "SI":"NO";
  }
}
