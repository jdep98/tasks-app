import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Category } from '../models/task.model';
import { StorageService } from './storage.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private readonly CATEGORIES_KEY = 'categories';
  private readonly DEFAULT_CATEGORIES: Category[] = [
    { id: 'default-personal', name: 'Personal', color: '#FF6B6B', icon: 'person', createdAt: new Date(), updatedAt: new Date() },
    { id: 'default-work', name: 'Trabajo', color: '#4ECDC4', icon: 'briefcase', createdAt: new Date(), updatedAt: new Date() },
    { id: 'default-shopping', name: 'Compras', color: '#FFE66D', icon: 'cart', createdAt: new Date(), updatedAt: new Date() }
  ];

  private categoriesSubject = new BehaviorSubject<Category[]>([]);
  public categories$: Observable<Category[]> = this.categoriesSubject.asObservable();

  constructor(private storageService: StorageService) {
    this.loadCategories();
  }

  /**
   * Cargar categorías del almacenamiento o usar las predeterminadas
   */
  private loadCategories(): void {
    let categories = this.storageService.getItem<Category[]>(this.CATEGORIES_KEY);
    if (!categories || categories.length === 0) {
      categories = this.DEFAULT_CATEGORIES;
      this.storageService.setItem(this.CATEGORIES_KEY, categories);
    }
    this.categoriesSubject.next(categories);
  }

  /**
   * Obtener todas las categorías
   */
  getCategories(): Category[] {
    return this.categoriesSubject.value;
  }

  /**
   * Obtener una categoría por ID
   */
  getCategoryById(id: string): Category | null {
    return this.getCategories().find(c => c.id === id) || null;
  }

  /**
   * Crear una nueva categoría
   */
  createCategory(name: string, color: string = '#999999', icon: string = 'folder'): Category {
    const category: Category = {
      id: uuidv4(),
      name,
      color,
      icon,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const categories = [...this.getCategories(), category];
    this.saveCategories(categories);
    return category;
  }

  /**
   * Actualizar una categoría
   */
  updateCategory(id: string, changes: Partial<Category>): Category | null {
    const categories = this.getCategories();
    const index = categories.findIndex(c => c.id === id);

    if (index === -1) return null;

    const updatedCategory = {
      ...categories[index],
      ...changes,
      id: categories[index].id, // No permitir cambiar ID
      updatedAt: new Date()
    };

    categories[index] = updatedCategory;
    this.saveCategories(categories);
    return updatedCategory;
  }

  /**
   * Eliminar una categoría
   */
  deleteCategory(id: string): boolean {
    // No permitir eliminar categorías predeterminadas
    if (id.startsWith('default-')) {
      return false;
    }

    const categories = this.getCategories().filter(c => c.id !== id);
    this.saveCategories(categories);
    return true;
  }

  /**
   * Guardar categorías en el almacenamiento
   */
  private saveCategories(categories: Category[]): void {
    this.storageService.setItem(this.CATEGORIES_KEY, categories);
    this.categoriesSubject.next(categories);
  }
}
