const { exit } = require("process");
const util = require('util');
const exec = util.promisify(require('child_process').exec);

export default async function setupTestDb() {
  try {
    const res = await exec(`DATABASE_URL=\"file:./test-db.sqlite\" yarn prisma migrate reset --force`)
  }
  catch (e) {
    console.error(e);
    console.log("Failed to create test database, sad.");
    exit(1);
  }
}
