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
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { PremioData } from '@interfaces/index';
import { ToastService, UsersService } from '@presentation/services';

@Component({
  selector: 'app-update-premios',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './update-premios.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdatePremiosComponent implements OnInit {
  title = input('');
  premio = input.required<PremioData>();

  onCancel = output();
  onSave = output();

  public toastService = inject(ToastService);
  public usersService = inject(UsersService);

  updatePremioForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.updatePremioForm = this.fb.group({
      descripcion: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.updatePremioForm.patchValue({
      descripcion: this.premio().descripcion,
    });
  }

  onSaveData() {
    const { descripcion } = this.updatePremioForm.value;

    const token = localStorage.getItem('casei_residencias_access_token') || '';

    this.usersService
      .actualizarPremio(this.premio().id, {
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
