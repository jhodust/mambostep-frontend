import { Profesor } from '../profesores/profesor';
import { AuthService } from './../login/auth.service';
import { Persona } from './persona';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class PersonaService {

  private url1="http://localhost:8080/personas";
  private url2="http://localhost:8080/personas/guardar";
  private url3="http://localhost:8080/personas/search";
  private url4="http://localhost:8080/personas/update";

  private url6="http://localhost:8080/personas/alumno/save";

  private url8="http://localhost:8080/personas/find";


  private httpHeaders = new HttpHeaders({'Content-Type':'aplication/json'});


  constructor(private _http: HttpClient,
    private _auth:AuthService) { }


  getPersonas():Observable<Persona[]>{
    return this._http.get<Persona[]>(this.url1);
  }


  savePersona(dto:any):Observable<any>{
    return this._http.post<Persona>(this.url2,dto);
  }



  saveAlumno(dto:any):Observable<any>{
    return this._http.post<Persona>(this.url6,dto);
  }

  searchDatosAlumno(documento:string):Observable<any>{
    return this._http.get<Persona>(this.url3+'/'+documento);
  }

  updatePersona(id:number, dto:any):Observable<Persona>{
    return this._http.put<Persona>(this.url4+"/"+id,dto);
  }



  findPersona(idPersona: number):Observable<any>{
    return this._http.get<Persona[]>(this.url8+'/'+idPersona);
  }


}
