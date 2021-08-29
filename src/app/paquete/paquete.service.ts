import { Observable } from 'rxjs';
import { Paquete } from './paquete';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PaqueteService {

  private url1="http://localhost:8080/paquetes/listar";

  constructor(private _http: HttpClient) { }

  getPaquetes():Observable<Paquete[]>{
    return this._http.get<Paquete[]>(this.url1);
  }
}
