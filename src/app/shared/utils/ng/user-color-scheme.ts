import { BehaviorSubject } from "rxjs";

const STORAGE_KEY = "user-color-scheme";

export const ColorScheme = {
  DARK: "dark",
  LIGHT: "light",
  AUTO: "auto",
} as const;

export type UserColorScheme = (typeof ColorScheme)[keyof typeof ColorScheme];

function _getUserColorScheme(): UserColorScheme {
  const colorScheme = localStorage.getItem(STORAGE_KEY);

  if (colorScheme === ColorScheme.DARK || colorScheme === ColorScheme.LIGHT) {
    return colorScheme;
  } else {
    return ColorScheme.AUTO;
  }
}

const _colorScheme$ = new BehaviorSubject<UserColorScheme>(
  _getUserColorScheme()
);

export const userColorScheme$ = _colorScheme$.asObservable();
export function getUserColorScheme(): UserColorScheme {
  return _colorScheme$.getValue();
}
export function setUserColorScheme(colorScheme: UserColorScheme): void {
  localStorage.setItem(STORAGE_KEY, colorScheme);
  _colorScheme$.next(colorScheme);
}
