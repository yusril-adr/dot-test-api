import { setSeederFactory } from 'typeorm-extension';
import { User } from '@entities/user.entity';

export default setSeederFactory(User, (faker) => {
  const firstName = faker.person.firstName('male');
  const user = new User();
  user.name = firstName;
  user.email = faker.internet.email({ firstName });
  user.username = faker.internet.userName({ firstName });
  return user;
});
