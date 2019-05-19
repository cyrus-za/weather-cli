// @ts-ignore
import minimist from 'minimist';
import weather from './weather';
import { CommandLineArgs, MainFnParams } from './types';

async function main({ locations = [], units = 'Standard' }: MainFnParams) {
  async function getAndLogWeather(location) {
    const response = await weather(location, { units });
    console.log(response);
  }

  const promises = locations.map(l => getAndLogWeather(l));

  await Promise.all(promises);
}

function extractArgsFromCommandLine(): CommandLineArgs {
  const argAliases = {
    u: ['units', 'unit'],
    l: ['location', 'locations']
  };

  const argsString = process.argv.slice(2);

  return minimist<CommandLineArgs>(argsString, { alias: argAliases });
}

function validateArgs({ units }: CommandLineArgs) {
  if (Array.isArray(units)) {
    throw new Error('Please only specify one unit type');
  }
}

function formatLocationArgs({ l: locationFromArgs = [], _: unlinkedArgs }: CommandLineArgs) {
  const locationArgs = Array.isArray(locationFromArgs) ? locationFromArgs : [locationFromArgs];
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
