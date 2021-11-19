import { MainComponent } from './main/main.component';
import { LoginComponent } from './login/login.component';
import { MensualidadComponent } from './mensualidad/mensualidad.component';
import { ConsultaPersonaComponent } from './consulta-persona/consulta-persona.component';
import { PersonasComponent } from './personas/personas.component';

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'admin', component: MainComponent,
    children: [
      { path: 'personas', component: PersonasComponent,canActivate:[AuthGuard] },
      { path: 'consulta-alumno', component: ConsultaPersonaComponent,canActivate:[AuthGuard] },
      { path: 'mensualidad', component: MensualidadComponent,canActivate:[AuthGuard] },
    ]}


];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
