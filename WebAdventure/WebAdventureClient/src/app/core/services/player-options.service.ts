import { BaseService } from './base.service';
import { Injectable, Inject } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from './utils/config.service';
import { IResponse } from '../../shared/interfaces/responses/response.interface';
import { Observable } from 'rxjs/Observable';
import { IPlayerOptionsViewModel } from '../../shared/interfaces/view-models/player-options/player-options-view-model.interface';
import { IPlayerOptionsCreationViewModel } from '../../shared/interfaces/view-models/player-options/player-options-creation-view-model.interface';
import { IPlayerOptionsUpdationViewModel } from '../../shared/interfaces/view-models/player-options/player-options-updation-view-model.interface';
import { IPlayerOptionsResponse } from '../../shared/interfaces/responses/player-options/players-options-response.interface';
import { IGameResponse } from '../../shared/interfaces/responses/games/game-response.interface';
import { IPlayerOptionsCreationResponse } from '../../shared/interfaces/responses/player-options/player-options-creation-response.interface';
import { IPlayerOptionsUpdationResponse } from '../../shared/interfaces/responses/player-options/player-options-updation-response.interface';
import { GameService } from './game.service';
import { IToastr } from '../../shared/interfaces/external-libraries/toastr.interface';
import { TOASTR_TOKEN } from './external-libraries/toastr.service';

/**
 * @class PlayerOptionsService
 * @description Encapsulates the logic for API interactivity involving player options
 */
@Injectable()
export class PlayerOptionsService extends BaseService {
    
    private baseUrl: string;
    private headers: HttpHeaders;

    private playerOptionsRoute: string;

    constructor(private http: HttpClient,
        private configService: ConfigService,
        private gameService: GameService,
        @Inject(TOASTR_TOKEN) private toastr: IToastr) {
        super();
        this.baseUrl = configService.getApiURI();
        this.headers = configService.getHeaders();
        this.playerOptionsRoute = this.baseUrl + 'players';
    }

    /**
     * @name getPlayerOptionsRoute
     * @returns void
     * @description Attempts to retrieve the current editting game id from 
     * session storage, throws an error if not found. Sets up this.playerOptionsRoute
     * variable if successfull.
     */
    getPlayerOptionsRoute(): void {
        let gameId = this.gameService.getGameIdUsersCurrentlyEdittingFromSessionStorage();
        if (!gameId) {
            this.toastr.error('No game id found');
            throw new Error('No game id found in player options service.');
        } else {
            this.playerOptionsRoute = this.baseUrl + 'games/' + gameId + '/players';
        }
    }

    /**
     * @name getPlayerOptions
     * @param playerOptions - IPlayerOptionsViewModel - the view model used for the API request
     * @returns Observable<IResponse> - an observable that the caller needs to subscribe. A caller should treat 
     * a successful response as the type IPlayerOptionsResponse.
     * @description Sends a HTTP GET request to the API to retrieve an individual player option and some response info
     */
    getPlayerOptions(): Observable<IResponse> {
        this.getPlayerOptionsRoute();
        // console.log('Sending GET to ' + this.playerOptionsRoute);
        return this.http.get<IPlayerOptionsResponse>(this.playerOptionsRoute, { headers: this.headers})
        .map( (res: IPlayerOptionsResponse ) => {
            return res;
        })
        .catch(this.handleError); 
    }

    /**
     * @name createPlayerOption
     * @param playerOptions - IPlayerOptionsCreationViewModel - the view model used for the API request
     * @returns Observable<IResponse> - an observable that the caller needs to subscribe. A caller should treat 
     * a successful response as the type IPlayerOptionsCreationResponse.
     * @description Sends a HTTP POST request to the API to create a player option
     */
    createPlayerOptions(playerOptions: IPlayerOptionsCreationViewModel): Observable<IResponse> {
        // console.log('Body entering createPlayerOptions = ' + JSON.stringify(playerOptions));
        // console.log('Sending POST to ' + this.playerOptionsRoute);
        let body = JSON.stringify(playerOptions);
        return this.http.post<IPlayerOptionsCreationResponse>(this.playerOptionsRoute, body, { headers: this.headers })
        .map( (res: IPlayerOptionsCreationResponse) => {
            // console.log('IPlayerOptionsCreationResponse = ', res);
            if (res.status) {
                // console.log('Successfully created game! ' + res);
            }
            return res;
        })
        .catch(this.handleError);
    }

    /**
     * @name updatePlayerOptions
     * @param playerOptions - IPlayerOptionsUpdationViewModel - the view model used for the API request
     * @returns Observable<IResponse> - an observable that the caller needs to subscribe. A caller should treat 
     * a successful response as the type IPlayerOptionsUpdationResponse.
     * @description Sends a HTTP PUT request to the API to create a player option
     */     
    updatePlayerOptions(playerOptions: IPlayerOptionsUpdationViewModel): Observable<IResponse> {
        let body = JSON.stringify(playerOptions);
        return this.http.put<IPlayerOptionsUpdationResponse>(this.playerOptionsRoute + '/' + playerOptions.id, body, { headers: this.headers})
        .map( (res: IPlayerOptionsUpdationResponse) => {
            // console.log('IPlayerOptionsUpdationResponse = ', res);
            return res;
        })
        .catch(this.handleError);
    }

}
