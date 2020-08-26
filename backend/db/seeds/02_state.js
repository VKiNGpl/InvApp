// eslint-disable-next-line no-unused-vars
const Knex = require('knex');

const tableNames = require('../../src/constants/tableNames');
const states = require('../../src/constants/states');

/**
 *  @param {Knex} knex
 */

exports.seed = async (knex) => {
  await knex(tableNames.state)
    .insert(states);
};
