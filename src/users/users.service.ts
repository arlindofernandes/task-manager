import { ConflictException, Injectable } from '@nestjs/common';
import { UserDto } from './user.dto';
import { hashSync as bcryptHashSync } from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/db/entities/user.entities';
import { Repository } from 'typeorm';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly UserRepository: Repository<UserEntity>,
  ) {}

  async create(newUser: UserDto) {
    const userAlreadyRegistered = await this.findByUserName(newUser.username);

    if (userAlreadyRegistered) {
      throw new ConflictException(
        `User '${newUser.username}' already registered`,
      );
    }
    const saveUser = new UserEntity();
    saveUser.username = newUser.username;
    saveUser.passwordHash = bcryptHashSync(newUser.password, 10);

    const { id, username } = await this.UserRepository.save(saveUser);

    return { id, username };
  }

  async findByUserName(username: string): Promise<UserDto | null> {
    const userFound = await this.UserRepository.findOne({
      where: { username },
    });

    if (!userFound) {
      return null;
    } else {
      return {
        id: userFound.id,
        username: userFound.username,
        password: userFound.passwordHash,
      };
    }
  }
}
