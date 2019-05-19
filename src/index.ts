import weather from './weather';

async function main(location) {
  const response = await weather(location);
  console.log(response);
}

if (require.main === module) {
  const location = process.argv[2];
  main(location)
    .catch((e: Error) => {
      console.error(e);
      process.exit(1);
    })
    .then(() => {
      process.exit();
    });
}

export default main;
