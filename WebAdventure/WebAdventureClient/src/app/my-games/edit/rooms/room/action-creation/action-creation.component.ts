import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'action-creation',
  templateUrl: './action-creation.component.html',
  styleUrls: ['./action-creation.component.scss']
})
export class ActionCreationComponent implements OnInit {
  
    ngOnInit(): void {
        console.log('In action creation component');
    }

}
