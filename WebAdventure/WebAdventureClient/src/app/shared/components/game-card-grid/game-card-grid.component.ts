import { IGame } from './../../interfaces/models/game.interface';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'game-card-grid',
    templateUrl: './game-card-grid.component.html',
    styleUrls: ['./game-card-grid.component.scss'] 
})
export class GameCardGridComponent {

    @Input() games: IGame[];
    @Input() columnWidth: number = 12;

    // whether to display play, save, edit buttons on the card, default to false
    @Input() displayPlay: boolean = false;
    @Input() displayDelete: boolean = false;
    @Input() displaySave: boolean = false;
    @Input() displayEdit: boolean = false;

    @Output() save: EventEmitter<any> = new EventEmitter();
    @Output() edit: EventEmitter<any> = new EventEmitter();
    @Output() play: EventEmitter<any> = new EventEmitter();

    saveClicked($event: any) {
        // console.log('Save event received in game-grid' + JSON.stringify($event));
        this.save.emit($event);
    }

    editClicked($event: any) {
        // console.log('Edit event received in game-grid' + JSON.stringify($event));
        this.edit.emit($event);
    }

    playClicked($event: any) {
        // console.log('Play event received in game-grid' + JSON.stringify($event));
        this.play.emit($event);
    }

}
