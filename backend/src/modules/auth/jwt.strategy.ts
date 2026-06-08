// Estrategia JWT de Passport. Extrae el token del header Authorization y,
// si la firma es válida, adjunta el objeto usuario a req.user para el resto de la petición.
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    super({
      // Extrae el token del header: "Authorization: Bearer <token>"
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('JWT_SECRET'),
    });
  }

  // Llamado automáticamente por Passport tras verificar la firma del token.
  // El objeto devuelto se convierte en req.user; se mapea "sub" a "id" para mayor claridad.
  async validate(payload: any) {
    return { id: payload.sub, email: payload.email, rol: payload.rol };
  }
}