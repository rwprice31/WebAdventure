import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpResponse, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { ConfigService } from './utils/config.service';
import { BaseService } from './base.service';

import { IGenre } from '../../shared/interfaces/models/genre.interface';
import { IResponse } from './../../shared/interfaces/responses/response.interface';
import { IGenresResponse } from './../../shared/interfaces/responses/genres/genres-response.interface';
import { GameService } from './game.service';
import { IToastr } from '../../shared/interfaces/external-libraries/toastr.interface';
import { TOASTR_TOKEN } from './external-libraries/toastr.service';
import { IItem } from '../../shared/interfaces/models/item.interface';

/**
 * @class ItemService
 * @description Encapsulates the logic for API interactivity involving items
 */
@Injectable()
export class ItemService extends BaseService {

    private baseUrl = '';
    private headers: HttpHeaders;

    private roomRoute: string;

    private game: IItem;

    private itemIdCurrentlyEdittingInSessionStorageKey = 'itemIdCurrentlyEditting';

    constructor(private http: HttpClient,
        private configService: ConfigService,
        @Inject(TOASTR_TOKEN) private toastr: IToastr,
        private gameService: GameService) {
        super();
        this.baseUrl = configService.getApiURI();
        this.headers = configService.getHeaders();   
    }

    /**
     * 
     */


}

