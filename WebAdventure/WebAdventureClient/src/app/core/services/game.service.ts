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

/**
 * @class GameService
 * @description Encapsulates the logic for API and session storage interactivity involving games
 */
@Injectable()
export class GameService extends BaseService {

    private baseUrl = '';
    private headers: HttpHeaders;

    private gameRoute: string;
    private authorQueryParam = 'author';

    private usersGameIdsSessionStorage = 'usersGameIds';
    private gameCurrentlyEdittingSessionStorage = 'currentlyEdittingGame';
    private gameIdCurrentlyEdittingSessionStorage = 'currentlyEdittingGameId';

    constructor(private http: HttpClient,
        private configService: ConfigService) {
        super();
        this.baseUrl = configService.getApiURI();
        this.headers = configService.getHeaders();   
        this.gameRoute = this.baseUrl + 'games';
    }

    /**
     * @name removeGameSessionStorage
     * @returns void
     * @description Removes all game-related information from session storage
     */
    public removeGameSessionStorage(): void {
        sessionStorage.removeItem(this.usersGameIdsSessionStorage);
        sessionStorage.removeItem(this.gameCurrentlyEdittingSessionStorage);
    }

    /**
     * @name getCurrentUsersOwnedGameIdsFromSessionStorage
     * @returns string[]
     * @description Retrieves the user's owned game ids from session storage as an array of strings
     */
    public getCurrentUsersOwnedGameIdsFromSessionStorage(): string[] {
        return JSON.parse(sessionStorage.getItem(this.usersGameIdsSessionStorage));
    }

    /**
     * @name addGameIdToCurrentUsersOwnedGameIdsInSessionStorage
     * @param id - the game id to add to session storage
     * @returns void
     * @description Adds the given game id to the existing user's owned game ids in session storage
     */
    addGameIdToCurrentUsersOwnedGameIdsInSessionStorage(id: number): void {
        console.log('Id = ' + id);
        let gameIds = JSON.parse(sessionStorage.getItem(this.usersGameIdsSessionStorage));
        gameIds.push(id);
        sessionStorage.setItem(this.usersGameIdsSessionStorage, JSON.stringify(gameIds));
    }

    /**
     * @name storeUsersOwnedGameIdsInSessionStorage
     * @param games - the user's owned games you want to add
     * @returns void
     * @description Stores the given game's in session storage, notice it will overwrite any 
     * existing store. Use addGameIdToCurrentUsersOwnedGameIdsInSessionStorage if you want to 
     * add a new game.
     */
    storeUsersOwnedGameIdsInSessionStorage(games: IGame[]): void {
        // console.log('games = ' + games.toString());
        let gameIds = [];
        games.forEach(game => {
            gameIds.push(game.id);
        });
        sessionStorage.setItem(this.usersGameIdsSessionStorage, JSON.stringify(gameIds));
    }

    /**
     * @name storeGameIdUsersCurrentlyEdittingInSessionStorage
     * @param gameId - the current game id the user is editting
     * @returns void
     * @description Stores the given game id as the game the user is currently editting in session session
     */
    storeGameIdUsersCurrentlyEdittingInSessionStorage(gameId: number): void {
        // console.log('Setting gameId ' + gameId + ' to ' + this.gameCurrentlyEdittingSessionStorage + ' in session storage');
        sessionStorage.setItem(this.gameIdCurrentlyEdittingSessionStorage, JSON.stringify(gameId));
    }

    /**
     * @name getGameIdUsersCurrentlyEdittingFromSessionStorage
     * @returns number - the game id
     * @description Retrieves the game id the user is currently editting from session storage
     */
    getGameIdUsersCurrentlyEdittingFromSessionStorage(): number {
        return +sessionStorage.getItem(this.gameIdCurrentlyEdittingSessionStorage);
    }

