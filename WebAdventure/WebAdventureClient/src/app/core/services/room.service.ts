import { IGame } from './../../shared/interfaces/models/game.interface';
import { IRoomCreationResponse } from './../../shared/interfaces/responses/rooms/room-creation-response.interface';
import { IRoomCreationViewModel } from './../../shared/interfaces/view-models/rooms/room-creation-view-model.interface';
import { IRoomsResponse } from './../../shared/interfaces/responses/rooms/rooms-response.interface';
import { IResponse } from './../../shared/interfaces/responses/response.interface';
import { Observable } from 'rxjs/Rx';
import { IToastr } from './../../shared/interfaces/external-libraries/toastr.interface';
import { TOASTR_TOKEN } from './external-libraries/toastr.service';
import { GameService } from './game.service';
import { ConfigService } from './utils/config.service';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable, Inject, OnInit } from '@angular/core';
import { BaseService } from './base.service';


/**
 * @class RoomService
 * @description Encapsulates the logic for API and session storage interactivity involving games
 */
@Injectable()
export class RoomService extends BaseService {

    private baseUrl = '';
    private headers: HttpHeaders;

    private roomRoute: string;

    private game: IGame;

    private roomIdCurrentlyEdittingInSessionStorageKey = 'roomIdCurrentlyEditting';

    constructor(private http: HttpClient,
        private configService: ConfigService,
        @Inject(TOASTR_TOKEN) private toastr: IToastr,
        private gameService: GameService) {
        super();
        this.baseUrl = configService.getApiURI();
        this.headers = configService.getHeaders();   
    }

    /**
     * @name setCurrentlyEdittingRoomToSessionStorage
     * @param 
     * @returns void
     * @description Sets the currently editting room id to session storage.
     */  
    setCurrentlyEdittingRoomToSessionStorage(roomId: number): void {
        sessionStorage.setItem(this.roomIdCurrentlyEdittingInSessionStorageKey, roomId.toString());
    }

    /**
     * @name getCurrentEdittingRoomFromSessionStorage
     * @returns the room id from session storage
     * @description Retrieves the currently editting room id from session storage.
     */  
    getCurrentEdittingRoomFromSessionStorage(): number {
        return +sessionStorage.getItem(this.roomIdCurrentlyEdittingInSessionStorageKey);
    }

    /**
     * @name setupRoomRoute
     * @returns void
     * @description Attempts to retrieve the current editting game id from 
     * session storage, throws an error if not found. Sets up this.roomRoute
     * variable if successfull.
     */   
    getRoomsRoute(): string {
        this.game = this.gameService.getGameUsersCurrentlyEdittingFromSessionStorage();
        if (!this.game) {
            this.toastr.error('No game id found.');
            throw new Error('No game id found in room service');
        } else {
            this.roomRoute = this.baseUrl + 'games/' + this.game.id + '/rooms';
            return this.roomRoute;
        }
    }

    /**
     * @name getRooms
     * @returns Observable<IResponse> - an observable that the caller needs to subscribe. A caller should treat 
     * a successful response as the type IGamesResponse.
     * @description Sends a HTTP GET request to the API to retrieve all games
     */
    getRooms(): Observable<IResponse> {
        this.getRoomsRoute();
        console.log('Sending GET to ' + this.roomRoute);
        return this.http.get<IRoomsResponse>(this.roomRoute, { headers: this.headers})
            .map( (res: IRoomsResponse ) => {
                // console.log('IGamesResponse = ', res);
                return res;
            })
            .catch(this.handleError);
    }

    /**
     * @name createRoom
     * @param room - IRoomCreationViewModel - the view model used for the API request
     * @returns Observable<IResponse> - an observable that the caller needs to subscribe. A caller should treat 
     * a successful response as the type IRoomCreationResponse.
     * @description Sends a HTTP POST request to the API to create a room
     */
    createRoom(room: IRoomCreationViewModel): Observable<IResponse> {
        this.getRoomsRoute();
        console.log('Body entering createRoom = ' + JSON.stringify(room));
        console.log('Sending POST to ' + this.roomRoute);
        let body = JSON.stringify(room);
        return this.http.post<IRoomCreationResponse>(this.roomRoute, body, { headers: this.headers})
        .map( (res: IRoomCreationResponse) => {
            console.log('IRoomCreationResponse ' + res);
            return res;
        });
    }

    // createGame(game: IGameCreationViewModel): Observable<IResponse> {
    //     // console.log('Body entering saveGame = ' + JSON.stringify(game));
    //     // console.log('Sending POST to ' + this.gameRoute);
    //     let body = JSON.stringify(game);
    //     return this.http.post<IGameCreationResponse>(this.gameRoute, body, { headers: this.headers })
    //     .map( (res: IGameCreationResponse) => {
    //         // console.log('IGameCreationResponse = ', res);
    //         if (res.status) {
    //             // console.log('Successfully created game! ' + res);
    //         }
    //         return res;
    //     })
    //     .catch(this.handleError);
    // }

}



