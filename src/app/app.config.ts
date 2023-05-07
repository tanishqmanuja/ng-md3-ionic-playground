import { APP_INITIALIZER, ApplicationConfig, importProvidersFrom } from '@angular/core';
import { PreloadAllModules, RouteReuseStrategy, provideRouter, withPreloading } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { ThemeService } from './shared/data-access/theme.service';

import { routes } from './app.routes';

function initializeApp(themeService: ThemeService) {
	return () => Promise.resolve(themeService);
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withPreloading(PreloadAllModules)),
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    importProvidersFrom(IonicModule.forRoot()),
    {
			provide: APP_INITIALIZER,
			useFactory: initializeApp,
			deps: [ThemeService],
			multi: true,
		},
  ]
};
