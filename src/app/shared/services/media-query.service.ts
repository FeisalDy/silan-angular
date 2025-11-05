import { Injectable, signal, effect, inject } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Injectable({
  providedIn: 'root',
})
export class MediaQueryService {
  private breakpointObserver = inject(BreakpointObserver);

  isXSmall = signal(false);
  isSmall = signal(false);
  isMedium = signal(false);
  isLarge = signal(false);
  isXLarge = signal(false);

  constructor() {
    const queries = {
      xSmall: Breakpoints.XSmall,
      small: Breakpoints.Small,
      medium: Breakpoints.Medium,
      large: Breakpoints.Large,
      xLarge: Breakpoints.XLarge,
    };

    const observer = this.breakpointObserver
      .observe(Object.values(queries))
      .subscribe((result) => {
        this.isXSmall.set(result.breakpoints[queries.xSmall]);
        this.isSmall.set(result.breakpoints[queries.small]);
        this.isMedium.set(result.breakpoints[queries.medium]);
        this.isLarge.set(result.breakpoints[queries.large]);
        this.isXLarge.set(result.breakpoints[queries.xLarge]);
      });

    effect((onCleanup) => {
      onCleanup(() => observer.unsubscribe());
    });
  }

  /** Custom query support */
  query(query: string) {
    const match = signal(false);
    const mql = window.matchMedia(query);

    match.set(mql.matches);
    const listener = (e: MediaQueryListEvent) => match.set(e.matches);
    mql.addEventListener('change', listener);

    effect((onCleanup) => {
      onCleanup(() => mql.removeEventListener('change', listener));
    });

    return match;
  }
}
