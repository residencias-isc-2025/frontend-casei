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
import { ObjetivoEspecificoData } from '@interfaces/use-cases/objetivo-especifico.response';
import { CommonService, ToastService } from '@presentation/services';

@Component({
  selector: 'app-update-objetivos-especificos',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './update-objetivo-especifico.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdateObjetivoEspecificoComponent implements OnInit {
  title = input('');
  objetivo = input.required<ObjetivoEspecificoData>();

  onCancel = output();
  onSave = output();

  public toastService = inject(ToastService);
  public commonService = inject(CommonService);

  updateObjetivoForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.updateObjetivoForm = this.fb.group({
      descripcion: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.updateObjetivoForm.patchValue({
      descripcion: this.objetivo().descripcion,
    });
  }

  onSaveData() {
    const { descripcion } = this.updateObjetivoForm.value;

    const token = localStorage.getItem('casei_residencias_access_token') || '';

    this.commonService
      .actualizarObjetivoEspecifico(this.objetivo().id, {
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
