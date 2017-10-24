import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map'; 
import 'rxjs/add/operator/catch';

import { IGame } from '../shared/interfaces/game.interface';

@Injectable()
export class GameInfoService {
    baseUrl: string = "";
    gameArray: IGame[] = [];

    constructor(private http: HttpClient) {

    }

    getGames(): Observable<IGame[]> {
        return Observable.of(this.gameArray);
    }

    insertGame(game: IGame) : Observable<IGame> {
        this.gameArray.push(game);
        return Observable.of(game);
    }

}

