import { runSeeders } from 'typeorm-extension';
import datasource from '@app/typeorm.config';

(async () => {
  await datasource.initialize();

  await runSeeders(datasource);
})();
