import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate',
  standalone: true,
})
export class TruncatePipe implements PipeTransform {
  transform(value: string | null | undefined, max = 80, suffix = '…'): string {
    if (!value) return '';
    const str = String(value).trim();
    if (str.length <= max) return str;
    // Cut at word boundary when possible
    const sliced = str.slice(0, max);
    const cut = sliced.replace(/\s+\S*$/, '');
    return (cut.length ? cut : sliced).trimEnd() + suffix;
  }
}
