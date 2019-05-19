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

function extractArgsFromCommandLine() {
  return minimist(process.argv.slice(2), {
    alias: {
      u: ['units', 'unit'],
      l: ['location', 'locations']
    }
  });
}

function validateArgs({ units }) {
  if (Array.isArray(units)) {
    throw new Error('Please only specify one unit type');
  }
}

function formatLocationArgs({ l: locationFromArga = [], _: unlinkedArgs }) {
  const locationArgs = Array.isArray(locationFromArga) ? locationFromArga : [locationFromArga];
  return [...locationArgs, ...unlinkedArgs];
}

if (require.main === module) {
  const args = extractArgsFromCommandLine();

  validateArgs(args);

  const locations = formatLocationArgs(args);

  main({ locations, units: args.units })
    .catch((e: Error) => {
      console.error(e);
      process.exit(1);
    })
    .then(() => {
      process.exit();
    });
}

export default main;
