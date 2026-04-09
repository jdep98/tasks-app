import { Injectable, signal } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getRemoteConfig, fetchAndActivate, getBoolean, RemoteConfig } from 'firebase/remote-config';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FirebaseConfigService {
  private remoteConfig!: RemoteConfig;
  
  // Signal to hold the current flag status
  public enableImportantMarker = signal<boolean>(true); // Default to true if fails

  constructor() {
    this.initRemoteConfig();
  }

  private async initRemoteConfig() {
    try {
      const app = initializeApp(environment.firebase);
      this.remoteConfig = getRemoteConfig(app);
      
      this.remoteConfig.settings.minimumFetchIntervalMillis = 3600000;
      this.remoteConfig.defaultConfig = {
        'enable_important_marker': true
      };

      await fetchAndActivate(this.remoteConfig);
      const isImportantMarkerEnabled = getBoolean(this.remoteConfig, 'enable_important_marker');
      
      this.enableImportantMarker.set(isImportantMarkerEnabled);
    } catch (error) {
      console.warn('Firebase Remote Config failed to initialize. Using default values.', error);
      this.enableImportantMarker.set(true);
    }
  }
}
