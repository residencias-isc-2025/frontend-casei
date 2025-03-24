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
import { Adscripcion } from '@core/models/adscripcion.model';
import { User } from '@core/models/user.model';
import { AdscripcionService } from '@core/services/adscripcion.service';
import { ToastService } from '@core/services/toast.service';
import { UserService } from '@core/services/user.service';
import { CustomDatepickerComponent } from '@presentation/components/custom-datepicker/custom-datepicker.component';

@Component({
  selector: 'app-update-profile',
  imports: [CommonModule, ReactiveFormsModule, CustomDatepickerComponent],
  templateUrl: './update-profile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdateProfileComponent implements OnInit {
  onCancel = output();
  onSave = output();

  fb = inject(FormBuilder);
  toastService = inject(ToastService);
  userService = inject(UserService);
  adscripcionService = inject(AdscripcionService);

  userProfile = input.required<User>();
  adscripcionesList = input<Adscripcion[]>([]);

  form = this.fb.group({
    nombre: ['', Validators.required],
    apellido_p: ['', Validators.required],
    apellido_m: ['', Validators.required],
    fecha_nacimiento: ['', Validators.required],
    area_adscripcion: [0, Validators.required],
  });

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.form.patchValue({
      nombre: this.userProfile().nombre,
      apellido_p: this.userProfile().apellido_paterno,
      apellido_m: this.userProfile().apellido_materno,
      fecha_nacimiento: this.userProfile().fecha_nacimiento,
      area_adscripcion: this.userProfile().area_adscripcion,
    });
  }

  onDateSelected(date: string) {
    this.form.get('fecha_nacimiento')?.setValue(date);
  }

  onSaveData() {
    const {
      nombre,
      apellido_p,
      apellido_m,
      fecha_nacimiento,
      area_adscripcion,
    } = this.form.value;

    this.userService
      .actualizarUsuario(this.userProfile().id, {
        nombre,
        apellido_paterno: apellido_p,
        apellido_materno: apellido_m,
        fecha_nacimiento,
        area_adscripcion,
      })
      .subscribe({
        error: (res) => {
          this.toastService.showError(res.mensaje!, 'Malas noticias');
        },
        next: (res) => {
          this.toastService.showSuccess(res.mensaje!, 'Éxito');
          this.onSave.emit();
        },
      });
  }
}
