import { IGame } from './../../shared/interfaces/models/game.interface';
import { IMonsterCreationResponse } from './../../shared/interfaces/responses/monsters/monster-creation-response.interface';
import { IMonsterCreationViewModel } from './../../shared/interfaces/view-models/monsters/monster-creation-view-model.interface';
import { IResponse } from './../../shared/interfaces/responses/response.interface';
import { Observable } from 'rxjs/Rx';
import { IToastr } from './../../shared/interfaces/external-libraries/toastr.interface';
import { TOASTR_TOKEN } from './external-libraries/toastr.service';
import { GameService } from './game.service';
import { ConfigService } from './utils/config.service';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable, Inject, OnInit } from '@angular/core';
import { BaseService } from './base.service';
import { IMonsterViewModel } from '../../shared/interfaces/view-models/monsters/monster-view-model.interface';
import { IMonsterResponse } from '../../shared/interfaces/responses/monsters/monster-response.interface';
import { IMonstersResponse } from '../../shared/interfaces/responses/monsters/monsters-response.interface';
import { IMonsterUpdatingViewModel } from '../../shared/interfaces/view-models/monsters/monster-updating-view-model.interface';
import { IMonsterUpdatingResponse } from '../../shared/interfaces/responses/monsters/monster-updating-response.interface';
import { IMonsterDeletionViewModel } from '../../shared/interfaces/view-models/monsters/monster-deletion-view-model.interface';
import { IMonsterDeletionResponse } from '../../shared/interfaces/responses/monsters/monster-deletion-response.interface';


/**
 * @class MonsterService
 * @description Encapsulates the logic for API and session storage interactivity involving games
 */
@Injectable()
export class MonsterService extends BaseService {

    private baseUrl = '';
    private headers: HttpHeaders;

    private monstersRoute: string;

    private game: IGame;

    private monstersIdCurrentlyEdittingInSessionStorageKey = 'monstersIdCurrentlyEditting';

    constructor(private http: HttpClient,
        private configService: ConfigService,
        @Inject(TOASTR_TOKEN) private toastr: IToastr,
        private gameService: GameService) {
        super();
        this.baseUrl = configService.getApiURI();
        this.headers = configService.getHeaders();   
    }

    /**
     * @name setCurrentlyEdittingMonsterToSessionStorage
     * @param 
     * @returns void
     * @description Sets the currently editting monsters id to session storage.
     */  
    setCurrentlyEdittingMonsterToSessionStorage(monstersId: number): void {
        sessionStorage.setItem(this.monstersIdCurrentlyEdittingInSessionStorageKey, monstersId.toString());
    }

    /**
     * @name getCurrentEdittingMonsterFromSessionStorage
     * @returns the monsters id from session storage
     * @description Retrieves the currently editting monsters id from session storage.
     */  
    getCurrentEdittingMonsterFromSessionStorage(): number {
        return +sessionStorage.getItem(this.monstersIdCurrentlyEdittingInSessionStorageKey);
    }

    /**
     * @name getMonstersRoute
     * @returns void
     * @description Attempts to retrieve the current editing game id from 
     * session storage, throws an error if not found. Sets up this.monstersRoute
     * variable if successfull.
     */   
    getMonstersRoute(): string {
        this.game = this.gameService.getGameUsersCurrentlyEdittingFromSessionStorage();
        if (!this.game) {
            this.toastr.error('No game id found.');
            throw new Error('No game id found in monsters service');
        } else {
            this.monstersRoute = this.baseUrl + 'games/' + this.game.id + '/monsters';
            return this.monstersRoute;
        }
    }

    /**
     * @name getMonsters
     * @returns Observable<IResponse> - an observable that the caller needs to subscribe. A caller should treat 
     * a successful response as the type IMonstersResponse.
     * @description Sends a HTTP GET request to the API to retrieve all monsters
     */
    getMonsters(): Observable<IResponse> {
        this.getMonstersRoute();
        console.log('Sending GET to ' + this.monstersRoute);
        return this.http.get<IMonstersResponse>(this.monstersRoute, { headers: this.headers})
            .map( (res: IMonstersResponse ) => {
                return res;
            })
            .catch(this.handleError);
    }

    /**
     * @name getMonster
     * @param game - IMonsterViewModel - the view model used for the API request
     * @returns Observable<IResponse> - an observable that the caller needs to subscribe. A caller should treat 
     * a successful response as the type IMonsterResponse.
     * @description Sends a HTTP GET request to the API to retrieve an individual monsters and some response info
     */
    getMonster(monsters: IMonsterViewModel): Observable<IResponse> {
        this.getMonstersRoute();
        let route: string = this.monstersRoute + '/' + monsters.monsterId;
        return this.http.get<IMonsterResponse>(route, { headers: this.headers })
            .map( (res: IMonsterResponse) => {
                return res;
            })
            .catch(this.handleError);
    }     

    /**
     * @name createMonster
     * @param monsters - IMonsterCreationViewModel - the view model used for the API request
     * @returns Observable<IResponse> - an observable that the caller needs to subscribe. A caller should treat 
     * a successful response as the type IMonsterCreationResponse.
     * @description Sends a HTTP POST request to the API to create a monsters
     */
    createMonster(monsters: IMonsterCreationViewModel): Observable<IResponse> {
        this.getMonstersRoute();
        console.log('Body entering createMonster = ' + JSON.stringify(monsters));
        console.log('Sending POST to ' + this.monstersRoute);
        let body = JSON.stringify(monsters);
        return this.http.post<IMonsterCreationResponse>(this.monstersRoute, body, { headers: this.headers})
        .map( (res: IMonsterCreationResponse) => {
            console.log('IMonsterCreationResponse ' + res);
            return res;
        });
    }

    /**
     * @name updateMonster
     * @param game - IMonsterUpdationViewModel - the view model used for the API request
     * @returns Observable<IResponse> - an observable that the caller needs to subscribe. A caller should treat 
     * a successful response as the type IMonsterUpdationResponse.
     * @description Sends a HTTP PUT request to the API to update a monsters
     */
    updateMonster(monsters: IMonsterUpdatingViewModel): Observable<IResponse> {
        this.getMonstersRoute();
        let route: string = this.monstersRoute + '/' + monsters.id;
        let body = JSON.stringify(monsters);
        return this.http.put<IMonsterUpdatingResponse>(route, body, { headers: this.headers })
          .map((res: IMonsterUpdatingResponse) => {
            console.log('IMonsterUpdatingResponse = ', res);
            return res;
        });
    }

    /**
     * @name deleteMonster
     * @param monsters - IMonsterDeletionViewModel
     * @returns Observable<IResponse> - an observable that the caller needs to subscribe. A caller should treat 
     * a successful response as the type IMonsterDeletionResponse.
     * @description Sends a HTTP DELETE request to the API to delete a monsters
     */
    deleteMonster(monsters: IMonsterDeletionViewModel): Observable<IResponse> {
        this.getMonstersRoute();
        let route: string = this.monstersRoute + '/' + monsters.id;
        let body = JSON.stringify(monsters);
        return this.http.delete<IMonsterDeletionResponse>(route, { headers: this.headers })
        .map( (res: IMonsterDeletionResponse) => {
            console.log('IMonsterDeletionResponse = ', res);
            return res;
        });
    }

}



