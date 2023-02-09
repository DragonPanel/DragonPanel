module.exports = async function setup() {
  process.env.DATABASE_URL = `file:./test-db.sqlite`;
}
