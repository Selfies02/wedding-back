// auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  private readonly fixedUsername = 'usuarioFijo';
  private readonly fixedPassword = 'passwordFijo';

  login(loginDto: LoginDto) {
    const { username, password } = loginDto;

    if (username === this.fixedUsername && password === this.fixedPassword) {
      return { message: 'Login correcto' };
    } else {
      throw new UnauthorizedException('Credenciales inválidas');
    }
  }
}
