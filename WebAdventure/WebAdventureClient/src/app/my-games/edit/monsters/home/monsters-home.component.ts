import { PageNotFoundComponent } from './../../../../page-not-found.component';
import { TOASTR_TOKEN } from './../../../../core/services/external-libraries/toastr.service';
import { IToastr } from './../../../../shared/interfaces/external-libraries/toastr.interface';
import { SimpleTableRow, SimpleTableColumn, SimpleTableRowCell } from './../../../../shared/components/simple-table/simple-table.component';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, Inject } from '@angular/core';
import { DialogService } from '../../../../core/services/dialog.service';
import { IMonsters } from "../../../../shared/interfaces/models/monsters.interface";
import { IMonsterDeletionViewModel } from "../../../../shared/interfaces/view-models/monsters/monster-deletion-view-model.interface";
import { IMonstersResponse } from "../../../../shared/interfaces/responses/monsters/monsters-response.interface";
//import { IMonsterResponse } from "../../../../shared/interfaces/responses/monsters/monster-response.interface";
import { MonsterService } from "../../../../core/services/monster.service";
import { IMonsterDeletionResponse } from "../../../../shared/interfaces/responses/monsters/monster-deletion-response.interface";

@Component({
  templateUrl: './monsters-home.component.html',
  styleUrls: ['./monsters-home.component.scss']
})
export class MonstersHomeComponent implements OnInit {

  private monsters: IMonsters[];

  private columns: SimpleTableColumn[] = [];
  private rows: SimpleTableRow[] = [];

  constructor(private router: Router,
    private route: ActivatedRoute,
    @Inject(TOASTR_TOKEN) private toastr: IToastr,
    private monsterService: MonsterService,
    private dialogService: DialogService) {
  }

  ngOnInit(): void {
    this.retrieveMonsters();
    this.buildTableData();
  }

  private retrieveMonsters(): void {
    this.route.data.subscribe((data: { monstersResponse: IMonstersResponse }) => {
      if (data.monstersResponse.status) {
        console.log("data: " + data + "monsters response: " + data.monstersResponse);
        this.monsters = data.monstersResponse.monsters;
        console.log('This monster = ' + JSON.stringify(this.monsters));
      } else {
        this.toastr.error(data.monstersResponse.statusText);
        console.log('retrieve monster failed');
      }
    });
  }

  private buildTableData(): void {

    this.rows = [

    ];

    this.columns = [
      {
        name: 'Name'
      },
      {
        name: 'Description'
      },
      {
        name: 'Health'
      },
      {
        name: 'Minimum Damage'
      },
      {
        name: 'Maximum Damage'
      },
      {
        name: 'Speed'
      },
      {
        name: 'Attack'
      },

    ];

    this.monsters.forEach(monster => {
      this.rows.push({
        rowID: monster.id,
        rowData: [
          {
            columnName: 'Name',
            data: monster.name
          },
          {
            columnName: 'Description',
            data: monster.descr
          },
          {
            columnName: 'Health',
            data: monster.health.toString()
          },
          {
            columnName: 'MinimumDamage',
            data: monster.minDamage.toString()
          },
          {
            columnName: 'MaximumDamage',
            data: monster.maxDamage.toString()
          },
          {
            columnName: 'Speed',
            data: monster.speed.toString()
          },
          {
            columnName: 'Attack',
            data: monster.attackDescr
          }

        ]
      });
    });
  }

  editClicked($event: SimpleTableRow) {
    this.router.navigate([$event.rowID], { relativeTo: this.route });
  }

  deleteClicked($event: SimpleTableRow) {
    this.dialogService.confirm('Do you really want to delete this monster?').subscribe(
      (res: boolean) => {
        if (res) {
          let monster: IMonsterDeletionViewModel = {
            id: $event.rowID
          };
          this.monsterService.deleteMonster(monster).subscribe(
            (d_res: IMonsterDeletionResponse) => {
              if (d_res) {

                this.monsters = d_res.monsters;
                this.refresh();
                this.buildTableData();
                this.toastr.success(d_res.statusText);

              } else {
                this.toastr.error(d_res.statusText);
              }


            }
          );
        } else {

        }
      });
  }

  refresh(): void {
    window.location.reload();
  }

}

