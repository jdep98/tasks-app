import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Task } from '../models/task.model';
import { StorageService } from './storage.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private readonly TASKS_KEY = 'tasks';
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  public tasks$: Observable<Task[]> = this.tasksSubject.asObservable();

  constructor(private storageService: StorageService) {
    this.loadTasks();
  }

  /**
   * Cargar todas las tareas del almacenamiento
   */
  private loadTasks(): void {
    const tasks = this.storageService.getItem<Task[]>(this.TASKS_KEY, []);
    this.tasksSubject.next(tasks || []);
  }

  /**
   * Obtener todas las tareas
   */
  getTasks(): Task[] {
    return this.tasksSubject.value;
  }

  /**
   * Obtener tareas por categoría
   */
  getTasksByCategory(categoryId: string): Task[] {
    return this.getTasks().filter(task => task.categoryId === categoryId);
  }

  /**
   * Crear una nueva tarea
   */
  createTask(title: string, description: string = '', categoryId: string): Task {
    const task: Task = {
      id: uuidv4(),
      title,
      description,
      completed: false,
      categoryId,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const tasks = [...this.getTasks(), task];
    this.saveTasks(tasks);
    return task;
  }

  /**
   * Actualizar una tarea
   */
  updateTask(id: string, changes: Partial<Task>): Task | null {
    const tasks = this.getTasks();
    const index = tasks.findIndex(t => t.id === id);

    if (index === -1) return null;

    const updatedTask = {
      ...tasks[index],
      ...changes,
      id: tasks[index].id, // No permitir cambiar ID
      updatedAt: new Date()
    };

    tasks[index] = updatedTask;
    this.saveTasks(tasks);
    return updatedTask;
  }

  /**
   * Marcar una tarea como completada
   */
  toggleTask(id: string): Task | null {
    const task = this.getTasks().find(t => t.id === id);
    if (!task) return null;
    return this.updateTask(id, { completed: !task.completed });
  }

  /**
   * Eliminar una tarea
   */
  deleteTask(id: string): boolean {
    const tasks = this.getTasks().filter(t => t.id !== id);
    this.saveTasks(tasks);
    return true;
  }

  /**
   * Guardar tareas en el almacenamiento
   */
  private saveTasks(tasks: Task[]): void {
    this.storageService.setItem(this.TASKS_KEY, tasks);
    this.tasksSubject.next(tasks);
  }

  /**
   * Eliminar todas las tareas de una categoría
   */
  deleteTasksByCategory(categoryId: string): void {
    const tasks = this.getTasks().filter(t => t.categoryId !== categoryId);
    this.saveTasks(tasks);
  }
}
