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
import { CustomDatepickerComponent } from '@presentation/components/custom-datepicker/custom-datepicker.component';
import { CommonService, ToastService } from '@presentation/services';

@Component({
  selector: 'app-add-periodo',
  imports: [CommonModule, ReactiveFormsModule, CustomDatepickerComponent],
  templateUrl: './add-periodo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddPeriodoComponent implements OnInit {
  title = input('');

  onCancel = output();
  onSave = output();

  public toastService = inject(ToastService);
  public commonService = inject(CommonService);

  addPeriodoForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.addPeriodoForm = this.fb.group({
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
    const today = new Date().toISOString().split('T')[0];

    this.addPeriodoForm.patchValue({
      fecha_i: today,
      fecha_f: today,
    });
  }

  onStartDateSelected(date: string) {
    this.addPeriodoForm.get('fecha_i')?.setValue(date);
  }

  onEndDateSelected(date: string) {
    this.addPeriodoForm.get('fecha_f')?.setValue(date);
  }

  onSaveData() {
    const { descripcion, clave, fecha_i, fecha_f } = this.addPeriodoForm.value;

    const token = localStorage.getItem('casei_residencias_access_token') || '';

    this.commonService
      .agregarPeriodo({
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
