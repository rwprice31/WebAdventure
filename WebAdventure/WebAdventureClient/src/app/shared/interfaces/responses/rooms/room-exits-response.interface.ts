import { IResponse } from '../response.interface';
import { IExit } from '../../models/exit.interface';

export interface IRoomExitsResponse extends IResponse {
    exits: IExit[];
}
