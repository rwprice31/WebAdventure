import { IGenresResponse } from './../../shared/interfaces/responses/genres/genres-response.interface';
import { Component, OnInit, Inject } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { GameService } from './../../core/services/game.service';
import { UserService } from './../../core/services/user.service';
import { GenreService } from './../../core/services/genre.service';
import { TOASTR_TOKEN } from './../../core/services/external-libraries/toastr.service';

import { IToastr } from './../../shared/interfaces/external-libraries/toastr.interface';
import { IGenre } from './../../shared/interfaces/models/genre.interface';
import { IGame } from './../../shared/interfaces/models/game.interface';

import { IGameCreationResponse } from './../../shared/interfaces/responses/games/game-creation-response.interface';
import { IGameCreationViewModel } from './../../shared/interfaces/view-models/games/game-creation-view-model.interface';

@Component({
  templateUrl: './my-games-new.component.html',
  styleUrls: ['./my-games-new.component.scss']
})
export class MyGamesNewComponent implements OnInit {

    createInfoForm: FormGroup;
    genres: IGenre[];
  
    constructor(private formBuilder: FormBuilder,
      private genreService: GenreService,
      private gameService: GameService,
      private userService: UserService,
      @Inject(TOASTR_TOKEN) private toastr: IToastr,
      private router: Router) {
    }
  
    ngOnInit() {
      this.getGenres();
      this.buildForm();
    }
  
    buildForm() {
      this.createInfoForm = this.formBuilder.group({
        name: ['', Validators.required],
        description: [''],
        genre: ['', Validators.required]
      });
    }
  
    getGenres() {
      this.genreService.getGenres().subscribe( (res: IGenresResponse) => {
        if (res.status) {
          this.genres = res.genres;
        } else {
          this.toastr.error(res.statusText);
        }
      });
    }
  
    save() {
        let game: IGameCreationViewModel = {
            id: 0,
            author: this.userService.getCurrentUser(),
            descr: this.createInfoForm.controls['description'].value,
            genre: this.createInfoForm.controls['genre'].value,
            name: this.createInfoForm.controls['name'].value,
            isPublic: true
        };
        this.gameService.createGame(game).subscribe( (res: IGameCreationResponse) => {
          if (res.status) {
            console.log('Game creation response = ' + JSON.stringify(res));
            this.gameService.addGameIdToCurrentUsersOwnedGameIdsInSessionStorage(res.game.id);
            this.toastr.success('Game successfully created!');
            this.router.navigate(['my-games/edit', res.game.id]);
          } else {
            this.toastr.error(res.statusText);
          }
        });

    }


}
