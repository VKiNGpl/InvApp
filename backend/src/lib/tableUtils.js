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

function references(table, tableName, notNullable = true) {
  const definition = table
    .integer(`${tableName}_id`)
    .unsigned()
    .references('id')
    .inTable(tableName)
    .onDelete('cascade');

  if (notNullable) {
    definition.notNullable();
  }
}

function link(table, columnName) {
  table.string(columnName, 2000);
}

function email(table, columnName) {
  return table.string(columnName, 254);
}

module.exports = {
  addDefaultColumns,
  createNameTable,
  link,
  email,
  references,
};
