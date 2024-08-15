import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@entities/user.entity';

@Injectable()
export class UserV1Service {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(
    data: Omit<User, 'id'> & {
      id?: number;
    },
  ): Promise<User> {
    const createdUser = this.userRepository.create(data);
    return await this.userRepository.save(createdUser);
  }

  async find(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findById(id: number): Promise<User> {
    return await this.userRepository.findOne({ where: { id } });
  }

  async findOne(params: Partial<User>): Promise<User> {
    return await this.userRepository.findOne({ where: params });
  }

  async findByUserName(name: string): Promise<User> {
    return await this.userRepository.findOne({ where: { name } });
  }

  async findByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne({ where: { email } });
  }

  async findByIdentifier(identifier: string): Promise<User> {
    return await this.userRepository.findOne({
      where: [
        {
          username: identifier,
        },
        { email: identifier },
      ],
    });
  }

  async saveToDb(data: User): Promise<User> {
    await this.userRepository.save(data);
    return data;
  }

  async delete(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }
}
