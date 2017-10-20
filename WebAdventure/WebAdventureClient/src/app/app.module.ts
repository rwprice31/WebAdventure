import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core/core.module';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent,
    AppRoutingModule.components
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CoreModule, // Singleton objects
    SharedModule // Shared (multi-instance) objects
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
