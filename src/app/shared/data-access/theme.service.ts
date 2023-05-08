import { Injectable } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { themeFromSourceColor, argbFromHex, applyTheme } from "@material/material-color-utilities";
import { BehaviorSubject, combineLatest, firstValueFrom, map, of, switchMap, tap } from "rxjs";
import { applySurfaceStyles } from "../utils/material/surface-styles";
import { isDarkMode$ } from "../utils/ng/prefers-color-scheme";
import { UserColorScheme, getUserColorScheme, setUserColorScheme, userColorScheme$ } from "../utils/ng/user-color-scheme";

const ION_COLOR_PRIMARY ='#428cff'

@Injectable({
	providedIn: "root",
})
export class ThemeService {
	private readonly themeColor$ = new BehaviorSubject(ION_COLOR_PRIMARY);
	private readonly theme$ = this.themeColor$.pipe(map((hexColor) => themeFromSourceColor(argbFromHex(hexColor))));

	private readonly isDarkMode$ = userColorScheme$.pipe(switchMap(scheme => {
		if(scheme === "dark"){
			return of(true);
		} else if (scheme === "light") {
			return of(false);
		} else {
			return isDarkMode$();
		}
	}));

	constructor() {
		combineLatest([this.theme$, this.isDarkMode$])
			.pipe(
				tap(([theme,dark]) => {
					applyTheme(theme, { dark });
					applySurfaceStyles(theme, { dark });
					applyBodyClass(dark)
				}),
				takeUntilDestroyed()
			)
			.subscribe();
	}

	async isDarkMode(){
		return firstValueFrom(this.isDarkMode$);
	}

	getUserColorScheme(): UserColorScheme {
		return getUserColorScheme();
	}

	setUserColorScheme(colorScheme: UserColorScheme) {
		return setUserColorScheme(colorScheme);
	}

}

export function applyBodyClass(isDark: boolean,className: string = "dark"): void {
	if(isDark && !document.body.classList.contains(className)){
		document.body.classList.add(className);
		return;
	}

	if(!isDark && document.body.classList.contains(className)){
		document.body.classList.remove(className);
		return;
	}
}

