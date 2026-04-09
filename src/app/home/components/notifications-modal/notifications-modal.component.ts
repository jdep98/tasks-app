import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton,
  IonIcon, IonBadge, ModalController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { closeCircle, alertCircle, calendarClear, checkmarkDoneCircleOutline, checkmarkCircleOutline } from 'ionicons/icons';
import { TaskService } from '../../../services/task.service';

@Component({
  selector: 'app-notifications-modal',
  templateUrl: './notifications-modal.component.html',
  styleUrls: ['./notifications-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton,
    IonIcon, IonBadge
  ],
})
export class NotificationsModalComponent {
  private modalCtrl = inject(ModalController);
  public taskService = inject(TaskService);

  constructor() {
    addIcons({ closeCircle, alertCircle, calendarClear, checkmarkDoneCircleOutline, checkmarkCircleOutline });
  }

  dismiss() {
    return this.modalCtrl.dismiss();
  }

  completeTask(taskId: string) {
    this.taskService.updateTask(taskId, { completed: true });
  }
}
