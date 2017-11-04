import { UserService } from './../../core/services/user.service';
import { IGameCreationViewModel } from './../../shared/interfaces/view-models/games/game-creation-view-model.interface';
import { GenreService } from './../../core/services/genre.service';
import { IToastr } from './../../shared/interfaces/external-libraries/toastr.interface';
import { TOASTR_TOKEN } from './../../core/services/external-libraries/toastr.service';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { IGenre } from './../../shared/interfaces/models/genre.interface';
import { IGame } from './../../shared/interfaces/models/game.interface';
import { GameService } from './../../core/services/game.service';
import { Component, OnInit, Inject } from '@angular/core';

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
      @Inject(TOASTR_TOKEN) private toastr: IToastr) {
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
        this.genreService.getGenres().subscribe((genres: IGenre[]) => this.genres = genres);
    }
  
    save() {
        let game: IGameCreationViewModel = {
            id: 0,
            author: this.userService.getCurrentUser().id,
            descr: this.createInfoForm.controls['description'].value,
            genre: this.createInfoForm.controls['genre'].value,
            name: this.createInfoForm.controls['name'].value
        };
        this.gameService.saveGame(game);
    }


}
