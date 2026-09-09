CH1 - L1

Welcome to Learn SQL

![alt text](sql_logos.png)

Welcome to this comprehensive course on SQL: Structured Query Language! Whether you're interested in working with PostgreSQL, MySQL, SQLite, or any other SQL database, this course will teach you the language you need to master them.

Let's Build a Payment App
In this course, we'll work on the database for a make-believe PayPal-clone called CashPal! We'll write queries that interact with users, transactions, payouts, and so on.

Assignment
The code to the right is a simple query that returns ("selects") all the rows and columns from a "people" table – but there's a problem! The table we're trying to use is called users, not people!

Fix the bug by changing "people" to "users" in the query, then submit your answer.

SELECT * FROM users;


CH1 - L2

Select Single Column
Databases are made up of tables which are made up of columns (AKA "fields"). It's just like an Excel spreadsheet.

Our CashPal database has a users table with these columns:

id (integer)
name (string)
age (integer)
balance (float)
is_admin (boolean: true/false)
There can be many records (rows) in this table, each representing a single user. For example, here are three user rows:

id	name	age	balance	is_admin
1	John Smith	28	450	1
2	Darren Walker	27	200	1
3	Jane Morris	33	496.24	0
In the last lesson, we used the * wildcard to get all the columns. To select only a single column, we simply swap out the * for the name of the column.

Returns all columns from the users table:

SELECT * FROM users;

Returns only the name column from the users table:

SELECT name FROM users;

Assignment
Update the query to only select the age column from the users table.

SELECT age FROM users;


CH1 - L3

Select Multiple Columns
As you probably guessed, if you can select all columns with a *, and you can select a single column by name, you can probably also select multiple columns by name. Here's the syntax:

select column_one, column_two, column_three from table_name;

For example, if I had a table of monster records for a game, I might write:

select health, damage, defense from monsters;

All SQL statements must end with a semicolon ;.

Assignment
Update the query to select the:

age
name
balance
columns in that order.

Remember, our users table in CashPal has this schema:

id	name	age	balance	is_admin
1	John Smith	28	450	1
2	Darren Walker	27	200	1
3	Jane Morris	33	496.24	0

SELECT age, name, balance FROM users;


CH1 - L4

What Is SQL?
Structured Query Language, or SQL (pronounced "squeel" by the in-crowd), is the primary programming language used to manage and interact with relational databases. SQL can perform operations like creating, updating, reading, and deleting records within a database.


Generally speaking, SQL is extremely powerful and programmable. While spreadsheets are great for simple manual data manipulation, SQL is designed for automated and scalable data operations. It can handle large datasets, complex queries, and integrate easily with general purpose programming languages like Python, TypeScript, and Go.


Which would you most likely use to keep track of your personal taxes and budget?

1

An abacus

2

An Excel or Google Sheets spreadsheet

3

A highly scalable SQL database


Which would you most likely use to store student records for an online school?

1

Your fingers and toes

2

An Excel or Google Sheets spreadsheet

3

A Turing machine with miles and miles of tape

4

A SQL database


CH1 - L5

Which Databases Use SQL?
SQL is just a query language. You typically use it to interact with a specific database technology. For example:

SQLite
PostgreSQL
MySQL
CockroachDB
Oracle
etc.
Although many different databases use the SQL language, most of them will have their own dialect. It's critical to understand that not all databases are created equal. Just because one SQL-compatible database does things a certain way, doesn't mean every SQL-compatible database will follow those exact same patterns.

We're Using SQLite
In this course, we'll be using SQLite specifically. SQLite is great for embedded projects, web browsers, and toy projects. It's lightweight, but has limited functionality compared to the likes of PostgreSQL or MySQL – two of the more common production SQL technologies.

We'll point out to you whenever some functionality we're working with is unique to SQLite!

Assignment
One way in which SQLite is a bit different is that it stores Boolean values as integers – the integers 0 and 1.

0 = false
1 = true
Our users table has a Boolean is_admin column to store whether a user is an admin or not. Write a query to see how this boolean field is actually represented in the results.

Select all of the ids, names, and is_admin flags from the users table.

SELECT id, name, is_admin FROM users;



CH1 - L6

NoSQL vs. SQL
When talking about SQL databases, we also have to mention the elephant in the room: NoSQL.

To put it simply, a NoSQL database is a database that does not use SQL (Structured Query Language). Each NoSQL database system typically has its own way of writing and executing queries. For example, MongoDB uses MQL (MongoDB Query Language), and ElasticSearch simply has a JSON API.

While most relational databases are fairly similar, NoSQL databases tend to be fairly unique and are used for more niche purposes. Some of the main differences between SQL and NoSQL databases are:

