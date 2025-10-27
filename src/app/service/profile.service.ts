// src/app/profile.service.ts
import { Injectable, OnDestroy, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environment'

@Injectable({ providedIn: 'root' })
export class ProfileService implements OnDestroy {
    private http = inject(HttpClient);

    private app = environment.PROFILE_APP; // "profile"
    private base = `${environment.API_BASE}/${environment.PROFILE_APP}`;
    private key = environment.PROFILE_API_KEY;

    private sessionId: string | null = null;
    private hbTimer: any = null;
    private boundEndHandler = () => this.end().catch(() => { });

    /** Start a session and begin heartbeats */
    async start(): Promise<string | null> {
        try {
            const headers = new HttpHeaders({ 'x-api-key': this.key });
            const res = await this.http.post<{ sessionId: string }>(`${this.base}/start`, {}, { headers }).toPromise();
            this.sessionId = res?.sessionId ?? null;

            // heartbeat every N sec
            this.stopHeartbeat();
            this.hbTimer = setInterval(() => this.heartbeat(), environment.HEARTBEAT_MS);

            // end on tab hide/close
            document.addEventListener('visibilitychange', this.boundEndHandler, { once: false });
            window.addEventListener('beforeunload', this.boundEndHandler, { once: false });

            return this.sessionId;
        } catch (e) {
            console.error('[profile] start failed', e);
            return null;
        }
    }

    /** Send a heartbeat (keepalive) */
    async heartbeat(): Promise<void> {
        if (!this.sessionId) return;
        const body = { sessionId: this.sessionId };

        // Use fetch for keepalive + header support
        await fetch(`${this.base}/heartbeat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': this.key
            },
            body: JSON.stringify(body),
            keepalive: true
        }).catch(() => { });
    }

    /** End the session and stop heartbeats */
    async end(): Promise<void> {
        if (!this.sessionId) return;
        this.stopHeartbeat();

        const body = { sessionId: this.sessionId };
        try {
            await fetch(`${this.base}/end`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': this.key
                },
                body: JSON.stringify(body),
                keepalive: true
            });
        } catch {
            // ignore network errors on unload
        } finally {
            this.sessionId = null;
            document.removeEventListener('visibilitychange', this.boundEndHandler);
            window.removeEventListener('beforeunload', this.boundEndHandler);
        }
    }

    /** Read today's stats */
    async statsToday() {
        const headers = new HttpHeaders({ 'x-api-key': this.key });
        return this.http.get(`${this.base}/stats`, { headers }).toPromise();
    }

    /** Read stats for a specific day (YYYY-MM-DD) */
    async statsDay(day: string) {
        const headers = new HttpHeaders({ 'x-api-key': this.key });
        return this.http.get(`${this.base}/stats?day=${encodeURIComponent(day)}`, { headers }).toPromise();
    }

    /** Read stats for a date range */
    async statsRange(from: string, to: string) {
        const headers = new HttpHeaders({ 'x-api-key': this.key });
        const url = `${this.base}/stats?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`;
        return this.http.get(url, { headers }).toPromise();
    }

    private stopHeartbeat() {
        if (this.hbTimer) { clearInterval(this.hbTimer); this.hbTimer = null; }
    }

    ngOnDestroy(): void {
        // Stop local heartbeats
        this.stopHeartbeat();

        // Tell the server to close the session
        this.end().catch(err => console.warn('[profile] end failed', err));

        // Clean up event listeners
        document.removeEventListener('visibilitychange', this.boundEndHandler);
        window.removeEventListener('beforeunload', this.boundEndHandler);
    }
}
