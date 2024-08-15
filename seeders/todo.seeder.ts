import { DataSource } from 'typeorm';
import {
  Seeder,
  // SeederFactoryManager
} from 'typeorm-extension';
import axios from 'axios';

import { Todo } from '@entities/todo.entity';
import { User } from '@entities/user.entity';
import { CONFIG } from '@helpers/constants/config';

export default class TodoSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    // factoryManager: SeederFactoryManager,
  ): Promise<void> {
    const todoRepository = dataSource.getRepository(Todo);
    const userRepository = dataSource.getRepository(User);
    const response = await axios.get(`${CONFIG.API_BASE_URL}/todos`);

    const dummyTodos = await Promise.all(
      response.data.map(async (todo) => {
        const user = await userRepository.findOne({
          where: { id: todo.userId },
        });
        return {
          ...todo,
          user,
        };
      }),
    );
    await todoRepository.insert(dummyTodos);
  }
}
