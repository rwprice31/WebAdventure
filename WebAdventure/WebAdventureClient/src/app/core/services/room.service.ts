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
import { IRoomDeletionViewModel } from '../../shared/interfaces/view-models/rooms/room-deletion-view-model.interface';
import { IRoomDeletionResponse } from '../../shared/interfaces/responses/rooms/room-deletion-response.interface';
import { IRoomExitCreationViewModel } from '../../shared/interfaces/view-models/rooms/room-exit-creation-view-model.interface';
import { IRoomExitCreationResponse } from '../../shared/interfaces/responses/rooms/room-exit-creation-response.interface';
import { IRoomExitsResponse } from '../../shared/interfaces/responses/rooms/room-exits-response.interface';
import { IRoomExitViewModel } from '../../shared/interfaces/view-models/rooms/room-exit-view-model.interface';
import { IRoomExitUpdationViewModel } from '../../shared/interfaces/view-models/rooms/room-exit-updation-view-model.interface';
import { IRoomExitDeletionViewModel } from '../../shared/interfaces/view-models/rooms/room-exit-deletion-view-model.interface';
import { IRoomExitUpdationResponse } from '../../shared/interfaces/responses/rooms/room-exit-updation-response.interface';
import { IRoomExitDeletionResponse } from '../../shared/interfaces/responses/rooms/room-exit-deletion-response.interface';


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
    private roomExitIdCurrentlyEdittingInSessionStorageKey = 'roomExitIdCurrentlyEditting';

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
     * @name getCurrentlyEdittingRoomFromSessionStorage
     * @returns the room id from session storage
     * @description Retrieves the currently editting room id from session storage.
     */  
    getCurrentlyEdittingRoomFromSessionStorage(): number {
        return +sessionStorage.getItem(this.roomIdCurrentlyEdittingInSessionStorageKey);
    }

    /**
     * @name setCurrentlyEdittingRoomExitToSessionStorage
     */
    setCurrentlyEdittingRoomExitToSessionStorage(exitId: number): void {
        sessionStorage.setItem(this.roomExitIdCurrentlyEdittingInSessionStorageKey, exitId.toString());
    }

    /**
     * @name getCurrentlyEdittingRoomExitFromSessionStorage
     */
    getCurrentlyEdittingRoomExitFromSessionStorage(): number {
        return +sessionStorage.getItem(this.roomExitIdCurrentlyEdittingInSessionStorageKey);
    }

    /**
     * @name getRoomsRoute
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
     * @name getRoomExitRoute
     * @param roomId 
     */
    getRoomExitRoute() {
        this.getRoomsRoute();
        let roomId = this.getCurrentlyEdittingRoomFromSessionStorage();
        return this.roomRoute + '/' + roomId + '/exits';
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
        })
        .catch(this.handleError)
        ;
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
        })
        .catch(this.handleError);
    }

    /**
     * @name deleteRoom
     * @param room - IRoomDeletionViewModel
     * @returns Observable<IResponse> - an observable that the caller needs to subscribe. A caller should treat 
     * a successful response as the type IRoomDeletionResponse.
     * @description Sends a HTTP DELETE request to the API to delete a room
     */
    deleteRoom(room: IRoomDeletionViewModel): Observable<IResponse> {
        this.getRoomsRoute();
        let route: string = this.roomRoute + '/' + room.id;
        return this.http.delete<IRoomDeletionResponse>(route, { headers: this.headers })
        .map( (res: IRoomDeletionResponse) => {
            console.log('IRoomDeletionResponse = ', res);
            return res;
        })
        .catch(this.handleError);
    }

    /**
     * @name createExitForRoom
     */
    createExitForRoom(exit: IRoomExitCreationViewModel): Observable<IResponse> {
        let route = this.getRoomExitRoute();
        let body = JSON.stringify(exit);
        // console.log('Sending POST to ' + route + ' with body = ' + body);
        return this.http.post<IRoomExitCreationResponse>(route, body, { headers: this.headers })
            .map( (res: IRoomExitCreationResponse) => {
                // console.log('IRoomExitCreationResponse = ' + JSON.stringify(res));
                return res;
            })
            .catch(this.handleError);
    }

    /**
     * @name getExitsForRoom
     */
    getExitsForRoom(): Observable<IResponse> {
        let route = this.getRoomExitRoute();
        return this.http.get<IRoomExitsResponse>(route, { headers: this.headers })
            .map( (res: IRoomExitsResponse) => {
                console.log('IRoomExitsResponse = ' + JSON.stringify(res));
                return res;
            });
    }

    /**
     * @name getRoomExit
     */
    getRoomExit(exit: IRoomExitViewModel): Observable<IResponse> {
        let route: string = this.getRoomExitRoute() + '/' + exit.exitId;
        console.log('Sending GET to ' + route);
        return this.http.get<IRoomExitsResponse>(route, { headers: this.headers})
            .map( (res: IRoomExitsResponse) => {
                return res;
            })
            .catch(this.handleError);
    }

    /**
     * @name updateRoomExit
     */
    updateRoomExit(exit: IRoomExitUpdationViewModel): Observable<IResponse> {
        let route: string = this.getRoomExitRoute() + '/' + exit.id; 
        let body = JSON.stringify(exit);
        return this.http.put<IRoomExitUpdationResponse>(route, body, { headers: this.headers})
            .map( (res: IRoomExitUpdationResponse) => {
                console.log('IRoomExitUpdationResponse = ' + res);
                return res;
            })
            .catch(this.handleError);
    }

    /**
     * @name deleteRoomExit
     */
    deleteRoomExit(exit: IRoomExitDeletionViewModel): Observable<IResponse> {
        let route: string = this.getRoomExitRoute() + '/' + exit.exitId;
        return this.http.delete<IRoomExitDeletionResponse>(route, { headers: this.headers })
        .map( (res: IRoomExitDeletionResponse) => {
            console.log('IRoomExitDeletionResponse = ', res);
            return res;
        })
        .catch(this.handleError);
    }

}



