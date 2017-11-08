import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IGame } from '../../shared/interfaces/models/game.interface';

@Component({
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent {

  private gameId: number;

  constructor(private route: ActivatedRoute) { }
  
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.gameId = +params['id']; 
      console.log('Game id = ' + this.gameId);
    });
  }

  getGameId(): number {
    return this.gameId;
  }
  
 }
