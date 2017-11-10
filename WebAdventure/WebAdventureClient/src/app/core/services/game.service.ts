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
import { IGameViewModel } from '../../shared/interfaces/view-models/games/game-view-model.interface';
import { IGameResponse } from '../../shared/interfaces/responses/games/game-response.interface';
import { HttpParams } from '@angular/common/http';

export let gameIdsLocalStorage = 'authorsGameIds';
export let gameCurrentlyEdittingLocalStorage = 'currentlyEdittingGameId';

@Injectable()
export class GameService extends BaseService {

    private baseUrl = '';
    private headers: HttpHeaders;

    private gameRoute: string;
    private authorQueryParam = 'author';

    constructor(private http: HttpClient,
        private configService: ConfigService) {
        super();
        this.baseUrl = configService.getApiURI();
        this.headers = configService.getHeaders();   
        this.gameRoute = this.baseUrl + 'games';
    }

    getGame(game: IGameViewModel): Observable<IResponse> {
        let route: string = this.gameRoute + '/' + game.gameId;
        console.log('Sending GET to ' + route);
        return this.http.get<IGameResponse>(route, { headers: this.headers})
        .map( (res: IGameResponse ) => {
            return res;
        })
        .catch(this.handleError); 
    }

    getUsersGames(game: IUsersGamesViewModel): Observable<IResponse> {
        // console.log('Sending GET to ' + this.gameRoute + ' with param ?author=' + game.userId);
        let params = new HttpParams()
            .set(this.authorQueryParam, game.userId);
        return this.http.get<IUsersGameResponse>(this.gameRoute, { headers: this.headers, params: params})
        .map( (res: IUsersGameResponse ) => {
            if (res.status) {
                this.storeAuthorsGameIdsInLocalStorage(res.games);
            }
            return res;
        })
        .catch(this.handleError);        
    }

    getGames(): Observable<IResponse> {
        // console.log('Sending GET to ' + this.gameRoute);
        return this.http.get<IGamesResponse>(this.gameRoute, { headers: this.headers})
            .map( (res: IGamesResponse ) => {
                // console.log('IGamesResponse = ', res);
                return res;
            })
            .catch(this.handleError);
    }

    saveGame(game: IGameCreationViewModel): Observable<IResponse> {
        // console.log('Body entering saveGame = ' + JSON.stringify(game));
        // console.log('Sending POST to ' + this.gameRoute);
        let body = JSON.stringify(game);
        return this.http.post<IGameCreationResponse>(this.gameRoute, body, { headers: this.headers })
        .map( (res: IGameCreationResponse) => {
            // console.log('IGameCreationResponse = ', res);
            if (res.status) {
                // console.log('Successfully created game! ' + res);
            }
            return res;
        })
        .catch(this.handleError);
    }

    updateGame(game: IGameUpdationViewModel): Observable<IResponse> {
        let body = JSON.stringify(game);
        return this.http.put<IGameUpdationResponse>(this.gameRoute + '/' + game.id, body, { headers: this.headers})
        .map( (res: IGameUpdationResponse) => {
            console.log('IGameUpdationResponse = ', res);
            return res;
        })
        .catch(this.handleError);
    }

    addGameIdToLocalStorage(id: number) {
        console.log('Id = ' + id);
        let gameIds = JSON.parse(localStorage.getItem(gameIdsLocalStorage));
        gameIds.push(id);
        localStorage.setItem(gameIdsLocalStorage, JSON.stringify(gameIds));
    }

    storeAuthorsGameIdsInLocalStorage(games: IGame[]) {
        // console.log('games = ' + games.toString());
        let gameIds = [];
        games.forEach(game => {
            gameIds.push(game.id);
        });
        localStorage.setItem(gameIdsLocalStorage, JSON.stringify(gameIds));
    }

    setGameCurrentlyEdittingInLocalStorage(gameId: number) {
        // console.log('Setting gameId ' + gameId + ' to ' + gameCurrentlyEdittingLocalStorage + ' in local storage');
        localStorage.setItem(gameCurrentlyEdittingLocalStorage, gameId.toString());
    }

    getGameCurrentlyEdittingFromLocalStorage(): number {
        return +localStorage.getItem(gameCurrentlyEdittingLocalStorage);
    }

}

