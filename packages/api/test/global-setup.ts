const dotenv = require("dotenv");
const { join } = require("path");
const { exit } = require("process");
const util = require('util');
const exec = util.promisify(require('child_process').exec);
import {expect, jest, test} from '@jest/globals';

module.exports = async function setup() {
  try {
    const res = await exec(`yarn prisma migrate reset --force`)
  }
  catch (e) {
    console.error(e);
    console.log("Failed to create test database, sad.");
    exit(1);
  }
}
