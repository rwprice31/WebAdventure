import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IGame } from '../../shared/interfaces/models/game.interface';
import { Observable } from 'rxjs/Observable';
import { GameService } from '../../core/services/game.service';

@Component({
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

  constructor(private route: ActivatedRoute,
    private gameService: GameService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.gameService.setGameCurrentlyEdittingInLocalStorage(+params['id']);
    });
  }

}
