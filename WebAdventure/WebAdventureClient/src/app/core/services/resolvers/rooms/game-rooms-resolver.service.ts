import { RoomService } from './../../room.service';
import { IToastr } from './../../../../shared/interfaces/external-libraries/toastr.interface';
import { TOASTR_TOKEN } from './../../external-libraries/toastr.service';
import { UserService } from './../../user.service';
import { IRoomsResponse } from './../../../../shared/interfaces/responses/rooms/rooms-response.interface';
import { Observable } from 'rxjs/Rx';
import { Resolve, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable, Inject } from '@angular/core';

/**
 * @class GameRoomsResolver
 * @description Resolver that provides a IRoomsResponse observable to component's that are set
 * to resolve to this class.
 */
@Injectable()
export class GameRoomsResolver implements Resolve<Observable<IRoomsResponse>> {

  constructor(private userService: UserService,
    private roomService: RoomService, 
    private router: Router,
    @Inject(TOASTR_TOKEN) private toastr: IToastr) {

    }
 
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IRoomsResponse> {
    return this.roomService.getRooms().map(
        (res: IRoomsResponse) => {
            console.log('Rooms response in resolve = ' + res);
            return res;
        }
    );
  }

}
