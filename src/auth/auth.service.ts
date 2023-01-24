import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { IJwtPayload } from './interfaces/jwt-payload.interface';


@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,

    private readonly jwtService: JwtService
  ) {}

  async create(createUserDto: CreateUserDto) {
    
    try {
      const { email, password } = createUserDto
      
      const user = await this.userModel.create({ 
        email,
        password: bcrypt.hashSync( password, 10 )
      })

      return user;

    } catch (error) {
      if( error.code === 11000 ) {
        throw new BadRequestException(`User exist in the db ${JSON.stringify( error.keyValue )}`)
      }
      throw new InternalServerErrorException('Check the logs')
    }
  }

  async login(loginUserDto: LoginUserDto){
    const { email, password } = loginUserDto

    const user = await this.userModel.findOne({email})

    if( !user || !bcrypt.compareSync( password, user.password ) )
      throw new UnauthorizedException("Wrong credentials.")
          
    
    return {
      email: user.email,
      token: this.getJwtToken({email})
    }
  }

  private getJwtToken( payload: IJwtPayload ) {
    const token = this.jwtService.sign( payload )
    return token
  }
}


