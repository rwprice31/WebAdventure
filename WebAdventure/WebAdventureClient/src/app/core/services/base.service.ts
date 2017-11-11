import { IResponse } from './../../shared/interfaces/responses/response.interface';
import { Observable } from 'rxjs/Rx';

/**
 * @class BaseService
 * @description A simple abstract service that serves as a base class for all other services
 * that interact with HTTP.
 */
export abstract class BaseService {

    constructor() { }

    /**
    * @name handleError
    * @param error - any kind of error 
    * @returns Observable<IResponse> that is passed along to the original caller
    * @description Handles any HTTP errors that may be produced within a child class' call.
    */
    protected handleError(error: any): Observable<IResponse> {

        let errorResponse: IResponse;

        // console.log('Error = ', error);

        if (error.status === 0) {
            errorResponse = {
                statusCode: 500,
                status: false,
                statusText: 'Server Error' 
            };
        } else if (error.status === 401) {
            errorResponse = {
                statusCode: 401,
                status: false,
                statusText: 'Not Authorized' 
            };
        } else {
            errorResponse = error.error;
        }

        // return observable for caller to handle
        return Observable.of(errorResponse);
    }
}

