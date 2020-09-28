// eslint-disable-next-line no-unused-vars
const Knex = require('knex');

const tableNames = require('../../src/constants/tableNames');
const {
  addDefaultColumns,
  createNameTable,
  link,
  email,
  references,
} = require('../../src/lib/tableUtils');

/**
 *  @param {Knex} knex
 */

exports.up = async (knex) => {
  await knex.schema.createTable(tableNames.country, (table) => {
    createNameTable(table);
    table.string('code', 10).notNullable().unique();
  });

  await knex.schema.createTable(tableNames.state, (table) => {
    createNameTable(table);
    table.string('abbreviation', 10);
    table.string('alpha_code', 5);
    references(table, tableNames.country);
  });

  await knex.schema.createTable(tableNames.address, (table) => {
    table.increments().notNullable();
    table.string('street_address_1', 50).notNullable();
    table.string('street_address_2', 50);
    table.string('city').notNullable();
    table.string('zip', 15).notNullable();
    table.float('latitude', 9, 7).notNullable();
    table.float('longitude', 9, 7).notNullable();
    references(table, tableNames.country);
    addDefaultColumns(table);
  });

  await knex.schema.createTable(tableNames.company, (table) => {
    table.increments().notNullable();
    table.string('name').notNullable();
    table.string('description', 1000);
    link(table, 'logo_url');
    link(table, 'website_url');
    email(table, 'email');
    references(table, tableNames.address);
    addDefaultColumns(table);
  });

  await knex.schema.createTable(tableNames.size, (table) => {
    createNameTable(table);
    table.decimal('length', 5, 2);
    table.decimal('width', 5, 2);
    table.decimal('height', 5, 2);
    table.decimal('volume', 5, 2);
    references(table, tableNames.shape);
    references(table, tableNames.unit);
  });

  await knex.schema.createTable(tableNames.item, (table) => {
    createNameTable(table);
    table.string('description', 2000);
    table.string('sku', 16).unique();
    table.boolean('sparks_joy').defaultTo(false).notNullable();
    references(table, tableNames.user);
    references(table, tableNames.item_type);
    references(table, tableNames.company);
    references(table, tableNames.size);
  });

  await knex.schema.createTable(tableNames.item_info, (table) => {
    table.increments().notNullable();
    table.decimal('price');
    table.date('purchase_date');
    table.date('expiration_date');
    table.date('last_used');
    references(table, tableNames.item);
    references(table, tableNames.user);
    references(table, tableNames.inventory_location);
    references(table, tableNames.company);
    addDefaultColumns(table);
  });

  await knex.schema.createTable(tableNames.item_image, (table) => {
    table.increments().notNullable();
    link(table, 'image_url');
    references(table, tableNames.item);
    addDefaultColumns(table);
  });

  await knex.schema.createTable(tableNames.related_item, (table) => {
    table.increments().notNullable();
    references(table, tableNames.item);
    references(table, tableNames.related_item);
    addDefaultColumns(table);
  });
};

exports.down = async (knex) => {
  await knex.schema.dropTable(tableNames.related_item);
  await knex.schema.dropTable(tableNames.item_image);
  await knex.schema.dropTable(tableNames.item_info);
  await knex.schema.dropTable(tableNames.item);
  await knex.schema.dropTable(tableNames.size);
  await knex.schema.dropTable(tableNames.company);
  await knex.schema.dropTable(tableNames.address);
  await knex.schema.dropTable(tableNames.state);
  await knex.schema.dropTable(tableNames.country);
};
