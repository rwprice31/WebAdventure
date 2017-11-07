import { IUser } from './user.interface';

export interface IGame {
    id: number;
    name: string;
    genre: string;
    description: string;
    author: IUser;
}
