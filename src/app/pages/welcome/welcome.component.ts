import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
  FormControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import { iAccessData } from '../../interfaces/i-access-data';
import { iMateria } from '../../interfaces/i-materia';
import { CustomValidators } from '../../custom-validators/custom-validator';
import { CustomValidatorsFasciaOraria } from '../../custom-validators/custom-validate-fascia-oraria';
import { CustomValidatorsMaterie } from '../../custom-validators/custom-validators-materie';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
})
export class WelcomeComponent {
  private isResetting: boolean = false;
  signupForm!: FormGroup;
  hidePassword = true;
  hideConfirmPassword = true;
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
    this.signupForm = this.fb.group(
      {
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
        confirmPassword: ['', Validators.required],
        ruolo: ['student', Validators.required],
        materie: this.fb.array([], CustomValidatorsMaterie.validateMaterie()),
        fasciaOraria: this.fb.group(
          {
            start: [''],
            end: [''],
          },
          { validators: CustomValidatorsFasciaOraria.validateFasciaOraria() }
        ),
      },
      { validators: CustomValidators.passwordsMatch() }
    );

    this.signupForm.get('ruolo')?.valueChanges.subscribe((newRole) => {
      if (this.isResetting) {
        return;
      }

      this.isResetting = true;

      try {
        this.signupForm.reset({
          username: this.signupForm.get('username')?.value,
          email: this.signupForm.get('email')?.value,
          password: '',
          confirmPassword: '',
          ruolo: newRole,
          materie: [],
          fasciaOraria: {
            start: '',
            end: '',
          },
        });

        const fasciaOrariaGroup = this.signupForm.get('fasciaOraria');
        const materieArray = this.signupForm.get('materie') as FormArray;

        if (newRole === 'mentor') {
          fasciaOrariaGroup?.get('start')?.setValidators(Validators.required);
          fasciaOrariaGroup?.get('end')?.setValidators(Validators.required);
          materieArray.setValidators(CustomValidatorsMaterie.validateMaterie());
        } else {
          fasciaOrariaGroup?.get('start')?.clearValidators();
          fasciaOrariaGroup?.get('end')?.clearValidators();
          materieArray.clearValidators();
        }

        fasciaOrariaGroup?.get('start')?.updateValueAndValidity();
        fasciaOrariaGroup?.get('end')?.updateValueAndValidity();
        materieArray.updateValueAndValidity();
      } finally {
        this.isResetting = false;
      }
    });

    this.materieFormArray.valueChanges.subscribe(() => {
      if (!this.isResetting) {
        this.materieFormArray.updateValueAndValidity({
          onlySelf: true,
          emitEvent: false,
        });
      }
    });
  }

  get ruoloControl(): FormControl {
    return this.signupForm.get('ruolo') as FormControl;
  }

  get isMentor(): boolean {
    return this.signupForm.get('ruolo')?.value === 'mentor';
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

  signup() {
    const password = this.signupForm.get('password')?.value;
    const confirmPassword = this.signupForm.get('confirmPassword')?.value;

    if (password !== confirmPassword) {
      console.error('Le password non corrispondono');
      this.signupForm
        .get('confirmPassword')
        ?.setErrors({ passwordsMismatch: true });
      return;
    }

    if (this.signupForm.valid) {
      const formValue = { ...this.signupForm.value };
      delete formValue.confirmPassword;
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
