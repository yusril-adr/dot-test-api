import { setSeederFactory } from 'typeorm-extension';
import { User } from '@entities/user.entity';
import { Todo } from '@entities/todo.entity';

export default setSeederFactory(Todo, (faker) => {
  const todo = new Todo();

  const userId = Math.round(Math.random() * 10);
  const user = new User();
  user.id = userId;

  todo.title = faker.word.words(5);
  todo.user = user;

  return todo;
});
