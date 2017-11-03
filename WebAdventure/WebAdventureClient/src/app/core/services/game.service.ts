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

@Injectable()
export class GameService extends BaseService {

    private baseUrl = '';
    private headers: HttpHeaders;

    private gameRoute: string;

    constructor(private http: HttpClient,
        private configService: ConfigService) {
        super();
        this.baseUrl = configService.getApiURI();
        this.gameRoute = this.baseUrl + 'games';
    }

    getUsersGames() {
        let games: IGame[] = [];

        let game1: IGame = {
            id: 0,
            name: 'Game 1',
            description: 'Game 1 description',
            genre: 'Action'
        };

        let game2: IGame = {
            id: 1,
            name: 'Game 2',
            description: 'Game 2 description',
            genre: 'Horror'
        };

        games.push(game1);
        games.push(game2);

        return Observable.of(games);
    }

    getGames(): Observable<IResponse> {
        console.log('Sending GET to ' + this.gameRoute);
        return this.http.get<IGamesResponse>(this.gameRoute, { headers: this.headers})
            .map( (res: IGamesResponse ) => {
                console.log('IGamesResponse = ', res);
                return res;
            })
            .catch(this.handleError);
    }

    insertGame(game: IGame) {

    }

}

