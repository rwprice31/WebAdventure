import { IGenresResponse } from './../../../shared/interfaces/responses/genres/genres-response.interface';
import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { CanComponentDeactivate } from './../../../core/services/guards/can-deactivate-guard.service';

import { IGame } from './../../../shared/interfaces/models/game.interface';
import { IGenre } from './../../../shared/interfaces/models/genre.interface';
import { IToastr } from './../../../shared/interfaces/external-libraries/toastr.interface';

import { GameService } from './../../../core/services/game.service';
import { GenreService } from './../../../core/services/genre.service';
import { TOASTR_TOKEN } from './../../../core/services/external-libraries/toastr.service';
import { DialogService } from './../../../core/services/dialog.service';

import { IGamesResponse } from './../../../shared/interfaces/responses/games/games-response.interface';

@Component({
  templateUrl: './game-info.component.html',
  styleUrls: ['./game-info.component.scss']
})
export class GameInfoComponent implements OnInit, CanComponentDeactivate  {

  game: IGame;
  createInfoForm: FormGroup;
  genres: IGenre[];
  confirmNavigation: boolean;
  gameId: number;

  constructor(private formBuilder: FormBuilder,
    private genreService: GenreService,
    private gameService: GameService,
    private dialogService: DialogService,
    @Inject(TOASTR_TOKEN) private toastr: IToastr,
    private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.getGenres();

    this.route.params.subscribe( params => {
      this.gameId = +params['id'];
      console.log('This game id = ' + this.gameId);
    });

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

    this.gameService.getGames().subscribe(
      (res: IGamesResponse) => {
        console.log('Response received in createInfo = ', JSON.stringify(res));
      }
    );

    // this.game = {
    //   id: 0,
    //   name: this.createInfoForm.controls['name'].value,
    //   description: this.createInfoForm.controls['description'].value,
    //   genre: this.createInfoForm.controls['genre'].value
    // };
    // this.gameInfoService.insertGame(this.game).subscribe((game: IGame) => {
    //   this.toastr.success('Game saved!');
    // });
  }

  canDeactivate(): boolean | Observable<boolean> | Promise<boolean> {
    // probably will want to check to see if anything's been updated first
    return this.dialogService.confirm('Leave and lose unsaved changes?');
  }


}
