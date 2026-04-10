import { Injectable, signal, computed } from '@angular/core';
import { Category } from '../models/task.model';
import { StorageService } from './storage.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private readonly CATEGORIES_KEY = 'categories';
  
  
  private readonly DEFAULT_CATEGORIES: Category[] = [
    { id: 'cat-shopping', name: 'Compras', color: '#0ce7e7', icon: 'cart-outline', createdAt: new Date(), updatedAt: new Date() },
    { id: 'cat-work', name: 'Trabajo', color: '#6666ff', icon: 'calculator-outline', createdAt: new Date(), updatedAt: new Date() },
    { id: 'cat-hobbies', name: 'Pasatiempos', color: '#ff6666', icon: 'color-palette-outline', createdAt: new Date(), updatedAt: new Date() },
    { id: 'cat-family', name: 'Cena Familiar', color: '#6666ff', icon: 'restaurant-outline', createdAt: new Date(), updatedAt: new Date() },
    { id: 'cat-gaming', name: 'Videojuegos', color: '#ff6666', icon: 'game-controller-outline', createdAt: new Date(), updatedAt: new Date() },
    { id: 'cat-entertainment', name: 'Entretenimiento', color: '#ff33cc', icon: 'musical-notes-outline', createdAt: new Date(), updatedAt: new Date() }
  ];

  // Signal state
  private state = signal<Category[]>([]);
  public categories = computed(() => this.state());

  constructor(private storageService: StorageService) {
    this.loadCategories();
  }

  private loadCategories(): void {
    let categories = this.storageService.getItem<Category[]>(this.CATEGORIES_KEY);
    if (!categories || categories.length === 0) {
      categories = this.DEFAULT_CATEGORIES;
      this.storageService.setItem(this.CATEGORIES_KEY, categories);
    }
    this.state.set(categories);
  }

  getCategoryById(id: string): Category | null {
    return this.state().find(c => c.id === id) || null;
  }

  createCategory(name: string, color: string = '#0ce7e7', icon: string = 'folder-outline'): Category {
    const category: Category = {
      id: uuidv4(),
      name,
      color,
      icon,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const categories = [...this.state(), category];
    this.saveCategories(categories);
    return category;
  }

  updateCategory(id: string, changes: Partial<Category>): Category | null {
    const categories = this.state();
    const index = categories.findIndex(c => c.id === id);

    if (index === -1) return null;

    const updatedCategory = {
      ...categories[index],
      ...changes,
      id: categories[index].id,
      updatedAt: new Date()
    };

    const newCategories = [...categories];
    newCategories[index] = updatedCategory;
    this.saveCategories(newCategories);
    return updatedCategory;
  }

  deleteCategory(id: string): boolean {
    const categories = this.state().filter(c => c.id !== id);
    this.saveCategories(categories);
    return true;
  }

  private saveCategories(categories: Category[]): void {
    this.storageService.setItem(this.CATEGORIES_KEY, categories);
    this.state.set(categories);
  }
}
