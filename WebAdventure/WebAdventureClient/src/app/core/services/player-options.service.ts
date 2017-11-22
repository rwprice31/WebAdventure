import { BaseService } from './base.service';
import { Injectable } from '@angular/core';
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
        private configService: ConfigService) {
        super();
        this.baseUrl = configService.getApiURI();
        this.headers = configService.getHeaders();
        this.playerOptionsRoute = this.baseUrl + 'players';
    }

    /**
     * @name getPlayerOptions
     * @param playerOptions - IPlayerOptionsViewModel - the view model used for the API request
     * @returns Observable<IResponse> - an observable that the caller needs to subscribe. A caller should treat 
     * a successful response as the type IPlayerOptionsResponse.
     * @description Sends a HTTP GET request to the API to retrieve an individual player option and some response info
     */
    getPlayerOptions(playerOptions: IPlayerOptionsViewModel): Observable<IResponse> {
        let route: string = this.playerOptionsRoute + '/' + playerOptions.id;
        console.log('Sending GET to ' + route);
        return this.http.get<IPlayerOptionsResponse>(route, { headers: this.headers})
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
        console.log('Sending POST to ' + this.playerOptionsRoute);
        let body = JSON.stringify(playerOptions);
        return this.http.post<IPlayerOptionsCreationResponse>(this.playerOptionsRoute, body, { headers: this.headers })
        .map( (res: IPlayerOptionsCreationResponse) => {
            console.log('IPlayerOptionsCreationResponse = ', res);
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
            console.log('IPlayerOptionsUpdationResponse = ', res);
            return res;
        })
        .catch(this.handleError);
    }

}
