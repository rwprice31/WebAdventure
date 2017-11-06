import { IUser } from '../models/user.interface';
import { IResponse } from './response.interface';

export interface IUserLoginResponse extends IResponse {
    user: IUser;
}
