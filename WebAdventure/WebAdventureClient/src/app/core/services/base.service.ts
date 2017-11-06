import { Observable } from 'rxjs/Rx';
import { IResponse } from '../../shared/interfaces/responses/response.interface';

export abstract class BaseService {

    constructor() { }

    protected handleError(error: any) {

        let errorResponse: IResponse;

        console.log('Error = ', error);

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

