import { IResponse } from '../response.interface';
import { IExit } from '../../models/exit.interface';

export interface IRoomExitDeletionResponse extends IResponse {
    exits: IExit[];
}
