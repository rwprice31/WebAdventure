import { IGame } from './../../interfaces/models/game.interface';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'game-card',
    templateUrl: './game-card.component.html',
    styleUrls: ['./game-card.component.scss'] 
})
export class GameCardComponent {

    // how many bootstrap columns it will take up
    @Input() percentWidth: number;
    @Input() game: IGame;

    // whether to display play, save, edit buttons on the card, default to false
    @Input() displayPlay: boolean = false;
    @Input() displaySave: boolean = false;
    @Input() displayEdit: boolean = false;
    @Input() displayDelete: boolean = false;

    @Output() save: EventEmitter<IGame> = new EventEmitter();
    @Output() edit: EventEmitter<IGame> = new EventEmitter();
    @Output() play: EventEmitter<IGame> = new EventEmitter();
    @Output() delete: EventEmitter<IGame> = new EventEmitter();

    saveClicked() {
        this.save.emit(this.game);
    }

    editClicked() {
        console.log('Edit clicked in game-card');
        this.edit.emit(this.game);
    }

    playClicked() {
        this.play.emit(this.game);
    }

    deleteClicked() {
        this.delete.emit(this.game);
    }

}
