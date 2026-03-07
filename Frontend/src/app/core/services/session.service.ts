import { Injectable } from '@angular/core';
import { TokenPair, UserAuthenticate } from '@shared/models';
import { BehaviorSubject, Observable } from 'rxjs';

export class SessionKey {
  static CURRENT_SELECT_LANG = 'CURRENT_SELECT_LANG';
  static UKEY = 'UKEY';
  static ROLE = 'ROLE';
  static USER = 'USER';
}

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private _currentUserSubject: BehaviorSubject<UserAuthenticate>;
  private _currentLangSubject: BehaviorSubject<string>;
  currentUser$: Observable<UserAuthenticate>;
  currentLang$: Observable<string>;
  userAuthenticate: UserAuthenticate;

  constructor() {
    const storedUser = localStorage.getItem(SessionKey.USER);
    this.userAuthenticate = storedUser ? (JSON.parse(storedUser) as UserAuthenticate) : ({} as UserAuthenticate);
    this._currentUserSubject = new BehaviorSubject<UserAuthenticate>(this.userAuthenticate);
    this._currentLangSubject = new BehaviorSubject<string>('vn');
    this.currentUser$ = this._currentUserSubject.asObservable();
    this.currentLang$ = this._currentLangSubject.asObservable();
  }
  get userAccessToken(): string {
    return this.userAuthenticate?.token ?? '';
  }

  get refreshToken(): string {
    return this.userAuthenticate?.refreshToken ?? '';
  }

  get userRole(): string {
    return localStorage.getItem(SessionKey.ROLE) ?? '';
  }

  get userInformation(): string {
    return localStorage.getItem(SessionKey.USER) ?? '';
  }

  get currentLang(): string {
    const lang = localStorage.getItem(SessionKey.CURRENT_SELECT_LANG);
    return 'VN';
  }

  saveUserAuthenticate(userAuthenticate: UserAuthenticate): void {
    this.userAuthenticate = userAuthenticate ?? ({} as UserAuthenticate);
    localStorage.setItem(SessionKey.USER, JSON.stringify(this.userAuthenticate));
    this._currentUserSubject.next(this.userAuthenticate);
  }

  updateTokens(tokenPair: TokenPair): void {
    this.userAuthenticate = {
      ...(this.userAuthenticate ?? {}),
      token: tokenPair.accessToken,
      refreshToken: tokenPair.refreshToken
    };
    this.saveUserAuthenticate(this.userAuthenticate);
  }
  saveCurrentLang(language: string): void {
    localStorage.setItem(SessionKey.CURRENT_SELECT_LANG, language);
    this._currentLangSubject.next(language);
  }
  saveUserRole(uId: string): void {
    localStorage.setItem(SessionKey.ROLE, uId);
  }

  getUserRole(): string {
    return localStorage.getItem(SessionKey.ROLE) ?? '';
  }

  isAuthenticated(): boolean {
    return !!this.userAccessToken && !!this.userAuthenticate?.userId;
  }

  destroySession(): void {
    localStorage.removeItem(SessionKey.USER);
    localStorage.removeItem(SessionKey.ROLE);
    this.userAuthenticate = {} as UserAuthenticate;
    this._currentUserSubject.next(this.userAuthenticate);
  }
}
