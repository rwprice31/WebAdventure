import { IUser } from './../../models/user.interface';

export interface IGameCreationViewModel {
    id: number;
    author: IUser;
    genre: string;
    name: string;
    descr: string;
    isPublic: boolean;
}
