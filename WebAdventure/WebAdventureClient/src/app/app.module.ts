import { AuthInterceptor } from './core/services/auth-interceptor.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ViewContainerRef, Component } from '@angular/core';
import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core/core.module';
import { FormsModule } from '@angular/forms';
import { HttpModule, Response } from '@angular/http';

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
    SharedModule, // Shared (multi-instance) objects
    FormsModule,
    HttpModule
  ],
  providers: [ AppComponent ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
