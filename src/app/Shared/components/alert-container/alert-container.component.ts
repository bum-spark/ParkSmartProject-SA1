import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertService } from '../../Services/Alert.service';
import { LucideAngularModule, CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-angular';

@Component({
  selector: 'app-alert-container',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './alert-container.component.html',
  styleUrl: './alert-container.component.css',
})
export class AlertContainerComponent {
  readonly alertService = inject(AlertService);
  
  // Iconos para usar en el template
  readonly CheckCircleIcon = CheckCircle;
  readonly XCircleIcon = XCircle;
  readonly AlertTriangleIcon = AlertTriangle;
  readonly InfoIcon = Info;
  readonly XIcon = X;

  closeAlert(id: string) {
    this.alertService.remove(id);
  }
}
