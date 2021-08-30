import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HorarioClase } from './horario-clase';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HorarioClaseService {

  private url1="http://localhost:8080/horario/alumno";

  constructor(private _http: HttpClient) { }

  getHorarioAlumno(identificacion:string):Observable<HorarioClase[]>{
    return this._http.get<HorarioClase[]>(this.url1+"/"+identificacion);
  }
}
