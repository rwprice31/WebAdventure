import { IGame } from './../../shared/interfaces/models/game.interface';
import { GameService } from './../../core/services/game.service';
import { Component, OnInit } from '@angular/core';

@Component({
  templateUrl: './my-games-home.component.html',
  styleUrls: ['./my-games-home.component.scss']
})
export class MyGamesHomeComponent implements OnInit {

  private games: IGame[];

  constructor(private gameService: GameService) {

  }

  ngOnInit(): void {
    this.gameService.getUsersGames().subscribe(
      (res: IGame[]) => {
        this.games = res;
        console.log('Games = ', this.games);
      }
    );
    
  }

}
