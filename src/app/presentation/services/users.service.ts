import { Injectable } from '@angular/core';
import { CreateUserInterface } from '../../interfaces/dtos/create-user.dto';
import { from } from 'rxjs';
import { createUserUseCase } from '../../core';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  createUser(user: CreateUserInterface) {
    return from(createUserUseCase(user));
  }
}
