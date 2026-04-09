import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly STORAGE_PREFIX = 'tasks_app_';

  public userName = signal('Parsley');

  constructor() {
    this.init();
  }

  private init() {
    const storedName = this.getItem<string>('USER_NAME');
    if (storedName) {
      this.userName.set(storedName);
    }
  }

  public setUserName(name: string) {
    this.userName.set(name);
    this.setItem('USER_NAME', name);
  }

  /**
   * Obtener un valor del almacenamiento local
   */
  getItem<T>(key: string, defaultValue?: T): T | null {
    try {
      const item = localStorage.getItem(this.STORAGE_PREFIX + key);
      return item ? JSON.parse(item) : defaultValue || null;
    } catch (error) {
      console.error(`Error reading from storage: ${key}`, error);
      return defaultValue || null;
    }
  }

  /**
   * Guardar un valor en el almacenamiento local
   */
  setItem(key: string, value: any): boolean {
    try {
      localStorage.setItem(this.STORAGE_PREFIX + key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error writing to storage: ${key}`, error);
      return false;
    }
  }

  /**
   * Eliminar un valor del almacenamiento local
   */
  removeItem(key: string): boolean {
    try {
      localStorage.removeItem(this.STORAGE_PREFIX + key);
      return true;
    } catch (error) {
      console.error(`Error removing from storage: ${key}`, error);
      return false;
    }
  }

  /**
   * Limpiar todo el almacenamiento de la app
   */
  clear(): boolean {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(this.STORAGE_PREFIX)) {
          localStorage.removeItem(key);
        }
      });
      return true;
    } catch (error) {
      console.error('Error clearing storage', error);
      return false;
    }
  }
}
