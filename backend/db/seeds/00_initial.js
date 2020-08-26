const bcrypt = require('bcrypt');

exports.seed = async (knex) => {
  await knex('table_name').del(); // Deletes ALL existing entries
  // Inserts seed entries
  await knex('table_name').insert([
    { id: 1, colName: 'rowValue1' },
    { id: 2, colName: 'rowValue2' },
    { id: 3, colName: 'rowValue3' },
  ]);
};
