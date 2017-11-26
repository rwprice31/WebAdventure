import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  templateUrl: './new-action.component.html',
  styleUrls: ['./new-action.component.scss']
})
export class NewActionComponent {

    constructor(private router: Router,
        private route: ActivatedRoute) {

    }

    createNewAction() {
        this.router.navigate(['options'], { relativeTo: this.route });
    }

}
