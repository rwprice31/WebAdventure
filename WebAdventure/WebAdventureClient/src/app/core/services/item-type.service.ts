import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { ConfigService } from './utils/config.service';
import { BaseService } from './base.service';

import { IGenre } from '../../shared/interfaces/models/genre.interface';
import { IResponse } from './../../shared/interfaces/responses/response.interface';
import { IGenresResponse } from './../../shared/interfaces/responses/genres/genres-response.interface';
import { IItemTypesResponse } from '../../shared/interfaces/responses/items/item-type.response.interface';

/**
 * @class ItemTypeService
 * @description Encapsulates the logic for API interactivity involving item types
 */
@Injectable()
export class ItemTypeService extends BaseService {

    private baseUrl: string;
    private headers: HttpHeaders;

    private itemTypesRoute: string;

    constructor(private http: HttpClient,
        private configService: ConfigService) {
        super();
        this.baseUrl = configService.getApiURI();
        this.itemTypesRoute = this.baseUrl + 'itemtypes';
        this.headers = configService.getHeaders();
    }

    /**
     * @name getItemTypes
     * @returns Observable<IResponse> - an observable that the caller needs to subscribe. A caller should treat 
     * a successful response as the type IItemTypesResponse.
     * @description Sends a HTTP GET request to the API to retrieve the game genre's available in the app
     */
    getItemTypes(): Observable<IResponse> {
        console.log('Sending GET to ' + this.itemTypesRoute);
        return this.http.get<IItemTypesResponse>(this.itemTypesRoute, { headers: this.headers })
            .map( (res: IItemTypesResponse ) => {
                console.log('IItemTypesResponse = ', res);
                return res;
            })
            .catch(this.handleError);
    }

}

