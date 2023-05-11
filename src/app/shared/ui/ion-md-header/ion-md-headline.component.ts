import { NgClass, TitleCasePipe } from "@angular/common";
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  OnInit,
  inject,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { IonContent } from "@ionic/angular";
import {
  concatMap,
  filter,
  map,
  switchMap,
  takeUntil,
  tap,
  withLatestFrom,
} from "rxjs";
import { fromIntersectionObserver } from "../../utils/rxjs/intersection-observer";
import { getIntersectionRatioY } from "../../utils/dom/intersection";
import { RxState } from "@rx-angular/state";
import { RxIf } from "@rx-angular/template/if";
import { PushPipe } from "@rx-angular/template/push";

type Size = "small" | "medium" | "large";
type State = {
  opacity: number;
  size: Size;
  isCollapsed: boolean;
};

@Component({
  selector: "ion-md-headline",
  standalone: true,
  imports: [TitleCasePipe, NgClass, RxIf, PushPipe],
  template: `<ng-container *rxIf="enabled$; strategy: 'local'">
    <div
      class="wrapper"
      [ngClass]="[size$ | push : 'local']"
      [style.opacity]="opacity$ | push : 'local'"
    >
      <span class="title"><ng-content></ng-content></span>
    </div>
  </ng-container>`,
  styles: [
    `
      :host {
        transition: opacity 200ms ease-in-out;
        will-change: opacity;
      }
      .wrapper {
        min-height: 64px;
        width: 100%;

        display: flex;
        flex-direction: column;
        justify-content: flex-end;

        padding-inline: 16px;
        padding-bottom: 24px;

        font-size: var(--md-sys-headline-small-size);
        font-weight: var(--md-sys-headline-small-weight);
        line-height: var(--md-sys-headline-small-line-height);

        &.large {
          min-height: 88px;

          padding-bottom: 28px;

          font-size: var(--md-sys-headline-medium-size);
          font-weight: var(--md-sys-headline-medium-weight);
          line-height: var(--md-sys-headline-medium-line-height);
        }
      }

      .title {
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        line-clamp: 2;
        -webkit-box-orient: vertical;
      }
    `,
  ],
  providers: [RxState],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IonMdHeadlineComponent implements OnInit, AfterViewInit {
  private readonly elRef = inject(ElementRef);
  private readonly content = inject(IonContent, { host: true });
  private readonly contentElRef = inject(ElementRef, { skipSelf: true });
  private readonly destroyRef = inject(DestroyRef);

  readonly state$: RxState<State> = inject(RxState);
  readonly size$ = this.state$.select("size");
  readonly opacity$ = this.state$.select("opacity");
  readonly enabled$ = this.state$.select("size").pipe(map(s => s !== "small"));

  constructor() {
    this.state$.set({
      isCollapsed: false,
      opacity: 1,
    });
  }

  ngOnInit(): void {}

  async ngAfterViewInit(): Promise<void> {
    this.content.scrollEvents = true;

    this.content.ionScrollStart
      .pipe(
        withLatestFrom(this.enabled$),
        filter(([, enabled]) => enabled),
        switchMap(() =>
          fromIntersectionObserver(this.elRef.nativeElement, {
            threshold: [0, 0.2, 0.3, 0.5, 0.7, 0.9, 1],
            rootMargin: "-64px 0px 0px 0px", //64px is the height of the header
          }).pipe(
            tap(entry => {
              this.state$.set({ opacity: entry.intersectionRatio });
            }),
            takeUntil(
              this.content.ionScrollEnd.pipe(
                withLatestFrom(this.state$.select("isCollapsed")),
                concatMap(async ([, isCollapsed]) => {
                  const intersectionRatio = getIntersectionRatioY(
                    this.contentElRef.nativeElement,
                    this.elRef.nativeElement
                  );
                  const intersectionRatioInverted = 1 - intersectionRatio;

                  if (intersectionRatio === 1 || intersectionRatio === 0) {
                    this.state$.set({
                      opacity: intersectionRatio,
                      isCollapsed: !Boolean(intersectionRatio),
                    });
                  } else if (
                    (isCollapsed && intersectionRatio < 0.4) ||
                    (!isCollapsed && intersectionRatio < 0.7)
                  ) {
                    await this.collapse(
                      isCollapsed
                        ? intersectionRatio
                        : intersectionRatioInverted * 350
                    );
                  } else {
                    await this.expand(
                      !isCollapsed
                        ? intersectionRatio
                        : intersectionRatioInverted * 350
                    );
                  }
                })
              )
            )
          )
        ),

        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  private async collapse(scrollDuration?: number) {
    this.state$.set({ opacity: 0 });

    if (scrollDuration) {
      await this.content.scrollToPoint(
        0,
        this.elRef.nativeElement.offsetHeight,
        scrollDuration
      );
    }

    this.state$.set({ isCollapsed: true });
  }

  private async expand(scrollDuration?: number) {
    this.state$.set({ opacity: 1 });

    if (scrollDuration) {
      await this.content.scrollToTop(scrollDuration);
    }

    this.state$.set({ isCollapsed: false });
  }
}
