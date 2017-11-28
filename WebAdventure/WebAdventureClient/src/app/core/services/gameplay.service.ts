import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';

import { BaseService } from './base.service';
import { ConfigService } from './utils/config.service';
import { UserService } from './user.service';

import { IGamePlayResponse } from './../../shared/interfaces/responses/games/game-play-response.interface';
import { IGame } from './../../shared/interfaces/models/game.interface';
import { IResponse } from '../../shared/interfaces/responses/response.interface';
import { IGamesResponse } from './../../shared/interfaces/responses/games/games-response.interface';
import { IGameViewModel } from '../../shared/interfaces/view-models/games/game-view-model.interface';
import { IGameResponse } from '../../shared/interfaces/responses/games/game-response.interface';
import { HttpParams } from '@angular/common/http';

@Injectable()
export class GamePlayService extends BaseService {

    private baseUrl = '';
    private headers: HttpHeaders;

    private gamePlayRoute: string;

    private game: IGame;

    constructor(private http: HttpClient,
        private config: ConfigService,
        private userService: UserService) {
        super();
        this.baseUrl = config.getApiURI();
        this.headers = config.getHeaders();
        this.gamePlayRoute = this.baseUrl + 'games/play';
    }

    getGame(id: number): Observable<IGamePlayResponse> {
        let route: string = this.gamePlayRoute + '/' + id;
        console.log('Sending GET to ' + route);
        return this.http.get<IGamePlayResponse>(route, { headers: this.headers})
        .map( (res: IGamePlayResponse ) => {
            return res;
        })
        .catch(this.handleError); 
    }

    startGame(id: number) : Observable<IGamePlayResponse> {
        let route: string = this.gamePlayRoute + '/' + id;
        console.log('Sending Post to ' + route);
        return this.http.post(route, this.userService.getCurrentUser());       
    }

    getCurrentRoomInfo(gameId:number, gamePlayId: number, roomId: number): Observable<IGamePlayResponse> {
        let route: string = this.gamePlayRoute + '/' + gameId + '/' + gamePlayId + '/' + roomId;
        console.log('Sending Get to ' + route);
        return this.http.get(route);
    }
}