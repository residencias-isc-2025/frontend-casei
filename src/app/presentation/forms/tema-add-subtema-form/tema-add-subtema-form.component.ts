import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SubTemas } from '@core/models/sub-temas.model';
import { Tema } from '@core/models/tema.model';
import { SubTemaService } from '@core/services/sub-tema.service';
import { TemaService } from '@core/services/tema.service';
import { ToastService } from '@core/services/toast.service';

@Component({
  selector: 'app-tema-add-subtema-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './tema-add-subtema-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TemaAddSubtemaFormComponent implements OnInit {
  onCancel = output();
  onSave = output();

  fb = inject(FormBuilder);

  toastService = inject(ToastService);
  temaService = inject(TemaService);
  subtemaService = inject(SubTemaService);

  tema = input.required<Tema>();

  subtemas = signal<SubTemas[]>([]);

  form = this.fb.group({
    subtema: [0, Validators.required],
  });

  ngOnInit(): void {
    this.subtemaService
      .obtenerDatosPaginados(1, 100, {})
      .subscribe((res) => this.subtemas.set(res.results));
  }

  onSubmit() {
    if (this.form.invalid) return;
    const { subtema } = this.form.value;

    let subtemas = this.tema().sub_temas;
    subtemas.push(subtema!);

    const payload: Partial<Tema> = {
      sub_temas: subtemas,
    };

    this.temaService.actualizar(this.tema()!.id, payload).subscribe({
      next: (response) => {
        this.toastService.showSuccess(response.mensaje, 'Éxito');
        this.onSave.emit();
      },
      error: (response) => {
        this.toastService.showError(response.mensaje, 'Malas noticias');
      },
    });
  }
}
