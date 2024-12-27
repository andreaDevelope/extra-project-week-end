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
  arr: iMateria[] = [
    {
      nome: 'matematica',
      livello: 'avanzato',
    },
    {
      nome: 'italiano',
      livello: 'avanzato',
    },
  ];
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
}
