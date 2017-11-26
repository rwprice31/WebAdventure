import { IAction } from './action.interface';
import { IOutcome } from './outcome.interface';

export interface IActionOutcome {
    id: string;
    action: IAction;
    outcome: IOutcome;
}
