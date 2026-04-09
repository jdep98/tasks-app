import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, IonIcon, IonButton, IonHeader, IonToolbar, IonTitle,
  IonItem, IonLabel, IonInput, IonItemSliding, IonItemOptions, IonItemOption,
  IonButtons, ModalController, IonList, IonAvatar, AlertController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  closeCircle, add, trash, create, colorPaletteOutline, 
  calculatorOutline, cartOutline, restaurantOutline, 
  gameControllerOutline, waterOutline, musicalNotesOutline, folderOutline,
  heartOutline, barbellOutline
} from 'ionicons/icons';
import { CategoryService } from '../../../services/category.service';
import { TaskService } from '../../../services/task.service';
import { Category } from '../../../models/task.model';

@Component({
  selector: 'app-categories-modal',
  templateUrl: './categories-modal.component.html',
  styleUrls: ['./categories-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule, FormsModule, 
    IonContent, IonIcon, IonButton, IonHeader, IonToolbar, IonTitle,
    IonItem, IonLabel, IonInput, IonItemSliding, IonItemOptions, IonItemOption,
    IonButtons, IonList, IonAvatar
  ],
})
export class CategoriesModalComponent {
  private modalCtrl = inject(ModalController);
  private alertCtrl = inject(AlertController);
  public categoryService = inject(CategoryService);
  public taskService = inject(TaskService);

  public isEditing = signal(false);
  public editingCategoryId = signal<string | null>(null);

  // Form
  public categoryName = signal('');
  public categoryColor = signal('#0ce7e7');
  public categoryIcon = signal('folder-outline');

  public availableColors = ['#0ce7e7', '#6666ff', '#ff6666', '#9933ff', '#ff33cc', '#ffb946', '#2dd36f', '#eb445a'];
  public availableIcons = [
    'folder-outline', 'cart-outline', 'calculator-outline', 'color-palette-outline', 
    'restaurant-outline', 'game-controller-outline', 'water-outline', 'musical-notes-outline', 
    'heart-outline', 'barbell-outline'
  ];

  constructor() {
    addIcons({ 
      closeCircle, add, trash, create, colorPaletteOutline, 
      calculatorOutline, cartOutline, restaurantOutline, 
      gameControllerOutline, waterOutline, musicalNotesOutline, 
      folderOutline, heartOutline, barbellOutline 
    });
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  openCreateForm() {
    this.categoryName.set('');
    this.categoryColor.set(this.availableColors[0]);
    this.categoryIcon.set(this.availableIcons[0]);
    this.editingCategoryId.set(null);
    this.isEditing.set(true);
  }

  openEditForm(category: Category, slidingItem: any) {
    slidingItem.close();
    this.categoryName.set(category.name);
    this.categoryColor.set(category.color || this.availableColors[0]);
    this.categoryIcon.set(category.icon || this.availableIcons[0]);
    this.editingCategoryId.set(category.id);
    this.isEditing.set(true);
  }

  closeForm() {
    this.isEditing.set(false);
  }

  saveCategory() {
    const name = this.categoryName().trim();
    if (!name) return;

    if (this.editingCategoryId()) {
      this.categoryService.updateCategory(this.editingCategoryId()!, {
        name: name,
        color: this.categoryColor(),
        icon: this.categoryIcon()
      });
    } else {
      this.categoryService.createCategory(name, this.categoryColor(), this.categoryIcon());
    }
    
    this.isEditing.set(false);
  }

  updateCategoryName(event: any) {
    this.categoryName.set(event.detail.value);
  }

  async deleteCategory(category: Category, slidingItem: any) {
    slidingItem.close();

    const alert = await this.alertCtrl.create({
      header: 'Eliminar Categoría',
      message: `¿Borrar "${category.name}" en cascada? Eliminará TODAS las tareas que formen parte de ella permanentemente.`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar Tareas y Categoría',
          role: 'destructive',
          handler: () => {
            this.taskService.deleteTasksByCategory(category.id);
            this.categoryService.deleteCategory(category.id);
          }
        }
      ]
    });
    await alert.present();
  }
}
