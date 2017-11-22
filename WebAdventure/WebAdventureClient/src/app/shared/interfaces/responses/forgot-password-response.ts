import { IUser } from '../models/user.interface';
import { IResponse } from './response.interface';

export interface IUserForgotPasswordResponse extends IResponse {
    user: IUser;
}
