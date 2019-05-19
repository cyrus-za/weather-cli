import minimist from 'minimist';
import weather, { Units } from './weather';

async function main({ location, units = 'Standard' as Units }) {
  const response = await weather(location, { units });
  console.log(response);
}

if (require.main === module) {
  const { location, units } = minimist(process.argv.slice(2));
  main({ location, units })
    .catch((e: Error) => {
      console.error(e);
      process.exit(1);
    })
    .then(() => {
      process.exit();
    });
}

export default main;
