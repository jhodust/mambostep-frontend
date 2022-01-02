import { ToastrModule } from 'ngx-toastr';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { TokenInterceptor } from './interceptors/token.interceptor';
import { PersonasComponent } from './personas/personas.component';
import { MensualidadComponent } from './mensualidad/mensualidad.component';
import { ConsultaPersonaComponent } from './consulta-persona/consulta-persona.component';
import { SideleftbarComponent } from './sideleftbar/sideleftbar.component';
import { HeaderComponent } from './header/header.component';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { DataTablesModule } from "angular-datatables";
import { PaqueteComponent } from './paquete/paquete.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ClasesComponent } from './clases/clases.component';
import { HorarioClaseComponent } from './horario-clase/horario-clase.component';
import { LoginComponent } from './login/login.component';
import { MainComponent } from './main/main.component';
import { SedesComponent } from './sedes/sedes.component';
import { ProfesoresComponent } from './profesores/profesores.component';
import { AlumnosComponent } from './alumnos/alumnos.component';

@NgModule({
  declarations: [
    AppComponent,
    SideleftbarComponent,
    HeaderComponent,
    ConsultaPersonaComponent,
    PersonasComponent,
    MensualidadComponent,
    PaqueteComponent,
    ClasesComponent,
    HorarioClaseComponent,
    LoginComponent,
    MainComponent,
    PaqueteComponent,
    ClasesComponent,
    SedesComponent,
    ProfesoresComponent,
    AlumnosComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    DataTablesModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      closeButton: true,
    }),
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
              { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
