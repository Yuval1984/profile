import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

bootstrapApplication(AppComponent, {
  providers: [provideNoopAnimations(), provideAnimationsAsync()]
}).catch(err => console.error(err));