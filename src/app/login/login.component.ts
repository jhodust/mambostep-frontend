import { AuthService } from './auth.service';
import { Persona } from './../personas/persona';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  persona:Persona;
  constructor(private _authService: AuthService,
    private _router: Router) {
    this.persona=new Persona();
   }


  ngOnInit(): void {
    if(this._authService.isAuthenticated()){
      console.log("ya autenticado");
      this._router.navigate(['/admin/personas']);
    }
  }

  login():void{
    console.log("$$$$$$$$$$$44");
    console.log(this.persona);
    if(this.persona.username == null || this.persona.password == null){
      console.log("username o password incorrectos");
      return;
    }

    this._authService.login(this.persona).subscribe(response => {
        console.log(response);
        this._authService.guardarPersonaLogueada(response.access_token);
        this._authService.guardarToken(response.access_token);
        let usuario = this._authService.personaLogueada;
        console.log(usuario);
        this._router.navigate(['/admin/alumnos']);
    },err => {
      if(err.status == 400){
        console.log("usuario o password incorrectas");
      }
    });
  }

}
