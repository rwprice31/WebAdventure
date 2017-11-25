import { IResponse } from './../response.interface';
import { IMonsters } from "../../models/monsters.interface";

export interface IMonsterDeletionResponse extends IResponse {
    monsters: IMonsters[];
}
