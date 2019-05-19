// @ts-ignore
import weather from './weather';

const location = process.argv[2];

async function main() {
  const response = await weather(location);
  console.log(`Weather in ${location} is currently ${response}`);
}

main()
  .catch((e: Error) => {
    console.error(e);
    process.exit(1);
  })
  .then(() => {
    process.exit();
  });
