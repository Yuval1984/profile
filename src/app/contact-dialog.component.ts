import { Component } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-contact-dialog',
    standalone: true,
    imports: [MatDialogModule, MatButtonModule, MatIconModule],
    template: `
    <div class="contact-dialog">
      <h2 mat-dialog-title>Contact Information</h2>
      <mat-dialog-content>
        <div class="contact-item">
          <mat-icon>phone</mat-icon>
          <a href="tel:05058451651">050-584-51651</a>
        </div>
        <div class="contact-item">
          <mat-icon>email</mat-icon>
          <a href="mailto:yuvalkogan84&#64;gmail.com">yuvalkogan84&#64;gmail.com</a>
        </div>
      </mat-dialog-content>
    </div>
  `,
    styles: [`
    .contact-dialog {
      padding: 1.5rem;
      min-width: 300px;
    }
    h2 {
      color: var(--text-color);
      margin: 0 0 1.5rem;
      font-size: 1.5rem;
      font-weight: 600;
    }
    .contact-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1rem;
      padding: 0.75rem;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 8px;
      transition: all 0.3s ease;
    }
    .contact-item:hover {
      background: rgba(255, 255, 255, 0.1);
      transform: translateX(5px);
    }
    mat-icon {
      color: var(--primary-color);
    }
    a {
      color: var(--text-color);
      text-decoration: none;
      font-size: 1.1rem;
    }
    a:hover {
      color: var(--primary-light);
    }
  `]
})
export class ContactDialogComponent { }
