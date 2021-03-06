import { IUser } from '../models/user.interface';
import { IResponse } from './response.interface';

export interface IUserRegistrationResponse extends IResponse {
    user: IUser;
}
