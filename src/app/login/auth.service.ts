import { Persona } from './../personas/persona';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url1="http://localhost:8080/oauth/token";

  private _personaLogueada:Persona;
  private _token: string;
  constructor(private _http: HttpClient) { }

  login(persona:Persona):Observable<any>{
    const credenciales=btoa('angularapp'+':'+'12345');
    const httpHeaders=new HttpHeaders({
      'Content-Type':'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + credenciales});
  let params = new URLSearchParams();
  params.set('grant_type','password');
  params.set('username',persona.username);
  params.set('password', persona.password);
  console.log("parametros");
  console.log(params.toString());
    return this._http.post<Persona>(this.url1,params.toString(),{headers:httpHeaders});
  }

  guardarPersonaLogueada(accessToken:string){
    let payload=this.obtenerDatosToken(accessToken);
    this._personaLogueada=new Persona();
    this._personaLogueada.id=payload.id;
    this._personaLogueada.identificacion=payload.identificacion;
    this._personaLogueada.username=payload.user_name;
    this._personaLogueada.roles=payload.authorities;
    sessionStorage.setItem('usuario',JSON.stringify(this._personaLogueada));
  }

  guardarToken(accessToken:string){
    this._token=accessToken;
    sessionStorage.setItem('token',accessToken);
  }

  obtenerDatosToken(accessToken:string){
    if(accessToken != null ){
      return JSON.parse(atob(accessToken.split(".")[1]));
    }
    return null;
  }


  public get personaLogueada():Persona{
    if(this._personaLogueada != null){
      return this._personaLogueada;
    }else if(this._personaLogueada == null && sessionStorage.getItem('usuario') != null){
      this._personaLogueada=JSON.parse(sessionStorage.getItem('usuario')) as Persona;
      return this._personaLogueada;
    }
    return new Persona();
  }

  public get token():string{
    if(this._token != null){
      return this._token;
    }else if(this._token == null && sessionStorage.getItem('token') != null){
      this._token=sessionStorage.getItem('token');
      return this._token;
    }
    return null;
  }

  isAuthenticated():boolean{
    let payload=this.obtenerDatosToken(this.token);
    if(payload != null && payload.user_name && payload.user_name.length>0){
      return true;
    }
    return false;
  }

  logout():void{
    this._token=null;
    this._personaLogueada=null;
    sessionStorage.clear();
  }
}
