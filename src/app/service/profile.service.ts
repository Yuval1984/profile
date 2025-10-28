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
    // Handlers are declared as class properties so we can properly remove them
    private boundPageHideHandler = () => this.end().catch(() => { });
    private boundBeforeUnloadHandler = () => this.end().catch(() => { });
    private boundVisibilityHandler = () => {
        if (document.visibilityState === 'visible') {
            // When the tab becomes visible again, send a heartbeat to mark as active
            this.heartbeat().catch(() => { });
        }
    };

    /** Start a session and begin heartbeats */
    async start(location?: { lat: number; lon: number; accuracy?: number; source?: 'gps' | 'ip'; city?: string; country?: string; countryCode?: string }): Promise<string | null> {
        try {
            const headers = new HttpHeaders({ 'x-api-key': this.key });
            const body: any = {};
            if (location) {
                body.location = location;
            }

            // Add device info
            body.device = {
                userAgent: navigator.userAgent,
                platform: navigator.platform,
                language: navigator.language,
                screen: {
                    width: screen.width,
                    height: screen.height
                },
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
            };

            const res = await this.http.post<{ sessionId: string }>(`${this.base}/start`, body, { headers }).toPromise();
            this.sessionId = res?.sessionId ?? null;

            // heartbeat every N sec
            this.stopHeartbeat();
            this.hbTimer = setInterval(() => this.heartbeat(), environment.HEARTBEAT_MS);

            // send an immediate heartbeat so the dashboard marks the user as active right away
            this.heartbeat().catch(() => { });

            // End on page hide or unload, but not merely on visibility change
            window.addEventListener('pagehide', this.boundPageHideHandler, { once: false });
            window.addEventListener('beforeunload', this.boundBeforeUnloadHandler, { once: false });

            // When returning to the tab, nudge activity
            document.addEventListener('visibilitychange', this.boundVisibilityHandler, { once: false });

            return this.sessionId;
        } catch (e) {
            console.error('[profile] start failed', e);
            return null;
        }
    }

    /** Send a heartbeat (keep user marked active) */
    async heartbeat(): Promise<void> {
        if (!this.sessionId) return;
        const headers = new HttpHeaders({ 'x-api-key': this.key });
        try {
            await this.http.post(`${this.base}/heartbeat`, { sessionId: this.sessionId }, { headers }).toPromise();
        } catch {
            // swallow errors; next tick will retry
        }
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
            window.removeEventListener('pagehide', this.boundPageHideHandler);
            window.removeEventListener('beforeunload', this.boundBeforeUnloadHandler);
            document.removeEventListener('visibilitychange', this.boundVisibilityHandler);
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
        window.removeEventListener('pagehide', this.boundPageHideHandler);
        window.removeEventListener('beforeunload', this.boundBeforeUnloadHandler);
        document.removeEventListener('visibilitychange', this.boundVisibilityHandler);
    }
}
