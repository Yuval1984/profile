import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { AppComponent } from './app/app';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

// Disable Angular image optimization warnings
(window as any).ngDevMode = false;

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    provideNoopAnimations(),
    provideAnimationsAsync()
  ]
}).catch(err => console.error(err));