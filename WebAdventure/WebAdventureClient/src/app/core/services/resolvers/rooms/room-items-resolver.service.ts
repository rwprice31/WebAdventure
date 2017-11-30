import { RoomService } from './../../room.service';
import { IToastr } from './../../../../shared/interfaces/external-libraries/toastr.interface';
import { TOASTR_TOKEN } from './../../external-libraries/toastr.service';
import { UserService } from './../../user.service';
import { Observable } from 'rxjs/Rx';
import { Resolve, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable, Inject } from '@angular/core';
import { IRoomItemsResponse } from '../../../../shared/interfaces/responses/rooms/room-items-response.interface';

/**
 * @class RoomItemsResolver
 * @description Resolver that provides a IRoomItemsResponse observable to component's that are set
 * to resolve to this class.
 */
@Injectable()
export class RoomItemsResolver implements Resolve<Observable<IRoomItemsResponse>> {

  constructor(private userService: UserService,
    private roomService: RoomService, 
    private router: Router,
    @Inject(TOASTR_TOKEN) private toastr: IToastr) {

    }
 
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IRoomItemsResponse> {
    return this.roomService.getItemsForRoom().map(
        (res: IRoomItemsResponse) => {
            // console.log('Room items response in resolve = ' + res);
            return res;
        }
    );
  }

}
