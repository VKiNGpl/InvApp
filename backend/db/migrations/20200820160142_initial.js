// eslint-disable-next-line no-unused-vars
const Knex = require('knex');

const tableNames = require('../../src/constants/tableNames');
const {
  addDefaultColumns,
  createNameTable,
  link,
  email,
} = require('../../src/lib/tableUtils');

/**
 *  @param {Knex} knex
 */

exports.up = async (knex) => {
  await Promise.all([
    knex.schema.createTable(tableNames.user, (table) => {
      table.increments().notNullable();
      email(table, 'email').notNullable().unique(); // max string length is 255 by default
      table.string('name').notNullable();
      table.string('password', 127).notNullable();
      table.datetime('last_login');
      addDefaultColumns(table);
    }),

    knex.schema.createTable(tableNames.item_type, (table) => {
      createNameTable(table);
    }),

    knex.schema.createTable(tableNames.shape, (table) => {
      createNameTable(table);
    }),

    knex.schema.createTable(tableNames.unit, (table) => {
      createNameTable(table);
    }),

    knex.schema.createTable(tableNames.inventory_location, (table) => {
      createNameTable(table);
      table.string('description', 1000);
      link(table, 'image_url');
    }),
  ]);
};

exports.down = async (knex) => {
  await Promise.all(
    [
      tableNames.inventory_location,
      tableNames.unit,
      tableNames.shape,
      tableNames.item_type,
      tableNames.user,
    ].map((tableName) => knex.schema.dropTable(tableName)),
  );
};
