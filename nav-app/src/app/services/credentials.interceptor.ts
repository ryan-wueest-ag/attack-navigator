import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * HTTP Interceptor that adds credentials (cookies) to requests to the Django backend
 * This is required for session-based authentication with the Django backend
 */
@Injectable()
export class CredentialsInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // Only add credentials for relative URLs or requests to our own domain
        // External APIs (like GitHub) don't support credentials with CORS
        const isRelativeUrl = !req.url.startsWith('http://') && !req.url.startsWith('https://');
        const isOwnDomain = req.url.includes(window.location.hostname) || req.url.startsWith('/');
        
        if (isRelativeUrl || isOwnDomain) {
            // Clone the request and add withCredentials flag
            // This tells the browser to include cookies with the request
            const credentialsReq = req.clone({
                withCredentials: true
            });
            
            return next.handle(credentialsReq);
        }
        
        // For external URLs, pass through without modification
        return next.handle(req);
    }
}
