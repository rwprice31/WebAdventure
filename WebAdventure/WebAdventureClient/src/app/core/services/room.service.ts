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
import { IRoomViewModel } from '../../shared/interfaces/view-models/rooms/room-view-model.interface';
import { IRoomResponse } from '../../shared/interfaces/responses/rooms/room-response.interface';
import { IRoomUpdationViewModel } from '../../shared/interfaces/view-models/rooms/room-updation-view-model.interface';
import { IRoomUpdationResponse } from '../../shared/interfaces/responses/rooms/room-updation-response.interface';


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
     * a successful response as the type IRoomsResponse.
     * @description Sends a HTTP GET request to the API to retrieve all rooms
     */
    getRooms(): Observable<IResponse> {
        this.getRoomsRoute();
        console.log('Sending GET to ' + this.roomRoute);
        return this.http.get<IRoomsResponse>(this.roomRoute, { headers: this.headers})
            .map( (res: IRoomsResponse ) => {
                // console.log('IRoomsResponse = ', res);
                return res;
            })
            .catch(this.handleError);
    }

    /**
     * @name getRoom
     * @param game - IRoomViewModel - the view model used for the API request
     * @returns Observable<IResponse> - an observable that the caller needs to subscribe. A caller should treat 
     * a successful response as the type IRoomResponse.
     * @description Sends a HTTP GET request to the API to retrieve an individual room and some response info
     */
    getRoom(room: IRoomViewModel): Observable<IResponse> {
        this.getRoomsRoute();
        let route: string = this.roomRoute + '/' + room.roomId;
        return this.http.get<IRoomResponse>(route, { headers: this.headers })
            .map( (res: IRoomResponse) => {
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

    /**
     * @name updateRoom
     * @param game - IRoomUpdationViewModel - the view model used for the API request
     * @returns Observable<IResponse> - an observable that the caller needs to subscribe. A caller should treat 
     * a successful response as the type IRoomUpdationResponse.
     * @description Sends a HTTP PUT request to the API to update a room
     */
    updateRoom(room: IRoomUpdationViewModel): Observable<IResponse> {
        this.getRoomsRoute();
        let route: string = this.roomRoute + '/' + room.id;
        let body = JSON.stringify(room);
        return this.http.put<IRoomUpdationResponse>(route, body, { headers: this.headers })
        .map( (res: IRoomUpdationResponse) => {
            console.log('IRoomUpdationResponse = ', res);
            return res;
        });
    }


    // updateGame(game: IGameUpdationViewModel): Observable<IResponse> {
    //     let body = JSON.stringify(game);
    //     return this.http.put<IGameUpdationResponse>(this.gameRoute + '/' + game.id, body, { headers: this.headers})
    //     .map( (res: IGameUpdationResponse) => {
    //         console.log('IGameUpdationResponse = ', res);
    //         return res;
    //     })
    //     .catch(this.handleError);
    // }

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



