import { IGenre } from './../../models/genre.interface';
import { IResponse } from './../response.interface';

export interface IGenresResponse extends IResponse {
    genres: IGenre[];
}
