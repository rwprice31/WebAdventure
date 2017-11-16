import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { IGenresResponse } from '../../../../shared/interfaces/responses/genres/genres-response.interface';
import { GenreService } from '../../genre.service';

/**
 * @class GameGenresResolver
 * @description Resolver that provides a IGenresResponse observable to component's that are set
 * to resolve to this class.
 */
@Injectable()
export class GameGenresResolver implements Resolve<Observable<IGenresResponse>> {

  constructor(private genreService: GenreService) {

    }
 
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IGenresResponse> {
      return this.genreService.getGenres().map(
          (res: IGenresResponse) => {
            console.log('IGenresResponse in resolver = ' + JSON.stringify(res));
            return res;
          }
      );
  }

}
