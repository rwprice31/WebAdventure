import { IUser } from './user.interface';

export interface IGame {
    id: number;
    name: string;
    genre: string;
    descr: string;
    author: IUser;
}
