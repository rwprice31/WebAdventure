import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { ConfigService } from './utils/config.service';
import { BaseService } from './base.service';

import { IGenre } from '../../shared/interfaces/models/genre.interface';
import { IResponse } from './../../shared/interfaces/responses/response.interface';
import { IGenresResponse } from './../../shared/interfaces/responses/genres/genres-response.interface';

@Injectable()
export class GenreService extends BaseService {

    private baseUrl: string;
    private headers: HttpHeaders;

    private genreRoute: string;

    constructor(private http: HttpClient,
        private configService: ConfigService) {
        super();
        this.baseUrl = configService.getApiURI();
        this.genreRoute = this.baseUrl + 'genres';
        this.headers = configService.getHeaders();
    }

    getGenres(): Observable<IResponse> {
        // console.log('Sending GET to ' + this.genreRoute);
        return this.http.get<IGenresResponse>(this.genreRoute, { headers: this.headers })
            .map( (res: IGenresResponse ) => {
                // console.log('IGenresResponse = ', res);
                return res;
            })
            .catch(this.handleError);
    }

}

