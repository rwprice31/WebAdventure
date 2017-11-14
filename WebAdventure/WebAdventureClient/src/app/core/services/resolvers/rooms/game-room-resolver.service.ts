import { IRoomResponse } from './../../../../shared/interfaces/responses/rooms/room-response.interface';
import { RoomService } from './../../room.service';
import { IToastr } from './../../../../shared/interfaces/external-libraries/toastr.interface';
import { TOASTR_TOKEN } from './../../external-libraries/toastr.service';
import { UserService } from './../../user.service';
import { Observable } from 'rxjs/Rx';
import { Resolve, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable, Inject } from '@angular/core';
import { IRoomViewModel } from '../../../../shared/interfaces/view-models/rooms/room-view-model.interface';

/**
 * @class GameRoomResolver
 * @description Resolver that provides a IRoomResponse observable to component's that are set
 * to resolve to this class.
 */
@Injectable()
export class GameRoomResolver implements Resolve<Observable<IRoomResponse>> {

  private roomId: number;

  constructor(private userService: UserService,
    private roomService: RoomService, 
    private router: Router,
    @Inject(TOASTR_TOKEN) private toastr: IToastr) {

    }
 
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IRoomResponse> {
    this.roomId = +route.params['id'];
    this.roomService.setCurrentlyEdittingRoomToSessionStorage(this.roomId);
    // it's not a new game
    if (this.roomId !== 0) {
      let room: IRoomViewModel = {
        roomId: this.roomId
      };
      return this.roomService.getRoom(room).map(
        (res: IRoomResponse) => {
          // console.log('IRoomsResponse in resolver = ' + JSON.stringify(res));
          return res;
        }
      );
    }
    return null;
  }

}
