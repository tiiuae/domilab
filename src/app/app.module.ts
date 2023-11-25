import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NetworkComponent } from './components/network/network.component';
import { InteractiveSigmaPage } from './pages/interactive-sigma/interactive-sigma.page';
import { NetworkAttacksPage } from './pages/network-attacks/network-attacks.page';
import { ApiService } from './services/api.service';
import { ToastService } from './services/toast.service';
import { ArcDiagramPage } from './pages/arc-diagram/arc-diagram.page';
import { MenuService } from './services/menu.service';
import { ArcDiagramComponent } from './components/arc-diagram/arc-diagram.component';

@NgModule({
  declarations: [
    AppComponent,
    NetworkComponent,
    ArcDiagramComponent,
    InteractiveSigmaPage,
    NetworkAttacksPage,
    ArcDiagramPage,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    NgbModule
  ],
  providers: [
    ApiService,
    MenuService,
    ToastService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
