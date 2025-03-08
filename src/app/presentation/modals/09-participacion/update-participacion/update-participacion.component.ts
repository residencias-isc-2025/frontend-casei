import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnInit,
  output,
} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ParticipacionResponse } from '@interfaces/index';
import { ToastService, UsersService } from '@presentation/services';

@Component({
  selector: 'app-update-participacion',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './update-participacion.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdateParticipacionComponent implements OnInit {
  title = input('');
  participacion = input.required<ParticipacionResponse>();

  onCancel = output();
  onSave = output();

  public toastService = inject(ToastService);
  public usersService = inject(UsersService);

  updateParticipacionForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.updateParticipacionForm = this.fb.group({
      organismo: ['', Validators.required],
      periodo: [1, Validators.required],
      participacion: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.updateParticipacionForm.patchValue({
      organismo: this.participacion().organismo,
      periodo: this.participacion().periodo,
      participacion: this.participacion().nivel_p,
    });
  }

  onStartDateSelected(date: string) {
    this.updateParticipacionForm.get('gestion_i')?.setValue(date);
  }

  onEndDateSelected(date: string) {
    this.updateParticipacionForm.get('gestion_f')?.setValue(date);
  }

  onSaveData() {
    const { organismo, periodo, participacion } =
      this.updateParticipacionForm.value;

    const token = localStorage.getItem('casei_residencias_access_token') || '';

    this.usersService
      .actualizarParticipacion(this.participacion().id, {
        accessToken: token,
        nivel_p: participacion,
        organismo,
        periodo,
      })
      .subscribe({
        error: (res) => {
          this.toastService.showError(res.mensaje!, 'Malas noticias');
        },
        next: (res) => {
          if (res.ok) {
            this.toastService.showSuccess(res.mensaje!, 'Éxito');
            this.onSave.emit();
          } else {
            this.toastService.showWarning(res.mensaje!, 'Malas noticias');
          }
        },
      });
  }
}
