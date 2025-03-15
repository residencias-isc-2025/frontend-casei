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
import { PeriodoData } from '@interfaces/index';
import { CustomDatepickerComponent } from '@presentation/components/custom-datepicker/custom-datepicker.component';
import { ToastService, CommonService } from '@presentation/services';

@Component({
  selector: 'app-update-periodo',
  imports: [CommonModule, ReactiveFormsModule, CustomDatepickerComponent],
  templateUrl: './update-periodo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdatePeriodoComponent implements OnInit {
  title = input('');
  periodo = input.required<PeriodoData>();

  onCancel = output();
  onSave = output();

  public toastService = inject(ToastService);
  public commonService = inject(CommonService);

  updatePeriodoForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.updatePeriodoForm = this.fb.group({
      descripcion: ['', Validators.required],
      clave: ['', Validators.required],
      fecha_i: ['', Validators.required],
      fecha_f: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.updatePeriodoForm.patchValue({
      descripcion: this.periodo().descripcion,
      clave: this.periodo().clave,
      fecha_i: this.periodo().fecha_inicio,
      fecha_f: this.periodo().fecha_fin,
    });
  }

  onStartDateSelected(date: string) {
    this.updatePeriodoForm.get('fecha_i')?.setValue(date);
  }

  onEndDateSelected(date: string) {
    this.updatePeriodoForm.get('fecha_f')?.setValue(date);
  }

  onSaveData() {
    const { descripcion, clave, fecha_i, fecha_f } =
      this.updatePeriodoForm.value;

    const token = localStorage.getItem('casei_residencias_access_token') || '';

    this.commonService
      .actualizarPeriodo(this.periodo().id, {
        accessToken: token,
        descripcion,
        clave,
        fecha_inicio: fecha_i,
        fecha_fin: fecha_f,
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
