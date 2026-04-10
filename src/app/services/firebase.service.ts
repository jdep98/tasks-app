import { Injectable, signal } from '@angular/core';
import { getApp, getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import { fetchAndActivate, getBoolean, getRemoteConfig, type RemoteConfig } from 'firebase/remote-config';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private app: FirebaseApp | null = null;
  private remoteConfig: RemoteConfig | null = null;

  public enableImportantMarker = signal<boolean>(true);
  public remoteConfigReady = signal<boolean>(false);
  public remoteConfigError = signal<string | null>(null);

  constructor() {
    void this.initializeFirebase();
  }

  private hasValidFirebaseConfig(): boolean {
    const config = environment.firebase as {
      apiKey?: string;
      authDomain?: string;
      projectId?: string;
      storageBucket?: string;
      messagingSenderId?: string;
      appId?: string;
    };

    return Boolean(
      config?.apiKey &&
      config.apiKey !== 'AIzaSyDummyKey-EmptyForNow' &&
      config?.projectId &&
      config.projectId !== 'dummy-project'
    );
  }

  private hasWebAppId(): boolean {
    const appId = (environment.firebase as { appId?: string })?.appId ?? '';
    return appId.includes(':web:');
  }

  private async initializeFirebase(): Promise<void> {
    if (!this.hasValidFirebaseConfig()) {
      this.remoteConfigReady.set(true);
      this.enableImportantMarker.set(true);
      this.remoteConfigError.set('Firebase no configurado: faltan credenciales reales en environment.');
      return;
    }

    if (!this.hasWebAppId()) {
      this.remoteConfigReady.set(true);
      this.enableImportantMarker.set(true);
      this.remoteConfigError.set('Config de Firebase inválida para Web: usa appId de tipo :web: desde Firebase Console.');
      console.warn('Firebase config uses a non-web appId. Create a Web App in Firebase and replace environment.firebase.appId.');
      return;
    }

    try {
      this.app = getApps().length > 0 ? getApp() : initializeApp(environment.firebase);
      this.remoteConfig = getRemoteConfig(this.app);

      this.remoteConfig.settings.minimumFetchIntervalMillis = environment.production ? 3600000 : 0;
      this.remoteConfig.defaultConfig = {
        enable_important_marker: 'true'
      };

      await fetchAndActivate(this.remoteConfig);
      this.enableImportantMarker.set(getBoolean(this.remoteConfig, 'enable_important_marker'));
      this.remoteConfigReady.set(true);
      this.remoteConfigError.set(null);
    } catch (error) {
      console.warn('Firebase Remote Config failed to initialize. Using default values.', error);
      this.enableImportantMarker.set(true);
      this.remoteConfigReady.set(true);
      this.remoteConfigError.set(error instanceof Error ? error.message : 'Unknown Firebase error');
    }
  }

  getFeatureFlag(flagName: string): boolean {
    if (flagName === 'enable_important_marker') {
      return this.enableImportantMarker();
    }

    return false;
  }

  setFeatureFlag(flagName: string, value: boolean): void {
    if (flagName === 'enable_important_marker') {
      this.enableImportantMarker.set(value);
    }
  }

  getFeatureFlags(): { [key: string]: boolean } {
    return {
      enable_important_marker: this.enableImportantMarker()
    };
  }

  getRemoteConfig(): RemoteConfig | null {
    return this.remoteConfig;
  }
}
