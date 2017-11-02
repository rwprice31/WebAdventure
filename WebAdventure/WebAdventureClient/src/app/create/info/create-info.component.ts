import { PageNotFoundComponent } from './../../page-not-found.component';
import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { IGame } from './../../shared/interfaces/models/game.interface';
import { IGenre } from './../../shared/interfaces/models/genre.interface';
import { IToastr } from './../../shared/interfaces/external-libraries/toastr.interface';

import { GameInfoService } from './../../core/services/game-info.service';
import { GenreService } from './../../core/services/genre.service';
import { TOASTR_TOKEN } from './../../core/services/external-libraries/toastr.service';
import { DialogService } from './../../core/services/dialog.service';

import { Observable } from 'rxjs/Rx';
import { CanComponentDeactivate } from './../../core/services/guards/can-deactivate-guard.service';

@Component({
  templateUrl: './create-info.component.html',
  styleUrls: ['./create-info.component.scss']
})
export class CreateInfoComponent implements OnInit, CanComponentDeactivate  {

  game: IGame;
  createInfoForm: FormGroup;
  genres: IGenre[];
  confirmNavigation: boolean;

  constructor(private formBuilder: FormBuilder,
    private genreService: GenreService,
    private gameInfoService: GameInfoService,
    private dialogService: DialogService,
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
    this.game = {
      id: 0,
      name: this.createInfoForm.controls['name'].value,
      description: this.createInfoForm.controls['description'].value,
      genre: this.createInfoForm.controls['genre'].value
    };
    this.gameInfoService.insertGame(this.game).subscribe((game: IGame) => {
      this.toastr.success('Game saved!');
    });
  }

  canDeactivate(): boolean | Observable<boolean> | Promise<boolean> {
    // probably will want to check to see if anything's been updated first
    return this.dialogService.confirm('Leave and lose unsaved changes?');
  }


}
