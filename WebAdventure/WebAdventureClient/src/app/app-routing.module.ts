import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Guards 
import { AuthGuard } from './core/services/guards/auth-guard.service';
import { NotAlreadyLoggedInGuard } from './core/services/guards/not-already-logged-in-guard.service';

import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found.component';
import { GamesComponent } from './games/games.component';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';

// Create
import { CreateComponent } from './create/create.component';
import { CreateInfoComponent } from './create/info/create-info.component';

const routes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'login', canActivate: [NotAlreadyLoggedInGuard], component: LoginComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'games', component: GamesComponent },
    { 
        path: 'create',
        canActivate: [AuthGuard],
        loadChildren: 'app/create/create.module#CreateModule'
    },
    { path: '',  pathMatch: 'full', redirectTo: 'home' },
    { path: '**', pathMatch: 'full', component: PageNotFoundComponent } // catch any unfound routes and redirect to home page
];

@NgModule({
    imports: [
      RouterModule.forRoot(routes)
    ],
    providers: [ ],
    exports: [ RouterModule ]
})
export class AppRoutingModule {
    static components = [ HomeComponent, LoginComponent, SignupComponent, 
        GamesComponent, PageNotFoundComponent ];
 }
