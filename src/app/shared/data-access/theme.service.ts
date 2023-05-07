import { Injectable } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { themeFromSourceColor, argbFromHex, applyTheme } from "@material/material-color-utilities";
import { tap } from "rxjs";
import { applySurfaceStyles } from "../utils/material/surface-styles";
import { isDarkMode$ } from "../utils/ng/prefers-color-scheme";

const ION_COLOR_PRIMARY ='#428cff'

@Injectable({
	providedIn: "root",
})
export class ThemeService {
	private readonly theme = themeFromSourceColor(argbFromHex(ION_COLOR_PRIMARY));

	constructor() {
		isDarkMode$()
			.pipe(
				tap(dark => {
					applyTheme(this.theme, { dark });
					applySurfaceStyles(this.theme, { dark });
					applyBodyClass(dark)
				}),
				takeUntilDestroyed()
			)
			.subscribe();
	}
}

export function applyBodyClass(isDark: boolean): void {
	if(isDark && !document.body.classList.contains("dark")){
		document.body.classList.add("dark");
		return;
	}

	if(!isDark && document.body.classList.contains("dark")){
		document.body.classList.remove("dark");
		return;
	}
}