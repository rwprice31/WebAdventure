import { IResponse } from './../response.interface';
import { IMonsters } from "../../models/monsters.interface";

export interface IMonsterResponse extends IResponse {
    monster: IMonsters;
}
