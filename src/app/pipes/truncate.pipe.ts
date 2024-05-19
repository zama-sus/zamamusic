import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone:true,
  name: 'truncate'
})
export class TruncatePipe implements PipeTransform {
  transform(value: string, limit: number = 100, completeWords: boolean = false, ellipsis: string = '...') {
    if (value?.length <= limit) {
      return value;
    }

    if (completeWords) {
      limit = value.substr(0, limit).lastIndexOf(' ');
    }

    return value.substr(0, limit) + (value.length > limit ? ellipsis : '');
  }
}
