import { Component, inject } from '@angular/core';
import { IonApp, IonRouterOutlet, IonFooter, IonToolbar, IonButton, IonIcon, IonFabButton, ModalController } from '@ionic/angular/standalone';
import { CreateTaskModalComponent } from './home/components/create-task-modal/create-task-modal.component';
import { addIcons } from 'ionicons';
import { homeOutline, notificationsOutline, settingsOutline, personOutline, add } from 'ionicons/icons';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  imports: [IonApp, IonRouterOutlet, IonFooter, IonToolbar, IonButton, IonIcon, IonFabButton],
})
export class AppComponent {
  private modalCtrl = inject(ModalController);

  constructor() {
    addIcons({ homeOutline, notificationsOutline, settingsOutline, personOutline, add });
  }

  async openCreateTaskModal() {
    const modal = await this.modalCtrl.create({
      component: CreateTaskModalComponent,
      breakpoints: [0, 0.75, 1],
      initialBreakpoint: 0.75
    });
    return await modal.present();
  }
}