NoSQL databases are usually non-relational; SQL databases are usually relational (we'll talk more about what this means later).
SQL databases usually have a defined schema; NoSQL databases usually have a dynamic schema.
SQL databases are table-based; NoSQL databases have a variety of different storage methods, such as document, key-value, graph, wide-column, and more.
Types of NoSQL Databases
Document Database
Key-Value Store
Wide-Column
Graph
A few of the most popular NoSQL databases are:

MongoDB
Cassandra
CouchDB
DynamoDB
ElasticSearch




Question 1
Correct
Each NoSQL Database tends to use ____ query language(s)

1

the same

2

different


Question 2
Correct
____ compatible databases tend to be more similar in their functionality than ____ databases

1

SQL, NoSQL

2

NoSQL, SQL



CH1 - L7

Comparing SQL Databases
Let's dive deeper and talk about some of the well-established SQL database systems and what makes them different from one another. The most popular SQL databases right now include:

PostgreSQL
MySQL
Microsoft SQL Server
SQLite
And many others
Source: db-engines.com

While all of these Databases use SQL, each database defines specific rules, practices, and strategies that separate them from their competitors.

SQLite vs. PostgreSQL
Personally, SQLite and PostgreSQL are my favorites from the list above. Postgres is a very powerful, open-source, production-ready SQL database. SQLite is a lightweight, embeddable, open-source database. I usually choose one of these technologies if I'm doing SQL work.

SQLite is a serverless database management system (DBMS) that has the ability to run within applications, whereas PostgreSQL uses a client-server model and requires a server to be installed and listening on a network, similar to an HTTP server.

See a full comparison here.

We Use SQLite in This Course
In this course, we will be working with SQLite, a lightweight and simple database. For most backend web servers, PostgreSQL is a more production-ready option, but SQLite is great for learning and for small systems.

Assignment
Let's take a look at how SQLite does not enforce type-checking. Notice that within the CREATE TABLE statement, name is defined as a TEXT field.

Run the code and take a look at the results (don't submit yet!).
On line 3, change the text string 'Montgomery Burns' to the integer 1, and run the code again.
Notice how even though we defined name as a TEXT field, SQLite allowed us to use an integer! Like Python and JavaScript, SQLite has a loose type system... You can store any type of data in any field, regardless of how you defined it. Remember: just because you can do something, doesn't mean you should!

To pass the assignment, submit the code in the altered state, where the record with an id of 2 has a name of 1.


CREATE TABLE users (id INTEGER, name TEXT, age INTEGER);
INSERT into users (id, name, age) values (1, 'John Doe', 21);
INSERT into users (id, name, age) values (2, '1', 33);
SELECT * FROM users;



Capitulo 2

Titulo: Creating a Table
To create a new table in a database, use the CREATE TABLE statement followed by the name of the table and the fields you want in the table.

CREATE TABLE employees (id INTEGER, name TEXT, age INTEGER, is_manager BOOLEAN, salary INTEGER);

Each field name is followed by its datatype. We'll get to data types in a minute.

It's also acceptable and common to break up the CREATE TABLE statement with some whitespace like this:

CREATE TABLE employees(
  id INTEGER,
  name TEXT,
  age INTEGER,
  is_manager BOOLEAN,
  salary INTEGER
);

Assignment
Let's begin building a table for the CashPal database! Create the people table with the following fields:

id – INTEGER
tag – TEXT
name – TEXT
age – INTEGER
balance – REAL
is_admin – BOOLEAN

Exemplo para resolverem CREATE TABLE people(
  id INTEGER,
  tag TEXT,
  name TEXT,
  age INTEGER,
  balance REAL,
  is_admin BOOLEAN
);

2.1

Create Table Practice
In most relational databases, a single table isn't enough to hold all the data we need! We usually create a table-per-entity. For example, a social media application might have the following tables:

users
posts
comments
likes
Assignment
We need a table that tracks the transactions between our CashPal users.

Create the transactions table with the following fields:

id – INTEGER
recipient_id – INTEGER
sender_id – INTEGER
note – TEXT
amount – REAL

2.2

Altering Tables
We often need to alter our database schema without deleting it and re-creating it. Imagine if Twitter deleted its database each time it needed to add a feature, that would be a disaster! Your account and all your tweets would be wiped out on a daily basis.

Instead, we can use the ALTER TABLE statement to make changes in place without deleting any data.

ALTER TABLE
With SQLite an ALTER TABLE statement allows you to:

1. Rename a Table or Column
ALTER TABLE employees
RENAME TO contractors;

ALTER TABLE contractors
RENAME COLUMN salary TO invoice;

2. Add or Drop a Column
ALTER TABLE contractors
ADD COLUMN job_title TEXT;

ALTER TABLE contractors
DROP COLUMN is_manager;

Unlike some SQL databases, SQLite does not support performing multiple operations (like adding multiple columns) in a single ALTER TABLE statement. Each change must be made in a separate ALTER TABLE command.

Assignment
We need to make some changes to the people table! At the moment, we have these six columns (shown as rows, so we can display datatypes):

CID	NAME	TYPE	NOTNULL	DFLT VALUE	PK
0	id	INTEGER	0		0
1	tag	TEXT	0		0
2	name	TEXT	0		0
3	age	INTEGER	0		0
4	balance	REAL	0		0
5	is_admin	BOOLEAN	0		0
Rename the table to users.
In users, rename the tag column to username.
In users, add the password (TEXT) column.

2.4

Intro to Migrations
A database migration is a change to the structure of a relational database. You can think of it like a commit in Git, but for your database schema. Every migration records how the structure of your data evolves over time.

For example, when we previously used an ALTER TABLE statement to add a new column, we were performing a migration.

Migrations are essential for adapting your database to changing requirements, fixing mistakes, and rolling out new features. In a team setting, migrations ensure everyone applies the same changes in the same order.

Good migrations are small, incremental and ideally reversible changes to a database. As you can imagine, when working with large databases, making changes can be scary! We have to be careful when writing database migrations so that we don't break any systems that depend on the old database schema.

Click to hide video

Example of a Bad Migration
Let's say the CashPal backend runs this SQL regularly:

SELECT * FROM people;

If we rename the table from people to users in a migration but forget to update the code, this query will break because the people table no longer exists.

A Safer Approach
Roll out schema and application changes in backward-compatible phases. Keep the old schema available until no running code depends on it.


Which of the following statements about migrations is FALSE?

1

You can be fast and loose when writing migrations - a bad migration is easy to fix

2

Well-written migrations are reversible

3

Migrations are incremental changes made to a database

4

A good migration takes into account any systems that rely on the existing schema

2.5

Up Migration
To manage migrations, we use a simple system based on up and down directions.

The up migration applies changes to move your schema forward.
The down migration rolls those changes back to the previous state.
This allows developers to safely move between versions of the schema during development and production rollouts.

Let's write the SQL for an up migration to add new features to our database.

Assignment
We're going to add more columns to the transactions table. We need to know whether or not each transaction between two users was successfully completed. Our database should also track the type of transaction.

The transactions table looks like this at the moment:

cid	name	type	notnull	dflt_value	pk
0	id	INTEGER	0		0
1	recipient_id	INTEGER	0		0
2	sender_id	INTEGER	0		0
3	note	TEXT	0		0
4	amount	REAL	0		0
Complete the following SQL statements in this order:

Add the BOOLEAN column was_successful to the transactions table.
Add the TEXT column transaction_type to the transactions table.
BOOL is technically valid, but the assignment expects BOOLEAN – so use BOOLEAN instead of BOOL to pass.

2.6

Down Migration
The migration we applied ended up causing trouble in production! It's possible the app wasn't ready for the new columns.

In situations like this, we need to roll back the changes safely using a down migration.

Why Down Migrations Matter
Down migrations allow us to:

Undo changes introduced by an up migration
Quickly recover from bugs or compatibility issues in production
Keep our schema consistent across environments (local, staging, production)
A well-written down migration should completely reverse the changes made in the up migration. In our case, that means removing the two columns we just added.

For example, to remove a column you can use the DROP COLUMN command:

ALTER TABLE users
DROP COLUMN email;

Click to hide video

Assignment
Complete the following down migration:

Drop the was_successful column from the transactions table.
Drop the transaction_type column from the transactions table.
This will revert the schema to the original state.

2.7

Migration Review
Let's look at a more realistic migration that reflects a common evolution.

Example
The projects table is being renamed to initiatives to better reflect how teams plan and track long-term work.

We also want to record when each initiative officially launched.

Up migration:

ALTER TABLE projects RENAME TO initiatives;

ALTER TABLE initiatives
ADD COLUMN launched_at TIMESTAMP;

Down migration:

ALTER TABLE initiatives DROP COLUMN launched_at;

ALTER TABLE initiatives RENAME TO projects;

This pair of migrations is reversible and safe. If something breaks, we can undo it.

Real World Migration Tools
In real-world projects, we don't run raw SQL migrations. We use tools that help:

Track which migrations have been applied.
Organize migrations in files.
Apply and roll back safely.
Popular Tools
Tool	Language	Notes
Goose	Go	Native Go tool
Flyway	Java, etc.	Simple file-based
Liquibase	Java	More config-heavy
Alembic	Python	For SQLAlchemy
Prisma Migrate	TypeScript	Works with Prisma ORM
Drizzle Kit	TypeScript	Works with Drizzle ORM
Example Workflow With a Tool
This will vary according to the tool you use.

Write migration files.
001_add_columns_to_transactions.up.sql
001_add_columns_to_transactions.down.sql
Apply them using a CLI:
migrate up

Your tool logs which migrations ran, and prevents duplicate migrations.
Version Control for Your Schema
Migration files are committed like code. They travel with your project, so your teammates and CI systems always apply the same schema changes in the right order.


Why are 'good' migrations written in a reversible manner?

1

They're not

2

So that if something goes wrong, the changes can be rolled back

3

Because you should always roll back changes before applying new ones


Will database migrations often be coupled with application code updates?

1

Yes

2

No

2.8

SQLite Data Types
Let's go over the data types supported by SQLite and how they're stored.

NULL – Null value.
INTEGER – Signed integer stored in 0, 1, 2, 3, 4, 6, or 8 bytes.
REAL – Floating-point value stored as a 64-bit IEEE floating-point number.
TEXT – Text string stored using the database encoding, most commonly UTF-8.
BLOB – Short for Binary Large Object and typically used for images, audio, or other multimedia.
BOOLEAN – Boolean values are written in SQLite queries as true or false, but are recorded as 1 or 0.
You may notice that we use the REAL data type in this course for some fields representing currency amounts. This is for simplicity.

In the real world, to avoid problems with floating-point math, the best practice is to use INTEGER for currency amounts. The value then represents the smallest denomination. For example, $42.67 would be stored as 4267 (cents).

Boolean Values
It's important to note, SQLite does not have a separate BOOLEAN storage class. Instead, boolean values are stored as integers:

0 = false
1 = true
It's not actually all that weird – boolean values are just binary bits after all!

SQLite will let you write your queries using boolean expressions and true/false keywords, but it will convert the booleans to integers under-the-hood.

2.9

Practice – Posts Table
You're working on CashPal's latest social media feature named "CashPal Chatter," which aims to revolutionize financial discussions online. Users can make a typical social media post that contains a picture of their latest purchase along with text and some other information. You've been assigned to create the new "posts" table.

Assignment
Write an SQL statement to create a new table named posts, which should contain the following columns:

id
image_url
description
author_id
is_sponsored
Use data types that make the most sense given the column name. For ID columns, assume we can just use INTEGER.

2. 10

Practice – Posts Table Migration
CashPal Chatter is a huge hit! After several weeks of use, the engineers at CashPal have decided that some changes need to be made to our posts table. You've been asked to write an up migration to alter the table.

Assignment
Write an up migration for the posts table that achieves the following:

The author_id column should be renamed to poster_id.
Add a new column named is_edited with a BOOLEAN type.
DROP the is_sponsored column.


CAPITULO 3

Null Values
In SQL, a cell with a NULL value indicates that the value is missing. A NULL value is very different from a zero value.

Constraints
When creating a table, we can define whether or not a field can or cannot be NULL, and that's a kind of constraint.

We will cover constraints in more detail soon; for now, let's focus on NULL values.

Assignment
We didn't force any constraints on our tables when we created them, and it has allowed for NULL entries to make their way into our table! Let's take a look at our transactions table to see what those NULL values look like.

Write a query to SELECT all fields on all records in the transactions table.

Observe
Notice that both the transaction_type and was_successful fields have NULL values in all 3 records in the table (nulls are represented by blank cells in our system). That's because we ran our migration in the previous exercise after the 3 records were created!

Tip
Use the * (wildcard) syntax to select all fields.

3.1

Constraints
A constraint is a rule we create on a database that enforces some specific behavior. For example, setting a NOT NULL constraint on a column ensures that the column will not accept NULL values.

If we try to insert a NULL value into a column with the NOT NULL constraint, the insert will fail with an error message. Constraints are extremely useful when we need to ensure that certain kinds of data exist within our database.

Defining a NOT NULL Constraint
The NOT NULL constraint can be added directly to the CREATE TABLE statement.

CREATE TABLE employees(
  id INTEGER PRIMARY KEY,
  -- The PRIMARY KEY constraint uniquely identifies each row in the table
  name TEXT UNIQUE,
  -- The UNIQUE constraint ensures that no two rows can have the same value in the 'name' column
  title TEXT NOT NULL
  -- The NOT NULL constraint ensures that the 'title' column cannot have NULL values
);

SQLite Limitation
In other dialects of SQL you can ADD CONSTRAINT within an ALTER TABLE statement. SQLite does not support this feature so when we create our tables we need to make sure we specify all the constraints we want! Here's a list of SQL Features SQLite does not implement in case you're curious.

Assignment
Thankfully all the tables we have created for CashPal up to this point have been for testing purposes! Now that we have a better understanding of constraints, let's rebuild our database with the proper constraints and tables.

Create the users table with the following fields and constraints:

id – INTEGER, PRIMARY KEY
name – TEXT, NOT NULL
age – INTEGER, NOT NULL
country_code – TEXT, NOT NULL
username – TEXT, UNIQUE, NOT NULL
password – TEXT, NOT NULL
is_admin – BOOLEAN

3.2

Primary Keys
A key defines and protects relationships between tables. A primary key is a special column that uniquely identifies records within a table. Each table can have one, and only one primary key.

The Primary Key Is Usually an ID
It's very common to have a column named id on each table in a database, and that id is the primary key for that table. No two rows in that table can share an id.

A PRIMARY KEY constraint can be explicitly specified on a column to ensure uniqueness, rejecting any inserts where you attempt to create a duplicate ID.

Assignment
Run the code. Notice that there's a bug: we have a violation of a PRIMARY KEY constraint on the id column. Fix the data that's being inserted.

When working with integer IDs, it's best practice to increment the id by 1 for each successive insert. Follow this convention when fixing the bug.

INSERT INTO users (
  id,
  name,
  age,
  username,
  password,
  is_admin
) VALUES (
  1,
  'Rudolf',
  33,
  'rudolf1234',
  'thisisnotsecure',
  false
);

INSERT INTO users (
  id,
  name,
  age,
  username,
  password,
  is_admin
) VALUES (
  1,
  'Jerry',
  25,
  'jerrysmith',
  'mypasswordis1234',
  true
);

3.4

Foreign Keys
Foreign keys are what make relational databases relational! Foreign keys define the relationships between tables. Simply put, a FOREIGN KEY is a field in one table that references the PRIMARY KEY (or a UNIQUE column) of another table.

Creating a Foreign Key in SQLite
Creating a FOREIGN KEY in SQLite happens at table creation! After we define the table fields and constraints we add a named CONSTRAINT where we define the FOREIGN KEY column and its REFERENCES.

Here's an example:

CREATE TABLE departments (
  id INTEGER PRIMARY KEY,
  department_name TEXT NOT NULL
);

CREATE TABLE employees (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  department_id INTEGER,
  CONSTRAINT fk_departments
    FOREIGN KEY (department_id)
    REFERENCES departments(id)
);

In this example, an employee has a department_id. The department_id must be the same as the id field of a record from the departments table. fk_departments is the specified name of the constraint.

CONSTRAINT fk_departments: create a constraint called fk_departments
FOREIGN KEY (department_id): make this constraint a foreign key assigned to the department_id field
REFERENCES departments(id): link the foreign field id from the departments table
Assignment
Our users table stores the country our users are from in a country_code field. We need some additional data about countries like their name, but we don't want to bloat our users table with all that country data.

The "locations" team at CashPal has created a countries table, and we can link a user to their country by setting a foreign key in the users table. Creating a foreign key without the CONSTRAINT keyword means the name of the constraint is auto-assigned.

Take a look at the code. There's an issue with the INSERT statements again! Fix the data so no foreign key constraints are violated. You'll need to reference the setup in the up.sql tab in the code editor.






INSERT INTO users (
  id,
  name,
  country_code
) VALUES (
  1,
  'Jerry',
  'US'
);

INSERT INTO users (
  id,
  name,
  country_code
) VALUES (
  2,
  'Amit',
  'IND'
);


3.5

Schema
We've used the word schema a few times now; let's talk about what it means. A database's schema describes how data is organized within it.

Data types, table names, field names, constraints, and the relationships between all of those entities are part of a database's schema.

There Is No Perfect Schema
When designing a database schema, there typically isn't a "correct" solution. We do our best to choose a reasonable set of tables, fields, constraints, etc. that will accomplish our project's goals.

Like many things in programming, different schema designs come with different trade-offs.

How to Decide on a Sane Schema
Let's use CashPal as an example. One important decision that needs to be made is which table will store a user's balance! As you can imagine, ensuring our data is accurate when dealing with money is critical. We want to be able to:

Keep track of a user's current balance
See the historical balance at any point in the past
See a log of which transactions changed the balance over time
There are many ways to approach this problem. For our first attempt, let's try the simplest schema that fulfills our project's needs.

Assignment
The architecture team at CashPal has decided on a single transactions table. The transactions table stores individual transactions, and we can keep track of the "current balance" on each transaction record. If we want the current balance, we can just look at the most recent transaction!

Create the transactions table with the following fields and constraints:

id – INTEGER, PRIMARY KEY
sender_id – INTEGER
recipient_id – INTEGER
memo – TEXT, NOT NULL
amount – REAL, NOT NULL
balance – REAL, NOT NULL

3.6

Relational Databases
We have been using the term relational quite a bit. It's time we actually go over what that means!

A relational database is a type of database that stores data so that it can be easily related to other data. For example, a user can have many tweets. There's a relationship between a user and their tweet.

In a relational database:

Data is typically represented in "tables."
Each table has "columns" or "fields" that hold attributes related to the record.
Each row or entry in the table is called a record.
Typically, each record has a unique Id called the primary key.
Example Relational Database
Relational Database

Here is an example of a small relational database. This database has 3 tables, Students, Courses, and StudentCourses. The StudentCourses table manages the relationship between the Students and Courses tables.

Example 1: Curly
Curly has an Id of 2.
We can find Curly's courses by looking in the StudentCourses table for the records that match his StudentId.
Example 2: Haskell Monads
"Haskell Monads" has an Id of 3.
We can find all the students enrolled in the Haskell Monads course by checking the CourseId column in the StudentCourses table.

Question 1
Not answered
How many courses is Curly enrolled in?

1

5

2

4

3

2

4

1


Question 2
Not answered
How many students are in the Haskell Monads course?

1

5

2

4

3

3

4

1

3.7

Relational vs. Non-Relational DBs
The big difference between relational and non-relational databases is that non-relational databases tend to nest their data. Instead of always keeping records in separate tables, they often store records within other records.

To over-simplify it, you can think of non-relational databases as giant JSON blobs. If a user can have multiple courses, you might just add all the courses to the user record.

{
  "users": [
    {
      "id": 0,
      "name": "Elon",
      "courses": [
        {
          "name": "Biology",
          "id": 0
        }
      ]
    },
    {
      "id": 1,
      "name": "Curly",
      "courses": [
        {
          "name": "Biology",
          "id": 0
        }
      ]
    }
  ]
}

This often results in duplicate data within the database. That's obviously less than ideal, but it does have some benefits that we'll talk about later in the course.

Relational Database
Relational Database

Non-Relational Database
Non-Relational Database


CH10 JOINS
L1

Joins
Joins are one of the most important features that SQL offers. Joins allow us to make use of the relationships we have set up between our tables. In short, joins allow us to query multiple tables at the same time.

Inner Join
The simplest and most common type of join in SQL is the INNER JOIN. By default, a JOIN command is an INNER JOIN. An INNER JOIN returns all of the records in table_a that have matching records in table_b as demonstrated by the following Venn diagram.


innerjoin.jpg

ON
To perform a table join, we need to tell the database how to "match up" the rows from each table. The ON clause specifies the columns from each table that should be compared.

When the same column name exists in both tables, we have to specify which table each column comes from using the table name (or an alias) followed by a dot . before the column name.

SELECT
  *
FROM
  employees
  INNER JOIN departments ON employees.department_id = departments.id;

In this query:

employees.department_id refers to the department_id column from the employees table.
departments.id refers to the id column from the departments table.
The ON clause ensures that rows are matched based on these columns, creating a relationship between the two tables.

The query above returns all the fields from both tables. The INNER keyword only affects the number of rows returned, not the number of columns. The INNER JOIN filters rows based on matching department_id and id, while the SELECT * ensures all columns from both tables are included.

Why Is This Important?
In many databases, different tables might share the same column names, such as id. If you don't specify the table name (or alias) for a column, the database won't know which column to use for the join. For example, writing ON id = id won't work because the database can't distinguish between the id columns in each table.

Assignment
Our frontend team is working on a profile page and would like to display a user's country name instead of just the country's two-letter code. Let's start by writing a simple join between the users table and countries table. We will expand on this query more in the next exercise.

Write an INNER JOIN between users and countries in that order.
Return all fields from both tables.
Join on the country_code field.

L2

Namespacing on Tables
When working with multiple tables, you can specify which table a field belongs to using a .. For example:

table_name.column_name

SELECT
  students.name,
  classes.name
FROM
  students
  INNER JOIN classes ON classes.class_id = students.class_id;

The above query returns the name field from the students table and the name field from the classes table.

Assignment
Adjust the query to:

Return the name and age fields from the users table.
Return the name field from the countries table and rename it to country_name.
Sort by country_name in ascending order.

SELECT
  *
FROM
  users
  INNER JOIN countries ON countries.country_code = users.country_code;


L3

Left Join
A LEFT JOIN will return every record from table_a regardless of whether or not any of those records have a match in table_b. A left join will also return any matching records from table_b. Here's a Venn diagram to help visualize the effect of a LEFT JOIN:

left join

A small trick you can do to make writing the SQL query easier is to define an alias for each table. Here's an example:

SELECT
  e.name,
  d.name
FROM
  employees e
  LEFT JOIN departments d ON e.department_id = d.id;

Notice the simple alias declarations e and d for employees and departments, respectively.

Some developers do this to make their queries less verbose. That said, I personally hate it because single-letter variables are harder to grok, so don't use them in this course!

Assignment
The CashPal team needs a report on all the transactions a user has made. Join the users and transactions tables on users.id and transactions.user_id.

Your query should return the following 3 fields:
A user's name, as name
The sum of all their transaction amounts, as transaction_sum
The count of all their transactions, as transaction_count
Group the data by the user's id.
Order the data by the sum field in descending order.
Be sure to still return user records for users who have no transactions.
Do not alias the tables; this will fail the tests.


L4

Right Join
A RIGHT JOIN is, as you may expect, the opposite of a LEFT JOIN. It returns all records from table_b regardless of matches, and all matching records between the two tables.

right-join

A RIGHT JOIN is just a LEFT JOIN with the order of the tables switched, so in most cases LEFT JOIN is preferred for readability.

L5

Full Join
A FULL JOIN combines the result set of the LEFT JOIN and RIGHT JOIN commands. It returns all records from both table_a and table_b regardless of whether or not they have matches.

Full-join

Compare the Join Types
Switch between join types below to see which rows survive. Margaret has no dept_id, and the Design department has no employees, so they only appear once you reach a FULL JOIN. Hover a row to trace where it goes.

Full
Right
Left
Inner



Only rows where employees and departments share a matching dept_id.

employees
emp_id	name	dept_id
1	Ada	eng
2	Grace	eng
3	Linus	ops
4	Margaret	NULL
departments
dept_id	dept_name
eng	Engineering
ops	Operations
design	Design
Result
dept_id	emp_id	name	dept_name
eng	1	Ada	Engineering
eng	2	Grace	Engineering
ops	3	Linus	Operations


L6

Boot.dev
Dashboard
Courses
Training
Billing
Leaderboard
Community
Shop

gem bag

New NotificationsToggle notifications99+
Disciple

Level 43

user avatarprofile role frame

sharpshooter armor
sharpshooter
5

streak embers

daily streak
Explain difficulty
xp potions

chest!Quest available

CH10: Joins

L6: Joins Quiz
Back
Next

Joins Quiz
Users
id	name	age	country_code	username	password	is_admin
1	David	34	US	DavidDev	insertPractice	0
2	Samantha	29	BR	Sammy93	addingRecords!	0
3	John	39	CA	Jjdev21	welovebootdev	0
4	Ram	42	IN	Ram11c	thisSQLcourserocks	0
5	Hunter	30	US	Hdev92	backendDev	0
6	Allan	27	US	Alires	iLoveB00tdev	1
7	Al	39	JP	quickCoder	snake_case	0
Transactions
id	user_id	recipient_id	sender_id	amount
1	1		4	10.5
2	3	10		9.56
3	1		2	256.21
4	10	2		50
Result
id	name	age	country_code	username	password	is_admin	id	user_id	recipient_id	sender_id	amount
1	David	34	US	DavidDev	insertPractice	0	1	1		4	10.5
3	John	39	CA	Jjdev21	welovebootdev	0	2	3	10		9.56
1	David	34	US	DavidDev	insertPractice	0	3	1		2	256.21
Query
SELECT
  *
FROM
  users ________ transactions ON users.id = transactions.user_id;




Boots
Spellbook
Lessons
Boots
Need help? I, Boots the Bear with a Back-End, can assist... for a price.

Ask Boots a question...



Given the tables and query, which JOIN type would produce the result

1

LEFT JOIN

2

INNER JOIN

3

FULL JOIN




L7

  Boot.dev
Dashboard
Courses
Training
Billing
Leaderboard
Community
Shop

gem bag

New NotificationsToggle notifications99+
Disciple

Level 43

user avatarprofile role frame

sharpshooter armor
sharpshooter
5

streak embers

daily streak
Explain difficulty
xp potions

chest!Quest available

CH10: Joins

L7: Joins Quiz
Back
Next

Joins Quiz
Users
id	name	age	country_code	username	password	is_admin
1	David	34	US	DavidDev	insertPractice	0
2	Samantha	29	BR	Sammy93	addingRecords!	0
3	John	39	CA	Jjdev21	welovebootdev	0
4	Ram	42	IN	Ram11c	thisSQLcourserocks	0
5	Hunter	30	US	Hdev92	backendDev	0
6	Allan	27	US	Alires	iLoveB00tdev	1
7	Al	39	JP	quickCoder	snake_case	0
Transactions
id	user_id	recipient_id	sender_id	amount
1	1		4	10.5
2	3	10		9.56
3	1		2	256.21
4	10	2		50
Result
id	name	age	country_code	username	password	is_admin	id	user_id	recipient_id	sender_id	amount
1	David	34	US	DavidDev	insertPractice	0	3	1		2	256.21
1	David	34	US	DavidDev	insertPractice	0	1	1		4	10.5
2	Samantha	29	BR	Sammy93	addingRecords!	0
3	John	39	CA	Jjdev21	welovebootdev	0	2	3	10		9.56
4	Ram	42	IN	Ram11c	thisSQLcourserocks	0
5	Hunter	30	US	Hdev92	backendDev	0
6	Allan	27	US	Alires	iLoveB00tdev	1
7	Al	39	JP	quickCoder	snake_case	0
Query
SELECT
  *
FROM
  users ________ transactions ON users.id = transactions.user_id;




Boots
Spellbook
Lessons
Boots
Need help? I, Boots the Hump Day Holdout, can assist... for a price.

Ask Boots a question...



Given the tables and query, which JOIN type would produce the result

1

LEFT JOIN

2

INNER JOIN

3

FULL JOIN

L8

Boot.dev
Dashboard
Courses
Training
Billing
Leaderboard
Community
Shop

gem bag

New NotificationsToggle notifications99+
Disciple

Level 43

user avatarprofile role frame

sharpshooter armor
sharpshooter
5

streak embers

daily streak
Explain difficulty
xp potions

chest!Quest available

CH10: Joins

L8: Joins Quiz
Back
Next

Joins Quiz
Users
id	name	age	country_code	username	password	is_admin
1	David	34	US	DavidDev	insertPractice	0
2	Samantha	29	BR	Sammy93	addingRecords!	0
3	John	39	CA	Jjdev21	welovebootdev	0
4	Ram	42	IN	Ram11c	thisSQLcourserocks	0
5	Hunter	30	US	Hdev92	backendDev	0
6	Allan	27	US	Alires	iLoveB00tdev	1
7	Al	39	JP	quickCoder	snake_case	0
Transactions
id	user_id	recipient_id	sender_id	amount
1	1		4	10.5
2	3	10		9.56
3	1		2	256.21
4	10	2		50
Result
id	name	age	country_code	username	password	is_admin	id	user_id	recipient_id	sender_id	amount
1	David	34	US	DavidDev	insertPractice	0	1	1		4	10.5
3	John	39	CA	Jjdev21	welovebootdev	0	2	3	10		9.56
1	David	34	US	DavidDev	insertPractice	0	3	1		2	256.21
4	10	2		50
Query
SELECT
  *
FROM
  users ________ transactions ON users.id = transactions.user_id;




Boots
Spellbook
Lessons
Boots
Need help? I, Boots the Sleepy Spellcaster, can assist... for a price.

Ask Boots a question...



Given the tables and query, which JOIN type would produce the result

1

RIGHT JOIN

2

INNER JOIN

3

FULL JOIN

L9

Boot.dev
Dashboard
Courses
Training
Billing
Leaderboard
Community
Shop

gem bag

New NotificationsToggle notifications99+
Disciple

Level 43

user avatarprofile role frame

sharpshooter armor
sharpshooter
5

streak embers

daily streak
Explain difficulty
xp potions

chest!Quest available

CH10: Joins

L9: Join Practice
Back
Next

Join Practice
Joins take some time to get used to, but the key to understanding them and using them effectively is practice!

Multiple Joins
To incorporate data from more than two tables, you can utilize multiple joins to execute more complex queries!

SELECT
  *
FROM
  employees
  LEFT JOIN departments ON employees.department_id = departments.id
  INNER JOIN regions ON departments.region_id = regions.id;

Assignment
Our front-end team is finalizing the profile page for CashPal. We need to write a query that returns all the user data they need for an individual user's profile. The query must return the following fields:

The user's id
The user's name
The user's age
The user's username
The user's country name, renamed to country_name
The sum of the amounts of all successful transactions from the user, renamed to balance
Return only a single user record – specifically the one whose id is 6.






Boots
Spellbook
Lessons
Boots
Need help? I, Boots the Fearless Friday Deployer, can assist... for a price.

Ask Boots a question...



002_main.sql
001_up.sql
1


Submit

Run

Solution


001_up.sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  age INTEGER NOT NULL,
  country_code TEXT NOT NULL,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  is_admin BOOLEAN
);

INSERT INTO
  users (id, name, age, country_code, username, password, is_admin)
VALUES
  (1, 'David', 34, 'US', 'DavidDev', 'insertPractice', false);

INSERT INTO
  users (id, name, age, country_code, username, password, is_admin)
VALUES
  (2, 'Samantha', 29, 'BR', 'Sammy93', 'addingRecords!', false);

INSERT INTO
  users (id, name, age, country_code, username, password, is_admin)
VALUES
  (3, 'John', 39, 'CA', 'Jjdev21', 'welovebootdev', false);

INSERT INTO
  users (id, name, age, country_code, username, password, is_admin)
VALUES
  (4, 'Ram', 42, 'IN', 'Ram11c', 'thisSQLcourserocks', false);

INSERT INTO
  users (id, name, age, country_code, username, password, is_admin)
VALUES
  (5, 'Hunter', 30, 'US', 'Hdev92', 'backendDev', false);

INSERT INTO
  users (id, name, age, country_code, username, password, is_admin)
VALUES
  (6, 'Allan', 27, 'US', 'Alires', 'iLoveB00tdev', true);

INSERT INTO
  users (name, age, country_code, username, password, is_admin)
VALUES
  ('Lance', 20, 'US', 'LanChr', 'b00tdevisbest', false);

INSERT INTO
  users (name, age, country_code, username, password, is_admin)
VALUES
  ('Tiffany', 28, 'US', 'Tifferoon', 'autoincrement', true);

INSERT INTO
  users (name, age, country_code, username, password, is_admin)
VALUES
  ('Lane', 27, 'US', 'wagslane', 'update_me', false);

INSERT INTO
  users (name, age, country_code, username, password, is_admin)
VALUES
  ('Darren', 15, 'CA', 'Dshan', 'found_me', false);

INSERT INTO
  users (name, age, country_code, username, password, is_admin)
VALUES
  ('Albert', 55, 'BR', 'BertDev', 'one_al_name', false);

INSERT INTO
  users (name, age, country_code, username, password, is_admin)
VALUES
  ('Alvin', 27, 'US', 'AlvinA27', 'easter_egg', false);

INSERT INTO
  users (name, age, country_code, username, password, is_admin)
VALUES
  ('Al', 39, 'JP', 'quickCoder', 'snake_case', false);

INSERT INTO
  users (name, age, country_code, username, password, is_admin)
VALUES
  ('Marcos', 24, 'BR', 'Marc0sM', 'join_master', false);

INSERT INTO
  users (name, age, country_code, username, password, is_admin)
VALUES
  ('Yuki', 31, 'JP', 'YukiRuns', 'sashimi42', false);

INSERT INTO
  users (name, age, country_code, username, password, is_admin)
VALUES
  ('Helena', 46, 'DE', 'helena-db', 'berlin_data', false);

INSERT INTO
  users (name, age, country_code, username, password, is_admin)
VALUES
  ('Mateo', 22, 'MX', 'mat_codes', 'tacoTuesday', false);

INSERT INTO
  users (name, age, country_code, username, password, is_admin)
VALUES
  ('Amara', 37, 'NG', 'amaraN', 'lagosLogic', true);

CREATE TABLE countries (id INTEGER PRIMARY KEY, country_code TEXT, name TEXT);

INSERT INTO
  countries (country_code, name)
VALUES
  ('US', 'United States');

INSERT INTO
  countries (country_code, name)
VALUES
  ('CA', 'Canada');

INSERT INTO
  countries (country_code, name)
VALUES
  ('IN', 'India');

INSERT INTO
  countries (country_code, name)
VALUES
  ('JP', 'Japan');

INSERT INTO
  countries (country_code, name)
VALUES
  ('BR', 'Brazil');

INSERT INTO
  countries (country_code, name)
VALUES
  ('DE', 'Germany');

INSERT INTO
  countries (country_code, name)
VALUES
  ('MX', 'Mexico');

INSERT INTO
  countries (country_code, name)
VALUES
  ('NG', 'Nigeria');

CREATE TABLE transactions (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL,
  recipient_id INTEGER,
  sender_id INTEGER,
  note TEXT,
  amount REAL,
  was_successful BOOLEAN
);

INSERT INTO
  transactions (user_id, sender_id, note, amount, was_successful)
VALUES
  (9, 4, 'Testing transaction!', 10.50, true);

INSERT INTO
  transactions (user_id, recipient_id, note, amount, was_successful)
VALUES
  (5, 10, 'Thanks for lunch!', 9.56, true);

INSERT INTO
  transactions (user_id, sender_id, note, amount, was_successful)
VALUES
  (6, 2, 'Car problems', 256.21, false);

INSERT INTO
  transactions (user_id, recipient_id, note, amount, was_successful)
VALUES
  (7, 8, 'Happy birthday!!', 50, true);

INSERT INTO
  transactions (user_id, sender_id, note, amount, was_successful)
VALUES
  (9, 11, 'MTG Draft', 50, false);

INSERT INTO
  transactions (user_id, recipient_id, note, amount, was_successful)
VALUES
  (6, 4, 'lunch with the friends', 12.56, true);

INSERT INTO
  transactions (user_id, sender_id, note, amount, was_successful)
VALUES
  (6, 12, 'paying ya back for lunch', 12.22, false);

INSERT INTO
  transactions (user_id, recipient_id, note, amount, was_successful)
VALUES
  (9, 6, 'lunch break', 24.89, true);

INSERT INTO
  transactions (user_id, sender_id, note, amount, was_successful)
VALUES
  (1, 13, 'thanks for lunch yesterday', 10.00, true);

INSERT INTO
  transactions (user_id, recipient_id, note, amount, was_successful)
VALUES
  (6, 14, '5 buck pizza for lunch', 5.00, true);

INSERT INTO
  transactions (user_id, sender_id, note, amount, was_successful)
VALUES
  (8, 2, 'lunch was goooood thanks, man!', 47.42, true);

INSERT INTO
  transactions (user_id, recipient_id, note, amount, was_successful)
VALUES
  (13, 4, 'lunch meetup, lets get together again soon.', 16.91, false);

INSERT INTO
  transactions (user_id, sender_id, note, amount, was_successful)
VALUES
  (6, 14, 'not sure how much lunch was, heres 20', 20.00, true);

INSERT INTO
  transactions (user_id, recipient_id, note, amount, was_successful)
VALUES
  (2, 13, 'Happy birthday, bro! Lets get lunch soon.', 100.00, true);

INSERT INTO
  transactions (user_id, sender_id, note, amount, was_successful)
VALUES
  (6, 17, 'April Claude API split', 88.40, true);

INSERT INTO
  transactions (user_id, recipient_id, note, amount, was_successful)
VALUES
  (6, 1, 'Coffee + cronut', 7.75, true);

INSERT INTO
  transactions (user_id, sender_id, note, amount, was_successful)
VALUES
  (6, 11, 'monorail ticket', 65.00, false);

INSERT INTO
  transactions (user_id, recipient_id, note, amount, was_successful)
VALUES
  (14, 6, 'shared cab fare', 14.20, true);

INSERT INTO
  transactions (user_id, sender_id, note, amount, was_successful)
VALUES
  (15, 4, 'Vercel bill reimbursement', 42.42, true);

INSERT INTO
  transactions (user_id, recipient_id, note, amount, was_successful)
VALUES
  (16, 12, 'game night snacks', 19.90, false);

INSERT INTO
  transactions (user_id, sender_id, note, amount, was_successful)
VALUES
  (17, 5, 'late fee refund', 3.33, true);

INSERT INTO
  transactions (user_id, recipient_id, note, amount, was_successful)
VALUES
  (18, 2, 'book swap', 11.11, true);


L10

Boot.dev
Dashboard
Courses
Training
Billing
Leaderboard
Community
Shop

gem bag

New NotificationsToggle notifications99+
Disciple

Level 43

user avatarprofile role frame

sharpshooter armor
sharpshooter
5

streak embers

daily streak
Explain difficulty
xp potions

chest!Quest available

CH10: Joins

L10: Query Practice – Support Tickets
Back
Next

Query Practice – Support Tickets
CashPal stores customer support requests in a support_tickets table. A recent bug caused a flood of "Account Access" tickets, hiding other important issues. Now that the bug is fixed, Support wants to focus on users with multiple non-"Account Access" problems.

Assignment
Write an SQL statement that includes an INNER JOIN and returns the following:

The user's name
The user's username
The count of support tickets attributed to that user, labeled as support_ticket_count
With the constraints:

Exclude any tickets that have "Account Access" as the issue_type.
Return records only for users who have more than 1 non-"Account Access" support ticket.
Sort the records so that users with the most support tickets appear first.





Boots
Spellbook
Lessons
Boots
Need help? I, Boots the Efficient Bubble Sorter, can assist... for a price.

Ask Boots a question...



002_main.sql
001_up.sql
1


Submit

Run

Solution






CAPITULO 3 (CONTINUIDADE) - CONSTRAINTS

Constraints (completo)
A constraint is a rule on a database that enforces some specific behavior, checked automatically on every insert and update.

Types of constraints:
- PRIMARY KEY: uniquely identifies each row; no duplicates, no NULL
- NOT NULL: the column must have a value on every insert
- UNIQUE: no two rows can have the same value in that column
- DEFAULT: a value used automatically when none is provided
- FOREIGN KEY: the value must reference an existing row in another table

SQLite Limitation: SQLite does not support ADD CONSTRAINT within an ALTER TABLE statement. In MySQL you can add constraints with ALTER TABLE ... ADD CONSTRAINT; in SQLite all constraints must be declared in CREATE TABLE.

Solution (rebuild users with proper constraints):
CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  age INTEGER NOT NULL,
  country_code TEXT NOT NULL,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  is_admin BOOLEAN
);


