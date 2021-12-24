import { HorarioClaseService } from './../horario-clase/horario-clase.service';
import { HorarioClase } from './../horario-clase/horario-clase';
import { Subject } from 'rxjs';
import { ClaseService } from './clase.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Clase } from './clase';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-clases',
  templateUrl: './clases.component.html',
  styleUrls: ['./clases.component.css']
})
export class ClasesComponent implements OnInit {
  @ViewChild('modalRegistroHorarioClase') modalRegistroHorarioClase: ElementRef;
  @ViewChild('closeModalHorariobutton') closeModalHorarioClasebutton;

  diasSemana:any[];
  constructor(private _formBuilder: FormBuilder,
    private _claseService: ClaseService,
    private _toastr: ToastrService,
    private _horarioClaseService: HorarioClaseService) { }



  showMessageError: boolean = false;
  messageError: string = "Este campo es obligatorio";
  datosClaseForm = this._formBuilder.group({
    nombre: ['', Validators.required],
    status: [false, Validators.required],
  });

  datosHorarioClaseForm = this._formBuilder.group({
    dia: ['', Validators.required],
    horaInicio: ['', Validators.required],
    horaFin: ['', Validators.required],
  });

  clases: Clase[] = [];

  viewForm:boolean=false;
  dtTrigger: Subject<any> = new Subject<any>();
  msgsSuccessStatus:boolean=false;
  msgsSuccess:string;
  msgsErrorStatus:boolean=false;
  msgsError:string;
  listHorarioClaseTemp: HorarioClase[];
  msgErrorResponseFormHorarioClase:string;

  ngOnInit(): void {
    this.initDiasSemana();
    this.listHorarioClaseTemp=[];
  }

  get formClase() { return this.datosClaseForm.controls; }
  get formHorarioClase() { return this.datosHorarioClaseForm.controls; }

  initDiasSemana(){
    this.diasSemana=[
      {
        "day": "Lunes",
      },
      {
        "day": "Martes",
      },
      {
        "day": "Miercoles",
      },
      {
        "day": "Jueves",
      },
      {
        "day": "Viernes",
      },
      {
        "day": "Sabado",
      },
      {
        "day": "Domingo",
      }
    ]
  }

  createClase(){
    this.viewForm=true;
  }

  openModal() {
    console.log("open")
    this.modalRegistroHorarioClase.nativeElement.className = 'modal show';
  }

  listarClases(){
    this.clases=[];
    this._claseService.getClases().subscribe(json => {
      this.clases=json;
      console.log(this.clases);
      this.dtTrigger.next();
    });
  }
  cancelForm(){
    this.dtTrigger.unsubscribe();
    this.viewForm=false;
    this.listarClases();
  }

  guardarClase(){
    this.showMessageError = true;
    if (this.datosClaseForm.invalid || this.datosClaseForm.invalid) {
      console.log(this.datosClaseForm);
      console.log("campos invalidos");
      return;
    }
    /*let dto={
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
    });*/
  }

  validateCheck(condition:boolean){
    return condition ? "SI":"NO";
  }

  addHorario(){
    this.cleanMsjErrorFormHorarioClase();
    if (this.datosHorarioClaseForm.invalid){
      this.msgErrorResponseFormHorarioClase="Diligencia el formulario correctamente";
      return;
    }
    let horarioTemp=this.buildHorarioClaseTemp();
    if(horarioTemp.validateHoraFinDespuesHoraInicio()){
      this.validateHoursClass(horarioTemp);
    }else{
      this.msgErrorResponseFormHorarioClase="La hora fin debe ser posterior a la hora inicio";
    }


  }

  buildHorarioClaseTemp():HorarioClase{
    let horarioTemp=new HorarioClase();
    horarioTemp.dia=this.datosHorarioClaseForm.get('dia').value;
    horarioTemp.horaInicio=this.datosHorarioClaseForm.get('horaInicio').value;
    horarioTemp.horaFin=this.datosHorarioClaseForm.get('horaFin').value;
    return horarioTemp;
  }

  validateHoursClass(horarioTemp:HorarioClase){

    this._horarioClaseService.validateAvailableHours(horarioTemp.dia,
      horarioTemp.horaInicio,horarioTemp.horaFin ).subscribe(response => {
      console.log(response);
      if(response.data){
        this.listHorarioClaseTemp.push(horarioTemp);
        this.closeModalHorarioAndResetForm();
      }else{
        this.msgErrorResponseFormHorarioClase=response.message;
      }
    });
  }

  cleanMsjErrorFormHorarioClase(){
    this.msgErrorResponseFormHorarioClase=null;
  }

  closeModalHorarioAndResetForm(){
    this.datosHorarioClaseForm.reset();
    //this.closeModalHorarioClasebutton.nativeElement.click();
  }

  deleteHorarioTemp(horarioClaseTemp:HorarioClase){
    this.listHorarioClaseTemp.forEach((value,index)=>{
      if(value.dia==horarioClaseTemp.dia &&
         value.horaInicio==horarioClaseTemp.horaInicio &&
         value.horaFin==horarioClaseTemp.horaFin){
          this.listHorarioClaseTemp.splice(index,1);
          this._toastr.success('Se ha eliminado el horario exitosamente!', 'Excelente');
         }
  });
  }
}