    /**
     * @name storeGameUsersCurrentlyEdittingInSessionStorage
     * @param gameId - the current game the user is editting
     * @returns void
     * @description Stores the given game as the game the user is currently editting in session session
     */
    storeGameUsersCurrentlyEdittingInSessionStorage(game: IGame): void {
        // console.log('Setting gameId ' + gameId + ' to ' + this.gameCurrentlyEdittingSessionStorage + ' in session storage');
        sessionStorage.setItem(this.gameCurrentlyEdittingSessionStorage, JSON.stringify(game));
    }

    /**
     * @name getGameUsersCurrentlyEdittingFromSessionStorage
     * @returns number - the game id
     * @description Retrieves the game id the user is currently editting from session storage
     */
    getGameUsersCurrentlyEdittingFromSessionStorage(): IGame {
        return JSON.parse(sessionStorage.getItem(this.gameCurrentlyEdittingSessionStorage));
    }

    /**
     * @name getGame
     * @param game - IGameViewModel - the view model used for the API request
     * @returns Observable<IResponse> - an observable that the caller needs to subscribe. A caller should treat 
     * a successful response as the type IGameResponse.
     * @description Sends a HTTP GET request to the API to retrieve an individual game and some response info
     */
    getGame(game: IGameViewModel): Observable<IResponse> {
        let route: string = this.gameRoute + '/' + game.gameId;
        // console.log('Sending GET to ' + route);
        return this.http.get<IGameResponse>(route, { headers: this.headers})
        .map( (res: IGameResponse ) => {
            return res;
        })
        .catch(this.handleError); 
    }

    /**
     * @name getUsersGames
     * @param game - IUsersGamesViewModel - the view model used for the API request
     * @returns Observable<IResponse> - an observable that the caller needs to subscribe. A caller should treat 
     * a successful response as the type IUsersGameResponse.
     * @description Sends a HTTP GET request to the API to retrieve a user's games
     */
    getUsersGames(game: IUsersGamesViewModel): Observable<IResponse> {
        // console.log('Sending GET to ' + this.gameRoute + ' with param ?author=' + game.userId);
        let params = new HttpParams()
            .set(this.authorQueryParam, game.userId);
        return this.http.get<IUsersGameResponse>(this.gameRoute, { headers: this.headers, params: params})
        .map( (res: IUsersGameResponse ) => {
            if (res.status) {
                this.storeUsersOwnedGameIdsInSessionStorage(res.games);
            }
            return res;
        })
        .catch(this.handleError);        
    }

    /**
     * @name getGames
     * @returns Observable<IResponse> - an observable that the caller needs to subscribe. A caller should treat 
     * a successful response as the type IGamesResponse.
     * @description Sends a HTTP GET request to the API to retrieve all games
     */
    getGames(): Observable<IGamesResponse> {
        // console.log('Sending GET to ' + this.gameRoute);
        return this.http.get<IGamesResponse>(this.gameRoute, { headers: this.headers})
            .map( (res: IGamesResponse ) => {
                // console.log('IGamesResponse = ', res);
                return res;
            })
            .catch(this.handleError);
    }

    /**
     * @name createGame
     * @param game - IGameCreationViewModel - the view model used for the API request
     * @returns Observable<IResponse> - an observable that the caller needs to subscribe. A caller should treat 
     * a successful response as the type IGameCreationResponse.
     * @description Sends a HTTP POST request to the API to create a game
     */
    createGame(game: IGameCreationViewModel): Observable<IResponse> {
        // console.log('Body entering createGame = ' + JSON.stringify(game));
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

    /**
     * @name updateGame
     * @param game - IGameUpdationViewModel - the view model used for the API request
     * @returns Observable<IResponse> - an observable that the caller needs to subscribe. A caller should treat 
     * a successful response as the type IGameUpdationResponse.
     * @description Sends a HTTP PUT request to the API to update a game
     */
    updateGame(game: IGameUpdationViewModel): Observable<IResponse> {
        let body = JSON.stringify(game);
        return this.http.put<IGameUpdationResponse>(this.gameRoute + '/' + game.id, body, { headers: this.headers})
        .map( (res: IGameUpdationResponse) => {
            console.log('IGameUpdationResponse = ', res);
            return res;
        })
        .catch(this.handleError);
    }

}



