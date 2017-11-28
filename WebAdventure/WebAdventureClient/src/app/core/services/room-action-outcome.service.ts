import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpResponse, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { ConfigService } from './utils/config.service';
import { BaseService } from './base.service';

import { IGenre } from '../../shared/interfaces/models/genre.interface';
import { IResponse } from './../../shared/interfaces/responses/response.interface';
import { IGenresResponse } from './../../shared/interfaces/responses/genres/genres-response.interface';
import { IActionOutcome } from '../../shared/interfaces/models/action-outcome.interface';
import { IOutcome } from '../../shared/interfaces/models/outcome.interface';
import { RoomService } from './room.service';
import { IGame } from '../../shared/interfaces/models/game.interface';
import { GameService } from './game.service';
import { TOASTR_TOKEN } from './external-libraries/toastr.service';
import { IToastr } from '../../shared/interfaces/external-libraries/toastr.interface';

/**
 * @class RoomActionOutcomeService
 * @description Encapsulates the logic for API interactivity involving rooms, actions, and outcomes
 */
@Injectable()
export class RoomActionOutcomeService extends BaseService {

    private baseUrl: string;
    private headers: HttpHeaders;

    private roomActionOutcomeRoute: string;

    // {roomid} / options

    private currentOutcomeSessionStorage = 'currentOutcome';

    constructor(private http: HttpClient,
        private configService: ConfigService,
        private roomService: RoomService,
        @Inject(TOASTR_TOKEN) private toastr: IToastr,
        private gameService: GameService) {
        super();
        this.baseUrl = configService.getApiURI();
        // this.genreRoute = this.baseUrl + 'genres';
        this.headers = configService.getHeaders();
    }

    /**
     * @name getRoomsActionOutcomeRoute
     * @returns string
     * @description
     */
    private getRoomsActionOutcomeRoute(): string {
        let gameId = this.gameService.getGameIdUsersCurrentlyEdittingFromSessionStorage();
        let roomId = this.roomService.getCurrentEdittingRoomFromSessionStorage();
        if (!gameId || !roomId) {
            this.toastr.error('No game id or room id found.');
            throw new Error('No game id or room id found.');
        } else {
            this.roomActionOutcomeRoute = this.baseUrl + 'games/' + gameId + '/rooms/' + roomId;
            return this.roomActionOutcomeRoute;
        }
    }

    /**
     * @name getCurrentActionOutcomeSessionStorage
     * @returns IOutcome
     * @description
     */
    public getCurrentOutcomeSessionStorage(): IOutcome {
        if (!JSON.parse(sessionStorage.getItem(this.currentOutcomeSessionStorage))) {
            let outcome: IOutcome = {
                id: 0,
                item: null,
                room: null
            };
            return outcome;
        } else {
            return JSON.parse(sessionStorage.getItem(this.currentOutcomeSessionStorage));    
        }
        
    }

    /**
     * @name setCurrentOutcomeSessionStorage
     * @returns void
     * @description
     */
    public setCurrentOutcomeSessionStorage(outcome: IOutcome): void {
        sessionStorage.setItem(this.currentOutcomeSessionStorage, JSON.stringify(outcome));
    }

    public createActionOutcome


}

