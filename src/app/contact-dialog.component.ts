import { Component } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <div class="contact-dialog">
      <h2 mat-dialog-title>Contact Me</h2>
      <mat-dialog-content>
        <div class="contact-item">
          <mat-icon>phone</mat-icon>
          <div class="contact-text">
            <span class="label">Phone</span>
            <a href="javascript:void(0)" (click)="copyToClipboard('+972508451651', 'phone'); $event.preventDefault()">050-845-1651</a>
          </div>
          <button 
            class="copy-btn" 
            (click)="copyToClipboard('+972508451651', 'phone')"
            [class.copied]="phoneCopied"
          >
            <mat-icon>{{ phoneCopied ? 'check' : 'content_copy' }}</mat-icon>
          </button>
        </div>
        <div class="contact-item">
          <mat-icon>email</mat-icon>
          <div class="contact-text">
            <span class="label">Email</span>
            <a href="javascript:void(0)" (click)="copyToClipboard('yuvalkogan84@gmail.com', 'email'); $event.preventDefault()">yuvalkogan84&#64;gmail.com</a>
          </div>
          <button 
            class="copy-btn" 
            (click)="copyToClipboard('yuvalkogan84@gmail.com', 'email')"
            [class.copied]="emailCopied"
          >
            <mat-icon>{{ emailCopied ? 'check' : 'content_copy' }}</mat-icon>
          </button>
        </div>
        <div class="contact-item">
          <mat-icon>work</mat-icon>
          <div class="contact-text">
            <span class="label">LinkedIn</span>
            <a href="https://linkedin.com/in/yuval-kogan-03866010b" target="_blank">linkedin.com/in/yuval-kogan-03866010b</a>
          </div>
          <button 
            class="copy-btn" 
            (click)="copyToClipboard('https://linkedin.com/in/yuval-kogan-03866010b', 'linkedin')"
            [class.copied]="linkedinCopied"
          >
            <mat-icon>{{ linkedinCopied ? 'check' : 'content_copy' }}</mat-icon>
          </button>
        </div>
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-button mat-dialog-close>Close</button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .contact-dialog {
      background: #1e2538;
      padding: 2rem;
      min-width: 400px;
      border-radius: 12px;
      max-width: 90vw;
      box-sizing: border-box;
    }
    @media (max-width: 768px) {
      .contact-dialog {
        padding: 1rem 0.85rem;
        min-width: auto;
        width: 100%;
        max-width: 100%;
      }
    }
    @media (max-width: 480px) {
      .contact-dialog {
        padding: 0.85rem 0.75rem;
      }
    }
    @media (max-width: 360px) {
      .contact-dialog {
        padding: 0.75rem 0.65rem;
      }
    }
    h2 {
      color: #ffffff !important;
      margin: 0 0 2rem;
      font-size: 1.8rem;
      font-weight: 700;
      text-align: center;
    }
    @media (max-width: 768px) {
      h2 {
        font-size: 1.25rem;
        margin: 0 0 1rem;
      }
    }
    @media (max-width: 480px) {
      h2 {
        font-size: 1.15rem;
        margin: 0 0 0.85rem;
      }
    }
    @media (max-width: 360px) {
      h2 {
        font-size: 1.05rem;
        margin: 0 0 0.75rem;
      }
    }
    mat-dialog-content {
      padding: 0 !important;
      margin-bottom: 1.5rem;
    }
    @media (max-width: 768px) {
      mat-dialog-content {
        margin-bottom: 1rem;
      }
    }
    @media (max-width: 480px) {
      mat-dialog-content {
        margin-bottom: 0.85rem;
      }
    }
    @media (max-width: 360px) {
      mat-dialog-content {
        margin-bottom: 0.75rem;
      }
    }
    .contact-item {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      margin-bottom: 1.5rem;
      padding: 1.25rem;
      padding-right: 3rem;
      background: rgba(99, 102, 241, 0.1);
      border-radius: 12px;
      border: 1px solid rgba(99, 102, 241, 0.2);
      transition: all 0.3s ease;
      position: relative;
    }
    .contact-item:last-child {
      margin-bottom: 0;
    }
    .contact-item:hover {
      background: rgba(99, 102, 241, 0.15);
      border-color: rgba(99, 102, 241, 0.4);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }
    .copy-btn {
      position: absolute;
      top: 0.75rem;
      right: 0.75rem;
      background: rgba(255, 255, 255, 0.1);
      border: none;
      border-radius: 6px;
      padding: 0.5rem;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .copy-btn mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
      color: rgba(255, 255, 255, 0.7);
    }
    .copy-btn:hover {
      background: rgba(255, 255, 255, 0.15);
    }
    .copy-btn:hover mat-icon {
      color: #ffffff;
    }
    .copy-btn.copied mat-icon {
      color: #22c55e;
    }
    mat-icon {
      color: #6366f1;
      font-size: 28px;
      width: 28px;
      height: 28px;
    }
    .contact-text {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }
    .label {
      color: rgba(255, 255, 255, 0.6);
      font-size: 0.85rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      font-weight: 500;
    }
    a {
      color: #ffffff;
      text-decoration: none;
      font-size: 1.15rem;
      font-weight: 500;
      word-break: break-all;
      overflow-wrap: break-word;
    }
    a:hover {
      color: #818cf8;
    }
    @media (max-width: 768px) {
      a {
        font-size: 0.875rem;
        word-break: break-word;
      }
      .label {
        font-size: 0.675rem;
      }
      .contact-item {
        padding: 0.85rem 0.75rem;
        padding-right: 2.5rem;
        margin-bottom: 0.85rem;
        gap: 0.85rem;
      }
      mat-icon {
        font-size: 22px;
        width: 22px;
        height: 22px;
        flex-shrink: 0;
      }
      .contact-text {
        flex: 1;
        min-width: 0;
      }
      .copy-btn {
        top: 0.4rem;
        right: 0.4rem;
        padding: 0.35rem;
      }
      .copy-btn mat-icon {
        font-size: 15px;
        width: 15px;
        height: 15px;
      }
    }
    @media (max-width: 480px) {
      .contact-item {
        padding: 0.75rem 0.65rem;
        padding-right: 2.25rem;
        gap: 0.7rem;
        margin-bottom: 0.75rem;
      }
      mat-icon {
        font-size: 20px;
        width: 20px;
        height: 20px;
      }
      a {
        font-size: 0.825rem;
      }
      .label {
        font-size: 0.625rem;
      }
    }
    @media (max-width: 360px) {
      .contact-item {
        padding: 0.65rem 0.55rem;
        padding-right: 2rem;
        gap: 0.6rem;
        margin-bottom: 0.65rem;
      }
      mat-icon {
        font-size: 18px;
        width: 18px;
        height: 18px;
      }
      a {
        font-size: 0.775rem;
      }
      .label {
        font-size: 0.6rem;
      }
    }
    mat-dialog-actions {
      padding: 0 !important;
      margin: 0;
      justify-content: center;
    }
    button {
      color: #ffffff !important;
      background: rgba(99, 102, 241, 0.2);
      padding: 0.5rem 2rem;
      border-radius: 8px;
      font-weight: 500;
    }
    button:hover {
      background: rgba(99, 102, 241, 0.3);
      color: #ffffff !important;
    }
    @media (max-width: 768px) {
      button {
        padding: 0.4rem 1.25rem;
        font-size: 0.875rem;
      }
    }
    @media (max-width: 480px) {
      button {
        padding: 0.375rem 1.15rem;
        font-size: 0.825rem;
      }
    }
    @media (max-width: 360px) {
      button {
        padding: 0.35rem 1rem;
        font-size: 0.8rem;
      }
    }
  `]
})
export class ContactDialogComponent {
  phoneCopied = false;
  emailCopied = false;
  linkedinCopied = false;

  copyToClipboard(text: string, type: 'phone' | 'email' | 'linkedin') {
    navigator.clipboard.writeText(text).then(() => {
      if (type === 'phone') {
        this.phoneCopied = true;
        setTimeout(() => this.phoneCopied = false, 2000);
      } else if (type === 'email') {
        this.emailCopied = true;
        setTimeout(() => this.emailCopied = false, 2000);
      } else if (type === 'linkedin') {
        this.linkedinCopied = true;
        setTimeout(() => this.linkedinCopied = false, 2000);
      }
    });
  }
}
