import { ProfesorService } from './../profesores/profesor.service';
import { SedeService } from './../sedes/sede.service';
import { Sede } from './../sedes/sede';
import { Profesor } from '../profesores/profesor';
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
    private _horarioClaseService: HorarioClaseService,
    private _profesorService: ProfesorService,
    private _sedeService: SedeService) { }



  showMessageError: boolean = false;
  messageError: string = "Este campo es obligatorio";
  datosClaseForm = this._formBuilder.group({
    id: [''],
    nombre: ['', Validators.required],
    sede: ['', Validators.required],
    profesor: ['', Validators.required],
    status: [true, Validators.required],
  });

  datosHorarioClaseForm = this._formBuilder.group({
    dia: ['', Validators.required],
    horaInicio: ['', Validators.required],
    horaFin: ['', Validators.required],
  });

  clases: Clase[] = [];

  viewForm:boolean=false;
  dtTrigger: Subject<any>;
  msgsSuccessStatus:boolean=false;
  msgsSuccess:string;
  msgsErrorStatus:boolean=false;
  msgsError:string;
  listHorarioClaseTemp: HorarioClase[];
  msgErrorResponseFormClase:string;
  msgErrorResponseFormHorarioClase:string;
  listProfesores: Profesor[] = [];
  listSedes: Sede[] = [];
  showMsgErrorResponseFormHorarioClase: boolean;
  ngOnInit(): void {
    this.dtTrigger=new Subject<any>();
    this.listarClases();
    this.initDiasSemana();
    this.listarSedes();
    this.listarProfesores();
    this.listHorarioClaseTemp=[];
    this.showMsgErrorResponseFormHorarioClase=false;

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

  listarProfesores(){
    this.listProfesores=[];
    this._profesorService.getProfesores().subscribe(json => {
      this.listProfesores=json.data;
    });
  }

  listarSedes(){
    this.listSedes=[];
    this._sedeService.getSedes().subscribe(json => {
      this.listSedes=json.data;
    });
  }


  loadFormClase(){

    this.dtTrigger.unsubscribe();
    this.viewForm=true;
  }

  openModal() {
    this.modalRegistroHorarioClase.nativeElement.className = 'modal show';
  }

  listarClases(){
    this.clases=[];
    this._claseService.getAllClases().subscribe(json => {
      this.clases=json;
      this.dtTrigger.next();
    });
  }
  cancelFormClase(){
    this.viewForm=false;
    this.datosClaseForm.reset();
  }

  guardarClase(){


    if(this.validateFormClase() && this.validateHorarioAgregado()){
      let clase=this.buildClase();
      this.sendRequestSaveClase(clase);
    }

  }

  validateFormClase():Boolean{
  this.showMessageError=true;
    if (this.datosClaseForm.invalid) {
      this.msgErrorResponseFormClase="Diligencia el formulario correctamente";
      return false;
    }
    return true;
  }

  validateHorarioAgregado():Boolean{
    if (this.listHorarioClaseTemp.length === 0) {
      this.msgErrorResponseFormClase="Agrega el horario de la clase";
      return false;
    }
    return true;
  }

  buildClase():Clase{

    let clase = new Clase();
    clase.id=this.datosClaseForm.get('id').value;
    clase.nombre=this.datosClaseForm.get('nombre').value;
    clase.status=this.datosClaseForm.get('status').value;
    clase.idSede=this.datosClaseForm.get('sede').value;
    clase.idProfesor=this.datosClaseForm.get('profesor').value;
    clase.listHorarioClase=this.listHorarioClaseTemp;
    return clase;
  }

  sendRequestSaveClase(claseDto:Clase){
    this._claseService.saveClase(claseDto).subscribe(response => {
      this.msgsSuccessStatus=true;
      this.msgsSuccess=response.message;
      this.cancelFormClase();
      this.listarClases();
    });
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
      horarioTemp.horaInicio,horarioTemp.horaFin, this.datosClaseForm.get('sede').value ).subscribe(response => {
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
    this.showMsgErrorResponseFormHorarioClase = false;
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
  onChangeSede(){
    this.listHorarioClaseTemp=[];
  }

  editClase(idClase: number){
    this._claseService.editClase(idClase).subscribe(response => {
      this.loadCurrentClase(response.data);
      this.loadFormClase();
    });
  }

  loadCurrentClase(clase: Clase){
    this.datosClaseForm.get('id').setValue(clase.id);
    this.datosClaseForm.get('nombre').setValue(clase.nombre);
    this.datosClaseForm.get('sede').setValue(clase.idSede);
    this.datosClaseForm.get('profesor').setValue(clase.idProfesor);
    this.datosClaseForm.get('status').setValue(clase.status);
    this.listHorarioClaseTemp=clase.listHorarioClase;
  }
}
