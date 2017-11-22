import 'rxjs/add/observable/of';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

/**
 * @class DialogService
 * @description A simple service that provides a confirm yes / no option to a window prompt.
 */
@Injectable()
export class DialogService {
    
  /**
  * @name confirm
  * @param message - an optional message to fill the confirm prompt with
  * @returns Observable<boolean> - the user's answer to the window Yes or No
  * @description Prompts a user with a confirmation window where they can answer yes or no
  */
  confirm(message?: string): Observable<boolean> {
    const confirmation = window.confirm(message || 'Is it OK?');

    return Observable.of(confirmation);
  }

}
