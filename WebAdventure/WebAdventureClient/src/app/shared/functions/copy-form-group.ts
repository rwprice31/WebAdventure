import { FormGroup, AbstractControl } from '@angular/forms';
import * as _ from 'lodash';

export function compareFormGroupValues(obj1: FormGroup, obj2: FormGroup): boolean {

    let obj1Values = [];
    let obj2Values = [];

    Object.keys(obj1.controls).forEach( (key: string ) => {
        obj1Values.push((obj1.controls[key].value));
    });

    Object.keys(obj2.controls).forEach( (key: string ) => {
        obj2Values.push((obj2.controls[key].value));
    });

    return _.isEqual(obj1Values, obj2Values);
}
