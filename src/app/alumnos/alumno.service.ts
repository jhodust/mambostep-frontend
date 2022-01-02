import { Observable } from 'rxjs';
import { AuthService } from './../login/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Alumno } from './alumno';

@Injectable({
  providedIn: 'root'
})
export class AlumnoService {

  private url1="http://localhost:8080/personas/alumno/all";
  private url2="http://localhost:8080/personas/alumno/save";
  private url3="http://localhost:8080/personas/alumno/find";

  private httpHeaders = new HttpHeaders({'Content-Type':'aplication/json'});


  constructor(private _http: HttpClient,
    private _auth:AuthService) { }



    getAlumnos():Observable<any>{
      return this._http.get<Alumno[]>(this.url1);
    }

    saveAlumno(dto:any):Observable<any>{
      return this._http.post<Alumno>(this.url2,dto);
    }



    findAlumno(idPersona: number):Observable<any>{
      return this._http.get<Alumno[]>(this.url3+'/'+idPersona);
    }
}
