import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnInit,
  output,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Participacion } from '@core/models/participacion.model';
import { ParticipacionService } from '@core/services/participacion.service';
import { ToastService } from '@core/services/toast.service';

@Component({
  selector: 'app-participacion-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './participacion-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ParticipacionFormComponent implements OnInit {
  onCancel = output();
  onSave = output();

  fb = inject(FormBuilder);
  toastService = inject(ToastService);
  participacionService = inject(ParticipacionService);

  editing = input.required<boolean>();

  title = input('');
  participacion = input<Participacion>();

  form = this.fb.group({
    organismo: ['', Validators.required],
    periodo: [1, Validators.required],
    participacion: ['', Validators.required],
  });

  ngOnInit(): void {
    if (!this.editing()) return;

    this.form.patchValue({
      organismo: this.participacion()?.organismo,
      periodo: this.participacion()?.periodo,
      participacion: this.participacion()?.nivel_p,
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    const formValue = this.form.value;
    const payload: Partial<Participacion> = {
      nivel_p: formValue.participacion ?? '',
      organismo: formValue.organismo ?? '',
      periodo: formValue.periodo ?? 0,
    };

    const action = this.editing()
      ? this.participacionService.actualizar(this.participacion()!.id, payload)
      : this.participacionService.crear(payload);

    action.subscribe({
      next: (response) => {
        this.toastService.showSuccess(response.mensaje, 'Éxito');
        this.onSave.emit();
      },
      error: (res) => {
        this.toastService.showError(res.mensaje!, 'Malas noticias');
      },
    });
  }
}
