import { IUsersGameResponse } from './../../shared/interfaces/responses/games/users-games-response.interface';
import { IUsersGamesViewModel } from './../../shared/interfaces/view-models/games/users-games-view-model.interface';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { BaseService } from './base.service';
import { ConfigService } from './utils/config.service';

import { IGame } from './../../shared/interfaces/models/game.interface';

import { IGameCreationViewModel } from './../../shared/interfaces/view-models/games/game-creation-view-model.interface';
import { IGameUpdationViewModel } from './../../shared/interfaces/view-models/games/game-updation-view-model.interface';

import { IResponse } from '../../shared/interfaces/responses/response.interface';
import { IGamesResponse } from './../../shared/interfaces/responses/games/games-response.interface';
import { IGameCreationResponse } from './../../shared/interfaces/responses/games/game-creation-response.interface';
import { IGameUpdationResponse } from './../../shared/interfaces/responses/games/game-updation-response.interface';
import { IUser } from '../../shared/interfaces/models/user.interface';

@Injectable()
export class GameService extends BaseService {

    private baseUrl = '';
    private headers: HttpHeaders;

    private gameRoute: string;

    constructor(private http: HttpClient,
        private configService: ConfigService) {
        super();
        this.baseUrl = configService.getApiURI();
        this.headers = configService.getHeaders();   
        this.gameRoute = this.baseUrl + 'games';
    }

    getUsersGames(game: IUsersGamesViewModel): Observable<IResponse> {
        let route: string = this.gameRoute + '/' + game.userId;
        console.log('Sending GET to ' + route);
        return this.http.get<IUsersGameResponse>(route, { headers: this.headers})
        .map( (res: IUsersGameResponse ) => {
            console.log('IUsersGameResponse = ', res);
            return res;
        })
        .catch(this.handleError);        
    }

    getGames(): Observable<IResponse> {
        console.log('Sending GET to ' + this.gameRoute);
        return this.http.get<IGamesResponse>(this.gameRoute, { headers: this.headers})
            .map( (res: IGamesResponse ) => {
                console.log('IGamesResponse = ', res);
                return res;
            })
            .catch(this.handleError);
    }

    saveGame(game: IGameCreationViewModel): Observable<IResponse> {
        console.log('Body entering saveGame = ' + JSON.stringify(game));
        console.log('Sending POST to ' + this.gameRoute);
        let body = JSON.stringify(game);
        return this.http.post<IGameCreationResponse>(this.gameRoute, body, { headers: this.headers })
        .map( (res: IGameCreationResponse) => {
            console.log('IGameCreationResponse = ', res);
            if (res.status) {
                console.log('Successfully created game! ' + res);
            }
            return res;
        })
        .catch(this.handleError);
    }

}

