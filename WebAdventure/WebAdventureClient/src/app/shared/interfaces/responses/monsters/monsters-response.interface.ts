import { IResponse } from './../response.interface';
import { IMonsters } from "../../models/monsters.interface";

export interface IMonstersResponse extends IResponse {
    monsters: IMonsters[];
}
