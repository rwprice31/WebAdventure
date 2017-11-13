import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IGame } from '../../shared/interfaces/models/game.interface';
import { Observable } from 'rxjs/Observable';
import { GameService } from '../../core/services/game.service';

@Component({
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent { }
