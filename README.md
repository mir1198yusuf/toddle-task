# Toddle interview backend task

### Hosted on

-   The live url of backend is - https://toddle-task.ddns.net . This is the base url of hosted version (like http://localhost:3000 is for local version). It will redirect to postman collection (more details in below section)
-   Hosted on EC2 t2.micro
-   Used Nginx as reverse proxy running on same instance and added TLS on it
-   Postgres db is also running on same instance

### Before running locally

-   Make sure Node.js 14+ & Postgres server is installed & Postgres server is running.
-   The project migrations will create the database as well, so it will first connect to default `postgres` database. Make sure that `postgres` database is not deleted & user have access to connect to `postgres` database & access to create-database.
-   Why create-database access needed ? To make it easier for reviewer to run all migrations (including database) in one-command, else reviewer would need to manually create a database first & then run table migrations.
-   How to check if user can connect to `postgres` db : run `psql -h <domain> -d postgres -U <user>`.
-   If you want to create a new user : run within `psql` following commands : `CREATE ROLE appuser;` => `alter role appuser with login;` => `alter user appuser createdb;` => `alter user appuser with password 'stongPass';` => Your user is ready, test with above command.

### How to run locally

-   Once you are at root of this project, do `npm install`
-   run `cp sample.env .env`
-   Populate `.env` with required values. Please do not change `DB_DATABASE` value.
-   run `node db/migrate.db.js` to run all the migrations. It will create database. and its tables.
-   run `npm run dev` to start the node server

### Postman Collection

-   The collection is public [here](https://www.postman.com/ym-356609/workspace/ym-team/collection/16305790-832c639b-bd7a-4e8d-ae20-4caa83107411?action=share&creator=16305790) . Fork it to your account to run it, also fork both the environments `toddle-local` and `toddle-ec2` avaiable in Environment section of same link.
-   If you are testing locally, use `toddle-local` postman environment. To test hosted version, use `toddle-ec2` postman environment. This will properly set the `url` variable of collection requests.
-   The collection's documentation can be found [here](https://www.postman.com/ym-356609/workspace/ym-team/documentation/16305790-832c639b-bd7a-4e8d-ae20-4caa83107411)
-   On running the auth-jwt api (of student or tutor), collection variable `tutor_jwt` or `student_jwt` will be automatically set and used for all future tutor/student apis. You can verify this in Headers section of each request.

### Database schema diagram

-   Please note as this is assignment, only minimum required fields are used, in real-world, each table would have many meaningful fields.
-   Schema diagram can be found [here](https://drive.google.com/file/d/1fnWHnXkUHoHBziLjimchd73du1tU--5G/view)

### File storage

-   To make it easier for reviewer to run locally, uploaded files are stored on server directly. (Else reviewer would need to create his/her own S3 bucket, generate access keys & use them locally)
-   Ideally in production, we would be storing the files on S3 or similar & deal with signed-urls as needed

### Report issues

-   I have verified all steps of running server, file permission, postman collection permission, etc to make sure that the review process is seamless.
-   However, in case I missed something or you are facing any issue in review process, please do let me know & I will assist quickly.
-   I covered almost all of the test cases, in case any is missed, please let me know, I will fix them too.
-   In case you want to review the data in remote hosted Postgres database for verification, please let me know. Will share the credentials (so you can connect via any of client like PgAdmin, etc) or I can show the data on a call.

### Cleanup steps

-   Once the review is done, to delete all database changes, run `node db/rollback.db.js`
-   Delete the code files.
-   If you had fork the postman collection, you can delete that as well.

Thanks for reading this 😄
