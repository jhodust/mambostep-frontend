import { AuthService } from './../login/auth.service';
import { Observable } from 'rxjs';
import { Paquete } from './paquete';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PaqueteService {

  private url1="http://localhost:8080/paquetes/listar";
  private url2="http://localhost:8080/paquetes/save";

  private httpHeaders = new HttpHeaders({'Content-Type':'aplication/json'});


  constructor(private _http: HttpClient,
    private _auth:AuthService) { }

  getPaquetes():Observable<Paquete[]>{
    return this._http.get<Paquete[]>(this.url1);
  }

  savePaquete(dto:any):Observable<Paquete>{
    return this._http.post<Paquete>(this.url2,dto);
  }
}
