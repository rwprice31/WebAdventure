import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found.component';

const routes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: '', component: HomeComponent },
    { path: '**', component: PageNotFoundComponent } // catch any unfound routes and redirect to home page
];

@NgModule({
    imports: [
      RouterModule.forRoot(routes)
    ],
    providers: [ ],
    exports: [ RouterModule ]
})
export class AppRoutingModule {
    static components = [ HomeComponent, PageNotFoundComponent ];
 }
