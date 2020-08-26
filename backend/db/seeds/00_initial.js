const crypto = require('crypto');
const bcrypt = require('bcrypt');
// eslint-disable-next-line no-unused-vars
const Knex = require('knex');

const tableNames = require('../../src/constants/tableNames');
const orderedTableNames = require('../../src/constants/orderedTableNames');

/**
 *  @param {Knex} knex
 */

exports.seed = async (knex) => {
  await orderedTableNames
    .reduce(async (promise, table_name) => {
      await promise;
      console.log('Clearing', table_name);
      return knex(table_name).del();
    }, Promise.resolve());

  const password = crypto.randomBytes(15).toString('hex');

  const user = {
    email: 'binaryvking@gmail.com',
    name: 'VKiNG',
    password: await bcrypt.hash(password, 12),
  };

  const [createdUser] = await knex(tableNames.user)
    .insert(user)
    .returning('*');

  console.log('User created:', {
    password,
  }, createdUser);
};
