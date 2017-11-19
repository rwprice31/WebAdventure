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
import { IGame } from '../../shared/interfaces/models/game.interface';
import { IItemViewModel } from '../../shared/interfaces/view-models/items/item-view-model.interface';
import { IItemResponse } from '../../shared/interfaces/responses/items/item-response.interface';
import { IItemCreationViewModel } from '../../shared/interfaces/view-models/items/item-creation-view-model.interface';
import { IItemCreationResponse } from '../../shared/interfaces/responses/items/item-creation-response.interface';
import { IItemUpdationViewModel } from '../../shared/interfaces/view-models/items/item-updation-view-model.interface';
import { IItemUpdationResponse } from '../../shared/interfaces/responses/items/item-updation-response.interface';
import { IItemDeletionViewModel } from '../../shared/interfaces/view-models/items/item-deletion-view-model.interface';
import { IItemDeletionResponse } from '../../shared/interfaces/responses/items/item-deletion-response.interface';
import { IItemsResponse } from '../../shared/interfaces/responses/items/items-response.interface';

/**
 * @class ItemService
 * @description Encapsulates the logic for API interactivity involving items
 */
@Injectable()
export class ItemService extends BaseService {

    private baseUrl = '';
    private headers: HttpHeaders;

    private itemRoute: string;

    private game: IGame;

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
     * @name setCurrentlyEdittingItemToSessionStorage
     * @param 
     * @returns void
     * @description Sets the currently editting item id to session storage.
     */  
    setCurrentlyEdittingItemToSessionStorage(itemId: number): void {
        sessionStorage.setItem(this.itemIdCurrentlyEdittingInSessionStorageKey, itemId.toString());
    }

    /**
     * @name getCurrentEdittingItemFromSessionStorage
     * @returns the item id from session storage
     * @description Retrieves the currently editting item id from session storage.
     */  
    getCurrentEdittingItemFromSessionStorage(): number {
        return +sessionStorage.getItem(this.itemIdCurrentlyEdittingInSessionStorageKey);
    }

    /**
     * @name getItemsRoute
     * @returns void
     * @description Attempts to retrieve the current editting game id from 
     * session storage, throws an error if not found. Sets up this.itemRouted
     * variable if successfull.
     */   
    getItemsRoute(): string {
        this.game = this.gameService.getGameUsersCurrentlyEdittingFromSessionStorage();
        if (!this.game) {
            this.toastr.error('No game id found.');
            throw new Error('No game id found in item service');
        } else {
            this.itemRoute = this.baseUrl + 'games/' + this.game.id + '/items';
            return this.itemRoute;
        }
    }

    /**
     * @name getItem
     * @param item - IItemViewModel - the view model used for the API request
     * @returns Observable<IResponse> - an observable that the caller needs to subscribe. A caller should treat 
     * a successful response as the type IItemResponse.
     * @description Sends a HTTP GET request to the API to retrieve an individual item and some response info
     */
    getItem(item: IItemViewModel): Observable<IResponse> {
        this.getItemsRoute();
        let route: string = this.itemRoute + '/' + item.itemId;
        return this.http.get<IItemResponse>(route, { headers: this.headers })
            .map( (res: IItemResponse) => {
                return res;
            })
            .catch(this.handleError);
    } 
    
    /**
     * @name createItem
     * @param item - IItemCreationViewModel - the view model used for the API request
     * @returns Observable<IResponse> - an observable that the caller needs to subscribe. A caller should treat 
     * a successful response as the type IRoomCreationResponse.
     * @description Sends a HTTP POST request to the API to create a room
     */
    createItem(item: IItemCreationViewModel): Observable<IResponse> {
        this.getItemsRoute();
        // console.log('Body entering createItem = ' + JSON.stringify(item));
        // console.log('Sending POST to ' + this.itemRoute);
        let body = JSON.stringify(item);
        return this.http.post<IItemCreationResponse>(this.itemRoute, body, { headers: this.headers})
        .map( (res: IItemCreationResponse) => {
            // console.log('IItemCreationResponse ' + res);
            return res;
        });
    }

    /**
     * @name updateItem
     * @param game - IItemUpdationViewModel - the view model used for the API request
     * @returns Observable<IResponse> - an observable that the caller needs to subscribe. A caller should treat 
     * a successful response as the type IItemUpdationResponse.
     * @description Sends a HTTP PUT request to the API to update an item
     */
    updateItem(item: IItemUpdationViewModel): Observable<IResponse> {
        this.getItemsRoute();
        let route: string = this.itemRoute + '/' + item.id;
        let body = JSON.stringify(item);
        return this.http.put<IItemUpdationResponse>(route, body, { headers: this.headers })
        .map( (res: IItemUpdationResponse) => {
            // console.log('IItemUpdationResponse = ', res);
            return res;
        });
    }

    /**
     * @name deleteItem
     * @param room - IItemDeletionViewModel
     * @returns Observable<IResponse> - an observable that the caller needs to subscribe. A caller should treat 
     * a successful response as the type IItemDeletionResponse.
     * @description Sends a HTTP DELETE request to the API to delete an item
     */
    deleteItem(item: IItemDeletionViewModel): Observable<IResponse> {
        this.getItemsRoute();
        let route: string = this.itemRoute + '/' + item.id;
        let body = JSON.stringify(item);
        return this.http.delete<IItemDeletionResponse>(route, { headers: this.headers })
        .map( (res: IItemDeletionResponse) => {
            // console.log('IItemDeletionResponse = ', res);
            return res;
        });
    }

    /**
     * @name getItems
     * @returns Observable<IResponse> - an observable that the caller needs to subscribe. A caller should treat 
     * a successful response as the type IItemsResponse.
     * @description Sends a HTTP GET request to the API to retrieve all items
     */
    getItems(): Observable<IResponse> {
        this.getItemsRoute();
        // console.log('Sending GET to ' + this.itemRoute);
        return this.http.get<IItemsResponse>(this.itemRoute, { headers: this.headers})
            .map( (res: IItemsResponse ) => {
                // console.log('IItemsResponse = ', res);
                return res;
            })
            .catch(this.handleError);
    }


}

