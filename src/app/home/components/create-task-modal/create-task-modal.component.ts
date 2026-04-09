import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, IonIcon, IonButton, IonHeader, IonToolbar, IonTitle,
  IonItem, IonLabel, IonInput, IonSelect, IonSelectOption, IonTextarea,
  IonToggle, IonButtons, ModalController, IonDatetime, IonDatetimeButton, IonModal
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { timeOutline, calendarOutline, starOutline, closeCircle } from 'ionicons/icons';
import { TaskService } from '../../../services/task.service';
import { CategoryService } from '../../../services/category.service';
import { FirebaseConfigService } from '../../../services/firebase-config.service';

@Component({
  selector: 'app-create-task-modal',
  templateUrl: './create-task-modal.component.html',
  styleUrls: ['./create-task-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule, FormsModule, 
    IonContent, IonIcon, IonButton, IonHeader, IonToolbar, IonTitle,
    IonItem, IonLabel, IonInput, IonSelect, IonSelectOption, IonTextarea,
    IonToggle, IonButtons, IonDatetime, IonDatetimeButton, IonModal
  ],
})
export class CreateTaskModalComponent {
  private modalCtrl = inject(ModalController);
  private taskService = inject(TaskService);
  public categoryService = inject(CategoryService);
  public firebaseService = inject(FirebaseConfigService);

  public title: string = '';
  public categoryId: string = 'cat-shopping';
  public isImportant: boolean = false;

  // Variables para Datetime
  public today: string = new Date().toISOString().split('T')[0]; // ej: '2024-05-12' para [min]
  public dateValue: string = new Date().toISOString(); 
  public timeValue: string = new Date().toISOString();

  get formattedDateUI(): string {
    return new Date(this.dateValue).toLocaleDateString();
  }

  get formattedTimeUI(): string {
    return new Date(this.timeValue).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  constructor() {
    addIcons({ timeOutline, calendarOutline, starOutline, closeCircle });
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    if (!this.title.trim()) return;

    const timeObj = new Date(this.timeValue);
    const formattedTime = timeObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    this.taskService.createTask(
      this.title, 
      '', 
      this.dateValue, // Guardar el valor ISO (YYYY-MM-DD...) puro para filtrado 
      formattedTime, 
      this.categoryId, 
      this.isImportant
    );

    return this.modalCtrl.dismiss(this.title, 'confirm');
  }
}
