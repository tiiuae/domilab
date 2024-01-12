import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InteractiveSigmaPage } from './pages/interactive-sigma/interactive-sigma.page';
import { NetworkAttacksPage } from './pages/network-attacks/network-attacks.page';
import { ArcDiagramPage } from './pages/arc-diagram/arc-diagram.page';
import { ComparisonPage } from './pages/comparison/comparison.page';

const routes: Routes = [
  // { path: 'interactive-sigma', component: InteractiveSigmaPage },
  { path: 'network-attacks', component: NetworkAttacksPage },
  { path: 'comparison', component: ComparisonPage },
  // { path: 'arc-diagram', component: ArcDiagramPage },
  { path: '**', component: NetworkAttacksPage },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
