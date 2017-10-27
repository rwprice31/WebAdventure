import { Observable } from 'rxjs/Rx';
import { IResponse } from '../../shared/interfaces/responses/response.interface';


export abstract class BaseService {

    constructor() { }

    protected handleError(error: any) {

        let errorResponse: IResponse = error.error;

        console.log('Error = ', errorResponse);

        return Observable.throw(errorResponse || 'Server error');
        
    }
}

