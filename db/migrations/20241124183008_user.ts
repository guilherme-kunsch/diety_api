import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('user', function(table) {
        table.uuid('id').primary()
        table.string('name', 50).notNullable()
        table.string('surname', 50).notNullable()
        table.string('email', 100).notNullable().unique()
        table.string('session_id').notNullable().unique()
    })
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('user')
}

