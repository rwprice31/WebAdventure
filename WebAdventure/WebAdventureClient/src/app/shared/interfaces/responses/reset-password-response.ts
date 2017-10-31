import { IUser } from '../models/user.interface';
import { IResponse } from './response.interface';

export interface IUserResetPasswordResponse extends IResponse {
    user: IUser;
}