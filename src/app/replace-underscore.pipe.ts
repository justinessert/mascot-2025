import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'replaceUnderscore'
})
export class ReplaceUnderscorePipe implements PipeTransform {

  transform(value: string): string {
    if (!value) {
      return '';
    }
    return value.replace(/_/g, ' ');
  }

}
