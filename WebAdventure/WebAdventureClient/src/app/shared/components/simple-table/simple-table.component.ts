import { Component, Input, EventEmitter, Output, OnInit } from '@angular/core';
import * as _ from 'lodash';

export interface SimpleTableColumn {
    name: string;
    width?: number;
    dataType?: string;
}

export interface SimpleTableRowCell {
    columnName: string;
    hidden?: boolean;
    data: string;
}

export interface SimpleTableRow {
    rowID?: number;
    rowData?: SimpleTableRowCell[];
}

@Component({
    selector: 'simple-table', 
    templateUrl: './simple-table.component.html', 
    styleUrls: ['./simple-table.component.scss']}
)
export class SimpleTableComponent implements OnInit {

    @Input()columns: SimpleTableColumn[] = [];
    @Input()rows: SimpleTableRow[] = [];
    @Input()editAbility: boolean = false;
    @Input()deleteAbility: boolean = false;

    @Output() edit: EventEmitter<SimpleTableRow> = new EventEmitter();
    @Output() delete: EventEmitter<SimpleTableRow> = new EventEmitter();

    private rowsWithoutHiddenFields: SimpleTableRow[];

    private unrecognizedColumnError = 'The following column is not recognized: ';
    private tooManyRowCellsError = 'You cannot have more row cells than columns';
    private missingColumnsError = 'You have attempted to set a column\'s data twice. Missing columns: ';
    
    ngOnInit(): void {
        this.formatColumns();
        this.formatRows();
        this.ensureDataValid();
    }

    private ensureDataValid(): void {

        let columnNames = this.columns.map(c => c.name);

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
            // console.log(columnData);
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

    private editClicked($event: SimpleTableRow) {
        this.edit.emit($event);
    }

    private deleteClicked($event: SimpleTableRow) {
        this.delete.emit($event);
    }

}
