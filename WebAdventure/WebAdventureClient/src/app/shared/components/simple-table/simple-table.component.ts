import {Component, Input} from '@angular/core';
import * as _ from 'lodash';

export interface SimpleTableColumn {
    name: string;
    width?: number;
    dataType?: string;
}

export interface SimpleTableRowCell {
    columnName: string;
    data: string;
}

export interface SimpleTableRow {
    rowData?: SimpleTableRowCell[];
}

@Component({selector: 'simple-table', templateUrl: './simple-table.component.html', styleUrls: ['./simple-table.component.scss']})
export class SimpleTableComponent {

    @Input()columns: SimpleTableColumn[] = [
        {
            name: 'First Name',
            width: 1
        }, {
            name: 'Last Name',
            width: 1
        }, {
            name: 'Username',
            width: 1
        }
    ];
    @Input()rows: SimpleTableRow[] = [
        {
            rowData: [
                {
                    columnName: 'First Name',
                    data: 'Robert'
                }, {
                    columnName: 'Last Name',
                    data: 'Bryan'
                }, {
                    columnName: 'Username',
                    data: 'rbryan21'
                }
            ]
        },
        {
            rowData: [
                {
                    columnName: 'First Name',
                    data: 'Robert'
                }, {
                    columnName: 'Last Name',
                    data: 'Bryan'
                }, {
                    columnName: 'Username',
                    data: 'rbryan21'
                }
            ]
        }
    ];
    @Input()editAbility: boolean = true;
    @Input()deleteAbility: boolean = false;
    @Input()backgroundColor: string = '#343a40';
    @Input()onHoverColor: string = '#e9ecef';
    @Input()textColor: string = 'white';

    private unrecognizedColumnError = 'The following column is not recognized: ';
    private tooManyRowCellsError = 'You cannot have more row cells than columns';
    private missingColumnsError = 'You have attempted to set a column\'s data twice. Missing columns: ';

    constructor() {
        this.formatColumns();
        this.formatRows();
        this.ensureDataValid();

    }

    private ensureDataValid(): void {

        let columnNames = this
            .columns
            .map(c => c.name);

        this.rows.forEach(row => {
            if (row.rowData.length > columnNames.length) {
                throw new Error(this.tooManyRowCellsError);
            }
        });

        let columnsWithData: Array<string[]> = new Array<string[]>();


        this.rows.forEach(row => {
            let columnDataForRow: string[] = [];
            row.rowData.forEach(data => {
                this.columns.forEach(column => {
                    if (!columnNames.includes(data.columnName)) {
                        throw new Error(this.unrecognizedColumnError + data.columnName);
                    }
                    if (data.columnName === column.name) {
                        columnDataForRow.push(column.name);
                    }
                });
            });
            columnsWithData.push(columnDataForRow);
        });

        columnsWithData.forEach(columnData => {
            console.log(columnData);
            let dataColumnDifference = _.difference(columnNames, columnData);
            if (dataColumnDifference.length > 0) {
                let columnsDuplicating = dataColumnDifference.join(', ');
                throw new Error(this.missingColumnsError + columnsDuplicating);
            }
        });

    }

    private formatColumns(): void {
        this.columns.unshift({
            name: '#',
            width: 1            
        });
    }

    private formatRows(): void {
        let count = 1;
        this.rows.forEach(row => {
           row.rowData.unshift({
               columnName: '#',
               data: count++ + ''
           });
        });
    }

}
