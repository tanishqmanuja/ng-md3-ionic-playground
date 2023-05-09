import { NgClass, NgIf, NgTemplateOutlet } from "@angular/common";
import {
  AfterViewInit,
  Component,
  ContentChild,
  DestroyRef,
  ElementRef,
  Input,
  OnDestroy,
  Renderer2,
  RendererStyleFlags2,
  TemplateRef,
  ViewChild,
  inject,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { IonContent, IonHeader, IonicModule } from "@ionic/angular";
import {
  BehaviorSubject,
  distinctUntilChanged,
  filter,
  map,
  merge,
  tap,
  withLatestFrom,
} from "rxjs";

@Component({
  selector: "page-layout",
  standalone: true,
  imports: [IonicModule, NgIf, NgTemplateOutlet, NgClass],
  host: {
    class: "ion-page",
  },
  template: `
    <ion-header class="ion-no-border" [translucent]="true">
      <ion-toolbar>
        <ion-buttons slot="start" *ngIf="backHref">
          <ion-back-button [defaultHref]="backHref"></ion-back-button>
        </ion-buttons>
        <ion-title #ionTitle [attr.data-state]="headerState">{{
          title
        }}</ion-title>
        <ion-buttons slot="end" *ngIf="headerButtonsTemplate">
          <ng-container
            [ngTemplateOutlet]="headerButtonsTemplate"
          ></ng-container>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content [fullscreen]="true">
      <span *ngIf="size !== 'small'" class="expanded-header">
        <header class="title" [ngClass]="[size]">
          <span [attr.data-state]="headerState" #expandableTitle>{{
            title
          }}</span>
        </header>
      </span>
      <ng-content></ng-content>
    </ion-content>
  `,
  styleUrls: ["./page-layout.component.scss"],
})
export class PageLayoutComponent implements AfterViewInit, OnDestroy {
  @Input() title: string = "New Page";
  @Input() size: "small" | "medium" | "large" = "small";
  @Input() backHref: string | null = null;
  @Input() forceSnapHeader: boolean = true;

  @ContentChild("headerButtons", { static: false })
  headerButtonsTemplate?: TemplateRef<any>;

  @ViewChild(IonContent, { static: true }) ionContent!: IonContent;

  @ViewChild(IonContent, { static: true, read: ElementRef })
  ionContentElementRef!: ElementRef<HTMLElement>;
  @ViewChild(IonHeader, { static: true, read: ElementRef })
  ionHeaderElementRef!: ElementRef<HTMLElement>;

  @ViewChild("ionTitle", { static: true, read: ElementRef })
  ionTitle!: ElementRef<HTMLElement>;
  @ViewChild("expandableTitle", { static: false, read: ElementRef })
  expandableTitle?: ElementRef<HTMLElement>;

  protected headerState: "collapsed" | "expanded" | "transition" = "expanded";
  private isFirstObservation: boolean = true;
  private intersectionObserver: IntersectionObserver | null = null;
  private intersectionEvent$ = new BehaviorSubject<
    IntersectionObserverEntry | undefined | null
  >(null);

  private renderer = inject(Renderer2);
  private destroyRef = inject(DestroyRef);

  ngAfterViewInit(): void {
    this.ionContent.scrollEvents = true;

    if (this.size === "small") {
      this.renderer.setStyle(
        this.ionTitle.nativeElement,
        "--_expanded-opacity",
        1,
        RendererStyleFlags2.DashCase
      );
      this.ionContent.ionScroll
        .pipe(
          filter(ev => ev.type === "ionScroll"),
          map(ev => {
            const delta =
              1 +
              (ev.detail.scrollTop -
                this.ionHeaderElementRef.nativeElement.offsetHeight) /
                this.ionHeaderElementRef.nativeElement.offsetHeight;
            if (delta > 0.5) {
              return "collapsed";
            } else {
              return "expanded";
            }
          }),
          distinctUntilChanged(),
          tap(state => {
            this.headerState = state;
          }),
          takeUntilDestroyed(this.destroyRef)
        )
        .subscribe();
    }

    if (
      this.size !== "small" &&
      this.expandableTitle &&
      !this.intersectionObserver
    ) {
      this.intersectionObserver = new IntersectionObserver(
        entries => {
          if (this.isFirstObservation) {
            this.isFirstObservation = false;
            return;
          }

          this.intersectionEvent$.next(entries.at(0));
        },
        {
          threshold: [0, 0.2, 0.3, 0.5, 0.7, 0.9, 1],
          root: this.ionContentElementRef.nativeElement,
        }
      );

      merge(
        this.ionContent.ionScrollStart,
        this.ionContent.ionScroll,
        this.ionContent.ionScrollEnd
      )
        .pipe(
          filter(() => Boolean(this.expandableTitle)),
          tap(ev => {
            if (ev.type === "ionScrollStart") {
              this.intersectionObserver?.observe(
                this.expandableTitle!.nativeElement
              );
            }

            if (ev.type === "ionScrollEnd") {
              this.intersectionObserver?.unobserve(
                this.expandableTitle!.nativeElement
              );
            }
          }),
          withLatestFrom(this.intersectionEvent$.pipe(filter(Boolean))),
          tap(async ([ev, entry]) => {
            if (ev.type === "ionScroll") {
              this.headerState = "transition";
              this.renderer.setStyle(
                this.expandableTitle!.nativeElement,
                "--_opacity",
                entry.intersectionRatio.toFixed(2),
                RendererStyleFlags2.DashCase
              );
              this.renderer.setStyle(
                this.ionTitle.nativeElement,
                "--_opacity",
                (1 - entry.intersectionRatio).toFixed(2),
                RendererStyleFlags2.DashCase
              );

              if (
                entry.intersectionRatio === 0 ||
                entry.intersectionRatio === 1
              ) {
                this.headerState = entry.isIntersecting
                  ? "expanded"
                  : "collapsed";
              }
            }

            if (ev.type === "ionScrollEnd") {
              if (
                entry.intersectionRatio === 0 ||
                entry.intersectionRatio === 1
              ) {
                this.headerState = entry.isIntersecting
                  ? "expanded"
                  : "collapsed";
              } else {
                if (0.8 < entry.intersectionRatio && this.forceSnapHeader) {
                  await this.ionContent.scrollToTop(300);
                  this.headerState = "expanded";
                } else {
                  const nextElement = this.getNextElement();
                  if (nextElement) {
                    await this.ionContent.scrollToPoint(
                      0,
                      nextElement.offsetTop,
                      300
                    );
                  }
                  this.headerState = "collapsed";
                }
              }
            }
          }),
          takeUntilDestroyed(this.destroyRef)
        )
        .subscribe();
    }
  }

  ngOnDestroy(): void {
    this.intersectionObserver?.disconnect();
  }

  private getNextElement(): HTMLElement | undefined {
    return (
      (this.ionContentElementRef.nativeElement.children[1] as HTMLElement) ??
      undefined
    );
  }
}
