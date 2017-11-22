import { IGenresResponse } from './../../../shared/interfaces/responses/genres/genres-response.interface';
import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
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
import { IGameResponse } from '../../../shared/interfaces/responses/games/game-response.interface';

import { compareFormGroupValues } from '../../../shared/functions/copy-form-group';

import * as _ from 'lodash';
import { IGameUpdationResponse } from '../../../shared/interfaces/responses/games/game-updation-response.interface';
import { UserService } from '../../../core/services/user.service';

@Component({
  templateUrl: './game-info.component.html',
  styleUrls: ['./game-info.component.scss']
})
export class GameInfoComponent implements OnInit, CanComponentDeactivate  {

  game: IGame;
  originalInfoForm: FormGroup;
  createInfoForm: FormGroup;
  genres: IGenre[];
  confirmNavigation: boolean;
  gameId: number;

  constructor(private formBuilder: FormBuilder,
    private genreService: GenreService,
    private gameService: GameService,
    private dialogService: DialogService,
    private userService: UserService,
    @Inject(TOASTR_TOKEN) private toastr: IToastr,
    private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.retrieveGenreInfo();
    this.retrieveGameInfo();
  }

  buildForm() {
    this.createInfoForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: [''],
      genre: ['', Validators.required]
    });
    this.setFormValues();
  }

  setFormValues() {
    this.createInfoForm.setValue({
      name: this.game.name,
      description: this.game.descr,
      genre: this.game.genre
    });
    this.originalInfoForm = _.cloneDeep(this.createInfoForm);
  }

  retrieveGameInfo() {
    this.route.data.subscribe( (data: { gameResponse: IGameResponse }) => {
      if (data.gameResponse.status) {
        this.game = data.gameResponse.game;
        this.buildForm();
      } else {
        this.toastr.error(data.gameResponse.statusText);
      }
    });
  }

  retrieveGenreInfo() {
    this.route.data.subscribe( (data: { genresResponse: IGenresResponse }) => {
      if (data.genresResponse.status) {
        this.genres = data.genresResponse.genres;
      } else {
        this.toastr.error(data.genresResponse.statusText);
      }
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

  updateGameInfo() {
    this.game = {
      id: this.game.id,
      name: this.createInfoForm.controls['name'].value,
      descr: this.createInfoForm.controls['description'].value,
      genre: this.createInfoForm.controls['genre'].value,
      author: this.userService.getCurrentUser()
    };
    console.log('Passing this updated game into updateGame ' + JSON.stringify(this.game));
    this.gameService.updateGame(this.game).subscribe( (res: IGameUpdationResponse) => {
      if (res.status) {
        this.game = res.game;
        this.setFormValues();
        this.toastr.success(res.statusText);
      } else {
        this.toastr.error(res.statusText);
      }
    });
  }

  canDeactivate(): boolean | Observable<boolean> | Promise<boolean> {
    // only prompt for message if values have changed
    if (!compareFormGroupValues(this.originalInfoForm, this.createInfoForm)) {
      return this.dialogService.confirm('Leave and lose unsaved changes?');
    } else {
      return true;
    }
  }


}
