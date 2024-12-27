import { iFasciaOraria } from './i-fascia-oraria';
import { iMateria } from './i-materia';

export interface iUser {
  id: number;
  email: string;
  password: string;
  username: string;
  ruolo: 'student' | 'mentor';
  materie?: iMateria[];
  fasciaOraria: iFasciaOraria;
}
