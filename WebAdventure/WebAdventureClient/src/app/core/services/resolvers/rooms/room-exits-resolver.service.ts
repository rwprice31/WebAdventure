import { RoomService } from './../../room.service';
import { IToastr } from './../../../../shared/interfaces/external-libraries/toastr.interface';
import { TOASTR_TOKEN } from './../../external-libraries/toastr.service';
import { UserService } from './../../user.service';
import { Observable } from 'rxjs/Rx';
import { Resolve, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable, Inject } from '@angular/core';
import { IRoomExitsResponse } from '../../../../shared/interfaces/responses/rooms/room-exits-response.interface';

/**
 * @class RoomExitsResolver
 * @description Resolver that provides a IRoomExitsResponse observable to component's that are set
 * to resolve to this class.
 */
@Injectable()
export class RoomExitsResolver implements Resolve<Observable<IRoomExitsResponse>> {

  constructor(private userService: UserService,
    private roomService: RoomService, 
    private router: Router,
    @Inject(TOASTR_TOKEN) private toastr: IToastr) {

    }
 
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IRoomExitsResponse> {
    return this.roomService.getExitsForRoom().map(
        (res: IRoomExitsResponse) => {
            // console.log('Room exits response in resolve = ' + res);
            return res;
        }
    );
  }

}
