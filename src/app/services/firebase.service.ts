import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private remoteConfigSubject = new BehaviorSubject<any>({});
  public remoteConfig$: Observable<any> = this.remoteConfigSubject.asObservable();

  // Simular un feature flag para demostración
  private featureFlagsSubject = new BehaviorSubject<{ [key: string]: boolean }>({
    advancedCategories: false,
    experimentalFeatures: false,
    tasksLimitByCategory: false
  });
  public featureFlags$: Observable<{ [key: string]: boolean }> = this.featureFlagsSubject.asObservable();

  constructor() {
    this.initializeFirebase();
  }

  /**
   * Inicializar Firebase (configuración posterior con keys reales)
   */
  private initializeFirebase(): void {
    // Aquí se configurará Firebase con credenciales reales
    console.log('Firebase service initialized');
  }

  /**
   * Obtener el valor de un feature flag
   */
  getFeatureFlag(flagName: string): boolean {
    return this.featureFlagsSubject.value[flagName] || false;
  }

  /**
   * Activar/desactivar un feature flag (para pruebas locales)
   */
  setFeatureFlag(flagName: string, value: boolean): void {
    const flags = { ...this.featureFlagsSubject.value };
    flags[flagName] = value;
    this.featureFlagsSubject.next(flags);
  }

  /**
   * Obtener todos los feature flags
   */
  getFeatureFlags(): { [key: string]: boolean } {
    return this.featureFlagsSubject.value;
  }

  /**
   * Obtener Remote Config (cuando esté integrado Firebase)
   */
  getRemoteConfig(): any {
    return this.remoteConfigSubject.value;
  }
}
