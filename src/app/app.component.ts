import { Component, inject } from '@angular/core';
import { IonApp, IonRouterOutlet, IonFooter, IonToolbar, IonButton, IonIcon, IonFabButton, ModalController, AlertController } from '@ionic/angular/standalone';
import { CreateTaskModalComponent } from './home/components/create-task-modal/create-task-modal.component';
import { CategoriesModalComponent } from './home/components/categories-modal/categories-modal.component';
import { StorageService } from './services/storage.service';
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
  private alertCtrl = inject(AlertController);
  public storageService = inject(StorageService);

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

  async openCategoriesModal() {
    const modal = await this.modalCtrl.create({
      component: CategoriesModalComponent,
      breakpoints: [0, 0.9, 1],
      initialBreakpoint: 0.9
    });
    return await modal.present();
  }

  async changeName() {
    const currentName = this.storageService.userName();
    const alert = await this.alertCtrl.create({
      header: 'Tu Nombre',
      message: '¿Cómo quieres que te llame la aplicación?',
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: 'Escribe tu nombre',
          value: currentName !== 'Parsley' ? currentName : ''
        }
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { 
          text: 'Guardar', 
          handler: (data) => {
            if (data && data.name && data.name.trim().length > 0) {
              this.storageService.setUserName(data.name.trim());
            }
          } 
        }
      ]
    });
    await alert.present();
  }
}
