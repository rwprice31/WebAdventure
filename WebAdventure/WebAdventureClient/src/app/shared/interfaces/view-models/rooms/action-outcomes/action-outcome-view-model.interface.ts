import { IAction } from '../../../models/action.interface';
import { IOutcome } from '../../../models/outcome.interface';

export interface IActionOutcomeViewModel {
    id: number;
    action: IAction;
    outcome: IOutcome;
}
