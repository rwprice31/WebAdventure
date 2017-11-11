import { IUser } from '../../models/user.interface';

export interface IGameUpdationViewModel {
    id: number;
    author: IUser;
    genre: string;
    name: string;
    descr: string;
}
