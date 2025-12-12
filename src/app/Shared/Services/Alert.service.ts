import { Injectable, signal } from '@angular/core';

export interface Alert {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
  isLeaving?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private _alerts = signal<Alert[]>([]);
  
  readonly alerts = this._alerts.asReadonly();

  private generateId(): string {
    return Math.random().toString(36).substring(2, 9);
  }

  show(type: Alert['type'], message: string, duration: number = 4000) {
    const alert: Alert = {
      id: this.generateId(),
      type,
      message,
      duration,
      isLeaving: false
    };

    this._alerts.update(alerts => [...alerts, alert]);

    // Auto-remove after duration
    if (duration > 0) {
      setTimeout(() => {
        this.remove(alert.id);
      }, duration);
    }
  }

  success(message: string, duration?: number) {
    this.show('success', message, duration);
  }

  error(message: string, duration?: number) {
    this.show('error', message, duration);
  }

  warning(message: string, duration?: number) {
    this.show('warning', message, duration);
  }

  info(message: string, duration?: number) {
    this.show('info', message, duration);
  }

  remove(id: string) {
    // First mark as leaving for animation
    this._alerts.update(alerts => 
      alerts.map(a => a.id === id ? { ...a, isLeaving: true } : a)
    );
    
    // Then remove after animation completes
    setTimeout(() => {
      this._alerts.update(alerts => alerts.filter(a => a.id !== id));
    }, 300); // Match animation duration
  }

  clear() {
    this._alerts.set([]);
  }
}
