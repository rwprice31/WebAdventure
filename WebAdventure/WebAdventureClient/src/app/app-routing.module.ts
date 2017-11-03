import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Guards 
import { AuthGuard } from './core/services/guards/auth-guard.service';
import { NotAlreadyLoggedInGuard } from './core/services/guards/not-already-logged-in-guard.service';

import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found.component';
import { BrowseGamesComponent } from './browse-games/browse-games.component';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { ResetPasswordComponent } from './resetpassword/resetpassword.component';

const routes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'login', canActivate: [NotAlreadyLoggedInGuard], component: LoginComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'games', component: BrowseGamesComponent },
    { path: 'resetpassword', component: ResetPasswordComponent},
    { 
        path: 'my-games',
        canActivate: [AuthGuard],
        loadChildren: 'app/my-games/my-games.module#MyGamesModule'
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
    static components = [ HomeComponent, LoginComponent, SignupComponent, ResetPasswordComponent,
        BrowseGamesComponent, PageNotFoundComponent ];
 }
