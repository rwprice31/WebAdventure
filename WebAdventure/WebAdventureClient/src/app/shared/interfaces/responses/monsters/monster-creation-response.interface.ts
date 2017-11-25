
import { IResponse } from './../response.interface';
import { IMonsters } from "../../models/monsters.interface";

export interface IMonsterCreationResponse extends IResponse {
    monster: IMonsters;
}
