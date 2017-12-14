import { IResponse } from './../response.interface';
import { IMonsters } from "../../models/monsters.interface";

export interface IMonsterUpdatingResponse extends IResponse {
    monster: IMonsters;
}
