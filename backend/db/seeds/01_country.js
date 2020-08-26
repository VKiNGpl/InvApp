// eslint-disable-next-line no-unused-vars
const Knex = require('knex');

const tableNames = require('../../src/constants/tableNames');
const countries = require('../../src/constants/countries');

/**
 *  @param {Knex} knex
 */

exports.seed = async (knex) => {
  await knex(tableNames.country)
    .insert(countries);
};
