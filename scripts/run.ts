import { generateRandomHash } from './randomHash';

async function main() {
  console.log(await generateRandomHash());
}

main();
