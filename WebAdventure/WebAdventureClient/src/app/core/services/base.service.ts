import { Observable } from 'rxjs/Rx';
import { IResponse } from '../../shared/interfaces/responses/response.interface';

export abstract class BaseService {

    constructor() { }

    protected handleError(error: any) {

        // grab that error from the HttpClientError object
        let errorResponse: IResponse = error.error;

        // if no error response found, just create a generic server error response
        if (!errorResponse.status) {
            errorResponse = {
                statusCode: 500,
                status: false,
                statusText: 'Server Error' 
            };
        }

        // log error to console
        console.log('Error = ', errorResponse);

        // return observable for caller to handle
        return Observable.of(errorResponse);
    }
}