CAPITULO 4 - CRUD: INSERT, UPDATE, DELETE E CONSULTAS

Lesson 1: CRUD
CRUD stands for Create, Read, Update, Delete - the four basic operations of persistent storage.
- Create: INSERT (add new records)
- Read: SELECT (query records)
- Update: UPDATE (modify existing records)
- Delete: DELETE (remove records)
Question: Which SQL statement creates a new record?
Answer: INSERT

Lesson 2: Insert Statement
The INSERT statement adds new rows to a table. Specify the table, the columns receiving values, and the values:
INSERT INTO users (id, name, age, country_code, username, password) VALUES (8, 'Yuki', 31, 'JP', 'yuki31', 'hash-yuki');
Best practice: always list the columns explicitly. If the table gains a column later, an INSERT that relies on column order silently breaks or inserts wrong data.
Question: Which part of an INSERT lists the columns receiving values?
Answer: the column list between the table name and VALUES

Lesson 3: Auto Increment
Writing id values by hand is error-prone. Most databases can generate them automatically.
- SQLite: INTEGER PRIMARY KEY auto-increments when omitted
- MySQL: AUTO_INCREMENT attribute on the column
- PostgreSQL: SERIAL or GENERATED ALWAYS AS IDENTITY
With auto increment: INSERT INTO users (name, age, country_code, username, password) VALUES ('Yuki', 31, 'JP', 'yuki31', 'hash-yuki');
In MySQL the table must declare it at creation: CREATE TABLE users (id INT PRIMARY KEY AUTO_INCREMENT, name VARCHAR(100) NOT NULL, ...);
Question: In SQLite, which column type auto-increments when omitted in an INSERT?
Answer: INTEGER PRIMARY KEY

