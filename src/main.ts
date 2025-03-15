import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import localeKa from '@angular/common/locales/ka';
import localeKaExtra from '@angular/common/locales/extra/ka';
import { registerLocaleData } from '@angular/common';

registerLocaleData(localeKa, 'ka', localeKaExtra);

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
