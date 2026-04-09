import { Component, ChangeDetectionStrategy, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonIcon, IonButton, IonHeader, IonToolbar, IonTitle, IonFooter,
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
    IonItem, IonLabel, IonSelect, IonSelectOption, IonTextarea,
    IonToggle, IonButtons, IonDatetime, IonModal
  ],
})
export class CreateTaskModalComponent implements OnInit {
  private modalCtrl = inject(ModalController);
  private taskService = inject(TaskService);
  public categoryService = inject(CategoryService);
  public firebaseService = inject(FirebaseConfigService);

  @Input() task?: any;

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

  ngOnInit() {
    if (this.task) {
      this.title = this.task.title;
      this.categoryId = this.task.categoryId;
      this.isImportant = this.task.isImportant || false;

      let dateObj = new Date(this.task.date);
      if (isNaN(dateObj.getTime())) {
        dateObj = new Date(this.task.createdAt);
      }
      this.dateValue = dateObj.toISOString();

      const fakeDate = new Date();
      const timeParts = this.task.time.match(/(\d+):(\d+)\s*(am|pm)/i);
      if (timeParts) {
        let hours = parseInt(timeParts[1], 10);
        let minutes = parseInt(timeParts[2], 10);
        const ampm = timeParts[3].toLowerCase();
        if (ampm === 'pm' && hours < 12) hours += 12;
        if (ampm === 'am' && hours === 12) hours = 0;
        fakeDate.setHours(hours, minutes, 0, 0);
        this.timeValue = fakeDate.toISOString();
      }
    }
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    if (!this.title.trim()) return;

    const timeObj = new Date(this.timeValue);
    const formattedTime = timeObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (this.task) {
      this.taskService.updateTask(this.task.id, {
        title: this.title,
        date: this.dateValue,
        time: formattedTime,
        categoryId: this.categoryId,
        isImportant: this.isImportant
      });
    } else {
      this.taskService.createTask(
        this.title,
        '',
        this.dateValue,
        formattedTime,
        this.categoryId,
        this.isImportant
      );
    }

    return this.modalCtrl.dismiss(this.title, 'confirm');
  }
}
