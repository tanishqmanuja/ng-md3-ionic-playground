import { BehaviorSubject } from "rxjs";

const userColorScheme = {
	DARK: "dark",
	LIGHT: "light",
	FOLLOW_SYSTEM: "system",	
} as const;

export type UserColorScheme = typeof userColorScheme[keyof typeof userColorScheme];

function _getUserColorScheme(): UserColorScheme {
	const colorScheme = sessionStorage.getItem("userColorScheme");

	if(colorScheme === userColorScheme.DARK || colorScheme === userColorScheme.LIGHT){
		return colorScheme;
	} else {
		return userColorScheme.FOLLOW_SYSTEM;
	}
}

const _colorScheme$ = new BehaviorSubject<UserColorScheme>(_getUserColorScheme());

export const userColorScheme$ = _colorScheme$.asObservable();
export function getUserColorScheme(): UserColorScheme {
	return _colorScheme$.getValue();
}
export function setUserColorScheme(colorScheme: UserColorScheme): void {
	sessionStorage.setItem("userColorScheme", colorScheme);
	_colorScheme$.next(colorScheme);
}