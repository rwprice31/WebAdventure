import { IExit } from '../../models/exit.interface';
import { IResponse } from '../response.interface';


export interface IRoomExitUpdationResponse extends IResponse {
    exits: IExit[];
}
