import { GenreService } from './../../core/genre.service';
import { Component, OnInit } from '@angular/core';
import { IGame } from '../../shared/interfaces/game.interface';
import { IGenre } from './../../shared/interfaces/genre.interface';

@Component({
  selector: 'info',
  templateUrl: './create-info.component.html',
  styleUrls: ['./create-info.component.scss']
})
export class CreateInfoComponent implements OnInit {

  genres: IGenre[];

  constructor(private genreService: GenreService) {
    
  }

  ngOnInit() {
    this.getGenres();
  }

  getGenres() {
    this.genreService.getGenres().subscribe((genres: IGenre[]) => this.genres = genres);
  }

}
