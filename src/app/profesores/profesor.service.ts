import { Observable } from 'rxjs';
import { Profesor } from './profesor';
import { AuthService } from './../login/auth.service';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProfesorService {

  private url1="http://localhost:8080/personas/profesor/all";
  private url2="http://localhost:8080/personas/profesor/save";
  private url3="http://localhost:8080/personas/profesor/find";

  private httpHeaders = new HttpHeaders({'Content-Type':'aplication/json'});


  constructor(private _http: HttpClient,
    private _auth:AuthService) { }



    getProfesores():Observable<any>{
      return this._http.get<Profesor[]>(this.url1);
    }

    saveProfesor(dto:any):Observable<any>{
      return this._http.post<Profesor>(this.url2,dto);
    }



    findProfesor(idPersona: number):Observable<any>{
      return this._http.get<Profesor[]>(this.url3+'/'+idPersona);
    }
}
