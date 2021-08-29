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
import { HttpClientModule } from '@angular/common/http';
import { DataTablesModule } from "angular-datatables";
import { PaqueteComponent } from './paquete/paquete.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ClasesComponent } from './clases/clases.component';

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
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    DataTablesModule,
    BrowserAnimationsModule, // required animations module
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
