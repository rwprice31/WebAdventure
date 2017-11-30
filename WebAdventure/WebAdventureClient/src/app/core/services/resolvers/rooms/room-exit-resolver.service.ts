import { IRoomResponse } from './../../../../shared/interfaces/responses/rooms/room-response.interface';
import { RoomService } from './../../room.service';
import { IToastr } from './../../../../shared/interfaces/external-libraries/toastr.interface';
import { TOASTR_TOKEN } from './../../external-libraries/toastr.service';
import { UserService } from './../../user.service';
import { Observable } from 'rxjs/Rx';
import { Resolve, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable, Inject } from '@angular/core';
import { IRoomViewModel } from '../../../../shared/interfaces/view-models/rooms/room-view-model.interface';
import { IRoomExitViewModel } from '../../../../shared/interfaces/view-models/rooms/room-exit-view-model.interface';
import { IRoomExitsResponse } from '../../../../shared/interfaces/responses/rooms/room-exits-response.interface';

/**
 * @class RoomExitResolver
 * @description Resolver that provides a IRoomExitResponse observable to component's that are set
 * to resolve to this class.
 */
@Injectable()
export class RoomExitResolver implements Resolve<Observable<IRoomExitsResponse>> {

  private exitId: number;

  constructor(private userService: UserService,
    private roomService: RoomService, 
    private router: Router,
    @Inject(TOASTR_TOKEN) private toastr: IToastr) {

    }
 
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IRoomExitsResponse> {
    this.exitId = +route.params['id'];
    this.roomService.setCurrentlyEdittingRoomExitToSessionStorage(this.exitId);
    // it's not a new exit
    if (this.exitId !== 0) {
      let exit: IRoomExitViewModel = {
        exitId: this.exitId
      };
      return this.roomService.getRoomExit(exit).map(
        (res: IRoomExitsResponse) => {
          console.log('IRoomExitsResponse in resolver = ' + JSON.stringify(res));
          return res;
        }
      );
    }
    return null;
  }

}