Lesson 4: Manual Entry
Sometimes you WANT to control the id (imports, migrations, restoring backups). Inserting an explicit id is allowed as long as it does not violate the PRIMARY KEY:
INSERT INTO users (id, name, age, country_code, username, password) VALUES (9, 'Lance', 20, 'US', 'LanChr', 'hash-lance');
If the id already exists, the insert fails with a constraint error.
Question: What happens if you manually insert an id that already exists?
Answer: the insert fails with a PRIMARY KEY violation

Lesson 5: Count
COUNT is an aggregate function: it collapses many rows into a single summary value.
SELECT COUNT(*) FROM users;
COUNT(column) counts rows where that column is not NULL.
Question: Which aggregate function returns the number of rows?
Answer: COUNT

Lesson 6: WHERE Clause
WHERE filters which rows a statement affects or returns. It works with SELECT, UPDATE and DELETE.
SELECT * FROM users WHERE country_code = 'BR';
Operators: =, <>, !=, <, >, <=, >=. Logical: AND, OR, NOT.
SELECT name, age FROM users WHERE age >= 30 AND country_code = 'US';
Question: Which clause filters rows before they are returned?
Answer: WHERE

Lesson 7: Finding NULL Values
NULL means "no value" - not zero and not an empty string. Comparing with = or <> never matches NULL. Use IS NULL and IS NOT NULL:
SELECT * FROM users WHERE country_code IS NULL;
SELECT * FROM users WHERE country_code IS NOT NULL;
Question: Which operator finds rows where a column has no value?
Answer: IS NULL

