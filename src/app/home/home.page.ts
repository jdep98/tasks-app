import { Component, ChangeDetectionStrategy, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonIcon,
  IonItem, IonLabel, IonCheckbox, IonList,
  IonAvatar, IonImg, IonButton, IonMenuButton, IonButtons,
  IonNote, IonItemSliding, IonItemOptions, IonItemOption, AlertController, ModalController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  menuOutline, cartOutline, calculatorOutline, colorPaletteOutline,
  restaurantOutline, gameControllerOutline, waterOutline, musicalNotesOutline,
  homeOutline, notificationsOutline, settingsOutline, personOutline,
  checkmarkCircle, ellipseOutline, star, starOutline, closeCircle, timeOutline, trash, create
} from 'ionicons/icons';

import { TaskService } from '../services/task.service';
import { CategoryService } from '../services/category.service';
import { FirebaseConfigService } from '../services/firebase-config.service';
import { StorageService } from '../services/storage.service';
import { CreateTaskModalComponent } from './components/create-task-modal/create-task-modal.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonIcon,
    IonItem, IonLabel, IonCheckbox, IonList,
    IonAvatar, IonImg, IonButton, IonMenuButton, IonButtons,
    IonNote, IonItemSliding, IonItemOptions, IonItemOption
  ],
})
export class HomePage implements OnInit {
  public taskService = inject(TaskService);
  public categoryService = inject(CategoryService);
  public firebaseService = inject(FirebaseConfigService);
  private storageService = inject(StorageService);
  private alertCtrl = inject(AlertController);
  private modalCtrl = inject(ModalController);
  
  public selectedTimeline = signal('Semanal');
  public timelines = ['Hoy', 'Semanal', 'Mensual', 'Anual'];
  
  public userName = signal('Parsley');

  // Signal computado que reacciona a los cambios en tasks y en el filtro de línea de tiempo
  public filteredTasks = computed(() => {
    const tasks = this.taskService.tasks();
    const filter = this.selectedTimeline();

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayMillis = today.getTime();

    // Inicio de la semana (Lunes como primer dia)
    const currentDay = today.getDay() || 7;
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - (currentDay - 1));
    startOfWeek.setHours(0, 0, 0, 0);

    // Fin de la semana (Domingo)
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    return tasks.filter(task => {
      let taskDate = new Date(task.date);
      if (isNaN(taskDate.getTime())) {
        taskDate = new Date(task.createdAt);
      }
      taskDate.setHours(0, 0, 0, 0);
      const taskMillis = taskDate.getTime();

      switch (filter) {
        case 'Hoy':
          return taskMillis === todayMillis;
        case 'Semanal':
          return taskDate >= startOfWeek && taskDate <= endOfWeek;
        case 'Mensual':
          return taskDate.getMonth() === today.getMonth() && taskDate.getFullYear() === today.getFullYear();
        case 'Anual':
          return taskDate.getFullYear() === today.getFullYear();
        default:
          return true;
      }
    });
  });

  constructor() {
    addIcons({
      menuOutline, cartOutline, calculatorOutline, colorPaletteOutline,
      restaurantOutline, gameControllerOutline, waterOutline, musicalNotesOutline,
      homeOutline, notificationsOutline, settingsOutline, personOutline,
      checkmarkCircle, ellipseOutline, star, starOutline, closeCircle, timeOutline, trash, create
    });
  }

  ngOnInit() {
    const storedName = this.storageService.getItem<string>('USER_NAME');
    if (storedName) {
      this.userName.set(storedName);
    }
  }

  async changeName() {
    const alert = await this.alertCtrl.create({
      header: 'Tu Nombre',
      message: '¿Cómo quieres que te llame la aplicación?',
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: 'Escribe tu nombre',
          value: this.userName() !== 'Parsley' ? this.userName() : ''
        }
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { 
          text: 'Guardar', 
          handler: (data) => {
            if (data && data.name && data.name.trim().length > 0) {
              const newName = data.name.trim();
              this.userName.set(newName);
              this.storageService.setItem('USER_NAME', newName);
            }
          } 
        }
      ]
    });
    await alert.present();
  }

  toggleTimeline(timeline: string) {
    this.selectedTimeline.set(timeline);
  }

  toggleTaskCompletion(taskId: string) {
    this.taskService.toggleTask(taskId);
  }

  async editTask(task: any, slidingItem: any) {
    slidingItem.close();
    const modal = await this.modalCtrl.create({
      component: CreateTaskModalComponent,
      componentProps: { task },
      breakpoints: [0, 0.75, 1],
      initialBreakpoint: 0.75
    });
    return await modal.present();
  }

  deleteTask(taskId: string, ionSlidingItem: any) {
    ionSlidingItem.close();
    this.taskService.deleteTask(taskId);
  }
}
