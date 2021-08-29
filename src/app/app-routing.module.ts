import { MensualidadComponent } from './mensualidad/mensualidad.component';
import { ConsultaPersonaComponent } from './consulta-persona/consulta-persona.component';
import { PersonasComponent } from './personas/personas.component';

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'personas', component: PersonasComponent },
  { path: 'consulta-alumno', component: ConsultaPersonaComponent },
  { path: 'mensualidad', component: MensualidadComponent },

];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
