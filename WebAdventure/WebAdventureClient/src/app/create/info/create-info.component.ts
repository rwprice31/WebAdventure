import { PageNotFoundComponent } from './../../page-not-found.component';
import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { IGame } from './../../shared/interfaces/game.interface';
import { IGenre } from './../../shared/interfaces/genre.interface';
import { IToastr } from './../../shared/interfaces/toastr.interface';

import { GameInfoService } from './../../core/game-info.service';
import { GenreService } from './../../core/genre.service';
import { TOASTR_TOKEN } from './../../core/external-libraries/toastr.service';

@Component({
  selector: 'info',
  templateUrl: './create-info.component.html',
  styleUrls: ['./create-info.component.scss']
})
export class CreateInfoComponent implements OnInit {

  game: IGame;
  createInfoForm: FormGroup;
  genres: IGenre[];


  constructor(private formBuilder: FormBuilder,
    private genreService: GenreService,
    private gameInfoService: GameInfoService,
    @Inject(TOASTR_TOKEN) private toastr: IToastr) {
  }

  ngOnInit() {
    this.getGenres();
    this.buildForm();
  }

  buildForm() {
    this.createInfoForm = this.formBuilder.group({
      name: '',
      description: '',
      genre: ''
    });
  }

  getGenres() {
    this.genreService.getGenres().subscribe((genres: IGenre[]) => this.genres = genres);
  }

  save() {
    this.game = {
      id: 0,
      name: this.createInfoForm.controls['name'].value,
      description: this.createInfoForm.controls['description'].value,
      genre: this.createInfoForm.controls['genre'].value
    };
    this.gameInfoService.insertGame(this.game).subscribe((game: IGame) => {
      this.toastr.success("Game saved!");
    });
  }

}
