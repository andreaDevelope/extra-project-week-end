import { iFasciaOraria } from './../../interfaces/i-fascia-oraria';
import { Component } from '@angular/core';
import { iUser } from '../../interfaces/i-user';
import { AuthService } from '../../services/auth-service';
import { Router } from '@angular/router';
import { iAccessData } from '../../interfaces/i-access-data';
import { iMateria } from '../../interfaces/i-materia';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.scss',
})
export class WelcomeComponent {
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

  selectedMateria: iMateria | null = null;

  fasciaoraria: iFasciaOraria = {
    start: '10pm',
    end: '14pm',
  };

  form: Partial<iUser> = {
    username: '',
    email: '',
    password: '',
    ruolo: 'mentor',
    materie: [],
    fasciaOraria: this.fasciaoraria,
  };

  constructor(private authSer: AuthService, private router: Router) {}

  signup() {
    this.authSer.register(this.form).subscribe((res: iAccessData) => {
      this.router.navigate(['/log-in']);
    });
  }

  addMateria(materia: iMateria) {
    if (!this.form.materie) {
      this.form.materie = [];
    }
    if (
      !this.form.materie.find(
        (m) => m.nome === materia.nome && m.livello === materia.livello
      )
    ) {
      this.form.materie.push(materia);
    }
  }

  removeMateria(index: number) {
    if (this.form.materie) {
      this.form.materie.splice(index, 1);
    }
  }
}
