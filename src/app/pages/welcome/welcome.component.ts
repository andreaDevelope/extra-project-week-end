import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import { iAccessData } from '../../interfaces/i-access-data';
import { iMateria } from '../../interfaces/i-materia';
import { iFasciaOraria } from '../../interfaces/i-fascia-oraria';
import { MatButtonToggleChange } from '@angular/material/button-toggle';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
})
export class WelcomeComponent {
  signupForm!: FormGroup;
  selectedRole = 'student'; // Ruolo predefinito
  materieDisponibili: iMateria[] = [
    { nome: 'Matematica', livello: 'base' },
    { nome: 'Matematica', livello: 'intermedio' },
    { nome: 'Matematica', livello: 'avanzato' },
    { nome: 'Inglese', livello: 'base' },
    { nome: 'Inglese', livello: 'intermedio' },
    { nome: 'Inglese', livello: 'avanzato' },
    { nome: 'Scienze', livello: 'base' },
    { nome: 'Scienze', livello: 'intermedio' },
    { nome: 'Scienze', livello: 'avanzato' },
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.initForm();
  }

  initForm() {
    this.signupForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.pattern(
            '^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[0-9]).{6,}$'
          ),
        ],
      ],
      ruolo: [this.selectedRole],
      materie: this.fb.array([]),
      fasciaOraria: this.fb.group({
        start: ['', Validators.required],
        end: ['', Validators.required],
      }),
    });

    this.updateFormControls();
  }

  // Determina se il ruolo è Mentor
  get isMentor(): boolean {
    return this.selectedRole === 'mentor';
  }

  get materieFormArray(): FormArray {
    return this.signupForm.get('materie') as FormArray;
  }

  addMateria(materia: iMateria) {
    const materie = this.materieFormArray;
    if (
      !materie.controls.some(
        (control) =>
          control.value.nome === materia.nome &&
          control.value.livello === materia.livello
      )
    ) {
      materie.push(this.fb.group(materia));
    }
  }

  removeMateria(index: number) {
    this.materieFormArray.removeAt(index);
  }

  normalizeFasciaOraria(fasciaOraria: {
    start: string;
    end: string;
  }): iFasciaOraria {
    const start = this.convertTo24HourFormat(fasciaOraria.start);
    const end = this.convertTo24HourFormat(fasciaOraria.end);
    return { start, end };
  }

  convertTo24HourFormat(time: string): string {
    const [hours, minutes] = time.split(':');
    return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
  }

  switchRole(event: MatButtonToggleChange) {
    this.selectedRole = event.value; // Assicurati che sia 'mentor' o 'student'
    this.signupForm.patchValue({ ruolo: this.selectedRole });
    console.log('Ruolo selezionato:', this.selectedRole); // Debugging
    this.updateFormControls();
  }

  updateFormControls() {
    if (this.isMentor) {
      if (!this.signupForm.contains('fasciaOraria')) {
        this.signupForm.addControl(
          'fasciaOraria',
          this.fb.group({
            start: ['', Validators.required],
            end: ['', Validators.required],
          })
        );
      }
      if (!this.signupForm.contains('materie')) {
        this.signupForm.addControl('materie', this.fb.array([]));
      }
    } else {
      if (this.signupForm.contains('fasciaOraria')) {
        this.signupForm.removeControl('fasciaOraria');
      }
      if (this.signupForm.contains('materie')) {
        this.signupForm.removeControl('materie');
      }
    }

    // Aggiorna la vista manualmente, se necessario
    this.signupForm.updateValueAndValidity();
  }

  signup() {
    if (this.signupForm.valid) {
      const formValue = { ...this.signupForm.value };
      if (this.isMentor) {
        formValue.fasciaOraria = this.normalizeFasciaOraria(
          formValue.fasciaOraria
        );
      }

      this.authService.register(formValue).subscribe(
        (res: iAccessData) => {
          this.router.navigate(['/log-in']);
        },
        (error) => {
          if (error.errors) {
            Object.keys(error.errors).forEach((field) => {
              this.signupForm
                .get(field)
                ?.setErrors({ serverError: error.errors[field] });
            });
          }
        }
      );
    } else {
      console.error('Il modulo non è valido');
    }
  }
}
