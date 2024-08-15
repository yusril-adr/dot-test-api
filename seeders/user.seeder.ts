import { DataSource } from 'typeorm';
import {
  Seeder,
  // SeederFactoryManager
} from 'typeorm-extension';
import axios from 'axios';
import * as bcrypt from 'bcrypt';
import { config } from 'dotenv';
import { ConfigService } from '@nestjs/config';

import { User } from '@entities/user.entity';
import { CONFIG } from '@helpers/constants/config';

// Load .env file
config();

type DummyUser = Omit<User, 'id'> & {
  id?: number;
};

export default class UserSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    // factoryManager: SeederFactoryManager,
  ): Promise<void> {
    const configService = new ConfigService();
    const repository = dataSource.getRepository(User);
    const response = await axios.get(`${CONFIG.API_BASE_URL}/users`);
    const dummyPassword = bcrypt.hashSync(
      '12345678',
      parseInt(configService.get('SALT_ROUND')),
    );
    const dummyUser: DummyUser = {
      name: 'Test User',
      username: 'test-user',
      password: dummyPassword,
      email: 'test-user@gmail.com',
    };

    const dummyUsers: DummyUser[] = response.data.map((user: User) => {
      return {
        ...user,
        password: dummyPassword,
      };
    });

    dummyUsers.push(dummyUser);

    await repository.insert(dummyUsers);
  }
}
