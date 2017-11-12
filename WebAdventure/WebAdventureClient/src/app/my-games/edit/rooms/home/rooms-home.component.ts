import { SimpleTableRow } from './../../../../shared/components/simple-table/simple-table.component';
import { Router, ActivatedRoute } from '@angular/router';
import { Component } from '@angular/core';

@Component({
  templateUrl: './rooms-home.component.html',
  styleUrls: ['./rooms-home.component.scss']
})
export class RoomsHomeComponent {

    constructor(private router: Router,
        private route: ActivatedRoute) {
    }

    editClicked($event: SimpleTableRow) {
        this.router.navigate([$event.rowID], { relativeTo: this.route});
    }
    
}

