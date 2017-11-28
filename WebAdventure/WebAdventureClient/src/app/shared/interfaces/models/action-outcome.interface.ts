import { IAction } from './action.interface';
import { IOutcome } from './outcome.interface';

export interface IActionOutcome {
    id: number;
    action: IAction;
    outcome: IOutcome;
}
