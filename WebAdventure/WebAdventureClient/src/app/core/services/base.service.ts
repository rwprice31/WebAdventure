import { Observable } from 'rxjs/Rx';
import { IResponse } from '../../shared/interfaces/responses/response.interface';

export abstract class BaseService {

    constructor() { }

    protected handleError(error: any) {

        // grab that error from the HttpClientError object
        let errorResponse: IResponse = error.error;

        console.log('Error response = ' + JSON.stringify(error));

        if (!errorResponse && error.status === 401) {
            errorResponse = {
                statusCode: 401,
                status: false,
                statusText: 'Not Authorized' 
            };
        } else {
            // if no error response found, just create a generic server error response
            if (!errorResponse || !errorResponse.status) {
                errorResponse = {
                    statusCode: 500,
                    status: false,
                    statusText: 'Server Error' 
                };
            }
        }

        // return observable for caller to handle
        return Observable.of(errorResponse);
    }
}

