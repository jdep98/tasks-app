import { Injectable, signal, computed } from '@angular/core';
import { Task } from '../models/task.model';
import { StorageService } from './storage.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private readonly TASKS_KEY = 'tasks';
  
  // Signal state
  private state = signal<Task[]>([]);
  public tasks = computed(() => this.state());

  public overdueTasks = computed(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayMillis = today.getTime();

    return this.tasks().filter(task => {
      if (task.completed) return false;
      let taskDate = new Date(task.date);
      if (isNaN(taskDate.getTime())) taskDate = new Date(task.createdAt);
      taskDate.setHours(0, 0, 0, 0);
      return taskDate.getTime() < todayMillis;
    });
  });

  public todayTasks = computed(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayMillis = today.getTime();

    return this.tasks().filter(task => {
      if (task.completed) return false;
      let taskDate = new Date(task.date);
      if (isNaN(taskDate.getTime())) taskDate = new Date(task.createdAt);
      taskDate.setHours(0, 0, 0, 0);
      return taskDate.getTime() === todayMillis;
    });
  });

  public urgentCount = computed(() => this.overdueTasks().length + this.todayTasks().length);

  constructor(private storageService: StorageService) {
    this.loadTasks();
  }

  private loadTasks(): void {
    let tasks = this.storageService.getItem<Task[]>(this.TASKS_KEY);
    if (!tasks) {
      tasks = [];
      this.storageService.setItem(this.TASKS_KEY, tasks);
    }
    this.state.set(tasks);
  }

  getTasksByCategory(categoryId: string): Task[] {
    return this.state().filter(task => task.categoryId === categoryId);
  }
  
  getTaskCountByCategory(categoryId: string): number {
    return this.getTasksByCategory(categoryId).length;
  }

  createTask(title: string, description: string = '', date: string, time: string, categoryId: string, isImportant: boolean): Task {
    const task: Task = {
      id: uuidv4(),
      title,
      description,
      date,
      time,
      completed: false,
      categoryId,
      isImportant,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const tasks = [...this.state(), task];
    this.saveTasks(tasks);
    return task;
  }

  updateTask(id: string, changes: Partial<Task>): Task | null {
    const tasks = this.state();
    const index = tasks.findIndex(t => t.id === id);

    if (index === -1) return null;

    const updatedTask = {
      ...tasks[index],
      ...changes,
      id: tasks[index].id,
      updatedAt: new Date()
    };

    const newTasks = [...tasks];
    newTasks[index] = updatedTask;
    this.saveTasks(newTasks);
    return updatedTask;
  }

  toggleTask(id: string): Task | null {
    const task = this.state().find(t => t.id === id);
    if (!task) return null;
    return this.updateTask(id, { completed: !task.completed });
  }

  deleteTask(id: string): boolean {
    const tasks = this.state().filter(t => t.id !== id);
    this.saveTasks(tasks);
    return true;
  }

  private saveTasks(tasks: Task[]): void {
    this.storageService.setItem(this.TASKS_KEY, tasks);
    this.state.set(tasks);
  }

  deleteTasksByCategory(categoryId: string): void {
    const tasks = this.state().filter(t => t.categoryId !== categoryId);
    this.saveTasks(tasks);
  }
}
