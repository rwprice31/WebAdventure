import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map'; 
import 'rxjs/add/operator/catch';

import { IGenre } from '../../shared/interfaces/genre.interface';

let genre1: IGenre = {
    name: 'Action',
    description: 'Action description'
};
let genre2: IGenre = {
    name: 'Horror',
    description: 'Horror description'
};

@Injectable()
export class GenreService {
    baseUrl: string = "";
    genreArray: IGenre[];

    constructor(private http: HttpClient) {
        this.genreArray = [genre1, genre2];
    }

    getGenres() : Observable<IGenre[]> {
        return Observable.of(this.genreArray);
    }

}

