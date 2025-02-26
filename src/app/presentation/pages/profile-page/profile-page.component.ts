import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

// Modals
import { AcademicTrainingComponent } from '../../modals/academic-training/academic-training.component';
import { TeachingTrainingComponent } from '../../modals/teaching-training/teaching-training.component';
import { DisciplinaryUpdateComponent } from '../../modals/disciplinary-update/disciplinary-update.component';
import { AcademicManagementComponent } from '../../modals/academic-management/academic-management.component';
import { AcademicProductsComponent } from '../../modals/academic-products/academic-products.component';
import { ProfessionalExperienceComponent } from '../../modals/professional-experience/professional-experience.component';
import { EngineeringDesignComponent } from '../../modals/engineering-design/engineering-design.component';
import { ProfessionalAchievementsComponent } from '../../modals/professional-achievements/professional-achievements.component';
import { AssociationsComponent } from '../../modals/associations/associations.component';
import { AwardsComponent } from '../../modals/awards/awards.component';
import { ContributionsComponent } from '../../modals/contributions/contributions.component';

interface ProfileButtons {
  id: number;
  text: string;
  action: () => void;
}

@Component({
  selector: 'app-profile-page',
  imports: [
    CommonModule,
    AcademicTrainingComponent,
    TeachingTrainingComponent,
    DisciplinaryUpdateComponent,
    AcademicManagementComponent,
    AcademicProductsComponent,
    ProfessionalExperienceComponent,
    EngineeringDesignComponent,
    ProfessionalAchievementsComponent,
    AssociationsComponent,
    AwardsComponent,
    ContributionsComponent,
  ],
  templateUrl: './profile-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ProfilePageComponent {
  user = {
    name: 'Sergio Barreras',
    nomina: '990837',
    role: 'superuser',
  };

  selectedId = signal<number>(-1);

  titles = [
    'Formación académica',
    'Capacitación docente',
    'Actualización disciplinar',
    'Gestión académica',
    'Productos académicos',
    'Experiencia profesional',
    'Diseño ingenieril',
    'Logros profesionales',
    'Participación en asociaciones',
    'Premios y reconocimientos',
    'Aportaciones relevantes',
  ];

  buttons: ProfileButtons[] = [
    { id: 1, text: this.titles[0], action: () => this.handleClick(1) },
    { id: 2, text: this.titles[1], action: () => this.handleClick(2) },
    { id: 3, text: this.titles[2], action: () => this.handleClick(3) },
    { id: 4, text: this.titles[3], action: () => this.handleClick(4) },
    { id: 5, text: this.titles[4], action: () => this.handleClick(5) },
    { id: 6, text: this.titles[5], action: () => this.handleClick(6) },
    { id: 7, text: this.titles[6], action: () => this.handleClick(7) },
    { id: 8, text: this.titles[7], action: () => this.handleClick(8) },
    { id: 9, text: this.titles[8], action: () => this.handleClick(9) },
    { id: 10, text: this.titles[9], action: () => this.handleClick(10) },
    { id: 11, text: this.titles[10], action: () => this.handleClick(11) },
  ];

  handleClick(id: number) {
    this.selectedId.set(id);

    console.log(id);
  }
}
