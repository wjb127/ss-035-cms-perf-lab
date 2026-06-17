import * as migration_20250929_111647 from './20250929_111647';
import * as migration_20260617_033534_add_landing_global from './20260617_033534_add_landing_global';

export const migrations = [
  {
    up: migration_20250929_111647.up,
    down: migration_20250929_111647.down,
    name: '20250929_111647',
  },
  {
    up: migration_20260617_033534_add_landing_global.up,
    down: migration_20260617_033534_add_landing_global.down,
    name: '20260617_033534_add_landing_global'
  },
];
