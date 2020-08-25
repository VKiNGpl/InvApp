// eslint-disable-next-line no-unused-vars
const Knex = require('knex');

const tableNames = require('../../src/constants/tableNames');

function addDefaultColumns(table) {
  table.timestamps(false, true); // this is the same as next two lines
  // table.datetime('created_at').notNullable().default(Knex.fn.now());
  // table.datetime('updated_at').notNullable().default(Knex.fn.now());
  table.datetime('deleted_at');
}

function createNameTable(table) {
  table.increments().notNullable();
  table.string('name').notNullable().unique();
  addDefaultColumns(table);
}

function references(table, tableName) {
  table
    .integer(`${tableName}_id`)
    .unsigned()
    .references('id')
    .inTable(tableName)
    .onDelete('cascade');
}

function link(table, columnName) {
  table.string(columnName, 2000);
}

function email(table, columnName) {
  return table.string(columnName, 254);
}

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

    knex.schema.createTable(tableNames.inventory_location, (table) => {
      createNameTable(table);
      table.string('description', 1000);
      link(table, 'image_url');
    }),

    knex.schema.createTable(tableNames.country, (table) => {
      createNameTable(table);
      table.string('code', 10).notNullable().unique();
    }),

    knex.schema.createTable(tableNames.state, (table) => {
      createNameTable(table);
      table.string('code', 10).notNullable();
      references(table, 'country');
    }),
  ]);

  await knex.schema.createTable(tableNames.address, (table) => {
    table.increments().notNullable();
    table.string('street_address_1', 50).notNullable();
    table.string('street_address_2', 50);
    table.string('city').notNullable();
    table.string('zip', 15).notNullable();
    table.float('latitude', 5).notNullable();
    table.float('longitude', 5).notNullable();
    references(table, 'state');
  });

  await knex.schema.createTable(tableNames.company, (table) => {
    table.increments().notNullable();
    table.string('name').notNullable();
    table.string('description', 1000);
    link(table, 'logo_url');
    link(table, 'website_url');
    email(table, 'email');
    references(table, 'address');
  });
};

exports.down = async (knex) => {
  await Promise.all(
    [
      tableNames.company,
      tableNames.address,
      tableNames.state,
      tableNames.country,
      tableNames.user,
      tableNames.item_type,
      tableNames.shape,
      tableNames.inventory_location,
    ].map((tableName) => knex.schema.dropTable(tableName)),
  );
};
