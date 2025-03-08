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
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AportacionesResponse } from '@interfaces/index';
import { ToastService, UsersService } from '@presentation/services';

@Component({
  selector: 'app-update-aportacion',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './update-aportacion.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdateAportacionComponent implements OnInit {
  title = input('');
  aportacion = input.required<AportacionesResponse>();

  onCancel = output();
  onSave = output();

  public toastService = inject(ToastService);
  public usersService = inject(UsersService);

  updateAportacionForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.updateAportacionForm = this.fb.group({
      descripcion: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.updateAportacionForm.patchValue({
      descripcion: this.aportacion().descripcion,
    });
  }

  onSaveData() {
    const { descripcion } = this.updateAportacionForm.value;

    const token = localStorage.getItem('casei_residencias_access_token') || '';

    this.usersService
      .actualizarAportacion(this.aportacion().id, {
        accessToken: token,
        descripcion,
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
