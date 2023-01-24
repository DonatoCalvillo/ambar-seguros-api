import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';


@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>
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

}


