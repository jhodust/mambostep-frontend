import { Observable } from 'rxjs';
import { Clase } from './clase';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ClaseService {

  private url1="http://localhost:8080/clases/listar";
  constructor(private _http: HttpClient) { }

  getClases():Observable<Clase[]>{
    return this._http.get<Clase[]>(this.url1);
  }
}