Lesson 8: DELETE
DELETE removes rows. Always pair it with WHERE - a bare DELETE removes every row in the table:
DELETE FROM users WHERE id = 8;
Unlike DROP (which removes structure), DELETE only removes data. Deleted rows are gone unless you have a backup.
Question: What happens when you run DELETE FROM users; without a WHERE clause?
Answer: every row in the table is deleted

Lesson 9: Danger of Deleting Data
DELETE is irreversible in the database itself. Production systems protect themselves with:
- soft deletes: a deleted_at column marks rows instead of removing them
- backups before destructive operations
- restricted permissions: most app users cannot run DELETE at all
- foreign keys with ON DELETE RESTRICT preventing orphaned related rows
Real-world lesson: an admin once ran a script without a WHERE clause and lost client data; recovery took days. Rule: SELECT first to preview the rows, then DELETE with the same WHERE.
Question: Which pattern marks rows as deleted without removing them?
Answer: soft delete (deleted_at column)

Lesson 10: Update Query in SQL
UPDATE changes existing rows. Shape: UPDATE table SET column = value WHERE condition.
UPDATE users SET age = 32 WHERE id = 8;
Without WHERE, every row is updated. Several columns at once:
UPDATE users SET age = 32, country_code = 'JP' WHERE id = 8;
MySQL note: safe-update mode can refuse UPDATE/DELETE without a key column in WHERE - a guardrail.
Question: Which clause protects an UPDATE from changing every row?
Answer: WHERE

Lesson 11: Object-Relational Mapping (ORMs)
Applications rarely send raw SQL. An ORM (Object-Relational Mapper) maps tables to classes/objects in the programming language:
- Python: SQLAlchemy, Django ORM
- TypeScript/JavaScript: Prisma, Drizzle, TypeORM
- Go: GORM, sqlc
Conceptual example (Python + SQLAlchemy):
user = User(name='Yuki', age=31, country_code='JP')
session.add(user)   # generates the INSERT
session.commit()
Benefits: less boilerplate, type safety, migration tools. Costs: you still need SQL to debug, tune and understand what the ORM generated.
Question: True or false: learning SQL is pointless once you use an ORM.
Answer: false - ORMs generate SQL; you still need SQL to understand and fix what they generate

Lesson 12: Query Practice - User Count
Assignment: count how many users are in the database.
SELECT COUNT(*) FROM users;

Lesson 13: Query Practice - Country Codes
Assignment: return the distinct country codes present in the users table.
SELECT DISTINCT country_code FROM users;
DISTINCT removes duplicate values from the result.
