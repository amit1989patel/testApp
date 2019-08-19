
exports.up = function(knex, Promise) {
    return knex
    .schema
    .createTable('users', (table) => {
      table
        .increments('id')
        .unsigned()
        .primary();
      table
        .string('name')
        .notNull();
      table
        .string('email')
        .notNull();
      table
        .string('password')
        .notNull();
      table
        .enu('status', ['Active', 'Deactivated', 'Deleted'])
        .notNull()
        .defaultTo('Active');
      table
        .dateTime('createdAt')
        .notNull();
      table
        .dateTime('updatedAt')
        .nullable()
        .defaultTo(new Date());
      table
        .dateTime('deletedAt')
        .nullable();
    })
};

exports.down = function(knex, Promise) {
  return knex
  .schema
  .dropTable('users');
};


