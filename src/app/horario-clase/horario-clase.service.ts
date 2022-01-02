import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HorarioClase } from './horario-clase';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HorarioClaseService {

  private url1="http://localhost:8080/horario/alumno";
  private url2="http://localhost:8080/horario/validateAvailableHours";

  constructor(private _http: HttpClient) { }

  getHorarioAlumno(identificacion:string):Observable<HorarioClase[]>{
    return this._http.get<HorarioClase[]>(this.url1+"/"+identificacion);
  }

  validateAvailableHours(dia: string, horaInicio: any, horaFin:any, idSede:any):Observable<any>{
    const options = { params: new HttpParams().set("dia",dia).set("horaInicio", horaInicio).set("horaFin", horaFin).set("idSede", idSede) } ;
    return this._http.get<HorarioClase[]>(this.url2, options);
  }
}
