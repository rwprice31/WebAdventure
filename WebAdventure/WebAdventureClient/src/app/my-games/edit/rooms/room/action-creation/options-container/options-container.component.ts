import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  templateUrl: './options-container.component.html',
  styleUrls: ['./options-container.component.scss']
})
export class OptionsContainerComponent {

  constructor(private router: Router,
    private route: ActivatedRoute) {

  }

  cancel() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

}
