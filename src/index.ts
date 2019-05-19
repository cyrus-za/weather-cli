import minimist from 'minimist';
import weather, { Units } from './weather';

async function main({ locations = [] as (string | number)[], units = 'Standard' as Units }) {
  async function getAndLogWeather(location) {
    const response = await weather(location, { units });
    console.log(response);
  }

  const promises = locations.map(l => getAndLogWeather(l));

  await Promise.all(promises);
}

if (require.main === module) {
  const { l: locationFromArga = [], units, _: unauthorizedArgs } = minimist(process.argv.slice(2), {
    alias: {
      u: ['units', 'unit'],
      l: ['location', 'locations']
    }
  });
  if (Array.isArray(units)) {
    throw new Error('Please only specify one unit type');
  }

  const locationArgs = Array.isArray(locationFromArga) ? locationFromArga : [locationFromArga];
  const locations = [...locationArgs, ...unauthorizedArgs];

  main({ locations, units })
    .catch((e: Error) => {
      console.error(e);
      process.exit(1);
    })
    .then(() => {
      process.exit();
    });
}

export default main;
