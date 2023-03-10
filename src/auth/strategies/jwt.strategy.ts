import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { UnauthorizedException } from '@nestjs/common';
import { Injectable } from "@nestjs/common";

import { Repository } from "typeorm";

import { ExtractJwt, Strategy } from "passport-jwt";


import { IJwtPayload } from '../interfaces/jwt-payload.interface';
import { User } from "../entities/user.entity";

@Injectable()
export class JwtStrategy extends PassportStrategy( Strategy ) {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    configService: ConfigService
  ){
    super({
      secretOrKey: configService.get('JWT_SECRET'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    })
  }

  async validate (payload: IJwtPayload): Promise<User> {
    const { email } = payload

    const user = await this.userRepository.findOneBy({ email })

    if( !user )
      throw new UnauthorizedException('Token no valido')

    return user;
  }

}