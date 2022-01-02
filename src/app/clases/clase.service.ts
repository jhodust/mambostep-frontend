import { Observable } from 'rxjs';
import { Clase } from './clase';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ClaseService {

  private url1="http://localhost:8080/clases/listar/all";
  private url2="http://localhost:8080/clases/save";
  private url3="http://localhost:8080/clases/find";
  private url4="http://localhost:8080/clases/listar/active";
  constructor(private _http: HttpClient) { }

  getAllClases():Observable<any[]>{
    return this._http.get<Clase[]>(this.url1);
  }

  getClasesActivas():Observable<any[]>{
    return this._http.get<Clase[]>(this.url1);
  }

  saveClase(claseDto: Clase):Observable<any>{
    return this._http.post<Clase>(this.url2,claseDto);
  }

  editClase(idClase:any):Observable<any>{
    return this._http.get<Clase>(this.url3+'/'+idClase);
  }
}
