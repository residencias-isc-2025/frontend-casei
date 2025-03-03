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
import { DisenoIngenierilResponse } from '@interfaces/index';
import { ToastService, UsersService } from '@presentation/services';

@Component({
  selector: 'app-update-diseno-ingenieril',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './update-diseno-ingenieril.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdateDisenoIngenierilComponent implements OnInit {
  title = input('');
  disenoIngenieril = input.required<DisenoIngenierilResponse>();

  onCancel = output();
  onSave = output();

  public toastService = inject(ToastService);
  public usersService = inject(UsersService);

  updateDisenoIngenierilForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.updateDisenoIngenierilForm = this.fb.group({
      organismo: ['', Validators.required],
      periodo: [1, Validators.required],
      experiencia: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.updateDisenoIngenierilForm.patchValue({
      organismo: this.disenoIngenieril().organismo,
      periodo: this.disenoIngenieril().periodo,
      experiencia: this.disenoIngenieril().nivel_experiencia,
    });
  }

  onStartDateSelected(date: string) {
    this.updateDisenoIngenierilForm.get('gestion_i')?.setValue(date);
  }

  onEndDateSelected(date: string) {
    this.updateDisenoIngenierilForm.get('gestion_f')?.setValue(date);
  }

  onSaveData() {
    const { organismo, periodo, experiencia } =
      this.updateDisenoIngenierilForm.value;

    const token = localStorage.getItem('casei_residencias_access_token') || '';

    this.usersService
      .updateEngineeringDesignFunction(this.disenoIngenieril().id, {
        accessToken: token,
        nivel_experiencia: experiencia,
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
