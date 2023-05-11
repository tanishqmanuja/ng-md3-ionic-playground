import {
  AfterViewInit,
  ContentChild,
  Directive,
  ElementRef,
  Input,
  OnInit,
  Renderer2,
  RendererStyleFlags2,
  inject,
} from "@angular/core";
import { IonContent, IonTitle } from "@ionic/angular";
import { IonMdHeadlineComponent } from "./ion-md-headline.component";
import { distinctUntilChanged, map, of, switchMap } from "rxjs";
import { RxState } from "@rx-angular/state";
import { RxEffects } from "@rx-angular/state/effects";

type Size = "small" | "medium" | "large";
type State = {
  size: Size;
  isScrolled: boolean;
  opacity: number;
};

@Directive({
  selector: "ion-header[md-behaviour]",
  host: {
    class: "ion-no-border",
  },
  standalone: true,
  providers: [RxState, RxEffects],
})
export class IonMdHeaderBehaviourDirective implements OnInit, AfterViewInit {
  @ContentChild(IonTitle, { static: true, read: ElementRef })
  private readonly titleElRef!: ElementRef<HTMLElement>;

  @Input({ alias: "contentRef", required: true })
  content!: IonContent;

  @Input({ alias: "headlineRef" })
  headline?: IonMdHeadlineComponent;

  @Input()
  set size(size: Size) {
    this.state$.set({ size });
  }

  private readonly state$: RxState<State> = inject(RxState);
  private readonly rxEffects = inject(RxEffects);

  private renderer = inject(Renderer2);
  private elRef = inject(ElementRef);

  constructor() {
    this.state$.set({ isScrolled: false, opacity: 1 });
  }

  ngOnInit(): void {
    if (this.headline) {
      this.setupTitleOpacityForChanges();

      this.headline.state$.connect("size", this.state$.select("size"));

      this.state$.connect(
        "opacity",
        this.state$
          .select("size")
          .pipe(
            switchMap(s =>
              s === "small"
                ? of(1)
                : this.headline!.opacity$.pipe(map(o => 1 - o))
            )
          )
      );
    }
  }

  ngAfterViewInit(): void {
    this.content.scrollEvents = true;

    this.rxEffects.register(this.state$.select("opacity"), o =>
      this.setTitleOpacity(o)
    );

    this.rxEffects.register(this.state$.select("isScrolled"), s =>
      this.setScrolledState(s)
    );

    const isScrolled$ = this.content.ionScroll.pipe(
      map(ev => {
        const intersectionRatio =
          1 +
          (ev.detail.scrollTop - this.elRef.nativeElement.offsetHeight) /
            this.elRef.nativeElement.offsetHeight;

        return intersectionRatio > 0.5;
      }),
      distinctUntilChanged()
    );

    this.state$.connect("isScrolled", isScrolled$);
  }

  setScrolledState(isScrolled: boolean) {
    this.renderer.setAttribute(
      this.elRef.nativeElement,
      "data-scrolled",
      isScrolled ? "true" : "false"
    );
  }

  private setupTitleOpacityForChanges() {
    this.renderer.setStyle(
      this.titleElRef.nativeElement,
      "transition",
      "opacity 200ms ease-in-out",
      RendererStyleFlags2.DashCase
    );

    this.renderer.setStyle(
      this.titleElRef.nativeElement,
      "will-change",
      "opacity",
      RendererStyleFlags2.DashCase
    );
  }

  private setTitleOpacity(opacity: number) {
    this.renderer.setStyle(
      this.titleElRef.nativeElement,
      "opacity",
      opacity,
      RendererStyleFlags2.DashCase
    );
  }
}
