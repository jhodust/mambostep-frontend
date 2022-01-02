import { Sede } from './sede';
import { Observable } from 'rxjs';
import { AuthService } from './../login/auth.service';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SedeService {

  private url1="http://localhost:8080/sede/listar";

  private httpHeaders = new HttpHeaders({'Content-Type':'aplication/json'});


  constructor(private _http: HttpClient,
    private _auth:AuthService) { }


  getSedes():Observable<any>{
    return this._http.get<Sede[]>(this.url1);
  }
}
