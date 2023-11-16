async function up(knex) {
    // users table
    await knex.schema.withSchema('public').createTable('users', function (t) {
        t.specificType('id', 'serial').primary().comment('Primary key');

        t.specificType('username', 'varchar').notNullable().comment('Username');

        t.specificType('role', 'varchar').notNullable().comment('Role of user');

        t.specificType('created_at', 'timestamp').comment(
            'Timestamp when this user was created in the system'
        );

        t.unique('username');
    });

    // classrooms table
    await knex.schema
        .withSchema('public')
        .createTable('classrooms', function (t) {
            t.specificType('id', 'serial').primary().comment('Primary key');

            t.specificType('name', 'varchar')
                .notNullable()
                .comment('Name of classroom');

            t.specificType('created_at', 'timestamp').comment(
                'Timestamp when this class was created in the system'
            );

            t.specificType('created_by', 'int')
                .references('id')
                .inTable('users')
                .notNullable()
                .comment('Tutor user id who created this classroom');
        });

    // classroom - students mapping table
    await knex.schema
        .withSchema('public')
        .createTable('classrooms_students', function (t) {
            t.specificType('id', 'serial').primary().comment('Primary key');

            t.specificType('created_at', 'timestamp').comment(
                'Timestamp when this student was added in this class'
            );

            t.specificType('classroom_id', 'int')
                .references('id')
                .inTable('classrooms')
                .notNullable()
                .onDelete('cascade')
                .comment('Classroom id . FK');

            t.specificType('student_user_id', 'int')
                .references('id')
                .inTable('users')
                .notNullable()
                .comment('Student user id who is added to this classroom');

            t.unique(['classroom_id', 'student_user_id']);
        });

    // classroom - files mapping table
    await knex.schema
        .withSchema('public')
        .createTable('classrooms_files', function (t) {
            t.specificType('id', 'serial').primary().comment('Primary key');

            t.specificType('created_at', 'timestamp').comment(
                'Timestamp when this student was added in this class'
            );

            t.specificType('classroom_id', 'int')
                .references('id')
                .inTable('classrooms')
                .notNullable()
                .onDelete('cascade')
                .comment('Classroom id . FK');

            t.specificType('title', 'varchar')
                .notNullable()
                .comment('Title of file');

            t.specificType('description', 'varchar')
                .notNullable()
                .comment('Description of file');

            t.specificType('created_by', 'int')
                .references('id')
                .inTable('users')
                .notNullable()
                .comment('Tutor user id who uploaded this file');

            t.specificType('type', 'varchar')
                .notNullable()
                .comment('Type of file');

            t.specificType('url', 'varchar')
                .notNullable()
                .comment('Url of file');

            t.unique(['classroom_id', 'title']);
        });
}

async function down(knex) {
    await knex.schema.dropTable('classrooms_files');
    await knex.schema.dropTable('classrooms_students');
    await knex.schema.dropTable('classrooms');
}

export { up, down };
