import { Observable } from 'rxjs';
import { Mensualidad } from './mensualidad';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MensualidadService {



  private url1="http://localhost:8080/mensualidad/searchLast";
  private url2="http://localhost:8080/mensualidad/registrar";
  private url3="http://localhost:8080/mensualidad/dateFechaFinMensualidad";
  constructor(private _http: HttpClient) { }



  searchLastMensualidad(documento:string):Observable<any>{
    let params = new HttpParams ();
    params.append("documento", documento);
    return this._http.get<Mensualidad>(this.url1+'/'+documento);
  }



  saveMensualidad(dto:any):Observable<any>{
    return this._http.post<Mensualidad>(this.url2,dto);
  }

  getFechaFinMensualidad(fechaInicioMensualidad: string, diasHabilesMensualidad: string){
    return this._http.get<any>(this.url3+'/'+fechaInicioMensualidad+'/'+diasHabilesMensualidad);
  }


}
